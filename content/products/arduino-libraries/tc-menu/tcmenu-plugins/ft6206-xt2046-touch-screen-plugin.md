+++
title = "XPT2046 / FT6206 touch screen input plugin"
description = ""
tags = [ "arduino", "button-press", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2021-10-12"
author =  "dave"
menu = "tcmenu-plugins"
banner = ""
titleimg = ""
githublink = "https://github.com/davetcc/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

This touch screen input plugin supports both XPT2046 and FT6206 based touch screens. In order for this plugin to work correctly the right underlying library must be installed. These are described below:

* XPT2046 [Paul Stoffregen XPT2046 library](https://github.com/PaulStoffregen/XPT2046_Touchscreen), best installed from library manager.
* FT6206 [Adafruit_FT6206 library](https://github.com/adafruit/Adafruit_FT6206_Library), best installed from library manager

When using this touch plugin, the concept of touching and holding touches is handled by the unit itself, even managing "repeat key" is handled by the library, based on which mode it is in.

You should note that this plugin can only be used with graphical display renderers. You can also read the IoAbstraction [touch screen documentation]({{< relref "touch-screen-support.md" >}}) as this support is based on that.

## Configuring for your system

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, you can click on the image below the input plugin selection, and you'll see the two below options in the list:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/inputplugin-adalibtouch-option.jpg" alt="Choices for switches and rotary encoder" title="Choices for switches and rotary encoder" >}}

Once you've chosen the touch screen plugin, you'll need to configure the plugin for use, this includes choosing the right library and working out the correct rotation that aligns with your display, the easiest way to do this is to use the test sketch that's packaged with IoAbstraction.

### Properties for library based touch screen:

* Touch Library - choose the library that you wish to integrate with. As above, the library must be installed.
* Touch interrupt pin - XPT2046 library only, the interrupt pin to avoid polling.
* Touch CS pin - XPT2046 library only, the CS pin for the SPI interface.
* Orientation settings - see the [Orientation Settings section]({{< relref "touch-screen-calibration-ui.md" >}}) for more details on each option
* Calibration Support - see the [Calibration Settings]({{< relref "touch-screen-calibration-ui.md" >}}) a full explanation of calibration

## Working with the touch interface in code

When you use this plugin, it will create a variable called `touchScreen` on your behalf, it will be of type `MenuResistiveTouchScreen`. It will be exported so that you can use it in your code.

To calibrate the touch screen, you can use our calibration "extra", see the ESP32Amplifier example that shows how to use it.

    touchScreen.calibrateMinMaxValues(float xmin, float xmax, float ymin, float ymax)

For each dimension, min and max are the minimum and maximum values possible in that dimension, BEFORE any rotation is applied.
