#include "main.h"
#include "state.h"
#include "usart.h"
#include "command/command.h"

#include <stdbool.h>

#include <avr/io.h>
#include <avr/interrupt.h>

struct machine_state machine_state = {
	.error = ERROR_NONE,
	.caught_error = ERROR_NONE,
	.busy = false,
	.rx_buf_space = RX_BUFFER_SIZE,
	.motion_mode = MOTION_RAPID,
	.distance_mode = DISTANCE_ABSOLUTE,
	.offset_mode = OFFSET_INCREMENTAL,
	.unit_mode = UNITS_MM
};

int main() {
	//configure ports
	DISABLE_XY_DIR_PORT |= (1 << DISABLE_XY);
	DISABLE_Z_DIR_PORT |= (1 << DISABLE_Z);
	STEP_DIR_PORT |=
		(1 << X_STEP)
		| (1 << X_DIR)
		| (1 << Y_STEP)
		| (1 << Y_DIR)
		| (1 << Z_STEP)
		| (1 << Z_DIR);

	//configure timer
	TCCR0A |= (1 << WGM01); //clear timer on compare
	TCCR0B |= (1 << CS02);	//prescale by 256, f/256 = 78125 Hz max
	TIMSK0 |= (1 << OCIE0A); //enable timer interrupt

	//configure USART
	UBRR0H = 0; UBRR0L = 128; //9600 baud
	UCSR0B |= (1 << RXEN0) | (1 << RXCIE0) | (1 << TXEN0); //enable receiver and transmitter
	UCSR0C |= (1 << UCSZ01) | (1 << UCSZ00); //8-bit word size

	//enable global interrupts
	sei();

	//disable motors
	DISABLE_XY_PORT |= (1 << DISABLE_XY);
	DISABLE_Z_PORT |= (1 << DISABLE_Z);

	while (true) {
		//reset machine state
		if (machine_state.error != ERROR_NONE) {
			machine_state.caught_error = machine_state.error;
			machine_state.error = ERROR_NONE;
			machine_state.busy = false;
		}

		//await G-code block
		char block_buf[256];
		usart_receive_block(block_buf);

		//parse and execute command
		struct command command;
		parse_command(block_buf, &command);
		if (machine_state.error != ERROR_NONE) continue;

		//enable motors for testing
		DISABLE_XY_PORT &= ~(1 << DISABLE_XY);

		execute_command(&command);
		if (machine_state.error != ERROR_NONE) continue;

		//wait for interrupt-driven actions to finish
		while (machine_state.busy && machine_state.error == ERROR_NONE);
	}
}
