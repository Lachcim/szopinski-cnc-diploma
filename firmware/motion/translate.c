#include "motion.h"

void translate(const struct command* command, struct cartesian* xyz, struct cartesian* jik) {
    xyz->x = command->x_word;
    xyz->y = command->y_word;
    xyz->z = command->z_word;
    jik->x = command->i_word;
    jik->y = command->j_word;
    jik->z = command->k_word;
}
