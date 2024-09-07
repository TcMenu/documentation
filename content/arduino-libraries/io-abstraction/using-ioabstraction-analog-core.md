+++
title = "IoAbstraction Analog Core documentation"
description = ""
tags = [ "arduino", "mbed", "library", "analog-io" ]
date = "2019-08-15"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/power/input-library-8574.jpg"
titleimg = "/images/electronics/arduino/power/input-library-8574.jpg"
toc_needed = true 
type ="blog"
weight = 0
+++

IoAbstraction has a simple interface to the analog capabilities of all supported boards. It provides frequently used functionality around acquiring and setting analog values from ADC, PWM and DACs. Having the ability to read and write analog values as float, where the value is between 0 and 1; where 0 is off and 1 is fully on. this capability allows you share code across different Arduino and mbed boards.
 
The base class for this abstraction is `AnalogDevice` and you can see the full documentation in the [reference guide](/ref-docs/ioabstraction/html/index.html).

{{< blockClear "left" >}}

## Using the device analog Input an Output

For all devices call `internalAnalogDevice()` to get hold of a reference to an analog device. Depending on the platform, it will one of the following:

`ArduinoAnalogDevice` is the implementation for Arduino (including ESP8266 and ESP32). You can create an instance using the parameter-less version of the constructor; which defaults to the best available resolution for that board. 

`MbedAnalogDevice` is the implementation for mbed boards, it maps to the mbed AnalogIn, PwmOut and AnalogOut object forms internally. These are created on demand using our lightweight collection. There are no construction options for the mbed variant.

## Platform specific values for various Arduino and mbed boards

By default, unless you either change the configurations in `PlatformDetermination.h` (not recommended) or use the Arduino constructor and provide different values, the settings in the table below will be used. We recommend that you use `getCurrentFloat` and `setCurrentFloat` and work with floats, unless performance dictates otherwise. 

| Processor     | Board Examples        | Read Bits | Write Bits |
|---------------|-----------------------|-----------|------------|
| AVR (default) | Uno, Mega, Mighty     |        10 |          8 |
| SAMD          | MKR, Zero, Nano IOT   |        12 |         12 |
| nrf52840      | Nano 33 BLE           |        12 |          8 |
| ESP8266       | NodeMCU, Huzzah       |        10 |         10 |
| ESP32         | Wrover, Huzzah32      |        12 |          8 |
| mbed          | All mbed boards       |   depends |    depends |
 
For most Arduino boards we map directly to the analogRead and analogWrite functions, however for ESP32 and mbed this is not possible. Below we discuss how this is implemented on those boards.
 
### For ESP32 boards - ADC, LEDC (PWM) and DAC

On ESP32, we have standardised access to PWM and DAC. For PWM we use the ledc functions, and for the DAC, we use the inbuilt DAC functions. Further, for all analog ADC functions we also now use direct IDF calls. You can get hold of the ESP32 specific component that we create to manage this, it gives you access to the ledc channel should you need it, for example if you want two pins to share the same PWM channel:

    // access the ESP32 specific output object
    EspAnalogOutputMode* mode = analogAbstraction.getEspOutputMode(pin);
    bool dacChannel = mode->isDac();
    uint16_t analogChannel = mode->getPwmChannel(); 

    EspAnalogInputMode* mode = analogAbstraction.getEspInputMode(pin);
    bool dacChannel = mode->alterPinAttenuation(esp32AttenuationValue);
    bool onDac1 = mode->isOnDAC1(); 
    uint8_t analogChannel = mode->getChannel();

### For mbed boards - ADC, PWM and DAC

On mbed we have implemented the Analog abstraction to use analog GPIO mapping classes, we create these on demand (as you call initPin) and store each pin mapping as an `AnalogPinReference`. You can get hold of the object that holds the GPIO mapping. The mappings contain a union depending on if the pin represents input, output or PWM. You MUST use the right entry in the union for the direction you have.

    // To get the analog pin mapping
    AnalogPinReference* pinRef = analogDevice.getAnalogGPIO(pin);    
    
    // To get the direction, eg DIR_IN, DIR_OUT, DIR_PWM
    AnalogDirection dir = pinRef->getDirection();

    // the pin ref object has a union that you access dependent on the direction.
    union AnalogPinReferences {
        AnalogIn* input;    // use only when direction is DIR_IN 
        AnalogOut* out;     // use only when direction is DIR_OUT
        PwmOut* pwm;        // use only when direction is DIR_PWM
    } analogRef;
    
    // to get the pin references union where you can get access to the mbed GPIO type.
    AnalogPinReferences references = pinRef->getReferences();

## How to use analog abstraction

Before using a pin you must set it to input, pwm or output, this is mandatory on some boards, so always specify direction:

    enum AnalogDirection { DIR_IN, DIR_OUT, DIR_PWM };
    void initPin(pinid_t pin, AnalogDirection direction) 

To get the maximum range in a given direction provide the direction and the pin:

    int getMaximumRange(AnalogDirection dir, uint8_t pin)

To get the bit depth instead provide the direction and the pin:

    int getBitDepth(AnalogDirection direction, uint8_t /*pin*/)

To get the current value as a floating-point between 0 and 1.0:

    float getCurrentFloat(pinid_t pin)
    
To set the current value as a floating-point between 0 and 1.0:

    void setCurrentFloat(pinid_t pin, float newValue)

To get the current raw value for a pin that's configured as input:

    unsigned int getCurrentValue(pinid_t pin)
    
To set the current raw value for a pin that's configured as output:

    void setCurrentValue(uint8_t pin, unsigned int newValue)

## Examples of usage

There is an example packaged with the library `analogExample` for Arduino; which demonstrates the use of analog abstraction for Arduino. Also for mbed, the `mbedExample` shows how to create and use the analog abstraction from mbed.     

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})    