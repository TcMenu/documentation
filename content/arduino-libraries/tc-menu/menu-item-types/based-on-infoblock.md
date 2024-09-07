+++
title = "Detailed description of MenuInfo based menu items"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-10"
author =  "dave"
menu = "menu-item-types"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
toc_needed = true
+++

All types of MenuItem can have an INFO block, which is a structure that can be stored in FLASH that represents the static data for an item. This is because all items directly extend from the MenuItem class, they always have a reference to an AnyMenuInfo block that's stored in program memory on devices that support it. In addition to this, there's [RuntimeMenuItem documented here]({{< relref "based-on-runtimemenuitem.md" >}}) which also has what's called a render callback, where a function is called to help render the item. 

* [See the main menu types page]({{< relref "menu-item-types.md" >}})
* {{< refdocs title="See the reference documentation showing the full hierarchy" src="/tcmenu/html/class_menu_item.html" >}} 

Items that directly extend MenuItem _always_ reference a data block that extends from AnyMenuInfo, at an absolute minimum the core fields defined in this structure must always be provided. For storage there are two options, either store in const/FLASH, on boards that support PROGMEM this will be program memory. Otherwise, they can be stored in RAM. Below we provide the definition this structure.

    struct AnyMenuInfo {
        /** the name given to this menu item */ 
        char name[NAME_SIZE_T];
        /** the identifier for this menu */
        uint16_t id;
        /** eeprom address for this item or -1 if not stored */
        uint16_t eepromAddr;
        /** maximum value that this type can store */
        uint16_t maxValue;
        /** the callback function */
        MenuCallbackFn callback;
    };

We can see that the ID, Name, EEPROM location, maximum value and callback function are all members of the structure. When you call the methods to get items on MenuItem it accesses the members of this structure. Even if the structure is in RAM, never change the ID or EEPROM address after adding the menu item to menu manager.

So after reading the above, we know that we represent items with an subclass of MenuItem, and it will contain an Info structure. This is so that some of the read only information **can** be stored in PROGMEM. 

If the program memory flag is set, then all info structures and their strings must be in PROGMEM on AVR and ESP. MenuItems reside in RAM as they contain state that can change. The designer does this for you automatically. There's also items based upon `RuntimeMenuItem`, these work slightly differently, as described below, but again are memory efficient. 

In designer you can also elect for menu items to store static data in RAM, so it can be adjusted at runtime by simply checking the store in RAM option. 
