+++
title = "Working with boolean values - BooleanMenuItems"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-11"
author =  "dave"
menu = "menu-item-types"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
toc_needed = true
+++

An item that can represent only boolean true or false. It can be configured to show as ON/OFF, TRUE/FALSE or YES/NO as required.

## Type information for BooleanMenuItem

* Class Type: `BooleanMenuItem` / `BooleanMenuInfo` in MenuItems.h
* Enum returned by `getMenuType()` is MENUTYPE_BOOLEAN_VALUE
* [This item is based on an Info block]({{< relref "based-on-infoblock.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* {{< refdocs title="BooleanMenuItem reference documentation" src="/tcmenu/html/class_boolean_menu_item.html" >}} 

## Creating an object from the designer

Choose to add a new menu item, and from the dialog choose Boolean item, once created the properties panel will look similar to:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-boolean.png" title="Boolean Item Editor UI" alt="image showing boolean item editor UI">}}

Here we will only look at the boolean specific fields, see here for [common properties for all menu items]({{< relref "menu-item-types.md" >}})

Naming - the names to use for true and false.

* YES / NO - presents as textual values 
* TRUE / FALSE - presents as textual values
* ON / OFF - presents as textual values 
* CHECKBOX - presents as a checkbox

## Accessing boolean menu items from code

You can get and set a boolean menu items value by calling:

    bool b = menuItem.getBoolean();
    menuItem.setBoolean(b);

You can check which type of naming (on/off, yes/no etc) it should use by calling:

    BooleanNaming naming = menuItem.getBooleanNaming();

## Creating a boolean menu item from the CLI

To create an boolean menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type boolean --eeprom AUTO --name BoolName [--localonly --readonly --hide]

The structure of a boolean menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "boolItem",
      "item": {
        "naming": "TRUE_FALSE",
        "name": "BoolName",
        "variableName": "BoolName",
        "id": 4,
        "eepromAddress": 4,
        "readOnly": false,
        "localOnly": false,
        "visible": true,
        "staticDataInRAM": false
      }
    }

naming can be: TRUE_FALSE, YES_NO, ON_OFF, CHECKBOX

## Creating a boolean item manually

In nearly all cases it's better to create items using the designer. However, this is how you create an additional boolean item manually should it be required. You can drop the `const` and `PROGMEM` from the INFO structure if you choose to create in RAM (isInProgmem parameter set to false). Even for RAM items never change the ID after adding to `menuMgr`.

    [const] BooleanMenuInfo minfoBoolItem [PROGMEM] = { "Bool Item", myId, eepromLocation, 1, 
                                             NO_CALLBACK, NAMING_ON_OFF };
    BooleanMenuItem menuBoolItem(&minfoBoolItem, false, &nextMenuItem, [bool isInfoProgmem=true]);

Above we create a boolean item along with it's associated info structure. `myId` should be replaced with the unique ID for the item, `eepromLocation` should be replaced with either -1 (no eeprom location) or a location in ROM, `NO_CALLBACK` signifies there is no callback, you can replace this with a callback if there is one. Lastly, the `NAMING_ON_OFF` can be replaced with `NAMING_YES_NO` or `NAMING_TRUE_FALSE`. 
