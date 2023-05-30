+++
title = "Liquid Crystal fork example using IO Abstraction library - examples"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "display-driver", "switches" ]
type = "blog"
date = "2017-11-30"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/davetcc/IoAbstraction/"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
weight = 3
aliases = ["/products/arduino-downloads/io-abstraction/io-abstraction-liquidcrystal-examples/"]
+++


Recently, I have made a fork of Arduino LiquidCrystal (HD44780 display driver library) that allows the library to work with 
the IO abstraction library, meaning you can configure a display to use Arduino pins, an i2c 8574 IO expander or shift 
registers by simply changing one line of code in your sketch.

There are two additional examples provided with this version that show how to use the fork 
with both a shift register and an 8574 i2c IO expander. If the library is configured without an abstraction
being provided, it defaults to Arduino pins, just like it used to do.

Download link: [LiquidCrystalIO library on github](https://github.com/davetcc/LiquidCrystalIO)

{{< blockClear "left" >}}

Usage is exactly the same as the standard version of the library with a minor caveat.
You must call the liquid crystal begin method from within the setup() method, which is not
mandatory in the regular version, but must be done in this version. Other than this very minor
detail, the library should work without any other changes.

This library also uses TaskManger, making it completely compatible with the TaskManager framework, it
ensures that any significant waits for the display hardware are done through task manager, to avoid
potentially 100s of micros of latency. It does however mean that you should do all rendering in a single
repeating task when using with task manager.

Another advantage of this library is that it can be programmed to work with any i2c pinout be it PCF8574 or MCP23017.

## Wiring a display using a PCF8574 i2c expander:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/7seg/LCD16x2-wire-8574-circuit.png" alt="Circuit example for wiring display via 8574 " title="Schematic for connecting parallel display via PCF8574" >}}

## Wiring a display using a shift register:

As per the diagram above, but use a shift register instead of the i2c device. 

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})