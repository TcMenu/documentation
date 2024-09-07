+++
title = "TcMenu - Touch pad sensor input plugin"
description = ""
tags = [ "arduino", "button-press", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2021-01-14"
author =  "dave"
menu = "tcmenu-plugins"
banner = ""
titleimg = ""
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

## Requirements

Requires tcMenu V2.0 or greater.

Current support:

* ESP32 touch sensor hardware.

## Touch-pad sensor summary

Touch-pad sensors check for button presses without an actual switch, instead the rely on a change in capacitance when the user touches an area (usually a small metal plate around the size of a finger. Given that this procedure is quite complex, it usually requires hardware support for such inputs, so it can only ever be supported when hardware allows. At the moment we only support this for ESP32.  

This plugin basically allows the ESP32 touch sensors to be used with switches library as if they were normal buttons. It is done by directly integrating with the IDF touch sensor code. 

## Configuring for your system

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, you can click on the image below the input plugin selection, and you'll see the following option, select it:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/inputplugin-esp32touchpad-option.jpg" alt="Choices for switches and rotary encoder" title="Choices for switches and rotary encoder" >}}

Once you've chosen the touch-pad sensor plugin, you'll need to configure the plugin for use, further, you need to determine the threshold value, below which you can be certain there has been a touch event. 

### Properties for resistive touch screen:

* Activation Threshold - Any value obtained below this can be considered a touch event.
* High Voltage setting - Defaulted to reasonable value, read the ESP32 IDF touch-pad documentation  
* Low Voltage setting - Defaulted to reasonable value, read the ESP32 IDF touch-pad documentation  
* Attenuation - Defaulted to reasonable value, read the ESP32 IDF touch-pad documentation  
* Up Sensor - the touch sensor number 0..9 for UP.
* Down Sensor - the touch sensor number 0..9 for DOWN.
* Select Sensor - the touch sensor number 0..9 for SELECT.
