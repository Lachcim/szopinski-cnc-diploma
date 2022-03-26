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

    //parse words, comments and parameters
    while (true) {
        struct word word;
        char entity_type = parse_entity(&buffer, &word, error);

        if (*error != PARSED_SUCCESSFULLY) return;
        if (entity_type == ENTITY_NONE) break;

        //assign word to modal group
        if (entity_type == ENTITY_WORD)
            assign_word(&output, word, error);

        if (*error != PARSED_SUCCESSFULLY) return;
    }

    *command = output;
}
