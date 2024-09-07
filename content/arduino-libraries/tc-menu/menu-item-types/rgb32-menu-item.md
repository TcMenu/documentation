+++
title = "Working with RGB color choice items  - Rgb32MenuItem"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-11"
author =  "dave"
menu = "menu-item-types"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
toc_needed = true
+++

An item type that represents a color in the Red Green Blue space, optionally also having an Alpha. Colors are represented as values between 0 and 255 for each part and optionally an additional part for Alpha.

## Type information for Rgb32MenuItem

* Type: `Rgb32MenuItem` with default callback of `rgbAlphaItemRenderFn` in `ScrollChoiceMenuItem.h`
* Enum returned by `getMenuType()` is MENUTYPE_COLOR_VALUE
* [This item is based on RuntimeMenuItem]({{< relref "based-on-runtimemenuitem.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* [RGB color item reference documentation](https://www.thecoderscorner.com/ref-docs/tcmenu/html/class_rgb32_menu_item.html)

## Creating a color menu item using the designer

From the add item dialog choose the RGB Color option. At this point the properties area should look as follows:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-rgb.png" title="RGB Item Editor UI" alt="image showing the RGB editor">}}

The only RGB specific option is alpha, if this color needs an alpha channel tick the box, otherwise leave un-ticked.

## Working with color items in code

To get and set color data as an `RgbColor32` we can do the following

    RgbColor32 color(255, 255, 255);

    item.setColorData(color); 
    RgbColor32 clr = item.getColorData();
    
On any `RgbColor32` structure you can get a HTML color string such as `#ffffff` for example.

    clr.asHtmlString(buffer, bufferSize, alphaNeeded);

You can check if an menu item is using the alpha channel

    item.isAlphaInUse();

## Creating an RGB menu item from the CLI

To create an RGB menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type rgb --eeprom AUTO --name RgbName [--localonly --readonly --hide]

The structure of an RGB menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "rgbItem",
      "item": {
        "includeAlphaChannel": false,
        "name": "RgbName",
        "variableName": "RgbName",
        "id": 13,
        "eepromAddress": 14,
        "readOnly": false,
        "localOnly": false,
        "visible": true,
        "staticDataInRAM": false
      }
    }

## Creating Rgb items manually

    const AnyMenuInfo minfoRGB = { "RGB", myId, myEeprom, 0, onRgbChanged };
    Rgb32MenuItem menuRGB(&minfoRGB, RgbColor32(0, 0, 0), isAlphaIncluded, nextItemPtr, INFO_LOCATION_PGM);// or INFO_LOCATION_RAM

You can see above an example of how to very simply create an RGB menu item manually in code without designer. See the reference docs for more information. 
