#ifndef MOTION_H
#define MOTION_H

#include "../main.h"
#include "../command/command.h"

#include <stdbool.h>

#define Z_STEP_FACTOR 7.888889

#define UNITS_PER_MM ((unsigned long) TO_FIXED(201.20724))
#define UNITS_PER_MM_Z ((unsigned long) TO_FIXED(201.20724 * Z_STEP_FACTOR))
#define UNITS_PER_INCH ((unsigned long) TO_FIXED(5110.66389))
#define UNITS_PER_INCH_Z ((unsigned long) TO_FIXED(5110.66389 * Z_STEP_FACTOR))

#define MOTOR_TIMEOUT (F_CPU / 256 / 256 * 5)
#define MAX_RADIUS_ERROR 100

#define abs(x) ((x > 0) ? x : -x)
#define abs_diff(a, b) ((a > b) ? (a - b) : (b - a))
#define square(x) ((x) * (x))

struct cartesian {
    long x, y, z;
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
void translate_offset(const struct command*, struct cartesian*);
unsigned long sqrt_int(unsigned long long);

void init_rapid(const struct command*);
void rapid_handler();
void init_linear(const struct command*);
void linear_handler();
void init_arc(const struct command*, bool);
void arc_handler();

#endif
