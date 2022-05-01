#include "motion.h"
#include "../main.h"
#include "../state.h"

static long delta_x, delta_y, delta_z; //1.30 signed fixed-point
static unsigned long long acc_x, acc_y, acc_z; // 34.30 fixed-point

unsigned int* leader;
unsigned int leader_dest;

void init_linear(const struct command* command) {
    //initalize ports as in rapid movement
    init_rapid(command);

    //find greatest difference in any axis
    unsigned int diff_x = abs_diff(motion_state.machine_pos.x, motion_state.destination.x);
    unsigned int diff_y = abs_diff(motion_state.machine_pos.y, motion_state.destination.y);
    unsigned int diff_z = abs_diff(motion_state.machine_pos.z, motion_state.destination.z);

    unsigned int leader_diff = diff_x;
    leader = &motion_state.machine_pos.x;
    leader_dest = motion_state.destination.x;

    if (diff_y > leader_diff) {
        leader_diff = diff_y;
        leader = &motion_state.machine_pos.y;
        leader_dest = motion_state.destination.y;
    }
    if (diff_z > leader_diff) {
        leader_diff = diff_z;
        leader = &motion_state.machine_pos.z;
        leader_dest = motion_state.destination.z;
    }

    //normalize deltas against the leader
    delta_x = (((long long)diff_x) << 30) / leader_diff;
    delta_y = (((long long)diff_y) << 30) / leader_diff;
    delta_z = (((long long)diff_z) << 30) / leader_diff;

    //set inital accumulator values
    acc_x = (unsigned long long)motion_state.machine_pos.x << 30;
    acc_y = (unsigned long long)motion_state.machine_pos.y << 30;
    acc_z = (unsigned long long)motion_state.machine_pos.z << 30;

    //divide timer frequency by 4
    OCR0A = 2;

    //set appropriate motion handler
    motion_state.motion_handler = linear_handler;
}

void linear_handler() {
    //stop if the leader reached its destination
    if (*leader == leader_dest) {
        //account for rounding error
        if (motion_state.machine_pos.x != motion_state.destination.x) STEP_PORT |= (1 << X_STEP);
        if (motion_state.machine_pos.y != motion_state.destination.y) STEP_PORT |= (1 << Y_STEP);
        if (motion_state.machine_pos.z != motion_state.destination.z) STEP_PORT |= (1 << Z_STEP);

        DISABLE_Z_PORT |= (1 << DISABLE_Z);
        motion_state.motion_handler = 0;
        return;
    }

    //remember integer part of accumulator before incrementing
    unsigned long long old_int_x = acc_x & 0xFFFFFFC0000000;
    unsigned long long old_int_y = acc_y & 0xFFFFFFC0000000;
    unsigned long long old_int_z = acc_z & 0xFFFFFFC0000000;

    //increment accumulators
    acc_x += delta_x;
    acc_y += delta_y;
    acc_z += delta_z;

    //move if integer part changed
    if ((acc_x & 0xFFFFFFC0000000) != old_int_x) STEP_PORT |= (1 << X_STEP);
    if ((acc_y & 0xFFFFFFC0000000) != old_int_y) STEP_PORT |= (1 << Y_STEP);
    if ((acc_z & 0xFFFFFFC0000000) != old_int_z) STEP_PORT |= (1 << Z_STEP);
}
