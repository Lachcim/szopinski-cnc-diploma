#include "command.h"
#include "../motion/motion.h"

#include "../usart.h"
#include <stdio.h>
#include "../state.h"

void execute_command(const struct command* command) {
    struct command cmd = *command;

    if (!(cmd.word_flag & FLAG_X_WORD)) cmd.x_word = 0;
    if (!(cmd.word_flag & FLAG_Y_WORD)) cmd.y_word = 0;
    if (!(cmd.word_flag & FLAG_Z_WORD)) cmd.z_word = 0;

    init_rapid((struct cartesian){command->x_word >> 16, command->y_word >> 16, command->z_word >> 16});
}
