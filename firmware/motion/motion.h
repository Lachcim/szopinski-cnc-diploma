#ifndef MOTION_H
#define MOTION_H

#include "../command/command.h"

#include <stdbool.h>

#define Z_STEP_FACTOR_FLOAT 7.888889
#define Z_STEP_FACTOR ((unsigned long) TO_FIXED(Z_STEP_FACTOR_FLOAT))

#define UNITS_PER_MM ((unsigned long) TO_FIXED(201.20724))
#define UNITS_PER_MM_Z ((unsigned long) TO_FIXED(201.20724 * Z_STEP_FACTOR_FLOAT))
#define UNITS_PER_INCH ((unsigned long) TO_FIXED(5110.66389))
#define UNITS_PER_INCH_Z ((unsigned long) TO_FIXED(5110.66389 * Z_STEP_FACTOR_FLOAT))

#define MINUTES_PER_TICK TO_FIXED_FRAC(1.0 / (60 * 78125))

#define abs_diff(a, b) ((a > b) ? (a - b) : (b - a))

#define ENABLE_MOTION_TIMER TIMSK0 |= (1 << OCIE0A)
#define DISABLE_MOTION_TIMER TIMSK0 &= ~(1 << OCIE0A)

struct cartesian {
    unsigned int x, y, z;
};

struct motion_state {
    struct cartesian machine_pos;

    void (*volatile motion_handler)();
    bool falling_edge;

    struct cartesian origin;
    struct cartesian destination;
    struct cartesian center;
};

extern struct motion_state motion_state;

void translate(const struct command*, struct cartesian*);

void init_rapid(const struct command*);
void rapid_handler();
void init_linear(const struct command*);
void linear_handler();

#endif
