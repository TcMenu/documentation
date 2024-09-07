+++
title = "Integrating EEPROM support into menu applications"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2021-08-14"
author =  "dave"
menu = "tc-menu"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/eeprom-title-board.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 2
toc_needed = true
+++

[IoAbstraction EEPROM support]({{< relref "eeprom-impl-seamless-8-and-32-bit.md" >}}) can be integrated into your menu application, it can be used to load and store menu item values, authentication and also [choice menu items]({{< relref "scrollchoice-menu-item.md" >}}) that are using EEPROM storage. Menu Manager makes it very easy to save values to EEPROM between runs. Each menu item can optionally have a storage point in the EEPROM area (-1 / 0xffff means not stored). Any items that have a valid EEPROM address will be persisted upon calling the `save` function on menuMgr, and similarly, will be read back by calling `load`.

    void menuMgr.load(magicKey = 0xfade, firstRunCallback = NULL);
    void menuMgr.save(magicKey = 0xfade);

Where:

* magicKey this value is stored in the first two bytes of the ROM and then read back before loading. If the values do not match, no loading takes place.
* firstRunCallback is a task manager task that only called when the magic key does not match, to make any preparations needed.

NOTE: during `load()` the menu item callbacks are NOT run, this leads to instability because `load` is often called long before the application is fully initialised. We recommend your app should not rely on this behaviour. However, should you wish to run the callbacks, you do so manually once your application is fully loaded, and the examples show how to do this.

## Setting up EEPROM support in TcMenu Designer

From version 2.2 onwards EEPROM support can be added to you project by the designer UI. To change the EEPROM type used by your project, open the code generator and choose the "Change EEPROM" button highlighted in the image below.

{{< figure src="/products/arduino-libraries/images/apps/tcmenu/codegen-rom-auth-selection.jpg" alt="code generator authenticator area" title="Code generator - authenticator and eeprom settings" >}}

Once you click on the above button, the following dialog will appear, where you can configure the type of EEPROM required:

{{< figure src="/products/arduino-libraries/images/apps/tcmenu/codegen-choose-eeprom.jpg" alt="code generator EEPROM area" title="Code generator - EEPROM settings dialog" >}}

* No EEPROM - do not set an EEPROM, in this case you must not call load or save, use an EEPROM Authenticator, or any EEPROM based choice items.
* AVR EEPROM - use AVR direct EEPROM functions, the lightest option for AVR based boards.
* EEPROM class - use the `EEPROM` class that some boards support, you must call `EEPROM.begin(..)` before calling `setupMenu`. This is generally the best option for ESP boards.
* Use an I2C AT24Cx based ROM - use an I2C ROM by providing the I2C address and also the ROM page size. This will do everything apart from call `Wire.begin()` which should be done before calling `setupMenu` when required.
* Battery backed RAM on STM32 - this uses the BSP driver to access the battery backed RAM on supported STM32 boards. Tested on STM32F429 and STM32F439. 

Any EEPROM selected by this method will be registered with menuMgr automatically during the `setupMenu()` call.

## Choosing between legacy and size based EEPROM support

From 3.1 there is a new option on the application information page that allows you to choose between size based EEPROM loading/saving and traditional loading and saving. To change between the two, simple select the Root menu item, and then in the information panel there is checkbox to switch between modes. 

Note that if you change this option, then you will need to manually transition between the two states. 

**Size based** mode saves an extra two bytes after the magic key, meaning for new menus the starting location is 4. These two additional bytes hold the maximum location ever written to during save. Then during load, nothing above this location will be loaded back, meaning that new items that have a higher location than the save point will not load from EEPROM, instead they will retain their default value.   

**Legacy mode** saves only the magic key and then menus can start at location 2. It is however your responsibility to ensure that when new menu items are added, that you migrate between the two, using a new magic key or similar approach. The above size based mode has been added to handle most simple cases without the need for migrations.

You can also switch between modes directly in code:

    setSizeBasedEEPROMStorageEnabled(bool enable);

Where enable controls if size based save/load should be enabled or not.

## Loading and saving single menu items

You can load and save single items, there are two global functions to allow this:

    bool ok =  loadMenuItem(eeprom, theItem, magicKey = 0xfade);
    saveMenuItem(eeprom, theItem);

Get the EEPROM from menu manager using `menuMgr.getEepromAbstraction()`, and provide a pointer to a single menu item.

## Setting up EEPROM support manually

It's usually best to use the inbuilt support in TcMenu Designer as described above. However, you can also manually add the support too. In order to use any EEPROM functions, or to use EEPROM based choice menu items, you need to set up an EepromAbstraction and provide a pointer to `menuMgr` using `setEepromRef`. For details of how to create an EepromAbstraction see [AVR and Arduino EEPROM example](https://github.com/TcMenu/IoAbstraction/blob/main/examples/avrEepromExample/avrEepromExample.ino) and [I2C AT24 EEPROM example](https://github.com/TcMenu/IoAbstraction/blob/main/examples/i2cEepromExample/i2cEepromExample.ino).

    // before making any call to load or save, or before using ChoiceMenuItems
    menuMgr.setEepromRef(eepromPtr);
 

## Loading or saving a single menu item

In order to load or save single items include the following header

    #include <EepromItemStorage.h>

This includes the helper functions used by menu manager, that allow for working with EEPROM storage, note that saving a single item requires TcMenu 3.0 or above.

    bool loadMenuItem(EepromAbstraction* eeprom, MenuItem* theItem, uint16_t magicKey = 0xfade);
    void saveMenuItem(EepromAbstraction* eeprom, MenuItem* theItem);

Where

* eeprom is the EEPROM abstraction, in most cases use `menuMgr.getEepromAbstraction()` for this.
* theItem is a pointer to the item to be saved/loaded.
* magicKey is as above.

NOTE on single save it is assumed that the magic key has been written out at some point in the past by using the full save feature.

## Special cases and other details

See the {{< refdocs title="reference docs about EeepromAbstraction" src="/ioabstraction/html/class_eeprom_abstraction.html" >}}

Should you need to use EEPROM functions before initialisation, you can set the root menu item before initialise for this special case. In this case, should need to use the menuMgr load function, as you must either set the EEPROM reference yourself as above, or  call the overload of the load function that takes a pointer to an EepromAbstraction. 

    menuMgr.setRootMenu(rootItem);

A frequent question that is asked is 'how should I call save to ensure that all menu item state is stored'. The best way to do this is to use a [power loss detection circuit](https://www.thecoderscorner.com/electronics/microcontrollers/psu-control/detecting-power-loss-in-powersupply/) and call save in that call back. The second best is to have a timed function (maybe once every 10 minutes) along with a commit handler that detects changes. Never call save in the menu item callback, *if using a rotary encoder that would break your EEPROM in days.* 

