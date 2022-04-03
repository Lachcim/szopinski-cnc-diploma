#include "command.h"
#include "../motion/motion.h"

#include "../usart.h"
#include <stdio.h>
#include "../state.h"

void execute_command(const struct command* command) {
    //set feed rate mode
    if (command->word_flag & FLAG_G_FEED_RATE)
        machine_state.feed_rate_mode =
            command->g_feed_rate == TO_FIXED(93) ?
            FEED_RATE_INVERSE_TIME : FEED_RATE_CONSTANT;

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

    //initialize motion
    if (command->word_flag & (FLAG_X_WORD | FLAG_Y_WORD | FLAG_Z_WORD)) {
        struct cartesian xyz, ijk;
        translate(command, &xyz, &ijk);

        switch (machine_state.motion_mode) {
            case MOTION_RAPID:
                init_rapid(xyz);
        }
    }
}

bool has_non_modal(const struct command* command, long word) {
    for (unsigned char i = 0; i < MAX_NON_MODALS; i++)
        if (command->g_non_modal[i] == word)
            return true;

    return false;
}
