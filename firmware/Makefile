PROG ?= usbasp
AVRDUDE ?= avrdude

CFLAGS = -std=c99 -Os -Wall -mcall-prologues -mmcu=atmega328p
LDFLAGS = -Wl,-gc-sections -Wl,-relax

SOURCES = $(wildcard *.c)
HEADERS = $(wildcard *.h)
OBJECTS = $(patsubst %.c, $(BUILD)/%.o, $(SOURCES))

BUILD = build

$(BUILD)/firmware.hex: $(BUILD)/firmware
	avr-objcopy -O ihex -R .eeprom $^ $@

$(BUILD)/firmware: $(OBJECTS)
	avr-gcc $(CFLAGS) $(LDFLAGS) -o $@ $^

$(BUILD)/%.o: %.c $(HEADERS) | $(BUILD)
	avr-gcc -c $(CFLAGS) -o $@ $<

$(BUILD):
	mkdir -p $(BUILD)

.PHONY: clean
clean:
	rm -r $(BUILD)/*

.PHONY: upload
upload: $(BUILD)/firmware.hex
	$(AVRDUDE) -p m328p -c $(PROG) -V -U flash:w:$(BUILD)/firmware.hex
