+++
title = "IoAbstraction - Cross platform build support"
description = ""
tags = [ "arduino", "library", "eventing" ]
date = "2020-12-04"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/taskmgr/taskmanager-marshalling-interrupt.png"
toc_needed = true 
type ="blog"
weight = 5
+++

{{< library-overview >}}

## General Arduino

* On all devices we try to configure the device to the highest precision possible, and provide read and write methods based on float values between 0 and 1.

## Notes for mbed

* For mbed we support mbed V5 and V6 Bare-Metal and RTOS.
* Pins are managed using the underlying gpio methods. Interrupts are managed using `InterruptIn`.
* Analog input PWM output, and DAC output are all supported, DAC output is only enabled when the board has an onboard DAC. PWM and ADC are always enabled.

## Extra notes for ESP32

* On ESP32 ArduinoAnalogAbstraction uses native ESP functions for ADC, PWM and DAC. There are few Arduino library dependencies left.
* You can also choose to use direct IDF digital IO functions instead of the Arduino provided, by enabling direct IDF digital support. To do so define flag `IOA_USE_ESP32_EXTRAS` in your tool settings.
