#include "motion.h"
#include "../main.h"

void init_rapid(const struct command* command) {
    //obtain destination in absolute machine coordinates
    struct cartesian dest;
    translate(command, &dest);

    //enable motors needed to make the move
    if (dest.x != motion_state.machine_pos.x || dest.y != motion_state.machine_pos.y)
        DISABLE_XY_PORT &= ~(1 << DISABLE_XY);
    if (dest.z != motion_state.machine_pos.z)
        DISABLE_Z_PORT &= ~(1 << DISABLE_Z);

    //set motor directions
    if (dest.x > motion_state.machine_pos.x) STEP_PORT |= (1 << X_DIR);
    else STEP_PORT &= ~(1 << X_DIR);

    if (dest.y > motion_state.machine_pos.y) STEP_PORT |= (1 << Y_DIR);
    else STEP_PORT &= ~(1 << Y_DIR);

    if (dest.z > motion_state.machine_pos.z) STEP_PORT |= (1 << Z_DIR);
    else STEP_PORT &= ~(1 << Z_DIR);

    //divide timer frequency by 3
    OCR0A = 2;

    //update motion state
    motion_state.destination = dest;
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
