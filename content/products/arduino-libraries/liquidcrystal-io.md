---
title: "LiquidCrystalIO Library"
description: ""
date: "2020-07-14"
author:  "system"
showChildren: true
type: "category"
githublink: "https://github.com/davetcc/LiquidCrystalIO/"
banner: "/products/arduino-libraries/images/electronics/arduino/liquidcrystalio/dfrobot-board.jpg"
menu:
    main:
        name: 'LiquidCrystalIO Library'
        identifier: 'liquidcrystal-io'
        parent: 'arduino-libraries'
        weight: 4

---

LiquidCrystalIO is a fork of the LiquidCrystal library for HD44780 devices that works on both Arduino and mbed devices, integrating with [IoAbstraction library]({{< relref "io-abstraction.md" >}}). Further, it also works either with device pins or any IO expansion device supported by IoAbstraction, including direct pins, PCF8574, PCF8575, MCP23017, MPR121, AW9523 and even shift registers. Importantly, HD44780 displays are slow, very slow in fact, running at around 270Khz. This means that there are inevitable delays involved in programming the device, in this fork those delays give some time back to task manager so that other tasks can run while waiting. The only limitation this brings is that only one task manager task must draw to the display, otherwise the code would re-enter heavily affecting the delays.

During construction there is an additional parameter; which is of type IoAbstractionRef, this represents the means of communication with the device. Out of the box it supports device pins, shift registers, and PCF8547 / MCP23017 I2C IO expanders. 

* {{< library-overview >}}


