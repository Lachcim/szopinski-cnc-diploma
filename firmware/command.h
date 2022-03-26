#ifndef COMMAND_H
#define COMMAND_H

#define PARSED_SUCCESSFULLY 0
#define ERROR_BLOCK_DELETE 1
#define ERROR_INVALID_LINE_NUM 2

struct word {
    char letter;
    union {
        struct {
            char num_int;
            char num_frac;
        };
        short num;
    };
};

struct command {
    struct word g_motion;
    struct word g_distance_mode;
    struct word g_offset_mode;
    struct word g_feed_rate;
    struct word g_unit_mode;
    struct word m_stop;
};

void parse_command(const char*, struct command*, char*);

void consume_whitespace(const char**);
void parse_block_delete(const char**, char*);
void parse_line_number(const char**, char*);

#endif
