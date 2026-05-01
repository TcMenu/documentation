+++
title = "Introduction to fluent menu builder"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2026-04-22"
author =  "dave"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
toc_needed = true
+++

We've added a new fluent menu builder to the library. This builder provides a more intuitive and readable way to construct menus, making it easier for developers to create complex menu structures without requiring the many static definitions of the past. We've added this builder because on most machines with moderate sized menus, the overhead of this method is relatively low.

The main difference is that the fluent API works at runtime, meaning that menu items are allocated from the heap. However, they are generally only allocated once at start-up, with no additional memory allocations beyond initial setup, unless you specifically create extra items after setup completes.

We envisage that most people on 32-bit boards and regular sized menus will prefer this API, over the original static allocation. If you choose to use the fluent API, it is probably best to also use dynamic EEPROM support, which is described next.

## Dynamic EEPROM storage

Dynamic EEPROM storage goes along with the above change, it allows you just ensure the ROM is big enough to store all menu items and then allow the `load` and `save` methods work out where things will reside. You simply set EEPROM location to either `SAVE_TO_ROM` or `DONT_SAVE` and then let the dynamic utility allocate space in the ROM. Each entry looks like below:

| Position | Purpose        | Length |
|----------|----------------|--------|
| 0 - 1    | Item ID        | 2      |
| 2 - 3    | Length of data | 2      |
| 3 - Len  | Item data      | Len    |

Immediately following this item will be the next item, and so on. The disadvantage of this approach is that it is not possible to selectively save to ROM like in location based ROM. However, many newer APIs basically only allow the whole dataset to be written at once.

## Creating a menu builder.

You can see all the possible menu types that can be created by the fluent API in each of the menu item type pages. However, here we show a few common examples and an overview of using this method to get you started.

Generally speaking, you can create a menu builder on the stack locally, and then add items to it. If you use [web based tcmenu designer](https://designer.thecoderscorner.com) to initialise your application it will automatically create a menu builder for you and prepare the menu items you add.

    void myFunction() {
        TcMenuBuilder builder = TcMenuBuilder(&MenuManager::ROOT);
        // use menu builder here        
    }

Nearly all methods in the builder return the builder, so you can chain calls together if you prefer that style. This is the style that TcMenu Designer chooses when it outputs fluent code.

When you start, you are appending menus at whatever level the builder starts with, this is the constructor parameter. In most cases this will be `ROOT`.

To enable dynamic EPPROM saving simply set this before doing anything else with the builder:

```
    builder.usingDynamicEEPROMStorage();
```

## Adding items to the menu

Let's take an example of adding a simple menu item:

```
    builder.floatItem(MENU_MAG_X_ID, "MagX", DONT_SAVE, 1, NoMenuFlags);
```

To add a sub menu item we do this by creating a submenu, adding items to it, and then going back one level using `endSub()`: 

```
   builder.subMenu(MENU_ACCELEROMETER_ID, "Accelerometer", NoMenuFlags, nullptr)
          .floatItem(MENU_MAG_X_ID, "MagX", DONT_SAVE, 1, NoMenuFlags)
          .endSub();

```
## Dealing with menu flags

There are two possibilities for menu flags, either `NoMenuFlags` or providing flags using `MenuFlags()` instead.

For example to make an item readonly, you can provide `MenuFlags().readOnly()`.

## Complex item builders

There are two additional complexities when creating analog or scroll choice items. They create their own builder to build either the Analog or Scroll item, this is because the item is too complex to describe in a single function. Here's an example of analog item construction, notice that we call `endItem()` after the analog parameters are set.

```
    builder.analogBuilder(MENU_TEMP_ID, "Temp", DONT_SAVE, MenuFlags().readOnly(), 0, nullptr)
        .offset(0).divisor(10).step(1).maxValue(2000).unit("C").endItem()
```
