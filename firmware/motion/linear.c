#include "motion.h"
#include "../main.h"
#include "../state.h"

void init_linear(const struct command* command) {
    //obtain destination in absolute machine coordinates
    struct cartesian dest;
    translate(command, &dest);

    //enable Z motor if needed to make the move
    if (dest.z != motion_state.machine_pos.z)
        DISABLE_Z_PORT &= ~(1 << DISABLE_Z);

    //set motor directions
    if (dest.x > motion_state.machine_pos.x) STEP_PORT |= (1 << X_DIR);
    else STEP_PORT &= ~(1 << X_DIR);

    if (dest.y > motion_state.machine_pos.y) STEP_PORT |= (1 << Y_DIR);
    else STEP_PORT &= ~(1 << Y_DIR);

    if (dest.z > motion_state.machine_pos.z) STEP_PORT |= (1 << Z_DIR);
    else STEP_PORT &= ~(1 << Z_DIR);

    //update motion state
    motion_state.destination = dest;
    motion_state.motion_handler = linear_handler;
}

void linear_handler() {
    unsigned long long max_dist = ((unsigned long long)motion_state.feed_rate * motion_state.time_elapsed) >> 32;

    unsigned long travelled_dist_x = abs_diff(motion_state.origin.x, motion_state.machine_pos.x);
    unsigned long travelled_dist_y = abs_diff(motion_state.origin.y, motion_state.machine_pos.y);
    unsigned long travelled_dist_z = abs_diff(motion_state.origin.z, motion_state.machine_pos.z);

    unsigned long long travelled_dist_sq = (unsigned long long)travelled_dist_x * travelled_dist_x
        + (unsigned long long)travelled_dist_y * travelled_dist_y
        + (unsigned long long)travelled_dist_z * travelled_dist_z;

    if (travelled_dist_sq >= max_dist * max_dist)
        return;

    if (motion_state.machine_pos.x != motion_state.destination.x)
        STEP_PORT |= (1 << X_STEP);
    else
        motion_state.motion_handler = 0;
}
