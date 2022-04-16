#include "motion.h"
#include "../state.h"

void translate(const struct command* command, struct cartesian* xyz) {
    //establish unit conversion factor
    unsigned long conv_factor = machine_state.unit_mode == UNITS_MM ?
        UNITS_PER_MM : UNITS_PER_INCH;
    unsigned long conv_factor_z = machine_state.unit_mode == UNITS_MM ?
        UNITS_PER_MM_Z : UNITS_PER_INCH_Z;

    //convert xyz units
    xyz->x = ((long long) command->x_word * conv_factor) >> 32;
    xyz->y = ((long long) command->y_word * conv_factor) >> 32;
    xyz->z = ((long long) command->z_word * conv_factor_z) >> 32;

    //if xyz words unspecified, retain current machine xyz values
    if (!(command->word_flag & FLAG_X_WORD)) xyz->x = motion_state.machine_pos.x;
    if (!(command->word_flag & FLAG_Y_WORD)) xyz->y = motion_state.machine_pos.y;
    if (!(command->word_flag & FLAG_Z_WORD)) xyz->z = motion_state.machine_pos.z;

    //add current position in incremental mode
    if (machine_state.distance_mode == DISTANCE_INCREMENTAL) {
        if (command->word_flag & FLAG_X_WORD) xyz->x += motion_state.machine_pos.x;
        if (command->word_flag & FLAG_Y_WORD) xyz->y += motion_state.machine_pos.y;
        if (command->word_flag & FLAG_Z_WORD) xyz->z += motion_state.machine_pos.z;
    }
}
