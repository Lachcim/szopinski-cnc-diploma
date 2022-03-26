#include "command.h"

#include <stdbool.h>

void parse_command(const char* buffer, struct command* command, char* error) {
    *error = PARSED_SUCCESSFULLY;

    //parse block delete and line number
    parse_block_delete(&buffer, error);
    if (*error != PARSED_SUCCESSFULLY) return;

    parse_line_number(&buffer, error);
    if (*error != PARSED_SUCCESSFULLY) return;

    //initialize output, mark all words as absent
    struct command output;
    output.word_flag = 0;

    //parse words in buffer
    struct word word;
    while (true) {
        //obtain word entity, validate syntax
        bool word_found = parse_word(&buffer, &word, error);
        if (*error != PARSED_SUCCESSFULLY) return;
        if (!word_found) break;

        //update command structure, validate semantics
        assign_word(&output, word, error);
        if (*error != PARSED_SUCCESSFULLY) return;
    }

    *command = output;
}
