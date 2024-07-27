---
title: "IO Abstraction library"
description: "IO Abstraction library"
date: "2017-10-10"
author:  "system"
showChildren: false
type: "category"
githublink: "https://github.com/TcMenu/IoAbstraction"
referenceDocs: "/ref-docs/ioabstraction/html/index.html"
banner: "/products/arduino-libraries/images/electronics/arduino/power/input-library-8574.jpg"
aliases: 
    - "/products/arduino-downloads/io-abstraction/"
    - "/products/arduino-downloads/io-abstraction/basicIoAbstraction-library-documentation/"
    - "/products/arduino-libraries/io-abstraction/basicIoAbstraction-library-documentation/"
menu:
    main:
        name: 'IO Abstraction library'
        parent: 'arduino-libraries'
        identifier: 'io-abstraction'
        weight: 2

---

This library provides abstractions that help you write event-driven Arduino and mbed applications. It has device abstractions that allow you to treat device pins, PCF8574, MCP23017, MPR121 and AW9523 almost the same in code. This includes higher level interrupt management, buttons with de-bouncing, matrix keyboards, rotary encoders and even [LiquidCrystalIO]({{< relref "liquidcrystal-io.md" >}} ). There are many examples packaged with the library that cover most use cases.

For development, you can use any Arduino or mbed IDE. However, our recommendation is [platformIO](https://platformio.org/) with Clion or VS Code. We test the library with Arduino and PlatformIO.

Need help with a commercial design, or want a customised version for your hardware, see the consultancy link at the top of the page?

## Reference guide and code repo

* [Read the reference guide](/ref-docs/ioabstraction/html/index.html)
* [Go to the code repo on github](https://github.com/TcMenu/IoAbstraction)
* [Collections - BtreeList]({{< relref "simple-collection-btree.md" >}})
* {{< library-overview >}}

## Digital IO for Arduino and mbed

* [Arduino & mbed digital IO on Pins, IO Expanders and shift registers]({{< relref "ioabstraction-pins-io-expanders-shiftreg.md">}})
* [PCF8574 I2C Io Expander]({{< relref "pcf8574-i2c-io-expander-arduino-mbed.md">}})
* [MCP23017 I2C IoExpander]({{< relref "mcp23017-i2c-io-expander-arduino-mbed.md" >}})
* [AW9523 I2C IoExpander with LED Control]({{< relref "aw9523-i2c-io-expander-arduino-mbed.md" >}})
* [MPR121 I2C IoExpander with Touch and LED control]({{< relref "mpr121-i2c-io-expander-arduino-mbed.md" >}})
* [Using MultiIo - more than one IO on the same abstraction]({{< relref "arduino-pins-and-io-expanders-same-time.md">}})
* [Abstracted I2C/Wire on Arduino and mbed]({{< relref "i2c-wire-calls-over-arduino-mbed.md" >}})

## Analog IO for Arduino and mbed

* [Using the analog abstraction for ADC/PWM/DACs]({{< relref "using-ioabstraction-analog-core.md" >}})
* [Raising events on Analog input]({{< relref "using-analog-events.md" >}})
* [Ioa Extras - extra Analog devices]({{< relref "ioa-extras.md" >}})

## Switches, keyboards and rotary encoders 

* [Using switches and rotary encoders for debounced input]({{< relref "switches-rotary-encoder-documentation.md">}})
* [Using the keyboard manager for matrix style keyboards and keypads]({{< relref "matrix-keyboard-keypad-manager.md" >}})
* [Touch screen interfaces for Arduino and mbed]({{< relref "touch-screen-support.md" >}})
* [Analog Joysticks for Arduino and mbed]({{< relref "using-analog-joysticks.md" >}})
* [Tutorial: Using switches for event based button presses]({{< relref "arduino-switches-handled-as-events.md">}})
* [Example: Rotary encoder and buttons on PCF8574 with interrupt]({{< relref "rotary-encoder-switches-interrupt-PCF8574.md">}})

## EEPROM abstractions

* [Seamless EEPROM implementations, AVR, Arduino, I2C]({{< relref "eeprom-impl-seamless-8-and-32-bit.md">}})

## Logging, text utilities and unit testing

* [Arduino logging with IoAbstraction]({{< relref "arduino-logging-with-io-logging.md">}})
* [Text Utilities and helpers]({{< relref "text-utilities-and-helpers.md" >}})
* [Troubleshooting, IoAbstraction mock implementations]({{< relref "ioabstraction-troubleshooting-unit-testing.md">}})
* [Simple Test - simple no frills unit test framework for Arduino and mbed]({{< relref "simple-test-unit-test-arduino-mbed.md">}})
