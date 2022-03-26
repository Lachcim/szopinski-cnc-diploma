#include "command.h"

void consume_whitespace(const char** buffer) {
    while (**buffer == ' ' || **buffer == '\t')
        (*buffer)++;
}

void parse_block_delete(const char** buffer, char* error) {
    consume_whitespace(buffer);

    if (**buffer == '/')
        *error = ERROR_BLOCK_DELETE;
}

void parse_line_number(const char** buffer, char* error) {
    consume_whitespace(buffer);

    if (**buffer != 'N' && **buffer != 'n')
        return;

    (*buffer)++;

    if (**buffer < '0' || **buffer > '9') {
        *error = ERROR_INVALID_LINE_NUM;
        return;
    }

    while (**buffer >= '0' && **buffer <= '9')
        (*buffer)++;

    if (**buffer != '.')
        return;

    (*buffer)++;
    while (**buffer >= '0' && **buffer <= '9')
        (*buffer)++;
}
