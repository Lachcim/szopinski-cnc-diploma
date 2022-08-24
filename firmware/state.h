#ifndef STATE_H
#define STATE_H

#include <stdbool.h>

#define ERROR_NONE 0
#define ERROR_MALFORMED 1
#define ERROR_UNSUPPORTED 2
#define ERROR_DUPLICATE_WORD 3
#define ERROR_CONFLICTING_MODAL 4
#define ERROR_MISSING_ARGUMENT 5
#define ERROR_INVALID_ARGUMENT 6
#define ERROR_RADIUS_MISMATCH 7

#define MOTION_RAPID 'r'
#define MOTION_LINEAR 'l'
#define MOTION_ARC 'a'
#define MOTION_ARC_CCW 'c'

#define DISTANCE_ABSOLUTE 0
#define DISTANCE_INCREMENTAL 1

#define OFFSET_INCREMENTAL 0
#define OFFSET_ABSOLUTE 1

#define UNITS_MM 0
#define UNITS_INCH 1

struct machine_state {
    volatile unsigned char error;

    char motion_mode;
    char distance_mode;
    char offset_mode;
    char unit_mode;
};

extern struct machine_state machine_state;

#endif
