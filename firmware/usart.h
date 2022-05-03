#ifndef USART_H
#define USART_H

#include <stddef.h>

#define RX_BUFFER_SIZE 255

#define USART_SENDING (UCSR0B & (1 << UDRIE0))

char usart_receive();
void usart_receive_block(char*);
void usart_send(const void*, size_t);

#endif
