+++
title = "Setting up IO-expanders in the menu designer"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2021-08-28"
author =  "dave"
menu = "tc-menu"
banner = "/products/arduino-libraries/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 2
toc_needed = true
+++

Setting up IO devices has been made much easier as of V2.2 of the designer software. you can now directly edit the IO expander configurations directly within tcMenu.

When we discuss IO devices we are talking about `IoAbstractionRef` objects that refer to either device pins, or any other device such as I2C expanders or shift registers from the [IoAbstraction library]({{< relref "io-abstraction.md" >}}). In order to manage the IO Expanders that are available within a project you can do so from the Code menu -> Show Io Expanders. Once that menu option is selected the following dialog appears:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/io-expander-management-dialog.png" alt="managing IO Expanders in menu designer" title="Managing IO Expanders in menu designer" >}}

From this dialog you can add, edit and remove IO expanders. By default, the "device pins" option is always there, and when you don't want to use any kind of IO expansion device, choose this option. 

Note that if the above dialog is shown from within code generator, it will have an extra "Select" button available, pressing select chooses that IO Expander.

## Choosing an IO Expander from within code generator

In code generator, any properties that require an IO expander will be presented as follows:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/io-expander-in-code-generator.png" alt="IO expander property in code generator" title="IO expander property in code generator" >}}

You cannot type directly in this field, instead you select an IO expander by pressing "Choose IO". At this point the above IO expander management dialog is shown. You can select an expander and the press the "Select" button.

## Adding a new IO Expander

Press the "Add New" button in to start, you'll be presented with a dialog like below.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/create-or-edit-expander-dialog.png" alt="create or edit IO Expanders in menu designer" title="Create/Edit IO Expander dialog" >}}

Firstly, you select the IO expander, at the moment code generator can generate all the code for connection on regular device pins, and also for common I2C devices. However, at the moment, for other cases you use the custom case, where you set up the expander yourself.

### Adding Custom IO

With custom IO, you create a new IO expander choosing the custom option, once you've done this, you'll need to create an expander with the same name in your sketch. The variable you create in your sketch must be global and not marked as static, so that it can be accessed as `extern`.  For example:

    // outside of any function, at global level
    IoAbstractionRef myIoOverI2c = ioFrom8574(0x20, 0);

You would then create the expander as custom, with name `myIoOverI2c`.


### Adding PCF8574 or MCP23017 IO

With the I2C options, you just provide a name, the I2C address and optionally the interrupt pin (or -1 for no interrupt pin). There is nothing further for you to do in this case, the expander will be created by code generator on your behalf. It will use the default I2C option for your board. 

For both options the variable will be exported for you to use as well if you wish, it will be exported as ioexp_{variableName}. For MCP23017, the Open-Drain LOW interrupt mode is assumed.

**NOTE for mbed: continue to manually define I2C expanders as before (using the custom option), as the I2C implementation cannot be guessed, we cannot auto create them for you.**

## Editing an existing IO Expander

To edit an expander, double-click on the item in the manager window, it will pop up for editing, you cannot change the name when editing.

## Removing an IO expander from the project

**Caution, choosing this option will remove the IO Expander irretrievably from the project.**

You can remove any item that is not in use other than the internal device pins option that is always available.

Note: It is possible that during code generation, the in use flag may not be reliable. We only recommend deleting items from the main menu when not using the code generator dialog.
