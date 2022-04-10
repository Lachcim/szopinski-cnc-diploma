#include "motion.h"
#include "../main.h"
#include "../state.h"

void init_rapid(const struct command* command) {
    //obtain destination in absolute machine coordinates
    struct cartesian dest;
    translate(command, &dest);

    //enable Z motor if needed to make the move
    if (dest.z != machine_state.machine_z)
        DISABLE_Z_PORT &= ~(1 << DISABLE_Z);

    //set motor directions
    if (dest.x > machine_state.machine_x) STEP_PORT |= (1 << X_DIR);
    else STEP_PORT &= ~(1 << X_DIR);

    if (dest.y > machine_state.machine_y) STEP_PORT |= (1 << Y_DIR);
    else STEP_PORT &= ~(1 << Y_DIR);

    if (dest.z > machine_state.machine_z) STEP_PORT |= (1 << Z_DIR);
    else STEP_PORT &= ~(1 << Z_DIR);

    TIMSK0 &= ~(1 << TOIE0);
    motion_state.destination = dest;
    motion_state.motion_handler = rapid_handler;
    TIMSK0 |= (1 << TOIE0);
}

void rapid_handler() {
    //move in each axis until respective destination reached
    bool move_x = machine_state.machine_x != motion_state.destination.x;
    bool move_y = machine_state.machine_y != motion_state.destination.y;
    bool move_z = machine_state.machine_z != motion_state.destination.z;

    if (move_x) STEP_PORT |= (1 << X_STEP);
    if (move_y) STEP_PORT |= (1 << Y_STEP);
    if (move_z) STEP_PORT |= (1 << Z_STEP);

    //reset handler if there are no more steps to make
    if (!move_x && !move_y && !move_z) {
        DISABLE_Z_PORT |= (1 << DISABLE_Z);
        motion_state.motion_handler = 0;
    }
}
