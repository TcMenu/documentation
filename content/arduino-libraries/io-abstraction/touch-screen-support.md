+++
title = "Touch screen support that works on all Arduino and mbed boards"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "eventing", "switches" ]
date = "2021-05-15"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/ioAbstraction/resistive-touch.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/ioAbstraction/resistive-touch.jpg"
toc_needed = true
type ="blog"
weight = 0
+++

IoAbstraction includes support for touch screens. The support is built in layers to allow for different drivers to be added over time. However, at the moment there is support for resistive touch screens on analog pins. This library can work with such touch screens regardless of analog input resolution, as long as the device is supported by IoAbstraction.

As with switches and rotary encoder support, this component deals with debouncing the user input and also working out if the user has selected or held, therefore supporting drag operations.

{{< blockClear "left" >}}

## Adding touch screen support to your project

In order to add touch screen support, first use your library manager to install IoAbstraction. Once this is done, you can either start with the touch screen example or just follow the instructions below.

### Add the ResistiveTouchScreen include and create an instance

    #include <ResistiveTouchScreen.h>

    using namespace iotouch;

    // This is the most basic extension of the touch screen class, it just allows
    // you to read it's present values, there is also an event driven version.
    ValueStoringResistiveTouchScreen touchScreen(XPOS_PIN, XNEG_PIN, YPOS_PIN, YNEG_PIN,
                                                 TouchOrientationSettings(xySwap, xInvert, yInvert));

Notes:

* XNEG_PIN and YPOS_PIN must be on an ADC pin
* Last parameter is one of PORTRAIT, PORTRAIT_INVERTED, LANDSCAPE, LANDSCAPE_INVERTED, RAW

### More about the orientation settings

The orientation settings let you control how the value from the touch unit should be interpreted, above we saw the following code:

    TouchOrientationSettings(xySwap, xInvert, yInvert)

This instructs the touch screen class how to process the data, if `xySwap` is set then the X and Y values will be swapped over before being sent, if `xInvert` is set then the _RAW_ X axis before swapping is inverted, and if `yInvert` is set then the _RAW_ Y axis before swapping is inverted. This gives full control over the orientation of the display and can handle nearly every situation.

### During your app setup, provide calibration data and start the touch screen 

    // If calibration is needed, then you can provide the calibration in terms of
    // screen edges here. Then we start
    touchScreen.calibrateMinMaxValues(0.15F, 0.75F, 0.06F, 0.91F);
    touchScreen.start();

### Then you can read back the settings at any time later

You can read back the values at any time, it is split into three methods, one to determine the current touch status, another to get the X and Y coordinates.

    // tell the encoder it is being used for scrolling and needs to be responsive
    void setUsedForScrolling(bool scrolling)

    // returns one of NOT_TOUCHED, TOUCHED, HELD, TOUCH_DEBOUNCE
    TouchState getTouchState()

    // return a float value between 0 and 1 to indicate screen position
    getLastX() and getLastY()

## Deal with touches in an event driven way

To do this instead of using the above `ValueStoringTouchScreenManager` you create your own class that extends from `TouchScreenManager`. See the [Touch interface reference docs](https://www.thecoderscorner.com/ref-docs/ioabstraction/html/_resistive_touch_screen_8h.html) for more information.

## Creating a new touch interrogator for new hardware

To do this you create an object that extends from TouchInterrogator, it must indicate touche status in the following method:

        virtual TouchState internalProcessTouch(
                float* ptrX, float* ptrY, TouchRotation rotation, 
                const CalibrationHandler& calib)=0;

See the [Touch interface reference docs](https://www.thecoderscorner.com/ref-docs/ioabstraction/html/_resistive_touch_screen_8h.html) for more information.

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
