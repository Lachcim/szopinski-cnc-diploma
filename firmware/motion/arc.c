#include "motion.h"
#include "../state.h"

void init_arc(const struct command* command, bool ccw) {
    //obtain destination
    struct cartesian dest;
    translate(command, &dest);

    //obtain circle center
    long center_x, center_y;
    translate_offset(command, &center_x, &center_y);


}

void arc_handler() {

}
