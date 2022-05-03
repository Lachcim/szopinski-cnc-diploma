#ifndef FEEDBACK_H
#define FEEDBACK_H

#include "state.h"
#include "motion/motion.h"

struct feedback {
    char header[12];
    bool busy;
    unsigned int command_counter;
    unsigned char error;
    struct cartesian machine_pos;
    unsigned char rx_buf_space;
};

#endif
