+++
title = "Rotary encoder with non-polling (interrupt based) switches from PCF8574"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "switches" ]
type = "blog"
date = "2018-08-24"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
titleimg = "/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-title.jpg"
weight = 2
+++

IoAbstraction has full support for interrupts on most devices, meaning we can connect a Rotary Encoder 
to an Arduino using a standard PCF8574 IO expander chip. In order to do this we need the PCF8574 /INT line to 
be connected to an Arduino pin that supports interrupts (such as pins 2 or 3).

Further, you can also have `switches` handle push button input without polling, by initialising for interrupt, especially
useful with IO exapnders.

{{< blockClear "left" >}}

Ensure you've [obtained the IoAbstraction library](https://github.com/TcMenu/IoAbstraction), then this example is packaged
as an example named `interruptSwitchEncoder8574`. We'll examine some parts of the sketch here, but the full sketch
is included with the library. Also, below is the circuit needed for this example:


{{< figure src="/images/electronics/arduino/power/ioabstraction-switches-interrupt-8574.png" title="Breadboard example of rotary encoder to PCF8574" alt="breadboard example circuit for PCF8574 based rotary encoder" >}}

First in order to use the PCF8574 abstractions, we must include the library (and the Wire extensions):

    #include<IoAbstraction.h>
    #include<IoAbstractionWire.h>
    
Before using any i2c devices, we must call `begin` on `Wire` during `setup`:

    Wire.begin();

Then we must initialise the switches part of the library that controls rotary encoders and buttons.
First we must tell it where the rotary encoder and buttons reside, in this case they are wired to a 
PCF8574 device, so we call `ioFrom8574` with the address of the device, and the interrupt pin where the
devices /INT pin is connected. The second parameter defines if we are polling, or interrupt driven, lastly
we define pull up or down logic for the switches. With PCF8574 it must be PULL_UP logic.

    switches.init(ioFrom8754(0x20, 2), SWITCHES_NO_POLLING, true);

Then for each switch we define a function that will be called back when the switch is pressed, if you
prefer you can use the same function more than once, the callback tells you which button was pressed.
Here is an example:

    void onRepeatButtonClicked(uint8_t pin, bool heldDown) {
      Serial.print("Repeat button ");
      Serial.println(heldDown ? "Held" : "Pressed");
    }

And once the callback functions are declared, in `setup` we add the buttons to switches. Here are examples:

    switches.addSwitch(spinwheelClickPin, onSpinwheelClicked);
    switches.addSwitch(repeatButtonPin, onRepeatButtonClicked, 25); // this one has repeat function.
    
Once this is done, we set up the rotary encoder by providing a call back for when there is a change and initialising
it with suitable values:

    void onEncoderChange(int newValue) {
      Serial.print("Encoder change ");
      Serial.println(newValue);
    }

    setupRotaryEncoderWithInterrupt(pinA, pinB, onEncoderChange);
    switches.changeEncoderPrecision(maximumEncoderValue, 100);
    
As with taskManager, switches needs the following in the loop method. Instead of doing things with delays, call task
managers schedule functions.

    void loop() {
      taskManager.runLoop();  
    } 

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})    