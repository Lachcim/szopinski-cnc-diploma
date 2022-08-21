#include "usart.h"
#include "state.h"

#include <avr/io.h>
#include <avr/interrupt.h>

static char rx_buf[RX_BUFFER_SIZE];
static char* receive_iter_in = rx_buf;
static const char* receive_iter_out = rx_buf;

static const char* transmit_iter;
static size_t transmit_counter;

char usart_receive() {
    //wait for a byte to appear in the buffer
    while (receive_iter_in == receive_iter_out);

    //read byte
    char output = *receive_iter_out;

    //increnent iterator
    receive_iter_out++;
    if (receive_iter_out == rx_buf + RX_BUFFER_SIZE)
        receive_iter_out = rx_buf;

    return output;
}

void usart_receive_block(char* buf) {
    int i = 0;
    while (i < RX_BUFFER_SIZE) {
        //read char from USART buffer
        char current_char = usart_receive();

        //break on newline, consume line breaks from previous block
        if (current_char == '\r' || current_char == '\n' || current_char == 0) {
            if (i == 0) continue;
            break;
        }

        //move char to buffer
        buf[i] = current_char;
        i++;
    }

    //insert terminator
    buf[i] = 0;
}

void usart_send(const void* buf, size_t size) {
    //set iterator and enable data buffer empty interrupts
    transmit_iter = buf;
    transmit_counter = size;
    UCSR0B |= (1 << UDRIE0);
}

ISR(USART_RX_vect) {
    //place data in buffer
    *receive_iter_in = UDR0;

    //increment receive iterator
    receive_iter_in++;
    if (receive_iter_in == rx_buf + RX_BUFFER_SIZE)
        receive_iter_in = rx_buf;
}

ISR(USART_UDRE_vect) {
    //disable interrupt if end of buffer reached
    if (transmit_counter == 0) {
        UCSR0B &= ~(1 << UDRIE0);
        return;
    }

    //move byte to data buffer
    UDR0 = *transmit_iter;

    //update iterator and counter
    transmit_iter++;
    transmit_counter--;
}
