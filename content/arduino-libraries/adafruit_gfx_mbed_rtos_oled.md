---
title: "Adafruit GFX fork providing OLED support on mbed RTOS"
description: ""
date: "2021-06-01"
author:  "system"
showChildren: true
type: "menu_list"
githublink: "https://github.com/TcMenu/Adafruit-GFX-mbed-fork"
banner: ""
---

We maintain a fork of Adafruit_GFX that provides OLED support on mbed RTOS, it's based on the original work by both [AdaFruit - Adafruit_GFX repo](https://github.com/adafruit/Adafruit-GFX-Library) and [the original SSD1306 library for mbed 2](https://os.mbed.com/users/nkhorman/code/Adafruit_GFX/).

We've got everything to compile on mbed RTOS 5 & 6, and we use it ourselves on both PicoSDK and our mbed STM32F439 test board as one of our core tests.

The repository is hosted on GitHub [https://github.com/TcMenu/Adafruit-GFX-mbed-fork] and is tested on STM32 hardware. We have tested it with both an SPI and I2C interface.

There are two examples showing how to use this library packaged with it. It is also possible to [generate an mbed 6 OLED IoT ready menu directly from TcMenu Designer](https://github.com/TcMenu/tcMenu)

