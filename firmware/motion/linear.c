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
    if (motion_state.machine_pos.x != motion_state.destination.x)
        STEP_PORT |= (1 << X_STEP);
    else
        motion_state.motion_handler = 0;
}
