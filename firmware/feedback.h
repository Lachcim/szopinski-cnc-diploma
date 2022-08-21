#ifndef FEEDBACK_H
#define FEEDBACK_H

#include "state.h"
#include "motion/motion.h"

struct pos_feedback {
    char header[12];
    char feedback_type;
    struct cartesian machine_pos;
};

struct command_feedback {
    char header[12];
    char feedback_type;
    bool finished;
    char error;
    char interpretation;
    struct cartesian origin;
    struct cartesian destination;
    struct cartesian center;
};

void send_command_started();
void send_command_finished();

#endif
