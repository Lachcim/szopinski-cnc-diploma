#include "motion.h"
#include "../state.h"

void translate(const struct command* command, struct cartesian* xyz) {
    //establish unit conversion factor
    unsigned long conv_factor = machine_state.unit_mode == UNITS_MM ?
        UNITS_PER_MM : UNITS_PER_INCH;
    unsigned long conv_factor_z = machine_state.unit_mode == UNITS_MM ?
        UNITS_PER_MM_Z : UNITS_PER_INCH_Z;

    //convert xyz units
    xyz->x = ((long long)command->x_word * conv_factor) >> 32;
    xyz->y = ((long long)command->y_word * conv_factor) >> 32;
    xyz->z = ((long long)command->z_word * conv_factor_z) >> 32;

    if (machine_state.distance_mode == DISTANCE_INCREMENTAL) {
        //in incremental mode, add current position to each axis
        if (!(command->word_flag & FLAG_X_WORD)) xyz->x = 0;
        if (!(command->word_flag & FLAG_Y_WORD)) xyz->y = 0;
        if (!(command->word_flag & FLAG_Z_WORD)) xyz->z = 0;

        xyz->x += motion_state.machine_pos.x;
        xyz->y += motion_state.machine_pos.y;
        xyz->z += motion_state.machine_pos.z;
    }
    else {
        //in absolute mode, retain current position unless specified otherwise
        if (!(command->word_flag & FLAG_X_WORD)) xyz->x = motion_state.machine_pos.x;
        if (!(command->word_flag & FLAG_Y_WORD)) xyz->y = motion_state.machine_pos.y;
        if (!(command->word_flag & FLAG_Z_WORD)) xyz->z = motion_state.machine_pos.z;
    }
}

void translate_offset(const struct command* command, struct cartesian* center) {
    //unit conversion
    unsigned long conv_factor = machine_state.unit_mode == UNITS_MM ?
        UNITS_PER_MM : UNITS_PER_INCH;

    center->x = ((long long)command->i_word * conv_factor) >> 32;
    center->y = ((long long)command->j_word * conv_factor) >> 32;

    //arc center z is the z level of the arc
    center->z = motion_state.machine_pos.z;

    bool i_present = command->word_flag & FLAG_I_WORD;
    bool j_present = command->word_flag & FLAG_J_WORD;

    if (machine_state.offset_mode == OFFSET_INCREMENTAL) {
        //at least one offset must be present
        if (!i_present && !j_present) {
            machine_state.error = ERROR_MISSING_ARGUMENT;
            return;
        }

        //add current position to each axis
        if (!(command->word_flag & FLAG_I_WORD)) center->x = 0;
        if (!(command->word_flag & FLAG_J_WORD)) center->y = 0;

        center->x += motion_state.machine_pos.x;
        center->y += motion_state.machine_pos.y;
    }
    else {
        //in absolute mode, both offsets must be present
        if (!i_present || !j_present) {
            machine_state.error = ERROR_MISSING_ARGUMENT;
            return;
        }
    }
}
