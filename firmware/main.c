#include "main.h"
#include "state.h"
#include "usart.h"
#include "feedback.h"
#include "command/command.h"
#include "motion/motion.h"

#include <stdbool.h>

#include <avr/io.h>
#include <avr/interrupt.h>

struct machine_state machine_state = {
	.error = ERROR_NONE,
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

	//configure motion timer
	TCCR0A |= (1 << WGM01); //clear timer on compare
	TCCR0B |= (1 << CS02); //prescale by 256, f/256 = 78125 Hz max

	//configure feedback timer
	TCCR1B |= (1 << WGM12) | (1 << CS12) | (1 << CS10); //CTC, prescale by 1024
	OCR1A = 4882; //interrupt every quarter second
	TIMSK1 |= (1 << OCIE1A); //enable interrupt

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
		//await G-code block
		char block_buf[RX_BUFFER_SIZE];
		usart_receive_block(block_buf);

		//parse and execute command
		struct command command;
		parse_command(block_buf, &command);

		if (machine_state.error == ERROR_NONE)
			execute_command(&command);

		//send feedback on how the command was parsed
		send_command_started();

		//finish processing if error occurred
		if (machine_state.error) {
			machine_state.error = ERROR_NONE;
			send_command_finished();
			continue;
		}

		//if motion started, wait for it to finish
		if (motion_state.motion_handler) {
			DISABLE_XY_PORT &= ~(1 << DISABLE_XY);

			ENABLE_MOTION_TIMER;
			while (motion_state.motion_handler);
			DISABLE_MOTION_TIMER;
		}

		send_command_finished();
	}
}
