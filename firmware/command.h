#ifndef COMMAND_H
#define COMMAND_H

#include <stdbool.h>

#define PARSED_SUCCESSFULLY 0
#define ERROR_BUFFER_OVERFLOW 1
#define ERROR_BLOCK_DELETE 2
#define ERROR_MALFORMED 3
#define ERROR_UNSUPPORTED 4
#define ERROR_DUPLICATE_WORD 5
#define ERROR_CONFLICTING_MODAL 6

#define ENTITY_NONE 0
#define ENTITY_WORD 1
#define ENTITY_COMMENT 2
#define ENTITY_PARAMETER 3

#define HAS_G_MOTION ((unsigned int) 0x1)
#define HAS_G_DISTANCE ((unsigned int) 0x2)
#define HAS_G_OFFSET ((unsigned int) 0x4)
#define HAS_G_FEED_RATE ((unsigned int) 0x8)
#define HAS_G_UNIT ((unsigned int) 0x10)
#define HAS_M_STOP ((unsigned int) 0x20)
#define HAS_F_WORD ((unsigned int) 0x40)
#define HAS_I_WORD ((unsigned int) 0x80)
#define HAS_J_WORD ((unsigned int) 0x100)
#define HAS_K_WORD ((unsigned int) 0x200)
#define HAS_L_WORD ((unsigned int) 0x400)
#define HAS_P_WORD ((unsigned int) 0x800)
#define HAS_R_WORD ((unsigned int) 0x1000)
#define HAS_X_WORD ((unsigned int) 0x2000)
#define HAS_Y_WORD ((unsigned int) 0x4000)
#define HAS_Z_WORD ((unsigned int) 0x8000)

struct word {
    char letter;
    union {
        struct {
            int num_int;
            int num_frac;
        };
        long num;
    };
};

struct command {
    unsigned int word_flag;
    struct word g_motion;
    struct word g_distance_mode;
    struct word g_offset_mode;
    struct word g_feed_rate;
    struct word g_unit_mode;
    struct word m_stop;
    long f_word;
    long i_word;
    long j_word;
    long k_word;
    long l_word;
    long p_word;
    long r_word;
    long x_word;
    long y_word;
    long z_word;
};

void parse_command(const char*, struct command*, char*);
void assign_word(struct command*, struct word, char*);

bool parse_word(const char**, struct word*, char*);
long parse_number(const char**, char*);

void consume_whitespace(const char**);
void consume_comment(const char**, char*);
void parse_block_delete(const char**, char*);
void consume_line_number(const char**, char*);

#endif
