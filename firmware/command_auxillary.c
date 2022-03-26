#include "command.h"

char parse_entity(const char** buffer, struct word* out_word, char* error) {
    consume_whitespace(buffer);


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
            break;
        }

        aux_letter++;
        aux_word_flag <<= 1;
        aux_word_pointer++;
    }
}

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
