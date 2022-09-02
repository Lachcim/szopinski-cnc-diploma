#ifndef COMMAND_H
#define COMMAND_H

#include <stdbool.h>
#include <stddef.h>

#include <avr/pgmspace.h>

#define TO_FIXED(DECIMAL) ((long)(DECIMAL * (1L << 16)))
#define TO_FIXED_UNSIGNED(DECIMAL) ((unsigned long)(DECIMAL * (1L << 16)))

#define FLAG_G_MOTION 0x1U
#define FLAG_G_DISTANCE 0x2U
#define FLAG_G_OFFSET 0x4U
#define FLAG_G_FEED_RATE 0x8U
#define FLAG_G_UNITS 0x10U
#define FLAG_F_WORD 0x20U
#define FLAG_I_WORD 0x40U
#define FLAG_J_WORD 0x80U
#define FLAG_X_WORD 0x100U
#define FLAG_Y_WORD 0x200U
#define FLAG_Z_WORD 0x400U

struct word {
    char letter;
    long num;
};

struct command {
    bool deleted;
    unsigned int word_flag;
    long g_motion;
    long g_distance_mode;
    long g_offset_mode;
    long g_feed_rate;
    long g_unit_mode;
    long f_word;
    long i_word;
    long j_word;
    long x_word;
    long y_word;
    long z_word;
};

struct modal_mapping {
    long g_word;
    unsigned int flag;
};

void parse_command(const char*, struct command*);
void assign_word(struct command*, struct word);
void execute_command(const struct command*);

bool parse_word(const char**, struct word*);
long parse_number(const char**);

void consume_whitespace(const char**);
void consume_comment(const char**);
bool parse_block_delete(const char**);
void consume_line_number(const char**);

#endif
