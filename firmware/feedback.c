#include "feedback.h"
#include "usart.h"

#include <avr/interrupt.h>

static struct feedback feedback = {
    .header = "PLOTFEEDB",
    .footer = "\r\n"
};

ISR(TIMER1_COMPA_vect) {
    //collect machine state info and place it in feedback struct
    feedback.busy = machine_state.busy;
    feedback.command_counter = machine_state.command_counter;
    feedback.error = machine_state.caught_error;
    feedback.machine_pos = motion_state.machine_pos;
    feedback.rx_buf_space = machine_state.rx_buf_space;

    //send struct asynchronously utilizing static allocation
    usart_send(&feedback, sizeof(feedback));
}
