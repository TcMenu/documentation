+++
title = "AW9523 I2C IoExpander with LED controller - Arduino and mbed"
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

IO Abstraction library fully supports the AW9523 16-bit IO expander chips on Arduino and mbed. It requires only two pins (three for interrupt mode) SDA, SCL, and optionally INT. Our driver integrates the GPIO, LED controller, and interrupt support providing nearly all functions using familiar Arduino terminology.

This device can even be used in conjunction with an {{< refdocs title="AW9523 analog device" src="/ioabstraction/html/class_a_w9523_analog_abstraction.html" >}} to make it even easier to use the LED controller.

{{< blockClear "left" >}}

The AW9523 is a pretty complete device, and has most capabilities of Arduino pins, however there are several notes:

* Interrupt support, you can enable interrupt handling on any input pin and connect the interrupt pin to the Arduino device
* It does not support INPUT_PULLUP, if you need pulled up input you need to add a manual restistor
* LED controller, this device has an additional `AnalogDevice` abstraction that you can use, any pin can be turned into a current source.

## Create an instance

To use globally define a variable as follows:

    AW9523IoAbstraction ioDevice(0x58, IO_PIN_NOT_DEFINED);

Optionally you can create an `AnalogDevice` to access the LED controller features:

    AW9523AnalogAbstraction ledController(ioDevice);

This will allow you to treat the extra LED controller features available as an analog device. [See the analog device help]({{< relref "using-ioabstraction-analog-core.md" >}}). Also see the AW9523 example packaged with the library, or the {{< refdocs title="AW9523 I2C device reference docs" src="/ioabstraction/html/class_a_w9523_io_abstraction.html" >}}.

Once you have created an instance, [simply use it like any other IoAbstraction]({{< relref "ioabstraction-pins-io-expanders-shiftreg.md" >}}) they all work the same way.

To find your i2c device address [use this i2c address scanner](https://playground.arduino.cc/Main/I2cScanner), this sketch will tell you every address on which it finds an i2c chip.

## Additional notes for LED controller mode

If you want to use the LED control function of the device, there is an additional output type, it is `LED_CURRENT_OUTPUT`. You can enable the LED mode two ways.

1. on the device abstraction call `ioAW9523.pinMode(pin, LED_CURRENT_OUTPUT);`
2. create the analog abstraction as per the example, and initialise the pin as PWM `analogAw9523.initPin(pin, DIR_PWM);`

See the reference docs linked above or example for more information.

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
