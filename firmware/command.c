#include "command.h"

void parse_command(const char* buffer, struct command* command, char* error) {
    *error = PARSED_SUCCESSFULLY;

    parse_block_delete(&buffer, error);
    if (*error != PARSED_SUCCESSFULLY) return;

    parse_line_number(&buffer, error);
    if (*error != PARSED_SUCCESSFULLY) return;
}
