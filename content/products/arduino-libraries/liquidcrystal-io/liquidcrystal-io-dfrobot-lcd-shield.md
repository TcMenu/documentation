+++
title = "LiquidCystalIO with a DfRobot shield"
description = ""
tags = [ "arduino", "library", "" ]
date = "2020-08-01"
author =  "dave"
menu = "liquidcrystal-io"
githublink = "https://github.com/davetcc/LiquidCrystalIO/"
referenceDocs = "/ref-docs/liquidcrystalio/html/index.html"
banner = "/images/electronics/arduino/liquidcrystalio/dfrobot-board.jpg"
titleimg = "/images/electronics/arduino/liquidcrystalio/dfrobot-board.jpg"
toc_needed = true 
type ="blog"
weight = 0
+++

DfRobot provides the simplest way to get started with LiquidCrystalIO on Uno and Mega (and other compatible boards). It has a display with an array of switches connected to A0 (up, down, left, right and select). This library works correctly with the display and even has a shorthand way of creating the LCD for this case.

{{< blockClear "left" >}}

## Connections to an Arduino Uno, Mega

This board is for use with Arduino Uno and Mega devices, because they are compatible with the original wiring pin out spec. The pin connections are as follows:

| Pin | Function  |
| --- | --------- |
|  8  | RS        |
|  9  | EN        |
| 10  | Backlight |
| A0  | Buttons   |
|  4  | D4        |
|  5  | D5        |
|  6  | D6        |
|  7  | D7        |
| A0  | Joystick  |

When using with LiquidCrystalIO, you can use the no-argument constructor, which is specifically for DfRobot where the pins are known upfront.

## Using the backlight as PWM

As the backlight is actually on a PWM pin (at least on Uno), then you have the option of configuring the library to use PWM for the backlight instead.

During setup simply do the following:

    // DF robot back light is on pin 10, which is PWM, provide values between 0 and 255
    myLcd.configureAnalogBacklight(internalAnalogIo(), 10);
    myLcd.setBacklight(128);

This allows you to control the backlight level at any time by using the `setBacklight` method.

## dfRobot LCD shield examples

* [Simplest DfRobot shield example](https://github.com/davetcc/LiquidCrystalIO/blob/master/examples/HelloWorld/HelloWorld.ino)
* [You can also use IoAbstraction's switches to manage the dfRobot buttons](https://github.com/davetcc/IoAbstraction/blob/master/examples/dfRobotRotaryEncoder/dfRobotRotaryEncoder.ino)

[Back to the main page]({{< relref "liquidcrystal-io.md">}})