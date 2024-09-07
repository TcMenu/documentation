+++
title = "MCP23017 I2C IoExpander for Arduino and mbed"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "switches" ]
type = "blog"
date = "2023-05-20"
author =  "dave"
menu = "ioa-devices"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/power/input-library-8574.jpg"
weight = 3
+++

IO Abstraction library fully supports the MCP23017 16-bit IO expander chips on Arduino and mbed. It requires only two pins (three for interrupt mode) SDA, SCL, and optionally INT. Our driver provides nearly all functionality using similar terminology to Arduino itself.

The MCP23017 provides 16 additional input or output ports, they have very similar capabilities to device pins and interrupt support is managed per pin. This device can be used for switches, rotary encoders, and with LiquidCrystalIO.

{{< blockClear "left" >}}

As above, the i2c communication bus is used to read and write values. You will need to know the address of the device, [use this i2c address scanner](https://playground.arduino.cc/Main/I2cScanner) if unsure. IO capabilities are almost identical to that of the Arduino, there are few limitations. However, I recommend if you are doing heavy writing and heavy interrupt based reading, then try to keep each on separate ports if possible.

* The device has 16 IO pins, and is therefore represented as two ports A and B. Pins are 0 thru 15.
* Port A is on pins 0-7, B is on pins 8-15.
* Inputs can be of type INPUT or INPUT_PULLUP.
* Interrupts are configurable per pin, with either single (whole chip) or per port to the Arduino interrupt pin(s).
* Interupts support CHANGE, RISING, FALLING modes.
* Ensure that you tie the /RESET pin to Vcc, or it is otherwise on a pin set HIGH by your sketch. Otherwise, severe instability will result.

## Creating an instance

    // create an IO device that has no interrupts
    MCP23017IoAbstraction io23017(address, optionalWirePtr);

    // create an IO device that has an interrupt per 8-bit port 
    MCP23017IoAbstraction io23017(address, interruptMode, interruptPinA, interruptPinB, optionalWireImpl);

    // create an IO device that has a single interrupt for both ports
    MCP23017IoAbstraction io23017(address, interruptMode, interruptPin, optionalWirePtr);

See the {{< refdocs title="reference docs for parameter details" src="/ioabstraction/html/class_m_c_p23017_io_abstraction.html" >}} 

Once you have created an instance, [simply use it like any other IoAbstraction]({{< relref "ioabstraction-pins-io-expanders-shiftreg.md" >}}) they all work the same way.

There are packaged samples for both LiquidCrystalIO and IoAbstraction that show how to use this device.

### Interrupt modes for the device

* NOT_ENABLED - interrupts are not enabled, in this case you could use the simpler single argument version.
* ACTIVE_LOW_OPEN - it is easiest, and the library will enable pull up resistors. More than one device can share this pin.
* ACTIVE_HIGH_OPEN - not really useful.
* ACTIVE_HIGH - interrupt line will go high when there is an interrupt.
* ACTIVE_LOW - interrupt line will go low when there is an interrupt