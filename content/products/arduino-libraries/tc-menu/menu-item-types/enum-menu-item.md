+++
title = "Working with fixed choices - EnumMenuItems"
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

An item that can represent a known series of values where only one can be selected at a time. Somewhat like a combo box. For enum items these values must be set at compile time, and on AVR / ESP they are in program memory. We store the choice as a zero based integer with the first choice being 0 and so on.

If you want choices that can change at runtime, or acquired from EEPROM or RAM then see [ScrollChoiceMenuItem]({{< relref "scrollchoice-menu-item.md" >}})

## Class types for EnumMenuItem

* Type: `EnumMenuItem` / `EnumMenuInfo` in MenuItems.h
* Type returned by `getMenuType()` is MENUTYPE_ENUM_VALUE
* [This item is based on an Info block]({{< relref "based-on-infoblock.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* [EnumMenuItem reference documentation](https://www.thecoderscorner.com/ref-docs/tcmenu/html/class_enum_menu_item.html) 

## Creating an enum item in the designer

From the add item dialog choose Enum item, the editor panel will look similar to:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-enum.png" title="Enumeration Item Editor UI" alt="image showing the enumeration editor">}}

To add additional choices, press the Add button below the values list. Double click on the item in the list to edit it, press enter when done. Pressing remove deletes the selected item.

## Working with enum menu items in code

To get and set the current values on an enumeration as an integer index.

    uint16_t currentValue = menuItem.getCurrentValue()
    menuItem.setCurrentValue(uint16_t val, bool silent = false)

To get the textual representation of an index:

	void menuItem.copyEnumStrToBuffer(char* buffer, int size, int idx);

Where:

* buffer is where the string will be copied
* size is the size of the buffer
* idx is the index in the enum - for example from calling menuItem.getCurrentValue()

## Creating an enum menu item from the CLI

To create an enum menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type enum --eeprom AUTO --name EnumName [--localonly --readonly --hide]

The structure of a float menu item in the EMF file is as follows, you can add and remove entries from the enumEntries section:

    {
      "parentId": 0,
      "type": "enumItem",
      "item": {
        "enumEntries": [
          "Enum 1",
          "Enum 2"
        ],
        "name": "EnumName",
        "variableName": "EnumName",
        "id": 10,
        "eepromAddress": -1,
        "readOnly": false,
        "localOnly": false,
        "visible": true,
        "staticDataInRAM": false
      }
    }

## Creating an enum item manually

In nearly all cases it's better to create items using the designer. However, this is how you create an additional enum item manually should it be required. **We strongly recommend that you do not create EnumMenuItem manually, instead use ScrollChoice items for this.**

    // first we create text strings for each of the choices
    // if on AVR/ESP then PROGMEM keyword is needed.
    const char enumStrFruits_0[] PROGMEM  = "Apples";
    const char enumStrFruits_1[] PROGMEM  = "Oranges";
    const char enumStrFruits_2[] PROGMEM  = "Pears";
    const char enumStrFruits_3[] PROGMEM  = "Plums";
    const char enumStrFruits_4[] PROGMEM  = "Grapes";
    
    // Now we assemble the list of enumerations, again on AVR/ESP use progmem
    const char* const enumStrFruits[] PROGMEM  = { 
            enumStrFruits_0, enumStrFruits_1, enumStrFruits_2,
            enumStrFruits_3, enumStrFruits_4 
    };
    const EnumMenuInfo PROGMEM minfoFruits = { "Fruits", myId, eepromLocation, numChoices,
                                               NO_CALLBACK, enumStrFruits };
    EnumMenuItem menuFruits(&minfoFruits, 0, &nextMenuItem);
    
Above we create an enum item along with it's associated info structure and choices. `myId` should be replaced with the unique ID for the item, `eepromLocation` should be replaced with either -1 (no eeprom location) or a location in ROM, `NO_CALLBACK` signifies there is no callback, you can replace this with a callback if there is one. 

Each of the choices has it's own string `enumStrFruits_N`, and then they are assembled into a list of choices `enumStrFruits`, finally these are passed into the Info block as the last parameter.
