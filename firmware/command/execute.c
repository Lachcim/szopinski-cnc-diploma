#include "command.h"
#include "../state.h"
#include "../motion/motion.h"

#include "../usart.h"
#include <stdio.h>

void execute_command(const struct command* command) {
    //command deleted, ignore remaining fields
    if (command->deleted)
        return;

    //set feed rate mode, only units per minute allowed
    if (command->word_flag & FLAG_G_FEED_RATE)
        if (command->g_feed_rate != TO_FIXED(94)) {
            machine_state.error = ERROR_UNSUPPORTED;
            return;
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
        //initialize motion state for the given motion mode
        switch (machine_state.motion_mode) {
            case MOTION_RAPID: init_rapid(command); break;
            case MOTION_LINEAR: init_linear(command); break;
            case MOTION_ARC:
            case MOTION_ARC_CCW:
                break;
        }

        motion_state.origin = motion_state.machine_pos;
    }
}

bool has_non_modal(const struct command* command, long word) {
    for (unsigned char i = 0; i < MAX_NON_MODALS; i++)
        if (command->g_non_modal[i] == word)
            return true;

    return false;
}
