#include "command.h"

#include <stdbool.h>

void parse_command(const char* buffer, struct command* command, char* error) {
    *error = PARSED_SUCCESSFULLY;

    //parse block delete and line number
    parse_block_delete(&buffer, error);
    if (*error != PARSED_SUCCESSFULLY) return;

    consume_line_number(&buffer, error);
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

void assign_word(struct command* command, struct word word, char* error) {
    //assign auxillary (non-G, non-M) words
    const char* aux_letter = "FIJKLPRXYZ";
    unsigned int aux_word_flag = HAS_F_WORD;
    long* aux_word_pointer = &command->f_word;

    while (*aux_letter != 0) {
        if (word.letter == *aux_letter) {
            //raise error if the command already contains this aux word
            if (command->word_flag & aux_word_flag) {
                *error = ERROR_DUPLICATE_WORD;
                return;
            }

            //assign value to command and mark word as present
            command->word_flag |= aux_word_flag;
            *aux_word_pointer = word.num;
            return;
        }

        aux_letter++;
        aux_word_flag <<= 1;
        aux_word_pointer++;
    }

    //handle unsupported letters
    if (word.letter != 'G' && word.letter != 'M') {
        *error = ERROR_UNSUPPORTED;
        return;
    }
}
