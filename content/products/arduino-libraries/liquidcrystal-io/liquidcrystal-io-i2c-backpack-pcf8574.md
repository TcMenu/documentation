+++
title = "LiquidCystalIO with PCF8574 i2c backpack"
description = ""
tags = [ "arduino", "library", "display-driver" ]
date = "2020-08-03"
author =  "dave"
menu = "liquidcrystal-io"
githublink = "https://github.com/TcMenu/LiquidCrystalIO"
referenceDocs = "/ref-docs/liquidcrystalio/html/index.html"
banner = "/images/electronics/arduino/liquidcrystalio/lcd-board.jpg"
titleimg = "/images/electronics/arduino/liquidcrystalio/lcd-board.jpg"
toc_needed = true 
type ="blog"
weight = 2
+++

An I2C LCD backpack based on the PCF8574 chip provides an easy way to get started with LiquidCrystalIO on most Arduino boards. It is usually in one of two configurations as listed below. This library works correctly with the display and even has a shorthand way of creating the LCD for this case.

{{< blockClear "left" >}}

## Connectivity combinations for i2c backpacks

| Pin | Option1   | Option2   |
| --- | --------- | --------- |
| 0   | RS        | EN        |
| 1   | RW        | RW        |
| 2   | EN        | RS        |
| 3   | Backlight | Backlight |
| 4   | D4        | D4        |
| 5   | D5        | D5        |
| 6   | D6        | D6        |
| 7   | D7        | D7        |

Construction for Option 1 outside of any functions (global):

    LiquidCrystalI2C_RS_EN(lcdVariableName, addr, invertBacklight)

Construction for Option 2 outside of any functions (global):

    LiquidCrystalI2C_EN_RS(lcdVariableName, addr, invertBacklight)
    
Where 

* lcdVariableName is the name of the global variable to create
* addr is the I2C address of the backpack
* invertBacklight to invert the backlight function. Note that the backlight function can sometimes be inverted.

## Examples of connecting to PCF8574 i2c backpack 

* [Simple example showing i2c backpack use](https://github.com/TcMenu/LiquidCrystalIO/blob/main/examples/HelloI2c/HelloI2c.ino)

[Back to the main page]({{< relref "liquidcrystal-io.md">}})
