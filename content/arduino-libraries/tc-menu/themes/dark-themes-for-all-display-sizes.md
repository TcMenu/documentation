+++
title = "Dark mode themes for all display sizes."
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2021-05-12"
author =  "dave"
menu = "themes"
banner = "/products/arduino-libraries/images/electronics/arduino/themes/color-dark-example.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

Below we show an example of the dark mode theme, it is designed to have darker background colors with lighter text and images.

{{< figure title="TFT screen using modern dark mode" alt="menu library on TFT with dark mode" src="/products/arduino-libraries/images/electronics/arduino/themes/color-dark-example.jpg">}}

TcMenu ships with two dark mode color themes and they are only compatible with color displays. The dark mode theme revolves around black and dark grey backgrounds with light grey and white foregrounds. It is available in traditional mode aimed at smaller resolutions, and as a modern theme designed for larger fonts, with more spacing between elements; which is especially suited for touch screens.

## Configuring the theme 

Themes add a theme header file to your sketch, _which once generated will not be touched again by designer_. This means that you can edit the theme file to meet your needs. Should you wish to regenerate the file, delete it, and then it will be regenerated.

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
