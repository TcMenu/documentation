---
title: "IO Abstraction library"
description: "IO Abstraction library"
date: "2017-10-10"
author:  "system"
showChildren: false
type: "menu_list"
githublink: "https://github.com/TcMenu/IoAbstraction"
referenceDocs: "/ioabstraction/html/index.html"
banner: "/products/arduino-libraries/images/electronics/arduino/power/input-library-8574.jpg"
---

This library provides abstractions that help you write event-driven Arduino and mbed applications. It has device abstractions that allow you to treat device pins, PCF8574, MCP23017, MPR121 and AW9523 almost the same in code. This includes higher level interrupt management, buttons with de-bouncing, matrix keyboards, rotary encoders and even [LiquidCrystalIO](${relRef("liquidcrystal-io.md")} ). There are many examples packaged with the library that cover most use cases.

For development, you can use any Arduino or mbed IDE. However, our recommendation is [platformIO](https://platformio.org/) with Clion or VS Code. We test the library with Arduino and PlatformIO.

Need help with a commercial design, or want a customised version for your hardware, see the consultancy link at the top of the page?

## Reference guide and code repo

* [Read the reference guide](${refdocs("/ioabstraction/html/index.html")})
* [Go to the code repo on github](https://github.com/TcMenu/IoAbstraction)
* [Collections - BtreeList](${relRef("simple-collection-btree.md")})

## Digital IO for Arduino and mbed

* [Arduino & mbed digital IO on Pins, IO Expanders and shift registers](${relRef("ioabstraction-pins-io-expanders-shiftreg.md")})
* [PCF8574 I2C Io Expander](${relRef("pcf8574-i2c-io-expander-arduino-mbed.md")})
* [MCP23017 I2C IoExpander](${relRef("mcp23017-i2c-io-expander-arduino-mbed.md")})
* [AW9523 I2C IoExpander with LED Control](${relRef("aw9523-i2c-io-expander-arduino-mbed.md")})
* [MPR121 I2C IoExpander with Touch and LED control](${relRef("mpr121-i2c-io-expander-arduino-mbed.md")})
* [Using MultiIo - more than one IO on the same abstraction](${relRef("arduino-pins-and-io-expanders-same-time.md")})
* [Abstracted I2C/Wire on Arduino and mbed](${relRef("i2c-wire-calls-over-arduino-mbed.md")})

## Analog IO for Arduino and mbed

* [Using the analog abstraction for ADC/PWM/DACs](${relRef("using-ioabstraction-analog-core.md")})
* [Raising events on Analog input](${relRef("using-analog-events.md")})
* [Ioa Extras - extra Analog devices](${relRef("ioa-extras")})

## Switches, keyboards and rotary encoders 

* [Using switches and rotary encoders for debounced input](${relRef("switches-rotary-encoder-documentation.md")})
* [Using the keyboard manager for matrix style keyboards and keypads](${relRef("matrix-keyboard-keypad-manager.md")})
* [Touch screen interfaces for Arduino and mbed](${relRef("touch-screen-support.md")})
* [Analog Joysticks for Arduino and mbed](${relRef("using-analog-joysticks.md")})
* [Tutorial: Using switches for event based button presses](${relRef("arduino-switches-handled-as-events.md")})
* [Example: Rotary encoder and buttons on PCF8574 with interrupt](${relRef("rotary-encoder-switches-interrupt-PCF8574.md")})

## EEPROM abstractions

* [Seamless EEPROM implementations, AVR, Arduino, I2C](${relRef("eeprom-impl-seamless-8-and-32-bit.md")})

## Logging, text utilities and unit testing helper classes

* [Arduino logging with IoAbstraction](${relRef("arduino-logging-with-io-logging.md")})
* [Text Utilities and helpers](${relRef("text-utilities-and-helpers.md")})
* [Troubleshooting, IoAbstraction mock implementations](${relRef("ioabstraction-troubleshooting-unit-testing.md")})
