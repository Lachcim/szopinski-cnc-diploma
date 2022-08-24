#include <limits.h>

unsigned long sqrt_int(unsigned long long x) {
    unsigned long y = 0;

    for (unsigned long mask = 0x80000000UL; mask != 0; mask >>= 1) {
        unsigned long y2 = y | mask;
        unsigned long long y2_squared = (unsigned long long)y2 * y2;

        if (y2_squared == x) return y2;
        if (y2_squared < x) y = y2;
    }

	return y;
}
