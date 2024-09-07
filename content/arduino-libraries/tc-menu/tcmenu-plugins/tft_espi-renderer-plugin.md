+++
title = "TcMenu - Using TFT_eSPI library to render menus"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2019-05-10"
author =  "dave"
menu = "tcmenu-plugins"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/adagfx-color-display-example.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/adagfx-color-display-example.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

In this guide we show how to use the [TFT_eSPI library](https://github.com/Bodmer/TFT_eSPI) to renderer menu items with tcMenu. This rendering driver for TFT_eSPI library is built into the core menu designer download, meaning it's available right out of the box. This plugin simply wraps the functionality that the library provides.


The TFT_eSPI menu plugin supports a lot of different displays, that cover a range of resolutions. However, we have mainly tested with both a ILI9341 and ST7735 based TFT, but it should work with other supported displays. When working with this library, you generally create a `User_Setup.h` file somewhere in your project, and reference it from `User_Setup_Select.h` within the library itself. The tcMenu plugin will include the required headers for you, leaving you to define only the menu specific settings.

TFT_eSPI Touch is also supported by the plugin and it has been integrated into the IoAbstraction touch interface. To use touch simply enable it in the plugin settings and choose the appropriate options (discussed below).

Thanks to the outstanding performance of this library, we are able to render menus in near real time without any flicker, and also support double buffering for menu items up to a given height. Providing near flicker free updates on our ESP32 test bed. 

Related documentation:
 
* [Core menu rendering class guide]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md">}})
* [How to take over the display]({{< relref "renderer-take-over-display.md">}})

## Configuring the rendering for your display

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, you can change the display renderer by clicking on the image to the left of the renderer.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/graphics-tftespi-renderer-option.jpg" alt="TFT_eSPI menu rendering choice" title="Image showing TFT_eSPI menu rendering choice">}}

## Configuration

The following configuration options are available on this renderer.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/graphics-tftespi-renderer-properties.jpg" alt="TFT_eSPI menu rendering properties" title="Image showing TFT_eSPI menu rendering properties">}}

### Variable Name

The graphics variable that the generator will generate on your behalf, it will be exported with this name to use in your own code.

### Display rotation

You can specify the initial rotation of the display as a value from 0 to 3.

### Double Buffer rows

Menu items are drawn one at a time, and they can be double buffered in memory; which avoids even the slightest of flicker. You can specify a number of rows that will be used for this buffering. Every row uses a 4 bit per pixel buffer, so a 320px width results in 160 bytes. If you picked a maximum height of 40px, it would take 6400 bytes.

This uses the sprite support that is built into the library, and if you have PSRAM available, it would that first.

### Title font

The numerical index of the font to use for the title.

### Item font

The numerical index of the font to use for the item.

### Updates per second

How many times the menu structure should be scanned for changes and redrawn if needed. TcMenu tries to minimise redraws where reasonably possible.

## Touch support

In terms of touch support, the following can be configured:

* Turning touch on and off, when off no touch facilities are added to your project.
* Orientation settings - see the [Orientation Settings section]({{< relref "touch-screen-calibration-ui.md" >}}) for more details on each option
* Calibration Support - see the [Calibration Settings]({{< relref "touch-screen-calibration-ui.md" >}}) a full explanation of calibration


[Back to tcMenu main page]({{< relref "tc-menu" >}}) 