PROG ?= usbasp
AVRDUDE ?= avrdude

CFLAGS = -std=c99 -Os -Wall -mcall-prologues -mmcu=atmega328p
LDFLAGS = -Wl,-gc-sections -Wl,-relax

BUILD = build

SOURCES = $(wildcard *.c) $(wildcard **/*.c)
HEADERS = $(wildcard *.h) $(wildcard **/*.h)
OBJECTS = $(patsubst %.c, $(BUILD)/%.o, $(SOURCES))

BUILD_DIRS = $(sort $(dir $(OBJECTS)))

$(BUILD)/firmware.hex: $(BUILD)/firmware
	avr-objcopy -O ihex -R .eeprom $^ $@

$(BUILD)/firmware: $(OBJECTS)
	avr-gcc $(CFLAGS) $(LDFLAGS) -o $@ $^

$(BUILD)/%.o: %.c $(HEADERS) | $(BUILD_DIRS)
	avr-gcc -c $(CFLAGS) -o $@ $<

$(BUILD_DIRS):
	mkdir -p $@

.PHONY: clean
clean:
	rm -r $(BUILD)/*

.PHONY: upload
upload: $(BUILD)/firmware.hex
	$(AVRDUDE) -p m328p -c $(PROG) -V -U flash:w:$(BUILD)/firmware.hex

.PHONY: fuses
fuses:
	$(AVRDUDE) -p m328p -c $(PROG) -U lfuse:w:0xD7:m -U hfuse:w:0xD9:m -U efuse:w:0xFF:m
