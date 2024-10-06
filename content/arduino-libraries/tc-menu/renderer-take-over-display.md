+++
title = "Taking over the display from a renderer"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-12"
author =  "dave"
menu = "tc-menu"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-widget-example.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-widget-example.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 2
toc_needed = true
+++

TcMenu allows you to take over the display from the renderer very easily, and once you own the display, you will be called back at regular intervals by the rendering class. During the time that you've taken over the display or presented a dashboard, you're responsible for the user input and rendering. **Please note that you should never update the screen outside of these callbacks**, as doing so would interfere with TcMenu rendering.

{{< blockClear "left" >}}

## Different methods for taking control of the display

There are three choices for custom drawing:

* A functional approach based on providing a callback function that gets called frequently to draw
* An object-oriented approach, where you provide an extension of `CustomDrawing` to the renderer, it gets called at various points in the renderer's lifecycle (reset, start, draw).
* Using the custom `DrawableDashboard` support where you provide one or more dashboard configurations, with the option of further customizing it using a delegate. 

Below we discuss them all in turn.

## 1. Functional approach to take over display

To use a regular function callback to take over the display:

    renderer.takeOverDisplay(myDisplayCallback);
    
In this case you must provide a method with the following signature:

    // This will be called frequently by the renderer class
    // here we give control back when the button is clicked.
    void myDisplayCallback(unsigned int encoderValue, RenderPressMode clicked) {
        // At this point clicked is the status of the select button
        // it can be RPRESS_NONE, RPRESS_PRESSED or RPRESS_HELD
        // encoderValue is the current value of the rotary encoder
    }
    
Once you own the display, the provided function will be called frequently by the renderer, you can check if anything needs drawing, and if so draw it at this point. You also have the current value of the rotary encoder available to you in `encoderValue`, along with the state of the encoder switch in `clicked` which is one of the values listed in the comment above.   

When conditions change such that you no longer need display control:

    renderer.giveBackDisplay();
    
### Functional approach to capturing display timeout / reset
    
You can also add a callback function that will be informed when the menu is reset after timing out, by default this happens after 30 seconds of inactivity. This is useful if you don't want to display the menu all the time. First define the function:

    // this function will be called when the menu becomes inactive.
    void onMenuBeingReset() {
        // for example in here we could take over the display when the
        // menu is inactive.
        renderer.takeOverDisplay(myDisplayFunction);
    }

Then add the function as the callback:

    renderer.setResetCallback(myResetCallback); 

If you want to change the threshold for becoming inactive:

    renderer.setResetIntervalTimeSeconds(newResetTimeInSeconds);

Or even turn off the reset / inactivity support altogether:

    renderer.turnOffResetLogic();

The original purpose of the reset / inactivity support was for complex menus, where if the user left the system deeply nested several menus down, after a timeout it would return to the root of the structure ready for the next user. 

## 2. Object oriented approach to display management

If we extend the class `CustomDrawing` and provide that instance to the renderer, then we can both handle taking over the display and reset events at the same time. {{< refdocs title="See custom drawing class in reference docs" src="/tcmenu/html/class_custom_drawing.html" >}}. Here we present a simple way to extend it.

    class MyCustomDrawing : public CustomDrawing {
    public:
        virtual ~CustomDrawing() = default;

        void reset() override {
            // if we get here the display has been reset because
            // of a timeout of the user interface for example to
            // take over the display
            renderer.takeOverDisplay();
        }

        void started(BaseMenuRenderer* currentRenderer) override {
            // take over display has just been called, and we
            // now need to do any initial activity
            // for example here we may clear the display and 
            // print the title
            lcd.clear();
            lcd.print("Super Device");
        }

        void renderLoop(unsigned int currentValue, RenderPressMode userClick) override {
            // At this point clicked is the status of the select button
            // it can be RPRESS_NONE, RPRESS_PRESSED or RPRESS_HELD
            // encoderValue is the current value of the rotary encoder
            // for example to exit when the user clicks
            if(userClick) renderer.giveBackDisplay();
            // for example to update a menu based on current value of the encoder.
            // don't forget you could call changePrecision in started(..) 
            menuAnalogToAlter.setCurrentValue(currentValue);
        }
    } myDrawingClass;

Once we've created an instance of the class (always at global scope), then we can pass this reference to the renderer as follows:

    renderer.setCustomDrawingHandler(&myDrawingClass);

Then to take over the display, use the no parameter version of the method:

    renderer.takeOverDisplay(); 

## 3. Using the `DrawableDashboard` to draw a dashboard

`DrawableDashboard` makes it possible to create dashboard style views out of menu items with only a few lines of code. Each dash item is basically a menu item that you can choose how it is presented. You can set where they appear on the screen, color, font and how much space to take up. The easiest way to get started is probably to look at one of the examples (such as the SimHub example).

Below is an example dashboard from the `esp32Simhub` example, it is from a racing simulator and contains a few different menu items presented in the dashboard, and also some custom items as well. We'll go through each below.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/themes/tft-dashboard-example.jpg" title="Dashboard example on ILI9431" alt="An example dashboard rendered onto a TFT ILI9431 display" width="200px" >}}

If we look at the above image, we see that it has a very large `N` item on the left which is the value of the current gear menu item, this is using a very large font that can easily be generated using [tcMenu Designers font generator]({{< relref "using-custom-fonts-in-menu.md">}}). To the right we have some more menu items with static text next to them, and at the top, we custom draw the LED matrix. The full example is packaged with [tcMenu library in the examples/esp folder](https://github.com/TcMenu/tcMenuLib/blob/main/examples/esp/esp32SimHub/dashboardSetup.cpp).

To get started, we create a main `DrawableDashboard` object and as it is done only once at startup we normally use `new` to create it. For example:

    mainDashboard = new DrawableDashboard(renderer.getDeviceDrawable(), &renderer, &widgetConnected,
                                          DrawableDashboard::DASH_ON_RESET_CLICK_EXIT);

Where:

* deviceDrawable is generally just taken from the renderer as follows `renderer.getDeviceDrawable()`
* renderer is generally `rederer`
* widget you can also render a title widget in the top right corner
* dashboardMode is one of `DASH_ON_RESET_CLICK_EXIT, DASH_ON_RESET_MANUAL_EXIT, DASH_FULLY_MANUAL, DASH_MANUAL_START_CLICK_EXIT`

You then set the main colors for the dashboard (background and primary foreground):

    mainDashboard->setBaseColors(RGB(0, 0, 0), RGB(220, 220, 220));

Now you can add drawing items for each menu item you want on the dashboard:

To add a drawing item thats based on a menu item we call `addDrawingItem`

    mainDashboard->addDrawingItem(&menuItem, Coord(x, y), &drawingParameters, valueChars,
                                  [overrideTitle = nullptr], [updateTicks = 5]);

Where `menuItem` is the item to present, then the coordinates provided by the `Coord` are the top left, the `drawingParameters` are described below, the valueChars is the width in characters, you can optionally override the title for the item, and optionally set how many ticks the value highlights on update for. Colors are best provided using the `RGB(red, green, blue)` macro using values between 0..255.

The simplest drawing parameters is defined as follows, the colors are fixed, and you can provide alignment (see below) and font:

    DashDrawParameters simpleDrawParameters(fgCol, bgCol, fontPtr, [alignment]);

In addition to above, You can define parameters that highlight the value when the value changes, parameters are as above, but with a highlight background and foreground color:

    DashDrawParametersUpdate updateParameters(fgCol, bgCol, fgUpdateCol, bgUpdateCol, 
                                              fontPtr, [alignment]);

You can define parameters that highlight as integer values change, for example an analog value may turn red when a certain value is reached, this is relevant to Analog, Enum, Boolean and ScrollChoice menu items:

    DashDrawParametersIntUpdateRange::IntColorRange drawColorRanges[] {
        {fgColor1, bgColor1, 0, 50}, // for values from 0..50
        {fgColor2, bgColor2, 51, 100} // for values from 51..100
    };
    DashDrawParametersIntUpdateRange drawParamsWithRanges(fgCol, bgCol,fgUpdateCol, bgUpdateCol,
                    fontPtr, drawColorRanges, numRanges, [alignment]);

You can define parameters for text items that match on equality:

    DashDrawParametersTextUpdateRange::TextColorOverride textRanges[] {
        {"hello", fgCol, bgCol },
        {"bye", fgCol, bgCol }
    };
    DashDrawParametersTextUpdateRange textRangeParams(fgCol, bgCol,fgUpdateCol, bgUpdateCol,
                    fontPtr, textRanges, numRanges, [alignment]);

For alignment the options are:

* `TITLE_LEFT_VALUE_LEFT`
* `TITLE_LEFT_VALUE_RIGHT`
* `NO_TITLE_VALUE_LEFT`
* `NO_TITLE_VALUE_RIGHT` 
* `TITLE_RIGHT_VALUE_LEFT`
* `TITLE_RIGHT_VALUE_RIGHT`

Along with the ability to use a delegate this gives a lot of flexibility in screen drawing outside the regular menu rendering.

## Setting the speed of rendering

You can adjust the number of update cycles per second by calling `setUpdatesPerSecond` on the renderer, it takes place immediately, even if already started.

## Using a delegate to customize the dashboard - ADVANCED

Optionally, you can set a delegate if you want to draw extra things to the display, or need more control around how it opens and closes.

* Step 1 - create a class that extends from `DrawableDashboardDelegate`
* Step 2 - now override the functions you need to handle, see the documentation for the class for the options.
* Step 3 - add the delegate to the dash, `mainDashboard->setDelegate(&myDelegate);`

