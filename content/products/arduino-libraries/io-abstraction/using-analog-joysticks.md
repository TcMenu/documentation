+++
title = "Working with Analog joysticks in IoAbstraction"
description = ""
tags = [ "arduino", "mbed", "library", "analog-io" ]
date = "2021-05-21"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/davetcc/IoAbstraction/"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/ioAbstraction/analog-joystick.jpg"
toc_needed = true
type ="blog"
weight = 0
+++

IoAbstraction fully supports analog joysticks, and it does so in many modes, you can use them in three ways:

1. You can get the values of the joystick using an `AnalogDevice` directly. This is the simplest case and you would read the present floating point value as needed.
2. You can treat an axis of the joystick as a rotary encoder, and either use it to track a range of values, or in direction only mode.
3. You can treat an axis of the joystick as two buttons, one for each direction.

## Using an analog joystick to emulate an encoder

You can create a rotary encoder that either tracks a range of values, or presents direction (-1 or 1).

    setupAnalogJoystickEncoder(internalAnalogIo(), analogPin, [](int value) {
        // value change handling here.
    });

For all joysticks analog and digital, the scroll direction is often different to the direction for setting values. IE when you are scrolling through menu items and choices, the offset usually increases as you move downward, but this is not the way most people are used to editing values, where they would expect up to increase the value. All encoders support this property, but only joystick based encoders change direction. Further, you can also choose to make the intention direction only (-1 down, 1 up).

    setUserIntention(EncoderUserIntention intention);

Where intention is one of: `CHANGE_VALUE`, `SCROLL_THROUGH_ITEMS`, `DIRECTION_ONLY`

## Using an analog joystick as two buttons

You can create two buttons from an analog joystick, this is useful for handling back and next on a menu with up and down dealing with the encoder for example.

    float centreReading = 0.5F;
    ioAbstraction =  joystickTwoButtonExpander(internalAnalogIo(), analogPin, centreReading) {
    
    // you can now use the ioAbstraction as you would any other you can create a multiIO containg
    // both device pins and the joystick buttons, pass the multiIO to switches
