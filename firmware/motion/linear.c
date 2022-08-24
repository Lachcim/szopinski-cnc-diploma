#include "motion.h"
#include "../main.h"
#include "../state.h"

static long delta_x, delta_y, delta_z; //1.30 signed fixed-point
static long long acc_x, acc_y, acc_z; //33.30 fixed-point

static long* leader;
static long leader_dest;

void init_linear(const struct command* command) {
    //initalize ports as in rapid movement
    init_rapid(command);

    //find greatest difference in any axis
    long long diff_x = motion_state.destination.x - motion_state.machine_pos.x;
    long long diff_y = motion_state.destination.y - motion_state.machine_pos.y;
    long long diff_z = motion_state.destination.z - motion_state.machine_pos.z;

    long long abs_diff_x = abs(diff_x);
    long long abs_diff_y = abs(diff_y);
    long long abs_diff_z = abs(diff_z);

    long long abs_leader_diff = abs_diff_x;
    leader = &motion_state.machine_pos.x;
    leader_dest = motion_state.destination.x;

    if (abs_diff_y > abs_leader_diff) {
        abs_leader_diff = abs_diff_y;
        leader = &motion_state.machine_pos.y;
        leader_dest = motion_state.destination.y;
    }
    if (abs_diff_z > abs_leader_diff) {
        abs_leader_diff = abs_diff_z;
        leader = &motion_state.machine_pos.z;
        leader_dest = motion_state.destination.z;
    }

    //normalize deltas against the leader
    delta_x = (diff_x << 30) / abs_leader_diff;
    delta_y = (diff_y << 30) / abs_leader_diff;
    delta_z = (diff_z << 30) / abs_leader_diff;

    //set inital accumulator values
    acc_x = (long long)motion_state.machine_pos.x << 30;
    acc_y = (long long)motion_state.machine_pos.y << 30;
    acc_z = (long long)motion_state.machine_pos.z << 30;

    //60% rapid speed
    OCR0A = 4;

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
    long long old_int_x = acc_x & 0xFFFFFFC0000000LL;
    long long old_int_y = acc_y & 0xFFFFFFC0000000LL;
    long long old_int_z = acc_z & 0xFFFFFFC0000000LL;

    //increment accumulators
    acc_x += delta_x;
    acc_y += delta_y;
    acc_z += delta_z;

    //move if integer part changed
    if ((acc_x & 0xFFFFFFC0000000LL) != old_int_x) STEP_PORT |= (1 << X_STEP);
    if ((acc_y & 0xFFFFFFC0000000LL) != old_int_y) STEP_PORT |= (1 << Y_STEP);
    if ((acc_z & 0xFFFFFFC0000000LL) != old_int_z) STEP_PORT |= (1 << Z_STEP);
}
