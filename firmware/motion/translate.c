#include "motion.h"
#include "../state.h"

void translate(const struct command* command, struct cartesian* xyz, struct cartesian* ijk) {
    unsigned long conv_factor = machine_state.unit_mode == UNITS_MM ?
        UNITS_PER_MM : UNITS_PER_INCH;
    unsigned long conv_factor_z = machine_state.unit_mode == UNITS_MM ?
        UNITS_PER_MM_Z : UNITS_PER_INCH_Z;

    xyz->x = ((long long) command->x_word * conv_factor) >> 32;
    xyz->y = ((long long) command->y_word * conv_factor) >> 32;
    xyz->z = ((long long) command->z_word * conv_factor_z) >> 32;
    ijk->x = ((long long) command->i_word * conv_factor) >> 32;
    ijk->y = ((long long) command->j_word * conv_factor) >> 32;
    ijk->z = ((long long) command->k_word * conv_factor_z) >> 32;

    if (!(command->word_flag & FLAG_X_WORD)) xyz->x = machine_state.machine_x;
    if (!(command->word_flag & FLAG_Y_WORD)) xyz->y = machine_state.machine_y;
    if (!(command->word_flag & FLAG_Z_WORD)) xyz->z = machine_state.machine_z;

    if (machine_state.distance_mode == DISTANCE_INCREMENTAL) {
        if (command->word_flag & FLAG_X_WORD) xyz->x += machine_state.machine_x;
        if (command->word_flag & FLAG_Y_WORD) xyz->y += machine_state.machine_y;
        if (command->word_flag & FLAG_Z_WORD) xyz->z += machine_state.machine_z;
    }

    if (machine_state.offset_mode == OFFSET_INCREMENTAL) {
        ijk->x += xyz->x;
        ijk->y += xyz->y;
        ijk->z += xyz->z;
    }
}
