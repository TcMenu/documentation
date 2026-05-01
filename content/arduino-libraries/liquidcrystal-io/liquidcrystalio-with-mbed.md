+++
title = "LiquidCystalIO with PicoSDK/mbed/NativeCpp over i2c or pins"
description = ""
tags = "arduino, library, display-driver"
date = "2020-08-02"
author =  "dave"
githublink = "https://github.com/TcMenu/LiquidCrystalIO"
referenceDocs = "/liquidcrystalio/html/index.html"
banner = "/images/electronics/arduino/liquidcrystalio/lcd-board.jpg"
titleimg = "/images/electronics/arduino/liquidcrystalio/lcd-board.jpg"
toc_needed = true 
type ="blog"
weight = 4
+++

LiquidCrystalIO is now also compatible with PicoSDK and mbed boards. It supports regular mbed pins, I2C backpacks based on PCF8574 and MCP23017 based connections. You can adapt any of the Arduino examples for mbed very easily, as the API is 99% the same.

The most recent examples for this are in our native C++ CMake project in https://github.com/TcMenu/tcLibraryDev

[Back to the main page](${relRef("liquidcrystal-io.md")})