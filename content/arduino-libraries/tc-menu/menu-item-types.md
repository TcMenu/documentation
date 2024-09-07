+++
title = "Working with Menu Item types in tcMenu"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2018-03-31"
author =  "dave"
menu = "tc-menu"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.png"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 4
toc_needed = true
aliases = [ "/products/arduino-libraries/tc-menu/tcmenu-menu-item-types-tutorial", "/products/arduino-libraries/tc-menu/manually-creating-menu-with-tcmenu" ]
+++

Many embedded applications need to present status and allow users to manage settings. TcMenu provides first class support for both presenting status and managing configuration/settings using menu items. It is possible to use with and without a local user interface. All menu item types can be accessed remotely, and we have a remote API, UI solutions, and connectors to commercial IoT endpoints for that.  

## Menu item arrangement and storage

Each menu item is part of a tree, if you are unfamiliar with trees, there's a little terminology worth learning. We refer to elements that hold other items as the parent of those items. Conversely, each of the items in the sub menu are children of subMenu. Let's take a look at an example:

    Root menu (parent of Item1, Item2, SubMenu)
       +- Item 1 (child of root)
       +- Item 2 (child of root)
       +- SubMenu (child of root, parent of subItem1, subItem2)
           +- SubItem1 (child of subMenu)
           +- SubItem2 (child of subMenu)

On the device, we store menu items in a linked list structure where the `getNext()` of a menu item points to the next item in the list, each submenu holds an additional linked list, of child items access using `getChild()`. We must terminate every list with NULL. Let's express the above list in this format:

```
Item1 -> Item2 -> SubMenu -> NULL
                    -> SubItem1 -> SubItem2 -> NULL
```

Each item has a type that defines what kind of data it can hold, for example an analog item can hold fixed point numeric information stored as an integer. Whereas a sub menu item does not have any "data" of its own, but holds child items that appear below it. Every menu item you create can be accessed in code using its variable name. File `yourProjectName_menu.h` has all the definitions ready exported.  Let's say we have an item called `Brightness` in the `Settings` Sub Menu, then the variable name would be as below:

* Fully qualified variable name (recommended): menuSettingsBrightness
* Unqualified variable name: menuBrightness 

This guide is designed to be read in conjunction with the {{< refdocs title="tcMenu reference documentation" src="/tcmenu/html/_menu_items_8h.html" >}}.

## Properties shared by all MenuItems

TcMenu can handle many menu item data types with each one extending MenuItem, so you can rely on some features always being available. Later on this page we'll provide links to each menu item type, but first let's look at properties common to all:

* ID: A unique identifier for this menu item. Usually chosen by the designer at creation, generally used to look up an exact item.
* name: the name of the menu item, will also be used to make up the variable name.
* eepromAddress: the location in ROM memory to store the value, or -1 to prevent saving. Pressing Auto in the UI chooses the next location. 
* onChange Function: the function to be called when this item changes or blank to indicate no callback. See the section below for a detailed analysis of the options available.
* next: we store menu items in a linked list, this will either be the next item or NULL.
* state flags: there are several status flags that all menus share such as changed, readonly, visible and remote send needed.
* type: the type of menu item, see MenuType enum in the reference docs.

On the designer you edit these parameters by selecting the menu item from the tree, the properties area will show something similar to below:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-corefields.png" title="Core fields in the property editor" alt="screenshot of core properties for menu item" >}}

### Callback function for changes

When an item changes, the manager can call you back to let your code take appropriate action, if you provide a function name in the designer, it will be generated in your sketch only if it doesn't already exist.

When no callback is required you either leave the field blank, or set it to `NoCallback`. Either of these indicate there is no callback for this item.

This is a simple example showing how we would control a PWM channel based on the value of a menu Item. In this example we have an `AnalogMenuItem` called `menuExample`, that has the same range of values as the PWM channel.

    void CALLBACK_FUNCTION onExampleChanged(int id) {
        analogWrite(somePwmPin, menuExample.getCurrentValue()); 
    } 

For advanced users you can click the "edit" button shown to the right of the callback, where you can select from one of the options in the callback type combo:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/callback-function-dialog.png" alt="Advanced editing of the callback function parameter"  title="Advanced callback parameter editor" >}}

* No callback defined - you don't want any callback for this item
* Function callback with implementation - you want a regular function callback, and you want designer to create the method in the INO file.
* Function callback definition only - you want to implement a regular callback in a file other than the project main / INO sketch, this automatically prepends an "@" to the beginning of the callback such as `@myCallback`. Doing this will result in `myCallback` being declared but not implemented. An example implementation will be provided in the "Code definition if needed", and you should put this into a CPP file somewhere. 
* Runtime renderFn override implementation - you want to be able to override the behaviour of a text or other supported runtime menu type. This is documented more in the runtime menu item section. This will create the callback function in the project INO file.
* Runtime renderFn override definition only - as above, but you want to define the function yourself elsewhere. An example implementation will be provided in the "Code definition if needed", and you should put this into a CPP file somewhere.

NOTE about definition only mode: You will then need to implement the function somewhere yourself or there will be a linker error.

## Important methods available on all menu items

To get the ID of any menu item

    int id = menuItem.getId();  

To get the item name into a character array

    copyNameToBuffer(char* buffer, int bufferSize);
    
To get the sub class type of the MenuItem, useful before casting it:

    MenuType type = menuItem.getMenuType();

To get the EEPROM storage address

    uint16_t position = menuItem.getEeepromPosition();

To get the maximum value for any item

    int maxVal = menuItem.getMaximumValue();
    
Checking if an item has changed or marking it as changed is handled using the changed methods, Note there's also several remote-change flags, remote changed means that the actual value needs to be remotely communicated. Unless you use the silent version of the set... method, the changed and remote flag will be set automatically.

    // set the item changed locally
    menuItem.setChanged(changed);
    // indicate that the item also needs to be sent remotely
    menuItem.setSendRemoteNeededAll();
    
    // check if the menu item is changed
    bool b = menuItem.isChanged(newState);

Menu items can be made read only and therefore cannot be edited, default is false (editable):

    menuItem.setReadOnly(newState);
    bool b = menuItem.isReadOnly();
    
Menu items that are not visible will not be displayed, default is true (visible).

    menuItem.setVisible(isVisible);
    bool b = menuItem.isVisible();
    
Menu items that are local only will never be sent to any remote, default is false (not local):
    
    menuItem.setLocalOnly(bool localOnly);
    bool b = menuItem.isLocalOnly();

## Specific menu item documentation

Core menu item types that others extend from

* [Detailed description of MenuInfo based menu items]({{< relref "based-on-infoblock.md" >}})
* [Detailed description of RuntimeMenuItem based menu items]({{< relref "based-on-runtimemenuitem.md" >}})

Menu item types that you can generate

* [Working with numeric values - AnalogMenuItems]({{< relref "analog-menu-item.md" >}})
* [Working with very large numbers - EditableLargeNumberMenuItem]({{< relref "largenum-menu-item.md" >}})
* [Working with floating point values - FloatMenuItems]({{< relref "float-menu-item.md" >}})
* [Working with fixed choices - EnumMenuItems]({{< relref "enum-menu-item.md" >}})
* [Working with scroll choice items - ScrollChoiceMenuItem]({{< relref "scrollchoice-menu-item.md" >}})
* [Working with boolean values - BooleanMenuItems]({{< relref "boolean-menu-item.md" >}})
* [Working with sub menus - SubMenuItems]({{< relref "sub-menu-item.md" >}})
* [Working with lists of data - RuntimeListMenuItem]({{< relref "list-menu-item.md" >}})
* [Working with text, date, time and IP address items - EditableMultiPartMenuItem]({{< relref "editabletext-menu-item.md" >}})
* [Working with RGB color choices - Rgb32MenuItem]({{< relref "rgb32-menu-item.md" >}})

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 
