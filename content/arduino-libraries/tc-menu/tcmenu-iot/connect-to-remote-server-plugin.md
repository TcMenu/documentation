+++
title = "Connect to a remote server plug-in for tcMenu library"
description = ""
tags = [ "arduino", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2024-10-11"
author =  "dave"
menu = "tcmenu-iot"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/serial-connection.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/serial-connection.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

In this guide we show how to setup and use the remote server communication plugin for tcMenu. This plugin allows you to reverse the normal connection direction, and have the API side be a server accepting connections from devices. You simply configure the address and port that the connector should connect with, and ensure there is an API listening at the other side.

{{< blockClear "left" >}}

## Direction of connection

For this plugin the direction of connection is reversed, and you similarly need to reverse the API connection, IE the API is listening, and the device is connecting. Here is the situation as a flow:

    API is listening  <---- connection request -------< Device opens connection
    API receives tree <---- bootstrap messages -------< Device sends bootstrap
    Updates           <---- either side can update ---> Updates

## Configuring remote server connectivity

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, to the right of the current remote type will be a button named "Change". Click this button and choose:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/client-remote-choice-generator.png" title="Serial remote choice in designer UI" alt="Serial remote choice in designer UI" >}}

### Parameters

The only parameter for serial is the name of the port to be used, if you are using the default USB Serial port it will nearly always be `Serial`. Otherwise choose the serial port instance for the hardware that you have.

* `Ethernet library type`: the underlying library that you're using to make the connection. This plugin supports many common libraries including `Ethernet`, `UIP`, `WiFi` and `Stm32Ethernet`
* `How to interpret the address`: You can define the address as a hard-wired string, a define/flag that you provide, or lastly a variable that you will define in your sketch of type `const char*`
* `Address of server`: the address of the server where you are accepting connections
* `Remote Port`: the port on which the server is listening

## Requirements in your sketch

You must ensure that the network library you have used is fully configured before calling `setupMenu()` in your sketch.

## Using with Java API

Presently, only the Java API supports this mode. Within the Java API the following example shows how to use this mode:

    com.thecoderscorner.menu.examples.client.ClientThatAcceptsForRemoteExample

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 
