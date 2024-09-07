+++
title = "TcMenu - Using Adafruit_GFX to render menus"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2019-05-10"
author =  "dave"
menu = "tcmenu-plugins"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/adagfx-color-display-example.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/adagfx-color-display-example.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 50
toc_needed = true
aliases = ['/products/arduino-libraries/tc-menu/using-adafruit_gfx-rendering/']
+++

In this guide we show how to use the Adafruit_GFX library to renderer menu items with tcMenu. This rendering driver for Adafruit_GFX is built into the core menu designer download, meaning it's available out of the box.

The Adafruit_GFX library supports a lot of different displays, with very different capabilities. Some are monochrome with an in-memory buffer; whereas others are high resolution colour displays that are not buffered in memory. In order to make our renderer as generic as possible it supports both of these capabilities through configuration. It's worth reading this guide fully so that you understand how we manage the various capabilities.

Before proceeding, you'll need to make sure you've installed both the Adafruit_GFX core library and the library that is compatible with your display. Also, I'd recommend taking a read through the [Adafruit_GFX library documentation](https://learn.adafruit.com/adafruit-gfx-graphics-library/overview) if you're not familiar with the library already. We'll also assume you've got a menu structure already prepared in the [menu designer UI]({{< relref "tcmenu-overview-quick-start.md">}}).  

Related documentation:
 
* [Core menu rendering class guide]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md">}})
* [How to take over the display]({{< relref "renderer-take-over-display.md">}})

## Configuring the rendering for your display

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, you can change the display renderer by clicking on the image to the left of the renderer.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/adafruit-graphics-renderer-option.jpg" alt="Adafruit_GFX rendering option" title="Image showing Adafruit_GFX renderer choice">}}

There are two possibilities for Adafruit_GFX based displays, the first and easiest is the "quick start" option, it supports a few common displays (ST7735, ST7789, ILI9341 and Nokia 5110), it creates all the variables and initialises the display for you. We'll refer to this option as quick start.

If you need full control over the display variable, and all the configuration options, then you choose the "Manual Declaration" option, in which case you prepare the variable yourself, and just tell tcMenu the name and type of variable you've created. We'll refer to this as "Manual Configuration".

## Quick Start for ILI9341, ST7735, ST7789 and Nokia 5110 

If you choose quick start, then the code generator will create the variable, and initialise the display on your behalf. It is obviously far less configurable than manual option, but easier for a few select display. It looks like there are more options than for the manual case, but that is because we will create everything on your behalf.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/adafruit-graphics-quick-properties.png" alt="Property Choices for quick start renderer" title="Image showing properties for Adafruit_GFX quick start" >}}

### Variable Name

The graphics variable that the generator will generate on your behalf, it will be exported with this name to use in your own code.

### Display Type

We support only a few displays with this quick start method, if your display is not listed, use the manual configuration option instead. Select the appropriate display driver for your hardware. Supported quick start displays:

* ST7735 - no frame buffer
* ST7789 - no frame buffer
* ILI9341 - no frame buffer
* Nokia 5110 - memory frame buffer

### Display Width & Height property

Set these to the hardware width and height of your display

### Reset pin (optional)

You can configure a reset pin if your display requires it. Either set to a pin value or -1 for none.

### CS pin (for all SPI cases)

Set this to the chip select (CS) pin for the display. All displays in this category need this.

### RS / DC pin (for all SPI cases)

Set this to the pin for Register select or Data/Command. All displays in this category need this.

### Data pin and clock pin (software SPI)

**Only set these two pins to a value other than -1 if you want to use software SPI**. This is much slower than hardware SPI, so do not use on bigger displays.

### Display rotation

You can specify the initial rotation of the display as a value from 0 to 3.

### Updates per second

How many times the menu structure should be scanned for changes and redrawn if needed. TcMenu tries to minimise redraws where reasonably possible.

## Manual Configuration

When you choose the manual configuration option, you need to create the display variable in your sketch, and make sure it is fully initialised before calling `setupMenu` in your sketch.  

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/adafruit-graphics-creator-properties.png" alt="Property Choices for manual config renderer" title="Image showing property choices for Adafruit_GFX manual configuration" >}}

### Display variable property

In this case you simply create a global variable in your sketch that creates the graphics object. You make sure that the library has been initialised before calling setupMenu() in your sketch. Set this value to the name of the global variable.

### Display variable type property

There are many types of display supported by this library, therefore you just provide the variable type that you declared. For example Adafruit_SSD1306. 

### Buffered display property

Indicates if this display uses memory buffering. Often, mono displays are memory buffered. For example Nokia 5110 and SSD1306 are memory buffered. When displays are memory buffered, the library will then call `display()` after each rendering change.

### Updates per second

How many times the menu structure should be scanned for changes and redrawn if needed. TcMenu tries to minimise redraws where reasonably possible.

## Pre-tested displays with Adafruit_GFX

Each of the display drivers shown below is fully tested with every release of tcMenu. Many other displays will probably work with this renderer, but we've not got one to hand to test.

### Using the menu library with Nokia 5110 

The library for this display is both memory buffered and monochrome. There is a complete example menu packaged with the core tcMenu library. This example was tested on MEGA / AVR with a UipEthernet remote. However, the concepts are generally applicable. Link below takes you to the source on github.

[https://github.com/TcMenu/tcMenuLib/tree/main/examples/nokia5110]

### Using the menu library with OLED SSD1306 

The library for this display is both memory buffered and monochrome. Again there is a complete example menu packaged with tcMenu. This example was tested on both ESP32 and ESP8266, but the concepts are generally applicable to any processor. Link below takes you to the source on github.

[https://github.com/TcMenu/tcMenuLib/tree/main/examples/esp8266WifiOled]

### Using the menu library with color TFT's - ILI9341 and ST7735

Both ILI9341 and ST7735 are high resolution, color displays with built in memory. Therefore, these display libraries are unbuffered on the Arduino side. In order to improve performance where memory allows we support drawing menu items into a 2-bit (4 color) area first in RAM, then using a high performance blit function to transfer the data. Using this buffer the performance is excellent.

There are some additional classes and functions available within our plugin that you can use yourself, these are how we improve drawing performance very significantly, they are available to you as well. But first we need to understand that all of the performance increase is down to RAM buffering (IE drawing into a canvas object first). We support two canvas types, the built in `GFXcanvas1` that is directly available in the library, or our extension `TcGFXcanvas2` that provides two bits per pixel (or 4 colors from 0..3).

We have two drawing functions that can take the buffers that back the canvas and present it optimally, we've optimized them as much as we can, they both perform quite well, but working with `TcGFXcanvas2` being the most tested overall. These "CookieCut" functions allow you cut a range of bitmap data out of a larger bitmap area. Our canvas extension works just like the other canvas objects that are built in.

Once you have drawn to a canvas, you now need to push to the display, for single bit (fgColor/bgColor) drawing, there is `drawCookieCutBitmap` where you provide the graphics, x, and y of the destination area, then the bitmap obtained from `getBuffer()` on the canvas followed by the width and height, then the total width of the bitmap, this is followed by the x and y starting location inside the bitmap and the foreground and background color.

    void drawCookieCutBitmap(Adafruit_SPITFT* gfx, int16_t x, int16_t y, 
                             const uint8_t *bitmap, int16_t w, int16_t h,
                             int16_t totalWidth, int16_t xStart, int16_t yStart,
                             uint16_t fgColor, uint16_t bgColor);
    
Next, for 2-bit per pixel drawing, there `drawCookieCutBitmap2bpp` that does exactly the same as above, but with a color palette, which you pass instead of the foreground and background.

    void drawCookieCutBitmap2bpp(Adafruit_SPITFT* gfx, int16_t x, int16_t y, 
                                 const uint8_t *bitmap, int16_t w, int16_t h,
                                 int16_t totalWidth, int16_t xStart, int16_t yStart,
                                 const uint16_t* palette);

We have many examples that use Adafruit displays packaged in the examples folder within tcMenu. We test TFTs on a very wide range of boards.

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 