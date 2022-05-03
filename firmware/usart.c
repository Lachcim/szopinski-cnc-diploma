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
    while (machine_state.rx_buf_space == RX_BUFFER_SIZE && machine_state.error == ERROR_NONE);
    if (machine_state.error != ERROR_NONE) return 0;

    //read byte
    char output = *receive_iter_out;
    machine_state.rx_buf_space++;

    //increnent iterator
    receive_iter_out++;
    if (receive_iter_out == rx_buf + RX_BUFFER_SIZE)
        receive_iter_out = rx_buf;

    return output;
}

void usart_receive_block(char* buf) {
    int i = 0;
    while (i < 256) {
        //read char from USART buffer
        char current_char = usart_receive();
        if (machine_state.error != ERROR_NONE) return;

        //break on newline, consume line breaks from previous block
        if (current_char == '\r' || current_char == '\n') {
            if (i == 0) continue;
            break;
        }

        //move char to buffer
        buf[i] = current_char;
        i++;
    }

    buf[i] = 0;
}

void usart_send(const void* buf, size_t size) {
    //set iterator and enable data buffer empty interrupts
    transmit_iter = buf;
    transmit_counter = size;
    UCSR0B |= (1 << UDRIE0);
}

ISR(USART_RX_vect) {
    //no room to receive the data
    if (machine_state.rx_buf_space == 0) {
        machine_state.error = ERROR_BUFFER_OVERFLOW;
        return;
    }

    *receive_iter_in = UDR0;
    machine_state.rx_buf_space--;

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
