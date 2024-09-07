+++
title = "Serial remote plug-in for tcMenu library"
description = ""
tags = [ "arduino", "serial", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2019-07-11"
author =  "dave"
menu = "tcmenu-iot"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/serial-connection.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/serial-connection.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-plugins/serial-remote-plugin/"]
+++

In this guide we show how to setup and use the serial communication remote plugin for tcMenu. It is a general purpose Serial plugin that has been tested with both USBSerial and Bluetooth on a number of different devices.

Serial is probably about the easiest remote to set up in terms of hardware and software. Nearly all Arduino boards have a built in USB Serial adapter. On many Arduino boards there are additional Serial interfaces, usually named Serial1 and Serial2. Check your board for compatibility.

If you would like to use bluetooth instead, then you'll need to have an extra Serial port on your board. Connecting serial devices is simple, just wire up the Rx and Tx connectors as recommended for your board. Note: If you are connecting a 3.3V Bluetooth module to a 5V board, don't forget level shifters!
       
## Configuring Serial connectivity

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, to the right of the current remote type will be a button named "Change". Click this button and choose:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/serial-remote-choice-generator.png" title="Serial remote choice in designer UI" alt="Serial remote choice in designer UI" >}}

### SERIAL_PORT parameter

The only parameter for serial is the name of the port to be used, if you are using the default USB Serial port it will nearly always be `Serial`. Otherwise choose the serial port instance for the hardware that you have.

## Requirements in your sketch

You must call begin on your serial port setting the desired speed before the `setupMenu` call. There are no other requirements of this plugin.

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 
