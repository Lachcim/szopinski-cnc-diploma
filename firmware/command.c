#include "command.h"
#include "state.h"

void parse_command(const char* buffer, struct command* command) {
    //initialize output, mark all words as absent
    struct command output;
    output.word_flag = 0;

    //parse block delete and line number
    if (parse_block_delete(&buffer)) return;

    consume_line_number(&buffer);
    if (machine_state.error != ERROR_NONE) return;

    //parse words in buffer
    struct word word;
    while (true) {
        //obtain word entity, validate syntax
        bool word_found = parse_word(&buffer, &word);
        if (machine_state.error != ERROR_NONE) return;
        if (!word_found) break;

        //update command structure, validate semantics
        assign_word(&output, word);
        if (machine_state.error != ERROR_NONE) return;
    }

    *command = output;
}

void assign_word(struct command* command, struct word word) {
    //assign auxillary (non-G, non-M) words
    const char* aux_letter = "FIJKLPRXYZ";
    unsigned int aux_word_flag = HAS_F_WORD;
    long* aux_word_pointer = &command->f_word;

    while (*aux_letter != 0) {
        if (word.letter == *aux_letter) {
            //raise error if the command already contains this aux word
            if (command->word_flag & aux_word_flag) {
                machine_state.error = ERROR_DUPLICATE_WORD;
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
        machine_state.error = ERROR_UNSUPPORTED;
        return;
    }
}
