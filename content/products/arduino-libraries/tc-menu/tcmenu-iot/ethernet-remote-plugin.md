+++
title = "Ethernet2, UipEthernet, Stm32Ethernet remote plug-in for tcMenu library"
description = ""
tags = [ "arduino", "sockets", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2019-07-11"
author =  "dave"
menu = "tcmenu-iot"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/ethernet-shield-board.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/ethernet-shield-board.jpg"
githublink = "https://github.com/davetcc/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 50
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-plugins/ethernet-remote-plugin/"]
+++

In this guide we show how to setup and use the ethernet plugin for Ethernet2, UipEthernet, Stm32Ethernet libraries. This plug-in works with Ethernet shields and many ethernet modules available for Arduino. For a general overview on remotely controlling and monitoring see [controlling embedded apps with embedCONTROL](https://www.thecoderscorner.com/products/apps/embed-control/). 

**IMPORTANT:** It is your responsibility to configure and initialise the Ethernet adapter before calling `setupMenu` in the general application setup. See the section further down on sketch requirements.

## Supported libraries

Once the plugin is selected, you can choose the library that supports your ethernet device, these are the choices along with any libraries that are needed alongside that option.

* Using an Arduino shield or WIZ5xxx based module: Use the inbuilt Arduino Ethernet library (Ethernet2 library)
* Using an ENC28J60 module: Use the [UipEthernet library](https://github.com/UIPEthernet/UIPEthernet) or the version from library manager- see below license warning
* Using an STM32 device that includes on chip ethernet support via [Stm32Ethernet library](https://github.com/stm32duino/STM32Ethernet)

## Warning about UipEthernet ENC28J60 library license.

As I suggest tcMenu for commercial projects, I have to include this warning.

This only applies to the UipEthernet library for ENC28J60 modules (NOT the Arduino provided Ethernet2 library which is LGPL and has more flexible licensing). 

UipEthernet library is GPL code and tcMenu purposely does not link with it directly. If you choose to cause the menu designer to generate code that links with UipEthernet instead of Ethernet2 you are essentially making your code GPL. If your project is for personal or completely private use it's probably not a problem, however think carefully before using in a public commercial product.
       
## Configuring the Ethernet2 or UipEthernet library

Ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, to the right of the current remote type will be a button named "Change". Select the ethernet control option:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/ethernet-remote-choice-generator.png" title="Serial remote choice in designer UI" alt="Serial remote choice in designer UI" >}}

### Number of connections

You can define the number of connections that can be allowed at once, each connection uses a small amount of RAM and one of the 6 remote connection slots.

### Listen Port parameters

This defines the port on which to listen for connections, by default it is set to 3333 for the first connection, 3334 and 3335 for the second and third.

## Requirements in your sketch

It is your responsibility to fully initialise the network stack before calling `setupMenu`. You must either choose DHCP configuration where an IP address will be automatically assigned, or you must configure one manually.

There are several Ethernet examples packaged with tcMenu. Take a look at either the Nokia5110 or TakeOverDisplay example. 

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 
