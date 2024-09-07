+++
title = "ESP8266 / ESP32 WiFi remote plug-in for tcMenu library"
description = ""
tags = [ "arduino", "sockets", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2019-07-11"
author =  "dave"
menu = "tcmenu-iot"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/heltek-wifi-8-esp8266.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/heltek-wifi-8-esp8266.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 50
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-plugins/esp-wifi-remote-plugin/"]
+++

In this guide we show how to setup and use the ESP8266 / ESP32 Wifi remote plugin for use in the menu library. This plug-in works with most ESP boards. ESP WiFi is quite easy to set up as it's built into the device. However, when using any ESP board and ESP8266 especially you must make sure that you frequently yield control to the runtime. If you are using task manager exclusively this should not be an issue.

For a general overview on remotely controlling and monitoring see [controlling embedded apps with embedCONTROL](https://www.thecoderscorner.com/products/apps/embed-control/).

**IMPORTANT**: It is your responsibility to configure and initialise the WiFi adapter before calling `setupMenu` in the general application setup. See the section further down on sketch requirements.
       
## Configuring ESP8266 or ESP32 WiFi

First, ensure that you've chosen the right "Embedded Platform" type which should be either `ESP32` or `ESP8266` to match your board, then ensure your menu structure is saved and lastly choose Code -> Generate Code from the menu. Once the code generation dialog appears, to the right of the current remote type will be a button named "Change". Click this button choose the appropriate ESP plugin for your board. For example:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/esp8266-remote-choice-generator.png" title="Serial remote choice in designer UI" alt="Serial remote choice in designer UI" >}}

### Number of connections

You can define the number of connections that can be allowed at once, each connection uses a small amount of RAM and one of the 6 remote connection slots.

### Listen Port parameters

This defines the port on which to listen for connections, by default it is set to 3333 for the first connection, 3334 and 3335 for the second and third. 

### Connection buffering parameter

You can enable or disable connection buffering on ESP connection. This uses a bit more RAM but may be slightly faster depending on your use case.

## Requirements in your sketch

It is your responsibility to fully initialise the network stack before calling `setupMenu` either in Access Point or Station mode. You must either choose DHCP configuration where an IP address will be automatically assigned, or you must configure one manually.

The absolute minimum that you'll need to do to start the WiFi is call the following before setup:

        WiFi.begin(ssid, password);
        WiFi.mode(WIFI_STA);

Take a look at the example esp8266WifiOled packaged with tcMenu, which works for both ESP32 and ESP8266.

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 
