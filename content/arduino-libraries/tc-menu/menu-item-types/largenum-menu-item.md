+++
title = "Working with large numbers - EditableLargeNumberMenuItem"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-11"
author =  "dave"
menu = "menu-item-types"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
toc_needed = true
+++

tcMenu supports Large numbers for editing, with values up to 12 digits in total, and it can optionally handle negative values too. The underlying storage is a bit packed BCD array. This makes for efficient storage and complete accuracy in all cases. However, you can convert to and from floating-point values for convenience when accuracy is not as important.

## Class types for Large Number items

* Type: `EditableLargeNumberMenuItem` with default callback of `largeNumItemRenderFn` in `EditableLargeNumberMenuItem.h`
* Enum returned by `getMenuType()` is MENUTYPE_LARGENUM_VALUE
* [This item is based on RuntimeMenuItem]({{< relref "based-on-runtimemenuitem.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* {{< refdocs title="Large Number reference documentation" src="/tcmenu/html/class_editable_large_number_menu_item.html" >}}

## Creating an object from the designer

From the add dialog choose the "Large numeric value" option. The form will look similar to:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-largenum.png" alt="editor value for a large number menu item" title="Large Number Editor UI" >}}

* Decimal Places: the number of decimal places after the point.
* Total Digits: the maximum allowable digits for the number item (including decimal places).
* Allow Negative: if this is un-ticked, the editor will only allow positive values. 

## Working with Large number items in code

There are two ways to acquire and set the values of a large number item, either as a `LargeFixedNumber` object that represents the whole and fraction components as 32 bit integers along with a negative flag, or a `float` single precision floating-point number.

    // Call this method on the menu item to get the underlying number storage
    LargeFixedNumber* getLargeNumber()

    // To get or set the value using float
    float getAsFloat()
    void setFromFloat(float value)

    // To get or set the value by whole and fraction
    uint32_t getWhole()
    uint32_t getFraction()
    bool isNegative()
    void setValue(uint32_t whole, uint32_t fraction, bool negative)

## Creating a large number menu item from the CLI

To create a large number menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type largenum --eeprom AUTO --name LgeNumName [--localonly --readonly --hide]

The structure of a large number menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "largeNumItem",
      "item": {
        "digitsAllowed": 0,
        "decimalPlaces": 0,
        "negativeAllowed": true,
        "name": "LgeNumName",
        "variableName": "LgeNumName",
        "id": 12,
        "eepromAddress": 6,
        "readOnly": false,
        "localOnly": false,
        "visible": true,
        "staticDataInRAM": false
      }
    }

## Manually creating an instance of LargeNumber item

    [const PROGMEM] AnyMenuInfo minfoSettingsLargeNum = { "LargeNum", myId, myEEPROMLocation, 0, NO_CALLBACK };
    EditableLargeNumberMenuItem menuSettingsLargeNum(&minfoSettingsLargeNum, LargeFixedNumber(8, 3, 100U, 500U, false),
                                                     allowNegative, nextMenuPtr, [bool isInfoProgmem=true]);

Above we create a large number item that accepts positive and negative numbers, it is based on an INFO block and this really simplifies creation, most requests pass through to `largeNumItemRenderFn`. The menu item name will be "LargeNum" and its menu changed callback is `NO_CALLBACK`, you could instead define a callback. Change `myId` to the desired ID and `myEepromLocation` to a suitable storage location or 0xFFFF.

The total number of digits and decimal places, and using the other constructor the negative flag are set here too.
