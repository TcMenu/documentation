+++
title = "LiquidCystalIO with mbed over i2c or pins"
description = ""
tags = [ "arduino", "library", "display-driver" ]
date = "2020-08-02"
author =  "dave"
menu = "liquidcrystal-io"
githublink = "https://github.com/TcMenu/LiquidCrystalIO"
referenceDocs = "/liquidcrystalio/html/index.html"
banner = "/images/electronics/arduino/liquidcrystalio/lcd-board.jpg"
titleimg = "/images/electronics/arduino/liquidcrystalio/lcd-board.jpg"
toc_needed = true 
type ="blog"
weight = 4
+++

LiquidCrystalIO is now also compatible with mbed boards. It supports regular mbed pins, I2C backpacks based on PCF8574 and MCP23017 based connections. You can adapt any of the Arduino examples for mbed very easily, as the API is 99% the same.

{{< blockClear "left" >}}

## Examples showing these use cases

* [Hello Mbed I2C PCF8574 example](https://github.com/TcMenu/LiquidCrystalIO/blob/main/examples/helloMbed/helloMbed.cpp)

[Back to the main page]({{< relref "liquidcrystal-io.md">}})