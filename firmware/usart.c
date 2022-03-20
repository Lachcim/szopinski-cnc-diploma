#include "usart.h"

#include <avr/io.h>
#include <avr/interrupt.h>

static const char* transmit_iter;

void usart_send(const char* buf) {
    //set iterator and enable data buffer empty interrupts
    transmit_iter = buf;
    UCSR0B |= (1 << UDRIE0);
}

ISR(USART_UDRE_vect) {
    char current_char = *transmit_iter;

    //disable interrupt if end of string reached
    if (current_char == 0) {
        UCSR0B &= ~(1 << UDRIE0);
        return;
    }

    //move character to data buffer
    UDR0 = current_char;
	transmit_iter++;
}
