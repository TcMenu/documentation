+++
title = "Using SSD1306 to generate a Uno / low memory multi level OLED menu"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2022-09-29"
author =  "dave"
menu = "tcmenu-plugins"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/oled-display.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/oled-display.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

It is possible to build multi level menus with an OLED display on an Arduino Uno or other low memory board provided you use SSD1306Ascii instead of the U8G2 library, as it uses a lot less memory at the cost of some flexibility. We've tested it with regular I2C SH1106 OLED display units and it works absolutely fine.

To use this library, you create the variable globally in your sketch, and then reference it in the code generator properties, the code generator will not create the display object for this type of display.

There are some limitations, firstly it is assumed that you will use a fixed width font for the menu drawing (you can use proportional fonts for the title), this is to ensure we know how wide the menu will be on the display. Don't forget we're not drawing this into a buffer, it is going straight onto the screen, and the screen is treated as an ASCII drawing area. This is not the case with the U8G2 plugin.

## Configuring for your display

We recommend before proceeding that you familiarize yourself with the [underlying SSD1306ASCII library](https://github.com/greiman/SSD1306Ascii).

You'd then create the display variable globally within your sketch, and initialise it before the call to `setupMenu()` in `setup()`.

With this done, the menu should appear on the display once the sketch is uploaded.

## Configuration options

* `Display Variable Name` this is the name of the display variable you created above.
* `Display Variable Type` this is the exact type of the display variable you created above.
* `Char Width` defines the number of characters across the display
* `Title font` the font to use for the title, take care to determine the size of each font carefully on low memory boards
* `Item font` the font to use for menu items, take care to determine the size of each font carefully on low memory boards

This should be all that's needed to get up and running with this display.  There's also an example packaged with tcmenu library.


