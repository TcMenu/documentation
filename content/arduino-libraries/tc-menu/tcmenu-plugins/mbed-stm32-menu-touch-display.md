+++
title = "STM32/mbed LTDC Frame buffer menu touch driver"
description = ""
tags = [ "arduino", "button-press", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2023-02-08"
author =  "dave"
menu = "tcmenu-plugins"
banner = ""
titleimg = ""
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

## STM32 LTDC Frame buffer touch screen support

It is possible to generate an impressive menu application using LTDC via the BSP functions. It has been tested to work fully with mbed on a STM32F429 Disc1 with ILI9341 and touch, but also should work with STM32duino and other screens given the right parameters and setup.

**IMPORTANT NOTE:** It should be noted that using this plugin outside the already tested case of mbed, discovery F429 board would be for advanced users only, and may involve a lot of configuration and setup. We would not be able to help you with such situations apart from integration with TcMenu.

Most of the settings are provided by the BSP library, for the touch screen we only need to provide:

* Orientation settings - see the [Orientation Settings section]({{< relref "touch-screen-calibration-ui.md" >}}) for more details on each option
* Calibration Support - see the [Calibration Settings]({{< relref "touch-screen-calibration-ui.md" >}}) a full explanation of calibration

Further a user level settings header file is included into the project, `BspUserSettings.h` this header file allows you to tweak any required settings, and also to provide implementations for any missing BSP functions that we rely on, there are comments in the header that describe its purpose. This file will be included by the plugin source to drive its configuration.
