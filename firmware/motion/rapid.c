#include "motion.h"
#include "../main.h"

void init_rapid(const struct command* command) {
    //initiate linear movement and set custom handler
    init_linear(command);
    motion_state.motion_handler = rapid_handler;
}

void rapid_handler() {
    //move in each axis until respective destination reached
    bool move_x = motion_state.machine_pos.x != motion_state.destination.x;
    bool move_y = motion_state.machine_pos.y != motion_state.destination.y;
    bool move_z = motion_state.machine_pos.z != motion_state.destination.z;

    if (move_x) STEP_PORT |= (1 << X_STEP);
    if (move_y) STEP_PORT |= (1 << Y_STEP);
    if (move_z) STEP_PORT |= (1 << Z_STEP);

    //reset handler if there are no more steps to make
    if (!move_x && !move_y && !move_z) {
        DISABLE_Z_PORT |= (1 << DISABLE_Z);
        motion_state.motion_handler = 0;
    }
}
