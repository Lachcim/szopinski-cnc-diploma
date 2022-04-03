#ifndef MOTION_H
#define MOTION_H

#include "../command/command.h"

#include <stdbool.h>

#define UNITS_PER_MM TO_FIXED(201.20724)
#define UNITS_PER_INCH TO_FIXED(5110.66389)

#define MOTOR_TIMEOUT 5

struct cartesian {
    unsigned int x, y, z;
};

struct motion_state {
    void (*motion_handler)();
    bool falling_edge;
    bool done;

    unsigned char motor_timeout_xy;
    unsigned char motor_timeout_z;
};

extern struct motion_state motion_state;

void translate(const struct command*, struct cartesian*, struct cartesian*);

void init_rapid(struct cartesian);

#endif
