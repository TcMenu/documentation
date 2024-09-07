+++
title = "Working with floating-point values - FloatMenuItems"
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

Float items are useful for displaying the result of inexact calculations and are only supported for read only purposes. The issue with floating points is that they are inexact and unsuited uses where they are ticked by a rotary encoder. An example use of a float menu item would be the average temperature of many readings.

## Type information for FloatMenuItem

* Class type: `FloatMenuItem` / `FloatMenuInfo` in MenuItems.h
* Enum returned by `getMenuType()` is MENUTYPE_FLOAT_VALUE
* [This item is based on an Info block]({{< relref "based-on-infoblock.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* [FloatMenuItem reference documentation](https://www.thecoderscorner.com/ref-docs/tcmenu/html/class_float_menu_item.html) 

## Creating an object from the designer

Choose to add a new menu item, and from the dialog choose Float item, once created the properties panel will look similar to:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-float.png" title="Float Editor UI" alt="image showing the float editor">}}

For float items, the only additional parameter is the number of decimal places to be displayed.

## Accessing float menu items from code

To get and set values on float items:

    menuItem.setFloatValue(newValue, silent = false);
    float f = menuItem.getFloatValue();

To check how many decimal places the value should format to:

    int places = menuItem.getDecimalPlaces();

## Creating a float menu item from the CLI

To create a float menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type float --name FloatName [--localonly --readonly --hide]

The structure of a float menu item in the EMF file is:

    {
      "parentId": 7,
      "type": "floatItem",
      "item": {
        "numDecimalPlaces": 0,
        "name": "FloatName",
        "variableName": "FloatName",
        "id": 9,
        "eepromAddress": 0,
        "readOnly": false,
        "localOnly": false,
        "visible": true,
        "staticDataInRAM": false
      }
    }

## Creating a float menu item manually

In nearly all cases it's better to create items using the designer. However, this is how you create an additional float item manually should it be required.

    [const PROGMEM] FloatMenuInfo minfoFloatItem = { "Float Item", myId, 0xFFFF, decPlaces, NO_CALLBACK };
    FloatMenuItem menuFloatItem(&minfoFloatItem, &nextMenuItem, [bool isInfoProgmem=true]);

Above we create a float item along with it's associated info structure. `myId` should be replaced with the unique ID for the item, `NO_CALLBACK` signifies there is no callback. `decPlaces` refers to how many decimal places this menu item should display.
