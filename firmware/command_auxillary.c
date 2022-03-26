#include "command.h"
#include "state.h"

bool parse_word(const char** buffer, struct word* out_word) {
    //ignore whitespace, comments and parameters
    while (true) {
        consume_whitespace(buffer);

        //handle end of buffer
        if (**buffer == 0)
            return false;

        //handle comments
        if (**buffer == '(' || **buffer == ';') {
            consume_comment(buffer);
            if (machine_state.error != ERROR_NONE) return false;
            continue;
        }

        //parameters aren't supported
        if (**buffer == '#') {
            machine_state.error = ERROR_UNSUPPORTED;
            return false;
        }

        break;
    }

    //obtain word letter, make it uppercase
    char letter = **buffer;
    if (letter >= 'a' && letter <= 'z')
        letter &= 0xDF;
    (*buffer)++;

    //obtain word value in 16.16 fixed-point
    long num = parse_number(buffer);
    if (machine_state.error != ERROR_NONE) return false;

    out_word->letter = letter;
    out_word->num = num;

    return true;
}

void consume_whitespace(const char** buffer) {
    while (**buffer == ' ' || **buffer == '\t')
        (*buffer)++;
}

void consume_comment(const char** buffer) {
    //end-of-line comment, move pointer to end of buffer
    if (**buffer == ';') {
        while (**buffer != 0)
            (*buffer)++;

        return;
    }

    //move pointer to end of parenthesis-enclosed comment
    while (**buffer != ')' && **buffer != 0)
        (*buffer)++;

    //end of buffer reached
    if (**buffer == 0) {
        machine_state.error = ERROR_MALFORMED;
        return;
    }

    (*buffer)++;
}

bool parse_block_delete(const char** buffer) {
    consume_whitespace(buffer);
    return **buffer == '/';
}

void consume_line_number(const char** buffer) {
    consume_whitespace(buffer);

    //must start with N
    if (**buffer != 'N' && **buffer != 'n')
        return;

    (*buffer)++;
    consume_whitespace(buffer);

    //consume integer part
    if (**buffer < '0' || **buffer > '9') {
        machine_state.error = ERROR_MALFORMED;
        return;
    }
    while (**buffer >= '0' && **buffer <= '9')
        (*buffer)++;

    //consume decimal point
    if (**buffer != '.')
        return;
    (*buffer)++;

    //consume fraction part
    if (**buffer < '0' || **buffer > '9') {
        machine_state.error = ERROR_MALFORMED;
        return;
    }
    while (**buffer >= '0' && **buffer <= '9')
        (*buffer)++;
}

long parse_number(const char** buffer) {
    bool negative = false;

    //parse sign
    if (**buffer == '-') {
        negative = true;
        (*buffer)++;
    }
    else if (**buffer == '+')
        (*buffer)++;

    long integer = 0;

    //must start with a digit or decimal point
    if ((**buffer < '0' || **buffer > '9') && **buffer != '.') {
        machine_state.error = ERROR_MALFORMED;
        return 0;
    }

    //handle integer part
    if (**buffer != '.') {
        //read integer digits
        while (**buffer >= '0' && **buffer <= '9') {
            integer *= 10;
            integer += **buffer - '0';
            (*buffer)++;
        }

        //no decimal point after integer, finish parsing
        if (**buffer != '.') {
            if (negative) integer = -integer;
            return integer << 16;
        }

        (*buffer)++;
    }
    else {
        //no integer part, fraction mandatory
        integer = 0;
        (*buffer)++;

        if (**buffer < '0' || **buffer > '9') {
            machine_state.error = ERROR_MALFORMED;
            return 0;
        }
    }

    long long sum = (long long)integer << 32;
    long long fraction = 0;
    long long divisor = 1;

    //read fraction digits
    while (**buffer >= '0' && **buffer <= '9') {
        fraction *= 10;
        fraction += **buffer - '0';
        divisor *= 10;
        (*buffer)++;
    }

    fraction <<= 32;
    fraction /= divisor;
    sum += fraction;

    if (negative) sum = -sum;
    return sum >> 16;
}
