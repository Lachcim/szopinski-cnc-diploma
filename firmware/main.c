#include "main.h"

#include <avr/io.h>
#include <avr/interrupt.h>

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
	TCCR0B |= (2 << CS00);	//divide clock by 8
	OCR0A = 63;
	TIMSK0 |= (1 << OCIE0A); //enable timer

	//enable global interrupts
	sei();

	//disable motors
	DISABLE_XY_PORT |= (1 << DISABLE_XY);
	DISABLE_Z_PORT |= (1 << DISABLE_Z);
}

ISR(TIMER0_COMPA_vect) {

}
