#ifndef MOTION_H
#define MOTION_H

#include "../command/command.h"

#include <stdbool.h>

#define UNITS_PER_MM ((unsigned long) TO_FIXED(201.20724))
#define UNITS_PER_MM_Z ((unsigned long) TO_FIXED(1587.30158))
#define UNITS_PER_INCH ((unsigned long) TO_FIXED(5110.66389))
#define UNITS_PER_INCH_Z ((unsigned long) TO_FIXED(40317.46031))

struct cartesian {
    unsigned int x, y, z;
};

struct motion_state {
    void (*motion_handler)();
    bool falling_edge;
    bool reset_busy;

    struct cartesian destination;
    struct cartesian offset;
};

extern struct motion_state motion_state;

void translate(const struct command*, struct cartesian*);

void init_rapid(const struct command*);
void rapid_handler();
void init_linear(const struct command*);
void linear_handler();

#endif
