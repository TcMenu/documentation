+++
title = "SimHub connector for tcMenu library"
description = ""
tags = [ "arduino", "serial", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2020-07-06"
author =  "dave"
menu = "tcmenu-iot"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/simhub-titleimg.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/simhub-titleimg.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-plugins/simhub-connector/"]
+++

We have a remote control driver for tcMenu that can be configured to easily work with [SimHub dash](https://www.simhubdash.com/). It requires at least 1.5.0 of tcMenu, and a version of SimHub that supports [custom serial devices](https://github.com/SHWotever/SimHub/wiki/Custom-serial-devices#enabling-the-plugin). We only recommend this integration for intermediate to advanced Arduino users, it requires a greater understanding of the underlying system to set it up. 

Please note that we are not affiliated in any way with SimHub, any issues with SimHub should be reported as usual, and any issues with TcMenu integration should be reported to us.

So why would you use tcMenu SimHub connector instead of the inbuilt SimHub Arduino support? You get more control of the rendering, more input options, and it supports nearly all boards, including AVR/Uno/Mega , SAMD/MKR, ESP8266, ESP32, mbed RTOS, and soon Nano 33 sense BLE. The cost of this is slightly more complexity. **This connector is in BETA at the moment while we get everything up to scratch.**

{{< blockClear "left" >}}

## Add Simhub Connector to a menu

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, change the remote control type by clicking on "click to change", and then choose the SimHub connector from the popup:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/simhub-generator-selection.png" alt="selection of SimHub from generator list" title="Select the SimHub option in the code generator popup" >}}

Once selected, it will be shown as the new remote control configuration as follows:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/simhub-selected.png" alt="Example of simhub connector configuration" title="Example of SimHub connector configuration when selected" >}}


### Serial port parameter

This is the port on which you will communicate with SimHub. It can be any serial port available on the device, and will default to Serial. It is your responsibility to initialise the port (usually by calling begin with the right baud).

### Connection Status menu item

Optionally, you can provide a menu item that should be updated with the connection status. It should be a BooleanMenuItem and it will be updated whenever there is a change in connectivity. 

## Setting up the protocol

We configure the custom protocol within the [SimHub custom serial settings](https://github.com/SHWotever/SimHub/wiki/Custom-serial-devices), and it is essential that you read through the information provided there. To start with we'll setup at "hello" and "goodbye" message. Once that is done, we'll normally add several messages that will update various menu items when they change. This plugin is currently in early release and only supports low update speeds, there will soon be a high refresh rate version of tcMenu.

### Set up the serial port communications 

1. In your sketch file, ensure that you've started the serial device that you are using in `setup()`, Note down the baud rate to use the same baud in later steps. For example: `Serial.begin(115200);`
2. In Simhub, navigate to the custom serial configuration. If it is not visible on the left-hand side menu, then you may need to enable it first, or upgrade to a later version of Simhub.
3. Set up the communication port on which the Arduino (or mbed) device is attached, along with the baud rate. Normally, you'd configure this to be 115200 at both sides. 
4. Now we will setup the "hello" message or "message after device connect", set the text to exactly the following including the single quotes: `'simhubStart\n'`
5. Now we will setup the "bye" message or "message before device disconnect", set the text to exactly the following including the single quotes: `'simhubEnd\n'`

### Map a SimHub value to a MenuItem
 
We can map any SimHub statistic to a menu item, for each SimHub statistic that we are interested in, we need a MenuItem of the right type, and we need to know the menu item's ID. To create a mapping between SimHub and tcMenu, start by adding a new "Update message" with a refresh rate, at the moment choose no more than 10 per second (soon we'll provide higher refresh rates). Now we need to set the "Update message" formula, these all follow the same format. `'<menuId>=' + [simhubValue] + '\n'`. 

So for example if we wanted to map `GameRPM` to menu item with ID 1: `'1=' + [GameRPM] + '\n'`. Upon reception of this message tcMenu would look for the menu with ID 1, it would then try to apply the received value to the message.

### Supported menu item types

* AnalogMenuItem: Any integer or decimal value, depending on menu item set up. Always represented as a fixed point value multiplied by the divisor. EG if the divisor is 10, then there is a single decimal place, and 1.5 would be 15 (1.5 * 10).
* BooleanMenuItem: Can either be 1 true, 0 false.
* EnumMenuItem: 0 is the first choice, 1 the second etc.
* TextMenuItem: for text values
* *Coming soon* FloatMenuItem: for floating-point values

## A few words about the performance of embedded displays 

You should be aware that many displays connected to Arduino boards are not capable of extremely high refresh rates, maybe 15-25 refreshes a second will be possible with most, but even this will require considerable setup. This is not a limitation of tcMenu, it's a limitation of the display technologies typically used with Arduino devices.

For example an i2c OLED 128x64 display running on a high speed bus, may reach around 30hz refresh, but a large colour display running on an 8 bit Arduino will struggle to refresh quickly depending on which library you use. LiquidCrystal displays, although they could technically refresh more rapidly, look pretty bad when refreshing more than a few times a second. 