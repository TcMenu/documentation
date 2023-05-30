+++
title = "TcMenu - Resistive touch screen input plugin"
description = ""
tags = [ "arduino", "button-press", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2021-01-12"
author =  "dave"
menu = "tcmenu-plugins"
banner = ""
titleimg = ""
githublink = "https://github.com/davetcc/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

TcMenu resistive touch screen input plugin supports four wire resistive touch devices that are often fitted in front of color TFT displays. This plugin requires two ADC analog inputs, but note that all pins must be output capable. The connectors are often referred to as X+, X-, Y+ and Y-. In all cases X- and Y+ must be connected to ADC (analog input) capable pins.

When using this touch unit, the concept of touching and holding touches is handled by the unit itself, even managing "repeat key" is handled by the library, based on which mode it is in.

You should note that this plugin can only be used with display renderers based on core graphical renderer, as of 2.0 this will be nearly all renderers. You can also read the IoAbstraction [touch screen documentation]({{< relref "touch-screen-support.md" >}}) as this support is based on that.

## Configuring for your system

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, you can click on the image below the input plugin selection, and you'll see the two below options in the list:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/inputplugin-resistivetouchscreen-option.jpg" alt="Choices for switches and rotary encoder" title="Choices for switches and rotary encoder" >}}

Once you've chosen the resistive touch screen plugin, you'll need to configure the plugin for use, this includes working out the resistive ranges and how they map onto the screen, the easiest way to do this is to use the test sketch that's packaged with IoAbstraction. You provide the minimum and maximum values in both the X and Y directions as floating-point fractions between 0 and 1.

### Properties for resistive touch screen:

* X+ is the pin connected to X+ of the resistive touch unit
* X- is the pin connected to X- of the resistive touch unit - needs ADC
* Y+ is the pin connected to Y+ of the resistive touch unit
* Y- is the pin connected to Y- of the resistive touch unit - needs ADC
* Orientation settings - see the [Orientation Settings section]({{< relref "touch-screen-calibration-ui.md" >}}) for more details on each option
* Calibration Support - see the [Calibration Settings]({{< relref "touch-screen-calibration-ui.md" >}}) a full explanation of calibration

## Working with the touch interface in code

When you use this plugin, it will create a variable called `touchScreen` on your behalf, it will be of type `MenuResistiveTouchScreen`. It will be exported so that you can use it in your code.

To set the range of values (min, max) in both dimensions you first run the packaged example in IoAbstraction, this allows you to touch in the very edges and find the actual range, it outputs the raw touch events to the serial port, once you have them, you can provide calibration data as follows:

    touchScreen.calibrateMinMaxValues(float xmin, float xmax, float ymin, float ymax)

For each dimension, min and max are the minimum and maximum values possible in that dimension, BEFORE any rotation is applied.
