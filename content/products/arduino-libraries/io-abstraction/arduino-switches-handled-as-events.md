+++
title = "Arduino Button presses that are handled like events"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "eventing", "switches" ]
type = "blog"
date = "2018-02-09"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
weight = 3
aliases = ["/products/arduino-downloads/io-abstraction/arduino-switches-handled-as-events/"]
+++

Have you ever wanted to treat button presses in Arduino similar to other languages, where you get an event callback when the switch is pressed? Look no further, the IO abstraction library can do that with very little fuss. In fact it can also do the same for rotary encoders as well, treating them similar to how scroll bars work in desktop applications.

To start we need to get the [IoAbstraction library](https://github.com/TcMenu/IoAbstraction) and open the `buttonRotartyEncoder` example. This example shows how to use a rotary encoder and two switches (the encoder push button and any other switch) with the switches class, outputting the buttons and rotary encoder state to the serial port.


{{< blockClear "left" >}}

## First, you'll need to build the following circuit:

{{< figure src="/images/electronics/arduino/tcMenu/wiring-rotary-encoder.png" alt="Example of wiring a rotary encoder to an Arduino" title="Wire the rotary encoder to pins, PinA needs an interrupt pin (EG: 2)">}}

{{< figure src="/images/electronics/arduino/tcMenu/wiring-pulldown-switch.png" alt="wiring a pull down switch to Arduino" title="Connect two switches as follows (usually one is the encoder push button)">}}

## A walk through of the code

This page is based on the example packaged within the ioabstraction library, called encoderSwitch. It's packaged within the examples directory, in Arduino IDE should be openable directly from the examples once the library is installed.

[Link to the example sketch file](https://github.com/TcMenu/IoAbstraction/blob/main/examples/buttonRotaryEncoder/buttonRotaryEncoder.ino)

This sketch may look slightly different when you first see it, at the top of the file are a lot of event handlers, they are called by `switches` when buttons are pressed or the encoder changes value. An example callback is shown below: 

    void onRepeatButtonClicked(uint8_t pin, bool heldDown) {
      Serial.println("Repeat button pressed");
    }

In the setup of the sketch we see that the event handling for switches is set up, and we tell
switches to use arduino pins for IO.

    switches.init(boardIo, SWITCHES_POLL_EVERYTHING, true);
    
    switches.addSwitch(somePin, aCallBackFunction);
    
    // optionally, we can add a button release handler - the callback is the same signature.
    //switches.onRelease(somePin, aCallBackFunction);
    
We then go ahead and set up the rotary encoder, setting the range of values to be between maximumEncoderValue, starting out at 100:

    void onEncoderChange(int newValue) {
        // ..
    }

    // then in the setup method.
    setupRotaryEncoderWithInterrupt(encoderAPin, encoderBPin, onEncoderChange);
    switches.changeEncoderPrecision(maximumEncoderValue, 100);

Alternatively, we can mimic the function of a rotary encoder by using Up and Down switches, these two buttons are controlled by the switches (IoAbstraction) library.

    setupUpDownButtonEncoder(buttonUpPin, buttonDownPin, onEncoderChange);
    switches.changeEncoderPrecision(maximumEncoderValue, 100);


Notice that the loop function just contains one line, as everything else is controlled by TaskManager.

    taskManager.runLoop();

For more detail, there's [complete documentation for the library]({{< relref "io-abstraction.md">}}).
In addition to this, there's also lots of other examples packaged with the library. 

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})