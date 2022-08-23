#ifndef COMMAND_H
#define COMMAND_H

#include <stdbool.h>
#include <stddef.h>

#include <avr/pgmspace.h>

#define TO_FIXED(DECIMAL) ((DECIMAL) * (1L << 16))
#define TO_FIXED_FRAC(DECIMAL) ((unsigned long)((DECIMAL) * (1ULL << 32)))

#define FLAG_G_MOTION ((unsigned int) 0x1)
#define FLAG_G_DISTANCE ((unsigned int) 0x2)
#define FLAG_G_OFFSET ((unsigned int) 0x4)
#define FLAG_G_FEED_RATE ((unsigned int) 0x8)
#define FLAG_G_UNITS ((unsigned int) 0x10)
#define FLAG_F_WORD ((unsigned int) 0x20)
#define FLAG_I_WORD ((unsigned int) 0x40)
#define FLAG_J_WORD ((unsigned int) 0x80)
#define FLAG_X_WORD ((unsigned int) 0x100)
#define FLAG_Y_WORD ((unsigned int) 0x200)
#define FLAG_Z_WORD ((unsigned int) 0x400)

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
bool has_non_modal(const struct command*, long);

bool parse_word(const char**, struct word*);
long parse_number(const char**);

void consume_whitespace(const char**);
void consume_comment(const char**);
bool parse_block_delete(const char**);
void consume_line_number(const char**);

#endif
