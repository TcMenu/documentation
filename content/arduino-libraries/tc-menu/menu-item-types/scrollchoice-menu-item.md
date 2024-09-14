+++
title = "Working with scroll choice items  - ScrollChoiceMenuItem"
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

Scroll Choice menu items allow for a single choice from a list of choices. Unlike enum menu item the choices may not be known until runtime, and could change at any time. There are several ways that choices can be stored either in a fixed width memory character array, EEPROM fixed width array, or lastly using a custom callback for each item.

## Class types for ScrollChoiceMenuItem

* Type `ScrollChoiceMenuItem` defined in `ScrollChoiceMenuItem.h`, default callback is `enumItemRenderFn`
* Enum returned by `getMenuType()` is MENUTYPE_SCROLLER_VALUE
* [This item is based on RuntimeMenuItem]({{< relref "based-on-runtimemenuitem.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* {{< refdocs title="Scroll choice menu item documentation" src="/tcmenu/html/class_scroll_choice_menu_item.html" >}}

## Creating a Scroll Choice item from the designer

From the add dialog choose the "Scroll Choice" option. The form will look similar to the following:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-scroll.png" title="Scroll Choice Editor UI" alt="image showing the scroll choice editor">}}

See the section further down on dealing with scroll items in code for the specifics, but here's how to configure for all three cases

To set up for EEPROM storage, you choose data mode as EEPROM, the item width is the maximum width of the text for an item, and initial items is how many items are in the array (can be changed at runtime). EEPROM offset is the position in the EEPROM storage where the array starts. You must call `menuMgr.setEepromRef(ptrToEeprom)` during setup. [See the menu manager docs]({{< relref "menumanager-and-iteration.md" >}})

To set up for RAM storage, you choose data mode as RAM, the item width is again the maximum width and initial items works as per EEPROM mode. In this case you must specify the array variable, which is a character array in memory large enough to account for width * numItems. If it does not exist in your sketch, the variable will be created for you in non-const memory as type `char*`, so you can change it at runtime. As per callbacks, if you start the RAM variable with "@" such as `@myVariableName` then it will be exported but not declared.  

You can also choose custom that will callback every time the item needs data. In this mode only initial items needs setting, the designer will add a custom callback to your code, see the section below on implementing it.

## Dealing with a scroll choice item in code

### Memory arrangement of EEPROM and RAM option

When using either EEPROM or RAM storage of items, we use a flat array of items the same size for each item. Let's say each item is 10 long, they will follow each other sequentially in memory like the illustration below. We use ~ to represent the zero termination. For EEPROM storage you specify the location at which the array starts, whereas for RAM you provide the variable name of the array.

For EEPROM storage, you absolutely must call `menuMgr.setEepromRef(ptrToEeprom)` BEFORE any possible calls to the menu item, the easiest way to do this is to define the EEPROM in the code generator window. [See the menu manager docs]({{< relref "menumanager-and-iteration.md" >}})

        item space    
        0 1 2 3 4 5 6 7 8 9
    r 0 H e l l o ~
    o 1 B o n j o u r ~
    w 2 G u t e n t a g ~ 

Caching: To cache EEPROM values into RAM call `cacheEepromValues` on the item, in this case the array size must not exceed 255 characters. Performance will be significantly improved, especially on I2C EEPROMs.

### Custom rendering option

In this case the menu item will call a custom rendering function each time information about the item is needed (such as the name or the value of each choice). The designer will create the render function for this automatically, and you can look at many examples for inspiration too.

Consult [Runtime Menu Item documentation]({{< relref "based-on-runtimemenuitem.md" >}}) for a more detailed background on callbacks.

By default, the designer created code will call into the default function as follows:

    int CALLBACK_FUNCTION exampleListRenderFn(RuntimeMenuItem* item, uint8_t row, RenderFnMode mode, char* buffer, int bufferSize) {
        switch(mode) {
        default:
            return defaultRtListCallback(item, row, mode, buffer, bufferSize);
        }
    }

Into the above, we can handle the various `mode` and `row` cases as follows:

* `RENDERFN_NAME` - for scroll choice items, you don't need to implement this unless you want to override the default name.
* `RENDERFN_VALUE` - is called for each `row` and should return the value at that position.

In most cases implementing just value should be enough. However, the core runtime item documentation linked above describes all the `mode` possibilities in more detail. 
  
## General purpose functions you can use

To get the text of a particular choice

    item.valueAtPosition(buffer, bufferSize, idx);

To get and set the current choice index

    void setCurrentValue(newIdx, silent = false);
    int idx = getCurrentValue();

## Creating a scroll choice menu item from the CLI

To create a scroll choice menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type choice --name ChoiceName [--localonly --readonly --hide]

The structure of a scroll choice menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "scrollItem",
      "item": {
        "itemWidth": 0,
        "eepromOffset": 0,
        "numEntries": 0,
        "choiceMode": "ARRAY_IN_EEPROM",
        "name": "ChoiceName",
        "variableName": "ChoiceName",
        "id": 14,
        "eepromAddress": -1,
        "readOnly": false,
        "localOnly": false,
        "visible": true
      }
    }

Where choice mode is one of: 
    
    ARRAY_IN_EEPROM, ARRAY_IN_RAM, CUSTOM_RENDERFN

## Manually creating a ScrollChoice item 

    RENDERING_CALLBACK_NAME_INVOKE(fnScrollChoiceCb, enumItemRenderFn, "Choice", 
                                   myEepromLocation, NO_CALLBACK)
    ScrollChoiceMenuItem menuScrollChoice(myId, fnScrollChoiceCb, 0, 
                                   romLocation, itemWidth, noItem, &nextMenuItem);

Above we create a Choice item with the choices in EEPROM, the name of the callback method is `fnScrollChoiceCb` and most requests pass through to `enumItemRenderFn`. The menu item name will be "Choice" and its menu changed callback is `NO_CALLBACK`, you could instead define a callback. Change `myId` to the desired ID and `myEepromLocation` to a suitable storage location or 0xFFFF.

We then specify the location in ROM where the array starts, and the width of each item and number of items. You can see the reference docs (link at top of page) for the RAM and custom constructors.

