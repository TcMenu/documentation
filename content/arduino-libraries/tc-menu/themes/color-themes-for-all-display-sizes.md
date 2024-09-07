+++
title = "Color themes for all display sizes."
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2021-05-12"
author =  "dave"
menu = "themes"
banner = "/products/arduino-libraries/images/electronics/arduino/themes/color-blue-example.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-plugins/color-themes-for-all-display-sizes/"]
+++

## Examples of this theme

[Information about themes in general]({{< relref "rendering-with-themes-icons-grids.md" >}}).

Below we show an example of a color theme, the one shown is the cool-blue theme:

{{< figure title="TFT screen using modern cool blue" alt="menu library on TFT with blue theme" src="/products/arduino-libraries/images/electronics/arduino/themes/color-blue-example.jpg">}}

TcMenu ships with the cool-blue color theme presently that is only compatible with color displays. Each color scheme has a traditional mode aimed at smaller resolutions, and a modern theme designed for larger fonts, with more spacing between elements; which is ideal for touch screens.

## Configuring the theme

Themes add a theme header file to your sketch, _which once generated will not be touched again by designer_. This means that you can edit the theme file to meet your needs. Should you wish to regenerate the file, delete it, and then it will be regenerated.

### Choosing between TcUnicode and Native fonts

You can now choose between native fonts supported by the library, or using our tcUnicode support.

With 3.0 of TcMenu onwards, we include support for [drawing UTF-8 Unicode fonts with TcUnicode]({{< relref "tc-unicode-helper.md" >}}). TcUnicode supports both its own Unicode fonts that can support all unicode ranges, and is also backward compatible with Adafruit fonts too. The designer is also equiped with a new font creation UI as of 3.0 which can convert desktop fonts to embedded format.  

### Font for items

This is the default font that menu items will draw using. See [Fonts in the menu designer]({{< relref "using-custom-fonts-in-menu.md" >}})

### Font for title

This is the title font that will be used for header text. See [Fonts in the menu designer]({{< relref "using-custom-fonts-in-menu.md" >}})

### Border width for action items

An optional border that can be drawn around actionable items to make them look more like buttons. 0 = no border.

### How to show title

There are various ways that the title can be drawn, always, as the first row, or never.

### Use sliders for analog items

When true, analog items will be drawn using what looks like a percentage bar. When using touch, editing is performed by dragging the bar. This can also be set by creating a RowPosition grid entry item by item.

### Use icons for active and edit status

Determines if an active / edit item indicator should be shown on the left.  This option is generally turned off for touch screen, otherwise on.

## Additional documentation

* [Information about themes in general]({{< relref "rendering-with-themes-icons-grids.md" >}}).
* [Full documentation of tcMenu rendering]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md" >}}).

