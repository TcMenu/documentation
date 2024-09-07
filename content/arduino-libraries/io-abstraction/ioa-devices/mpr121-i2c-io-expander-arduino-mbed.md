+++
title = "MPR121 I2C Touch/IoExpander/LED controller - Arduino and mbed"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "switches" ]
type = "blog"
date = "2023-05-20"
author =  "dave"
menu = "ioa-devices"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
weight = 3
+++

IO Abstraction library fully supports the MPR121 12-bit Touch control and IO expander chips on Arduino and mbed. It requires only two pins (three for interrupt mode) SDA, SCL, and optionally INT. Our driver integrates the Touch, GPIO, LED controller, and interrupt support providing nearly all functions using familiar Arduino terminology.

This device can even be used in conjunction with an [MPR121 analog device](https://www.thecoderscorner.com/ref-docs/ioabstraction/html/class_m_p_r121_analog_abstraction.html) to make it even easier to use the LED controller.

{{< blockClear "left" >}}

The MPR121 is a pretty complete device, and has most capabilities of Arduino pins, however there are several notes:

* Interrupt support, you can enable interrupt handling but it affects all pins at once.
* This device support three modes of input. Touch controller (see example), digital input, and digital input with pull up.
* The first 4 pins are touch control only, the later 8 are GPIO. These are mapped sequentially from 0..11.
* LED controller mode, it has a 15 step led controller, you can create an analog device that normalizes this to range 0..255 or as a float between 0 and 1.
* Using touch is enabled from pin 0 to a given pin number, and if you enable more than 4 touch pins, we turn off the GPIO functions. 
* You can also get the raw touch values from the analog device by reading them, again between 0 and 255 or as a float.

See the example for more on how to use this device, it is more complex to set up than most other devices and better explained in the example.

Once you have created an instance, [simply use it like any other IoAbstraction]({{< relref "ioabstraction-pins-io-expanders-shiftreg.md" >}}) they all work the same way.

To find your i2c device address [use this i2c address scanner](https://playground.arduino.cc/Main/I2cScanner), this sketch will tell you every address on which it finds an i2c chip.

## Additional notes for LED controller mode

If you want to use the LED control function of the device, there is an additional output type, it is `LED_CURRENT_OUTPUT`. You can enable the LED mode two ways.

1. on the device abstraction call `ioAW9523.pinMode(pin, LED_CURRENT_OUTPUT);`
2. create the analog abstraction as per the example, and initialise the pin as PWM `analogAw9523.initPin(pin, DIR_PWM);`

See the reference docs linked above or example for more information.

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
