#include "command.h"
#include "../state.h"

static struct modal_mapping modal_map[] = {
    {TO_FIXED(0), FLAG_G_MOTION},
    {TO_FIXED(1), FLAG_G_MOTION},
    {TO_FIXED(2), FLAG_G_MOTION},
    {TO_FIXED(3), FLAG_G_MOTION},
    {TO_FIXED(20), FLAG_G_UNITS},
    {TO_FIXED(21), FLAG_G_UNITS},
    {TO_FIXED(90), FLAG_G_DISTANCE},
    {TO_FIXED(90.1), FLAG_G_OFFSET},
    {TO_FIXED(91), FLAG_G_DISTANCE},
    {TO_FIXED(91.1), FLAG_G_OFFSET},
    {TO_FIXED(93), FLAG_G_FEED_RATE},
    {TO_FIXED(94), FLAG_G_FEED_RATE}
};

void parse_command(const char* buffer, struct command* command) {
    //mark all words as absent
    command->word_flag = 0;

    //parse block delete
    command->deleted = parse_block_delete(&buffer);
    if (command->deleted)
        return;

    //parse line number
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
        assign_word(command, word);
        if (machine_state.error != ERROR_NONE) return;
    }
}

void assign_word(struct command* command, struct word word) {
    //assign auxillary (non-G, non-M) words
    const char* aux_letter = "FIJXYZ";
    unsigned int aux_word_flag = FLAG_F_WORD;
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
    if (word.letter != 'G') {
        machine_state.error = ERROR_UNSUPPORTED;
        return;
    }

    //assign to proper modal group, binary search
    unsigned char min = 0;
    unsigned char max = sizeof(modal_map) / sizeof(struct modal_mapping) - 1;
    int index = -1;

    while (min != max) {
        unsigned char mid = (min + max) >> 1;

        if (modal_map[mid].g_word < word.num) {
            min = mid;
            continue;
        }
        if (modal_map[mid].g_word > word.num) {
            max = mid;
            continue;
        }

        index = mid;
        break;
    }

    //no mapping found for g-word, unsupported
    if (index == -1) {
        machine_state.error = ERROR_UNSUPPORTED;
        return;
    }

    //can't have two words from the same modal group
    if (command->word_flag & modal_map[index].flag) {
        machine_state.error = ERROR_CONFLICTING_MODAL;
        return;
    }

    //assign values to struct
    command->word_flag |= modal_map[index].flag;
    switch (modal_map[index].flag)
    {
        case FLAG_G_MOTION: command->g_motion = word.num; break;
        case FLAG_G_DISTANCE: command->g_distance_mode = word.num; break;
        case FLAG_G_OFFSET: command->g_offset_mode = word.num; break;
        case FLAG_G_FEED_RATE: command->g_feed_rate = word.num; break;
        case FLAG_G_UNITS: command->g_unit_mode = word.num; break;
    }
}
