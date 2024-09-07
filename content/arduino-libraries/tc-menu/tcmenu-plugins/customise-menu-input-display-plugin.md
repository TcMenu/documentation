+++
title = "Customising input and display tcMenu plugins"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2019-07-10"
author =  "dave"
menu = "tc-menu"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 99
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/customise-menu-input-display-plugin/"]

+++

Sometimes the input or rendering capabilities of the built in plugins may suit your purposes, or your hardware may not be supported. In these cases it is possible to either write a custom renderer from scratch, or more likely generate a new `Drawable` in the case of a graphical device.

This article assumes you are customising an input or display renderer plugin, so that it handles input or displays content differently, rather than building one from scratch. Note that this is an advanced topic and requires considerable C++ experience.

{{< blockClear "left" >}} 

## Moving from existing driver to custom driver

Firstly, build your menu along with the display driver for your display. This will put the rendering files into your project that are compatible with your display. It is recommended at this point that you ensure all is working, before moving forward to make any modifications.

Generally the first step is to locate and then rename the renderer header and source file. These will normally contain the name of the underlying driver such as u8g2 for example. You should rename these files in order to avoid them being overwritten by any future operations in the designer UI.

Next in the designer UI's code generator dialog, change the display type to custom display. This means that the designer will no longer manage the display code for you, and you'll be free to adjust as needed.

That's it, at this point you can make adjustments to the renderer safely, without risking the changes being lost by round-tripping with the designer.

## More detail on display drivers

Real world rendering classes extend from one of three base classes, we'll discuss the pros and cons of each here:

* The base renderer `BaseMenuRenderer` is the lowest level, but is lightest on resources, you basically override the `render` function and draw everything yourself. An example of this is the uno version of the LCD renderer.
* The base graphical renderer `BaseGraphicalRenderer` is middle of the road, it takes care of the `render` function for you, works out what fits onto your screen etc. It does not handle the drawing. An exmaple of this is the full version of the LCD renderer.
* Lastly, the `GraphicsDeviceRenderer` does all the drawing, spacing and everything else on your behalf to a `DeviceDrawable` device, we have such drawables for many libraries, it's very easy to implement the drawable as there is no business logic, just drawing commands.

Before trying to modify the class you should probably [read through the API documentation](/ref-docs/tcmenu/html/index.html), especially look at the documentation for the chosen render in detail. Never make changes to files inside tcMenu library, these will be overwritten in future updates.

There's also a dialog class within most renderers that will normally extend from either `BaseDialog` or `MenuBasedDialog`. The API documentation for this is in BaseDialog.h. If you want to also override how dialogs look, you'll need to change the rendering here too.  

## Creating a drawable for an unsupported display

You can choose to create your own drawable now in tcMenu Designer, from code generator, for the display option choose, "Create Drawable for an unsupported display". This will put all the code needed to create a `GraphicsDeviceRenderer` in your menu, and give you an empty drawable to fill in. It's pretty self-explanatory how to fill in the drawable.

## More detail on how menu input works

Most of the input plugins work based on IoAbstraction's switches `SwitchInput` class. It's worth fully understanding this class, as it's used by most input methods in tcMenu. Generally speaking the generator will add code to the `setupMenu()` method that's located in the \<projectName\>_tcMenu.cpp. Do not directly modify this file. Instead, follow the steps below:
  
 * Select no input for the input type in the generator.
 * In the setup of your application prepare your own input facilities.
 * When your equivalent of the OK button is pressed, call `menuMgr.onMenuSelect(buttonHeld);` where button held indicates if the button is held down.
 * The standard renderer is based on values being chosen based on values between 0 and a maximum value. Generally this is done by a rotary encoder (or a simulation thereof). If you are not using a rotary encoder you'd probably still need to implement `RotaryEncoder` using the interface to capture the changes in range when menus are selected or editing starts. See the [IoAbstraction documentation](/ref-docs/ioabstraction/html/index.html) around rotary encoders.
 
 [Back to tcMenu main page]({{< relref "tc-menu" >}}) 