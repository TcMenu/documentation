---
title: "TcMenu - IoT ready menu designer and library for Arduino and mbed"
description: ""
date: "2017-10-11"
author:  "system"
showChildren: false
type: "category"
githublink: "https://github.com/davetcc/tcMenu"
referenceDocs: "/ref-docs/tcmenu/html/index.html"
banner: "/products/arduino-libraries/images/front/tcMenu-banner.png"
titleimg: "/products/arduino-libraries/images/electronics/arduino/themes/color-blue-example.jpg"
menu:
    main:
        name: 'TcMenu Framework'
        identifier: 'tc-menu'
        parent: 'arduino-libraries'
        weight: 1
---

TcMenu is a modular, IoT ready multi level menu library for Arduino, mbed and many more platforms supporting many input, display and IoT / remote interfaces. It makes presenting configuration, status and operational information much easier. It is Apache licensed and commercial support is available from us.

Start by [working out what information and state is to be represented]({{< relref "menu-item-types.md" >}}) in the [Designer UI]({{< relref "tcmenu-overview-quick-start.md" >}}). Take inspiration from the [Arduino menu examples](https://github.com/davetcc/tcMenuLib/tree/master/examples). Then, run [Code Generator]({{< relref "code-generator-and-plugins-guide.md" >}}) which outputs code for the selected board ready for use in an IDE.

{{< blockClear "left" >}}



## Menu library core documentation for Arduino 

* [TcMenu - Getting started, including video & slides]({{< relref "tcmenu-overview-quick-start.md" >}})
* [tcMenu Designer releases page](https://github.com/davetcc/tcMenu/releases)
* [TcMenu library examples and starter projects](https://github.com/davetcc/tcMenuLib/tree/master/examples)
* [Commercial Support provided by the maintainers](https://www.thecoderscorner.com/support-services/training-support/)
* [Get help from the C++/Java/Flutter consultants who wrote tcMenu](https://www.thecoderscorner.com/support-services/consultancy/)
* [Guide to working with Menu Item Types]({{< relref "menu-item-types.md" >}})
* [Code Generator and plugins guide]({{< relref "code-generator-and-plugins-guide.md" >}}) 
* [EEPROM integration with menus]({{< relref "menu-eeprom-integrations.md" >}})
* [Setting up IO expanders in designer]({{< relref "setting-up-io-expanders-in-menu-designer.md" >}})
* [Authentication - securing sub-menus and remote connections]({{< relref "secure-menuitem-pins-and-remotes.md">}})
* [Creating and generating menus using the CLI]({{< relref "tcmenu-cli-workflow.md">}})
* [MenuManager and Menu iteration Guide]({{< relref "menumanager-and-iteration.md" >}})
* [Writing a multi-language locale based menu]({{< relref "multi-language-locale-menu.md" >}})
* [Useful helper functions in tcUtil.h](https://www.thecoderscorner.com/ref-docs/tcmenu/html/tc_util_8h.html)
* [Embedded library reference documentation](/ref-docs/tcmenu/html/index.html)
* [GitHub Repository - for source and releases](https://github.com/davetcc/tcMenu)
* [Major code level differences between library versions]({{< relref "major-differences-between-library-versions.md" >}}) 
* {{< library-overview >}}

### Menu library for vendor environments using CMake (non Arduino)

There are commercially available versions of our libraries that have been tuned to vendor provided environments such as ESP-IDF, STM32Cube and PicoSDK. With these you can purchase version with stronger testing and even indemnification, that do not need an Arduino or mbed environment present. The "standard" PicoSDK version is even open-soured, and all the libraries can build with the CMake build tool, the starting point for these builds is [CMake based library build](https://github.com/davetcc/tccLibSdk). Please contact us using the contact option in the menu or see the [consultancy and support options available](https://www.thecoderscorner.com/support-services/consultancy/).

### Specific for Java on Raspberry PI or embedded Linux

We have tested the designer application and embedCONTROL on a Raspberry PI, so not only can you make a Raspberry PI embedded application, you can even run designer and embedCONTROL on an RPI as well!

* [Creating an embedded Java menu application for RaspberryPI]({{< relref "menu-control-with-embedded-java.md" >}})
* [Display menu on JavaFX/OpenJDK on Raspberry PI]({{< relref "tcmenu-openjfx-raspberrypi-plugin.md" >}})
* [Menu In Menu - Embed remote menus into a single app]({{< relref "java-menu-in-menu.md" >}})
* [Java IoT API reference documentation](https://www.thecoderscorner.com/ref-docs/tcmenujavaapi/html/annotated.html)
* [embedCONTROL Core API reference documentation](https://www.thecoderscorner.com/ref-docs/embedcontrol-core/html/annotated.html)

## Display plugins

* [Working with display renderers]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md" >}})
* [Creating and using TitleWidgets and bitmaps]({{< relref "creating-and-using-bitmaps-menu.md" >}})
* [Themes, properties, grids and icons]({{< relref "rendering-with-themes-icons-grids.md" >}})
* [How to define fonts within theme configuration]({{< relref "using-custom-fonts-in-menu.md" >}})
* [Taking over the display]({{< relref "renderer-take-over-display.md" >}})
* [DfRobot LCD shield driver]({{< relref "dfrobot-input-display-plugin.md" >}})
* [LiquidCrystal / hd44780 display driver]({{< relref "liquidcrystalio-hd44780-renderer-plugin.md" >}})
* [AdaFruit_GFX driver - ILI9341, ST7735, Nokia5110 etc]({{< relref "adafruit_gfx-renderer-plugin.md" >}})
* [AdaFruit_GFX mbed RTOS for OLED - SSD1306, SH1106]({{< relref "adafruit_mbed-renderer-plugin.md" >}})
* [U8g2 driver - for SSD1306, SH1106 etc]({{< relref "u8g2-renderer-plugin.md" >}})
* [SSD1306Ascii low memory driver - for SSD1306 on Uno]({{< relref "ssd1306ascii-display-plugin.md" >}})
* [TFT_eSPI driver with double buffering]({{< relref "tft_espi-renderer-plugin.md" >}})
* [STM32 LTDC mbed frame buffer with touch]({{< relref "mbed-stm32-menu-touch-display.md" >}})
* [Customising a display driver]({{< relref "customise-menu-input-display-plugin.md" >}})

## Theme plugins

* [OLED/Mono themes both bordered and inverse]({{< relref "monochrome-themes-for-oled-5110.md" >}})
* [Color themes for most display sizes]({{< relref "color-themes-for-all-display-sizes.md" >}})
* [Dark themes for most display sizes]({{< relref "dark-themes-for-all-display-sizes.md" >}})

## Input plugins

* [Rotary encoder, buttons or joystick]({{< relref "encoder-switches-input-plugin.md" >}})
* [Using a matrix keyboard to control menu]({{< relref "menu-control-using-matrix-keyboard.md" >}})
* [DfRobot analog pin keypad input]({{< relref "dfrobot-input-display-plugin.md" >}})
* [Resistive touch screen menu integration]({{< relref "resistive-touch-screen-plugin.md" >}})
* [XPT2046 and FT6206 touch screen menu integration]({{< relref "ft6206-xt2046-touch-screen-plugin.md" >}})
* [Capacitive Touch-pad sensor input]({{< relref "touch-pad-sensor-plugin.md" >}})

## Remotely controlling your menu / IoT

<img class="pull-left" src="/products/arduino-libraries/images/apps/embed-control/mainicon.png" width="120" alt="IoT control with embedCONTROL"/>Our menu designer can build in IoT capabilities near automatically (on Ethernet2, UipEthernet (ENC28J60), ESP8266-WiFi, ESP32-WiFi, Bluetooth and Serial). Allowing you to [remotely monitor and control your device using Embed Control](https://www.thecoderscorner.com/products/apps/embed-control/) with minimal effort.

However, to write your own remote monitoring, use our [Java Remote API]({{< relref "tcmenu-java-api-to-arduino-remote-control.md" >}}), [TypeScript/JavaScript API](https://github.com/davetcc/embedcontrolJS), [C#/DotNet API](https://github.com/davetcc/tcmenu-dotnet-sdk), or the [Python API](https://github.com/davetcc/tcmenu-python). Coming soon is a Dart API.

{{< blockClear "left" >}}

* [embedCONTROL UI documentation](https://www.thecoderscorner.com/products/apps/embed-control/)
* [Menu library remote connectivity tutorial]({{< relref "menu-library-remote-connectivity.md" >}})
* [IoT monitoring and control using the Java API]({{< relref "tcmenu-java-api-to-arduino-remote-control.md" >}})
* [Java IoT API reference documentation](/ref-docs/tcmenujavaapi/html/index.html) 
* [TagVal protocol documentation]({{< relref "embed-control-tagval-wire-protocol.md" >}})

### IoT and Remote control plugins

* [Serial driver for usb, rs232 and Bluetooth control]({{< relref "serial-remote-plugin.md" >}})
* [Ethernet driver for Ethernet2 and Uip control]({{< relref "ethernet-remote-plugin.md" >}})
* [WiFi driver for ESP32 and ESP8266 control]({{< relref "esp-wifi-remote-plugin.md" >}})
* [Simhub connector for tcMenu using custom serial protocol]({{< relref "simhub-connector.md" >}})
* [Embedded Java plugin for ethernet/WiFi remote]({{< relref "embedded-java-ethernet-wifi.md" >}})
* [Serving up embedCONTROL in a web browser]({{< relref "embedcontroljs-webserver-plugin.md" >}})

## Creating / building / modifying plugins

* [Creating plugins for use with TcMenu](https://github.com/davetcc/tcMenu/tree/master/xmlPlugins)
