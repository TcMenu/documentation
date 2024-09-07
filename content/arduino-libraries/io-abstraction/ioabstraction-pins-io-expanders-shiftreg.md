+++
title = "IoAbstraction: Arduino Pins, IO Expanders, Shift Registers using same code"
description = ""
tags = [ "arduino", "library", "digital-io" ]
date = "2019-08-15"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/power/input-library-8574.jpg"
titleimg = "/images/electronics/arduino/power/input-library-8574.jpg"
toc_needed = true 
type ="blog"
weight = 0
+++

Using IoAbstraction you can write a sketch / program that uses Arduino pins, shift registers and IO expander devices at the same time, very much like you'd normally use Arduino pins. This library also provides simple interrupt handling that again is consistent across Arduino, mbed and IO expander ICs.

What do we mean by consistent, we mean that configuring a pin, adding an interrupt, reading from pins, and writing to pins is the same across Arduino, mbed, PCF8574, MCP23017, AW9523, MPR121 and shift registers. Even [analog operations are standardized too]({{< relref "using-ioabstraction-analog-core.md" >}}). For most cases, such as adding switches, encoders and checking analog levels, it is device independent.  

There are several sketches in the examples folder showing how to use most of the capabilities mentioned here. They cover Arduino pins, shift registers, IO expander devices, and [MultiIo abstraction]({{< relref "arduino-pins-and-io-expanders-same-time.md">}}) that allows many devices to be treated as a single large IO device.

You can look at {{< refdocs title="BasicIoAbstraction in the reference docs" title="/ioabstraction/html/class_basic_io_abstraction.html" >}}

There is also a [fork of the LiquidCrystal library that works with this abstraction]({{< relref "io-abstraction-liquidcrystal-examples.md">}}), and therefore can be used with pins, IO expanders or a shift register simply by changing the IoAbstraction it's using.

# Using IO Abstraction in your sketches

The IoAbstraction interface deals with pin configuration, reading, writing and processing interrupts. Each implementation has its own way of handling these functions, but to the outside user they look the same, apart from creating an instance where there are clear differences. In new code it is better to create these abstractions using global variables as described here. However, if you have an `IoAbstractionRef` simply replace the `.` in the code below with `->`.

First let's take a look at how to set the direction of a pin, here it is very similar to Arduino:

    ioDevice.pinMode(pin, INPUT);
    ioDevice.pinMode(pin, OUTPUT);
    ioDevice.pinMode(pin, INPUT_PULLUP);

To register a raw interrupt handler for a pin again similar to Arduino we use `ioDevice.attachInterrupt(..)`, see the [TaskManagerIO]({{< relref "taskmanager-io.md" >}}) section on events and interrupt handling for better strategies, where you can either marshal interrupts to task manager, or use events.

    ioDevice.attachInterrupt(pin, pinMode)

Where
    ioDevice is any IOAbstractionRef
    pin is the pin on the device to attach to
    pinMode one of CHANGE, RISING, FALLING.

### Reading from and writing to pins.

Reading and writing from pins works slightly differently with the library, this is because the IO may well be going over a serial bus. Due to this inefficiency, the serial implementations use a buffer to reduce reads and writes; but Arduino and mbed wrappers deal with pins directly without buffering. However, even when writing for Arduino or mbed, include the synchronisation code because otherwise it may not work with another IO device.

It's up to you how and when you call `sync`; but using the sync is most optimal when you first write, then sync, then read. This is demonstrated below:

    ioDevice.digitalWrite(pinWrite, newValue);
    ioDevice.sync();
    value = ioDevice.digitalRead(ioExpander, pinRead)
    
If you're only doing one operation, you can use the shorthand read and write functions with an 'S' at the end, these automatically sync the device as appropriate. However, if you're doing many operations over serial they are much less efficient.

    ioDevice.digitalWriteS(ioExpander, pinWrite, newValue);
    value = ioDevice.digitalReadS(ioExpander, pinRead)

### Reading from and writing to ports

It is also possible to read from and write to ports, 8 bits at a time. For some tasks this can be much easier than writing one bit at a time. On I2C expanders and shift registers there's no risk using ports whatsoever. However, with the Arduino pin abstraction, be careful to understand what other functions you may interfere with on that port. *At the moment mbed does not support this option.*

    void ioDevice.digitalWritePortS(uint8_t pinOnPort, uint8_t portVal);
    uint8_t ioDevice.digitalReadPortS(uint8_t pinOnPort, uint8_t portVal)

## Creating an Io Abstraction

Firstly you always need to include the main header: 

    #include <IoAbstraction.h>
    
Also, if you are using i2c IoExpander's such as the PCF8574, AW9523, MPR121 or MCP23017 also include this header:

    #include <IoAbstractionWire.h>

### To use with Arduino/mbed pins directly

The simplest IoAbstraction type of all is for pins on the processor itself, it's pretty much a pass through, that calls through to pinMode, digitalRead, digitalWrite etc.

    IoAbstactionRef arduinoPinsPtr = internalDigitalIo(); 
    auto arduinoPinsRef = internalDigitalDevice(); 

On Arduino and mbed we fully support creating IoAbstractionRefs for the inbuilt pins. 

**Extra notes for mbed:** we wrap the mbed DigitalIn, DigitalOut and InterruptIn support using our simple collection. We use the underlying `gpio_*` functions to configure, read and write, while interrupts are handled using the `InterruptIn` class. In a future version, we will expose the `gpio_t` for mbed, and make it possible to configure gpio's differently.

    IoAbstactionRef mbedPins = internalDigitalIo(); 
    auto arduinoPinsRef = internalDigitalDevice(); 

### Using with external devices

* [PCF8574 and PCF8575 I2C IoExpanders]({{< relref "pcf8574-i2c-io-expander-arduino-mbed.md" >}})
* [MCP23017 I2C IoExpanders]({{< relref "mcp23017-i2c-io-expander-arduino-mbed.md" >}})
* [AW9523 I2C IoExpanders with LED Control]({{< relref "aw9523-i2c-io-expander-arduino-mbed.md" >}})
* [MPR121 I2C Touch/GPIO/LED control]({{< relref "mpr121-i2c-io-expander-arduino-mbed.md" >}})

### Using with shift registers:

Unlike other IO devices, shift registers have a known direction upfront. The implementation handles the well-known 74HC165 for input and 74HC595 for output. You can define if an IO abstraction should handle input, output or both. For shift-registers inputs are always on pins 0..32, and outputs are always from 32 `SHIFT_REGISTER_OUTPUT_CUTOVER` upward. For more information about shift registers see [https://playground.arduino.cc/Code/ShiftRegSN74HC165N] and [https://www.arduino.cc/en/Tutorial/ShiftOut]. Interrupts cannot be supported on shift registers.

You can theoretically chain together up to 4 input shift registers and up to 4 output shift registers. However, we've only ever tested chaining two registers. Ensure you define the variable globally.

For input from 74HC165 shift register:

    ShiftRegisterIoAbstraction165In shiftRegister(
        ShiftRegConfig(clockPin, dataPin, latchPin, numDevices)
    );

For input from other types of shift register:

    ShiftRegisterIoAbstraction shiftRegister(
        ShiftRegConfig(clockPin, dataPin, latchPin, numDevices),
        ShiftRegConfig() // no write configuration
    );
     
For output only:

    ShiftRegisterIoAbstraction shiftRegister(
        ShiftRegConfig(), // no read configuration
        ShiftRegConfig(clockPin, dataPin, latchPin, numDevices)
    );

For input and output: 

    ShiftRegisterIoAbstraction shiftRegister(
        ShiftRegConfig(readClockPin, readDataPin, readLatchPin, readDevices),
        ShiftRegConfig(writeClockPin, writeDataPin, writeLatchPin, writeDevices)
    );
    

### To use more than one IO expander at the same time

To use more than one IoAbstraction at once in the same code, simply create a multi IO as below, and add as many IO expander devices as needed. `numberOfPinsForArduino` allocates `0` thru `numberOfPinsForArduino - 1` as for Arduino pins. Following this will be each expander that you add. The type is `MultiIoAbstraction` and is created as below. [See the full MultiIoAbstraction guide]({{< relref "arduino-pins-and-io-expanders-same-time.md" >}})

    MultiIoAbstraction multiIo(numberOfPinsForArduino);

If you have an abstraction variable and want to add it:

    multiIo.addIoDevice(ioDevice, numOfPinsNeeded);


If you have an IoAbstractionRef and want to add it:

    addIoExpander(ioRef, numOfPinsNeeded);

### Converting to an IoAbstractionRef

To convert any io device object into an `IoAbstractionRef` simply call `asIoRef(..)`:

    IoAbstractionRef multiIoRef = asIoRef(manuallyCreatedIo);

### Want a different IO device?

Either submit a patch on github, raise an issue on IoAbstraction, or get in touch using the contact form. 

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
