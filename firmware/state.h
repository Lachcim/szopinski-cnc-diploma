#ifndef STATE_H
#define STATE_H

#include <stdbool.h>

#define ERROR_NONE 0
#define ERROR_BUFFER_OVERFLOW 1
#define ERROR_BLOCK_DELETE 2
#define ERROR_MALFORMED 3
#define ERROR_UNSUPPORTED 4
#define ERROR_DUPLICATE_WORD 5
#define ERROR_CONFLICTING_MODAL 6
#define ERROR_MISSING_ARGUMENT 7

#define MOTION_RAPID 0
#define MOTION_LINEAR 1
#define MOTION_ARC 2
#define MOTION_ARC_CCW 3

#define DISTANCE_ABSOLUTE 0
#define DISTANCE_INCREMENTAL 1

#define OFFSET_INCREMENTAL 0
#define OFFSET_ABSOLUTE 1

#define FEED_RATE_CONSTANT 0
#define FEED_RATE_INVERSE_TIME 1

#define UNITS_MM 0
#define UNITS_INCH 1

struct machine_state {
    unsigned int machine_x;
    unsigned int machine_y;
    unsigned int machine_z;

    volatile char error;
    volatile bool busy;

    char motion_mode;
    char distance_mode;
    char offset_mode;
    char feed_rate_mode;
    char unit_mode;
};

extern struct machine_state machine_state;

#endif
