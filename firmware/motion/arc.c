#include "motion.h"
#include "../state.h"

static bool ccw, started;
static long center_x, center_y;
static unsigned long long radius_sq;

void init_arc(const struct command* command, bool init_ccw) {
    //obtain destination
    struct cartesian dest;
    translate(command, &dest);

    //remember direction, obtain circle center
    ccw = init_ccw;
    started = false;

    translate_offset(command, &center_x, &center_y);
    if (machine_state.error != ERROR_NONE) return;

    //calculate squared radius
    radius_sq = square(dest.x - center_x) + square(dest.y - center_y);

    //set z direction
    if (dest.z > motion_state.machine_pos.z) STEP_PORT |= (1 << Z_DIR);
    else STEP_PORT &= ~(1 << Z_DIR);

    //enable motors
    DISABLE_XY_PORT &= ~(1 << DISABLE_XY);
    if (dest.z != motion_state.machine_pos.z)
        DISABLE_Z_PORT &= ~(1 << DISABLE_Z);

    //motion timer at maximum speed
    OCR0A = 0;

    //update motion state
    motion_state.destination = dest;
    motion_state.motion_handler = arc_handler;
}

void arc_handler() {
    //check final conditions
    bool xy_finished = motion_state.machine_pos.x == motion_state.destination.x && motion_state.machine_pos.y == motion_state.destination.y;
    bool z_finished = motion_state.machine_pos.z == motion_state.destination.z;

    if (xy_finished && z_finished && started) {
        DISABLE_Z_PORT |= (1 << DISABLE_Z);
        motion_state.motion_handler = 0;
        return;
    }

    started = true;

    //handle z movement
    if (!z_finished) {
        //step z on every iteration
        STEP_PORT |= (1 << Z_STEP);

        if (xy_finished) {
            //no more xy calculations, reduce speed artificially
            OCR0A = 4;
            return;
        }
    }
    else
        DISABLE_Z_PORT |= (1 << DISABLE_Z);

    //get position relative to center
    long x_rel = motion_state.machine_pos.x - center_x;
    long y_rel = motion_state.machine_pos.y - center_y;

    //get current direction
    char step_x, step_y;
    if (!ccw) {
        step_x = ((x_rel >= 0 && y_rel < 0) || (x_rel < 0 && y_rel <= 0)) ? 1 : -1;
        step_y = ((x_rel >= 0 && y_rel < 0) || (x_rel > 0 && y_rel >= 0)) ? 1 : -1;
    }
    else {
        step_x = ((x_rel > 0 && y_rel >= 0) || (x_rel <= 0 && y_rel > 0)) ? 1 : -1;
        step_y = ((x_rel < 0 && y_rel <= 0) || (x_rel <= 0 && y_rel > 0)) ? 1 : -1;
    }

    //calculate radius for each movement option (+x, +x +y, +y)
    unsigned long long radius_component_x = square((long long)motion_state.machine_pos.x + step_x - center_x);
    unsigned long long radius_component_y = square((long long)motion_state.machine_pos.y + step_y - center_y);
    unsigned long long radius_component_non_x = square((long long)x_rel);
    unsigned long long radius_component_non_y = square((long long)y_rel);

    unsigned long long radius_sq_x = radius_component_x + radius_component_non_y;
    unsigned long long radius_sq_xy = radius_component_x + radius_component_y;
    unsigned long long radius_sq_y = radius_component_non_x + radius_component_y;

    //calculate radius difference for each option
    unsigned long long diff_x = abs_diff(radius_sq, radius_sq_x);
    unsigned long long diff_xy = abs_diff(radius_sq, radius_sq_xy);
    unsigned long long diff_y = abs_diff(radius_sq, radius_sq_y);

    //set motor directions
    if (step_x == 1) STEP_PORT |= (1 << X_DIR);
    else STEP_PORT &= ~(1 << X_DIR);
    if (step_y == 1) STEP_PORT |= (1 << Y_DIR);
    else STEP_PORT &= ~(1 << Y_DIR);

    //pick option with smallest difference
    if (diff_x <= diff_xy && diff_x <= diff_y)
        STEP_PORT |= (1 << X_STEP);
    else if (diff_y <= diff_xy && diff_y <= diff_x)
        STEP_PORT |= (1 << Y_STEP);
    else
        STEP_PORT |= (1 << X_STEP) | (1 << Y_STEP);
}
