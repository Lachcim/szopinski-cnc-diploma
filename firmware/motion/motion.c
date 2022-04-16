#include "motion.h"
#include "../main.h"
#include "../state.h"

#include <avr/interrupt.h>

struct motion_state motion_state = {0};

void update_position() {
    //capture state of step port
    char step = STEP_PORT;

    //update machine coordinates
    if (step & (1 << X_STEP))
        machine_state.machine_x += (step & (1 << X_DIR)) ? 1 : -1;
    if (step & (1 << Y_STEP))
        machine_state.machine_y += (step & (1 << Y_DIR)) ? 1 : -1;
    if (step & (1 << Z_STEP))
        machine_state.machine_z += (step & (1 << Z_DIR)) ? 1 : -1;
}

ISR(TIMER0_OVF_vect) {
    //drive step signal low every other iteration
    if (motion_state.falling_edge) {
        STEP_PORT &= ~((1 << X_STEP) | (1 << Y_STEP) | (1 << Z_STEP));

        motion_state.falling_edge = false;
        return;
    }

    //if there is no motion handler, do nothing
    if (!motion_state.motion_handler) {
        //reset busy state if motion has just completed
        if (motion_state.reset_busy) {
            machine_state.busy = false;
            motion_state.reset_busy = false;
        }

        return;
    }

    //delegate control to motion handler
    motion_state.motion_handler();

    //update machine and motion state
    update_position();
    motion_state.falling_edge = true;
    motion_state.time_elapsed++;
}
