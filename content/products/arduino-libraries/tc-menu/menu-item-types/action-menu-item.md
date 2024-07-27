+++
title = "Working with action items - ActionMenuItems"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-15"
author =  "dave"
menu = "menu-item-types"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
toc_needed = true
+++

Action menu items represent a menu item that does nothing more than run the callback when it is selected. There is no hard requirement for it to have a callback, but one without a callback would have no purpose.
 
## Type information for ActionMenuItem

* Class type: `ActionMenuItem` / `AnyMenuInfo` in MenuItems.h
* Enum returned by `getMenuType()` is MENUTYPE_ACTION_VALUE
* [This item is based on an Info block]({{< relref "based-on-infoblock.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* [ActionMenuItem reference documentation](https://www.thecoderscorner.com/ref-docs/tcmenu/html/class_action_menu_item.html) 

## Creating an object from the designer

Choose to add a new menu item, and from the dialog choose Float item, once created the properties panel will look similar to:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-action.png" title="Action Editor UI" alt="image showing the action editor">}}

For action items there are no special fields over and above the ones for all menu items.

## Accessing action menu items from code

There are no specific functions for action items.

## Creating an action menu item from the CLI

To create an action menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type action --name ActionName [--localonly --readonly --hide]

The structure of an action menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "actionMenu",
      "item": {
        "name": "ActionName",
        "variableName": "ActionName",
        "id": 3,
        "eepromAddress": 0,
        "readOnly": true,
        "localOnly": true,
        "visible": false,
        "staticDataInRAM": false
      }
    }

## Creating an action menu item manually

In nearly all cases it's better to create items using the designer. However, this is how you create an additional action item manually should it be required. You can drop the `const` and `PROGMEM` from the INFO structure if you choose to create in RAM (isInProgmem parameter set to false). Even for RAM items never change the ID after adding to `menuMgr`.

    [const] ActionMenuInfo minfoActionItem [PROGMEM] = { "Action Item", myId, 0xFFFF,
                                             0, myCallback };
    ActionMenuItem menuActionItem(&minfoActionItem, &nextMenuItem, [bool isInProgmem = true]);

Above we create an action item along with it's associated info structure. `myId` should be replaced with the unique ID for the item, myCallback will be called when the item is selected.
