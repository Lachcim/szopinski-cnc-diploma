#include "motion.h"
#include "../main.h"
#include "../state.h"

static struct cartesian rapid_dest;

void rapid_handler() {
    bool move_x = machine_state.machine_x != rapid_dest.x;
    bool move_y = machine_state.machine_y != rapid_dest.y;
    bool move_z = machine_state.machine_z != rapid_dest.z;

    if (move_x) STEP_PORT |= (1 << X_STEP);
    if (move_y) STEP_PORT |= (1 << Y_STEP);
    if (move_z) STEP_PORT |= (1 << Z_STEP);

    if (!move_x && !move_y && !move_z) {
        motion_state.motion_handler = 0;
        motion_state.done = true;
    }
}

void init_rapid(struct cartesian dest) {
    if (dest.x != machine_state.machine_x || dest.y != machine_state.machine_y)
        DISABLE_XY_PORT &= ~(1 << DISABLE_XY);
    if (dest.z != machine_state.machine_z)
        DISABLE_Z_PORT &= ~(1 << DISABLE_Z);

    if (dest.x > machine_state.machine_x)
        STEP_PORT |= (1 << X_DIR);
    else
        STEP_PORT &= ~(1 << X_DIR);

    if (dest.y > machine_state.machine_y)
        STEP_PORT |= (1 << Y_DIR);
    else
        STEP_PORT &= ~(1 << Y_DIR);

    if (dest.z > machine_state.machine_z)
        STEP_PORT |= (1 << Z_DIR);
    else
        STEP_PORT &= ~(1 << Z_DIR);

    rapid_dest = dest;
    motion_state.motion_handler = rapid_handler;
}
