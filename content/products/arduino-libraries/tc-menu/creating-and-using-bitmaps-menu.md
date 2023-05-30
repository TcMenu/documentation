+++
title = "Creating and using Bitmaps and Title Widgets in your menu"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2023-01-02"
author =  "dave"
menu = "tc-menu"
banner = "/products/arduino-libraries/images/front/tcMenu-banner.png"
githublink = "https://github.com/davetcc/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 99
toc_needed = true
+++


Within TcMenu designer there is a bitmap creation utility, it can take most common file formats as its source, and convert them to a format suitable for use in tcMenu (and many other libraries too). The bitmap creation utility is located in the "Code->Bitmap/Widget creation tool". It can create both straight bitmaps and title widgets to either the clipboard or a file. Let's first go through what it can create at the moment.

## Using the user interface

Below, I present the dialog that will appear once the bitmap creation tool is loaded. We'll study each section of it in detail.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/bitmap-creation-utility.jpg" alt="Bitmap and Widget creation utility showing two PNGs with transparency" title="Bitmap/Widget creation utility window" >}}

### Adding, selecting and removing images

To add an image either copy an image from a tool such as GIMP or other editing package onto the clipboard (ensure it has a transparency) and paste it into the window using CTRL-V (macOS use CMD-V). You can also add images by clicking the "Add image" button. Either way it will go into the next available slot. If you're creating a widget, ensure you add them in order.

To select/unselect an image simply left-click on an image. When images are selected the background becomes highlighted (like the ones in the example). By default, images that are added are automatically selected.

To remove one or more images, simply select each of the images that you want to remove and click "Remove Image". This removes _ALL_ selected images. 

### Pixel formats

At the moment only XBMP output is available. Further, regardless of what future options there may be, title widgets are always XBMP. 

### Exporting Bitmaps as code

At the moment the tool can create bitmaps in the XBM format, this is commonly accepted by many libraries such as tcMenu, Adafruit_GFX, U8G2, TFT_eSPI and many more. It is a simple 1-bit-per-pixel format that usually also defines a width and height separately. The source image you are encoding must currently have a transparency to work properly, the value RGBA(0,0,0,0) is considered "off". Each bitmap that is selected will be created in the same pass, they will be numbered. Code will be export either to a file or clipboard depending if "create bitmaps on clipboard" is checked.

### Exporting a Title widget as code

TcMenu can present one or more title widgets in the upper right of the menu, see further down for a full description of title widgets. An important note is that all images must be exactly the same size. If they are not, the icons will not present properly. For the variable name there is no need to put "Widget" on the end, it will be appended automatically. Code will be export either to a file or clipboard depending if "create bitmaps on clipboard" is checked. 

## How to use bitmaps in your code

### XBM - X-Bitmap format 

This format is supported by most libraries directly. Adafruit_GFX, U8G2 and TFT_eSPI can all draw XBM given just the width and height. Consult the documentation of the library for the exact function to use in each case.

Using XBM with a TcMenu device drawable is also trivial, and works on all supported display libraries, given a `DeviceDrawable` obtained from a renderer, you'd simply call:

    drawable->drawXBitmap(Coord(xLoc,yLoc), Coord(width, height), xbmpData);

Read more about [tcMenu device drawable]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md" >}}). 

## How to use title widgets in your code

For all displays including LiquidCrystal we support the concept of title widgets. Title widgets allow a small icon to be presented in the title area that can have a number of states. A non-exhaustive list of examples of this:

* Wifi signal strength indicator (see the esp8266 example).
* Current Connection status icon (see many of the examples).
* Power or battery indicator.

Here's an example OLED display showing two widgets:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/title-widget-example.jpg" title="Screen shot of menu showing title widgets - upper right" alt="OLED display showing tcMenu with title widgets" >}}

Each `TitleWidget` has an array of icons that represent the `states`. Each icon should first be defined:

    const uint8_t iconData1[] PROGMEM = { 0, 0, 0 etc };
    const uint8_t iconData2[] PROGMEM = { 0, 0, 0 etc };

Following this, we then define the array of icons, the icons are in XBM format (Xbitmap), GIMP can export in this format:

    const uint8_t* const iconsData[] PROGMEM = { iconData1, iconData2 };

Lastly we then define a `TitleWidget` that represents this icon state:

    TitleWidget iconsWidget(iconsData, numOfIcons, width, height [, &optionalNextWidget]);

The optionalNextWidget is a pointer to the next widget, if you only have one you don't provide it.

Now we set the *first* widget as follows:

    renderer.setFirstWidget(&iconsWidget);

To change the state of a widget, simply call its setter method:

    iconsWidget.setCurrentState(iconNumZeroBased);

### Default icon sets

There are default icons for both WiFi strength and connection state included that work for a wide range of displays.

Icons for low resolution displays such as Nokia 5110:

    #include "stockIcons/wifiAndConnectionIcons8x7.h"

Icons for higher resolution displays such as TFT and OLED:

    #include "stockIcons/wifiAndConnectionIcons16x10.h"

Icons for 5x8 LiquidCrystal / HD44780 displays:

    #include "stockIcons/wifiAndConnectionIconsLCD.h"

In each file there are two icon sets defined.

    // a set of wifi icons, 0 is not connected, 1..4 are low to high strength
    const uint8_t* const iconsWifi[] PROGMEM = { iconWifiNotConnected, iconWifiLowSignal, iconWifiMedSignal, iconWifiStrongSignal, iconWifiBestSignal };

    // a boolean not connected (0) or connected (1) icon    
    const uint8_t* const iconsConnection[] PROGMEM = { iconDisconnected, iconConnected };

For some sizes (but not all) we also define an icon for ethernet state (wired connection):

    const uint8_t* const iconsEthernetConnection[] PROGMEM = { iconEthernetNone, iconEthernetConn };

