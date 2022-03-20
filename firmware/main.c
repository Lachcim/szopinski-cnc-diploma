#include <avr/io.h>
#include <avr/interrupt.h>

#define DISABLE_XY PD7
#define DISABLE_Z PB0
#define START PB1

#define Y_STEP PC4
#define Y_DIR PC5
#define X_STEP PC2
#define X_DIR PC3
#define Z_STEP PC0
#define Z_DIR PC1

int main() {
	DDRD |= (1 << DISABLE_XY);
	DDRB |= (1 << DISABLE_Z);
	DDRC |= (1 << X_STEP);
	DDRC |= (1 << X_DIR);
	DDRC |= (1 << Y_STEP);
	DDRC |= (1 << Y_DIR);
	DDRC |= (1 << Z_STEP);
	DDRC |= (1 << Z_DIR);

	TCCR0A |= (1 << WGM01); //CTC
	TCCR0B |= (2 << CS00);	//div by 8
	OCR0A = 63;
	TIMSK0 |= (1 << OCIE0A); //enable timer

	sei();

	PORTD |= (1 << DISABLE_XY);
	PORTB |= (1 << DISABLE_Z);
}

ISR(TIMER0_COMPA_vect) {

}
