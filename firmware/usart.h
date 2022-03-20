#ifndef USART_H
#define USART_H

#define USART_SENDING (UCSR0B & (1 << UDRIE0))

void usart_receive_block(char*);
void usart_send(const char*);

#endif
