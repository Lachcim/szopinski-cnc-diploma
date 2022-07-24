#include "feedback.h"
#include "usart.h"

#include <avr/interrupt.h>

static struct timed_feedback timed_feedback = {
    .header = "PLOTFEEDBACK",
    .feedback_type = 't'
};

static struct command_feedback command_feedback = {
    .header = "PLOTFEEDBACK",
    .feedback_type = 'c'
};

void send_command_started() {
    command_feedback.finished = false;
    command_feedback.error = machine_state.error;
    command_feedback.interpretation = motion_state.busy ? machine_state.motion_mode : 'x';
    command_feedback.origin = motion_state.origin;
    command_feedback.destination = motion_state.destination;
    command_feedback.center = motion_state.center;

    usart_send(&command_feedback, sizeof(command_feedback));
}
void send_command_finished() {
    command_feedback.finished = true;
    usart_send(&command_feedback, sizeof(command_feedback));
}

ISR(TIMER1_COMPA_vect) {
    timed_feedback.machine_pos = motion_state.machine_pos;
    timed_feedback.rx_buf_space = machine_state.rx_buf_space;

    usart_send(&timed_feedback, sizeof(timed_feedback));
}
