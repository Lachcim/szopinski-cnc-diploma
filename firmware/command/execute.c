#include "command.h"
#include "../state.h"
#include "../motion/motion.h"

#include "../usart.h"
#include <stdio.h>

void execute_command(const struct command* command) {
    //set feed rate mode
    if (command->word_flag & FLAG_G_FEED_RATE)
        machine_state.feed_rate_mode =
            command->g_feed_rate == TO_FIXED(93) ?
            FEED_RATE_INVERSE_TIME : FEED_RATE_CONSTANT;

    //set feed rate
    if (command->word_flag & FLAG_F_WORD && machine_state.feed_rate_mode == FEED_RATE_CONSTANT) {
        if (command->f_word < 0) {
            machine_state.error = ERROR_INVALID_ARGUMENT;
            return;
        }

        //get distance unit conversion factor
        unsigned long distance_conv = (machine_state.unit_mode == UNITS_MM) ?
            UNITS_PER_MM : UNITS_PER_INCH;

        //get feed rate in machine units per minute, 32.32 fixed-point
        unsigned long long u_per_min = (unsigned long long)command->f_word * distance_conv;

        //get feed rate in machine units per tick, 0.32 fixed-point
        motion_state.feed_rate = (u_per_min * MINUTES_PER_TICK) >> 32;
    }

    //dwell
    if (has_non_modal(command, TO_FIXED(4))) {
        //TODO
    }

    //set units
    if (command->word_flag & FLAG_G_UNITS)
        machine_state.unit_mode =
            command->g_unit_mode == TO_FIXED(20) ?
            UNITS_INCH : UNITS_MM;

    //set XYZ distance mode
    if (command->word_flag & FLAG_G_DISTANCE)
        machine_state.distance_mode =
            command->g_unit_mode == TO_FIXED(90) ?
            DISTANCE_ABSOLUTE : DISTANCE_INCREMENTAL;

    //set IJK offset mode
    if (command->word_flag & FLAG_G_OFFSET)
        machine_state.offset_mode =
            command->g_unit_mode == TO_FIXED(90.1) ?
            OFFSET_ABSOLUTE : OFFSET_INCREMENTAL;

    //set motion mode
    if (command->word_flag & FLAG_G_MOTION)
        switch (command->g_motion) {
            case TO_FIXED(0):
                machine_state.motion_mode = MOTION_RAPID;
                break;
            case TO_FIXED(1):
                machine_state.motion_mode = MOTION_LINEAR;
                break;
            case TO_FIXED(2):
                machine_state.motion_mode = MOTION_ARC;
                break;
            case TO_FIXED(3):
                machine_state.motion_mode = MOTION_ARC_CCW;
                break;
        }

    //initiate motion
    if (command->word_flag & (FLAG_X_WORD | FLAG_Y_WORD | FLAG_Z_WORD)) {
        TIMSK0 &= ~(1 << TOIE0);

        //initialize motion state for the given motion mode
        switch (machine_state.motion_mode) {
            case MOTION_RAPID: init_rapid(command); break;
            case MOTION_LINEAR: init_linear(command); break;
            case MOTION_ARC:
            case MOTION_ARC_CCW:
                break;
        }

        motion_state.origin = motion_state.machine_pos;
        motion_state.reset_busy = true;
        motion_state.time_elapsed = 0;
        TIMSK0 |= (1 << TOIE0);
        return;
    }

    //no motion, execution complete
    machine_state.busy = false;
}

bool has_non_modal(const struct command* command, long word) {
    for (unsigned char i = 0; i < MAX_NON_MODALS; i++)
        if (command->g_non_modal[i] == word)
            return true;

    return false;
}
