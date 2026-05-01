---
title: "TcMenu - IoT ready menu designer and library for Arduino and mbed"
description: ""
date: "2017-10-11"
author:  "system"
showChildren: false
type: "menu_list"
githublink: "https://github.com/TcMenu/tcMenu"
referenceDocs: "/tcmenu/html/index.html"
banner: "/products/arduino-libraries/images/front/tcMenu-banner.png"
titleimg: "/products/arduino-libraries/images/electronics/arduino/themes/color-blue-example.jpg"
---

TcMenu is a modular, IoT ready multi level menu library for Arduino, mbed, Pico-SDK, mbed and many more platforms supporting many input, display and IoT / remote interfaces. It makes presenting configuration, status and operational information much easier. Apache licensed and therefore safe for commercial use.

Start by [working out what information and state is to be represented](${relRef("menu-item-types.md")}) in the [Designer UI](${relRef("tcmenu-overview-quick-start.md")}). Take inspiration from the [Arduino menu examples](https://github.com/TcMenu/tcMenuLib/tree/main/examples). Then, run [Code Generator](${relRef("code-generator-and-plugins-guide.md")}) which outputs code for the selected board ready for use in an IDE.

${blockClear("left")}



## Embedded Menu for Arduino

Web based menu designer:

* [Start web based TcMenu Turbo designer](https://designer.thecoderscorner.com/)
* [Documentation for Web based TcMenu Turbo](${relRef("tcmenu-designer.md")})
* [Get help from the C++/Java/Flutter consultants who wrote tcMenu](https://www.thecoderscorner.com/support-services/consultancy/)

Using Tc menu library:

* [TcMenu library examples and starter projects](https://github.com/TcMenu/tcMenuLib/tree/main/examples)
* [Guide to working with Menu Item Types](${relRef("menu-item-types.md")})
* [Code Generator and plugins guide](${relRef("code-generator-and-plugins-guide.md")}) 
* [EEPROM integration with menus](${relRef("menu-eeprom-integrations.md")})
* [Setting up IO expanders in designer](${relRef("setting-up-io-expanders-in-menu-designer.md")})
* [Authentication - securing sub-menus and remote connections](${relRef("secure-menuitem-pins-and-remotes.md")})
* [Creating and generating menus using the CLI](${relRef("tcmenu-cli-workflow.md")})
* [MenuManager and Menu iteration Guide](${relRef("menumanager-and-iteration.md")})
* [Writing a multi-language locale based menu](${relRef("multi-language-locale-menu.md")})
* [Useful helper functions in tcUtil.h](${refdocs("/tcmenu/html/tc_util_8h.html")})
* [Embedded library reference documentation](${refdocs("/tcmenu/html/index.html")})
* [GitHub Repository - for source and releases](https://github.com/TcMenu/tcMenu)
* [Major code level differences between library versions](${relRef("major-differences-between-library-versions.md")})

Desktop version of the menu designer

* [TcMenu - Getting started, including video & slides](${relRef("tcmenu-overview-quick-start.md")})

### Menu library for vendor environments using CMake (non Arduino)

You can use PicoSDK without requiring Arduino framework at all. The opensource version of IoAbstraction supports PicoSDK directly for nearly all cases. Our direct support generally works via CMake, and the starting point for these builds is [our CMake based project](https://github.com/TcMenu/tcLibraryDev) in the `cmakeProject` directory. If you're using this commercially, please contact us for commercial support.

We can support other platforms such as ESP-IDF and STM32 using this approach commercially.

## Working with displays

* [Working with display renderers](${relRef("rendering-with-tcmenu-LCD-TFT-OLED.md")})
* [Creating and using TitleWidgets and bitmaps](${relRef("creating-and-using-bitmaps-menu.md")})
* [Themes, properties, grids and card layout](${relRef("rendering-with-themes-icons-grids.md")})
* [How to define fonts within theme configuration](${relRef("using-custom-fonts-in-menu.md")})
* [Taking over the display and dashboards](${relRef("renderer-take-over-display.md")})

## Display plugins

* [DfRobot LCD shield driver](${relRef("dfrobot-input-display-plugin.md")})
* [LiquidCrystal / hd44780 display driver](${relRef("liquidcrystalio-hd44780-renderer-plugin.md")})
* [AdaFruit_GFX driver - ILI9341, ST7735, Nokia5110 etc](${relRef("adafruit_gfx-renderer-plugin.md")})
* [AdaFruit_GFX NativeCpp/PicoSDK/mbed RTOS for OLED - SSD1306, SH1106](${relRef("adafruit_mbed-renderer-plugin.md")})
* [U8g2 driver - for SSD1306, SH1106 etc](${relRef("u8g2-renderer-plugin.md")})
* [SSD1306Ascii low memory driver - for SSD1306 on Uno](${relRef("ssd1306ascii-display-plugin.md")})
* [TFT_eSPI driver with double buffering](${relRef("tft_espi-renderer-plugin.md")})
* [STM32 LTDC mbed frame buffer with touch](${relRef("mbed-stm32-menu-touch-display.md")})
* [Customising a display driver](${relRef("customise-menu-input-display-plugin.md")})

## Theme plugins

* [OLED/Mono themes both bordered and inverse](${relRef("monochrome-themes-for-oled-5110.md")})
* [Color themes for most display sizes](${relRef("color-themes-for-all-display-sizes.md")})
* [Dark themes for most display sizes](${relRef("dark-themes-for-all-display-sizes.md")})

## Input plugins

* [Rotary encoder, buttons or joystick](${relRef("encoder-switches-input-plugin.md")})
* [Using a matrix keyboard to control menu](${relRef("menu-control-using-matrix-keyboard.md")})
* [DfRobot analog pin keypad input](${relRef("dfrobot-input-display-plugin.md")})
* [Resistive touch screen menu integration](${relRef("resistive-touch-screen-plugin.md")})
* [XPT2046 and FT6206 touch screen menu integration](${relRef("ft6206-xt2046-touch-screen-plugin.md")})
* [Capacitive Touch-pad sensor input](${relRef("touch-pad-sensor-plugin.md")})

### Specific for Java on Raspberry PI or embedded Linux

We have tested the designer application and embedCONTROL on a Raspberry PI, so not only can you make a Raspberry PI embedded application, you can even run designer and embedCONTROL on an RPI as well! The Java API and EmbedControl libraries are fully JavaDoc commented.

* [Creating an embedded Java menu application for RaspberryPI](${relRef("menu-control-with-embedded-java.md")})
* [Display menu on JavaFX/OpenJDK on Raspberry PI](${relRef("tcmenu-openjfx-raspberrypi-plugin.md")})
* [Menu In Menu - Embed remote menus into a single app](${relRef("java-menu-in-menu.md")})

## Remotely controlling your menu / IoT

<img class="pull-left" src="/products/arduino-libraries/images/apps/embed-control/mainicon.png" width="120" alt="IoT control with embedCONTROL" > Our menu designer can build in IoT capabilities near automatically (on Ethernet2, UipEthernet (ENC28J60), ESP8266-WiFi, ESP32-WiFi, Bluetooth and Serial). Allowing you to [remotely monitor and control your device using Embed Control](https://www.thecoderscorner.com/products/apps/embed-control/) with minimal effort.

However, to write your own remote monitoring, use our [Java Remote API](${relRef("tcmenu-java-api-to-arduino-remote-control.md")}), [TypeScript/JavaScript API](https://github.com/TcMenu/embedcontrolJS), [C#/DotNet API](https://github.com/TcMenu/tcmenu-dotnet-sdk), or the [Python API](https://github.com/TcMenu/tcmenu-python-api). Coming soon is a Dart API.

${blockClear("left")}

* [embedCONTROL UI documentation](https://www.thecoderscorner.com/products/apps/embed-control/)
* [Menu library remote connectivity tutorial](${relRef("menu-library-remote-connectivity.md")})
* [IoT monitoring and control using the Java API](${relRef("tcmenu-java-api-to-arduino-remote-control.md")})
* [TagVal protocol documentation](${relRef("embed-control-tagval-wire-protocol.md")})

### IoT and Remote control plugins

* [Serial driver for usb, rs232 and Bluetooth control](${relRef("serial-remote-plugin.md")})
* [Ethernet driver for Ethernet2 and Uip control](${relRef("ethernet-remote-plugin.md")})
* [WiFi driver for ESP32 and ESP8266 control](${relRef("esp-wifi-remote-plugin.md")})
* [Simhub connector for tcMenu using custom serial protocol](${relRef("simhub-connector.md")})
* [Embedded Java plugin for ethernet/WiFi remote](${relRef("embedded-java-ethernet-wifi.md")})
* [Serving up embedCONTROL in a web browser](${relRef("embedcontroljs-webserver-plugin.md")})
* [Device acts as client to remote server](${relRef("connect-to-remote-server-plugin.md")})

## Creating / building / modifying plugins

* [Creating plugins for use with TcMenu](https://github.com/TcMenu/tcMenu/tree/main/xmlPlugins)
