+++
title = "TcMenu - DfRobot input and display plugin"
description = ""
tags = [ "arduino", "button-press", "display-driver", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2019-06-14"
author =  "dave"
menu = "tcmenu-plugins"
banner = ""
titleimg = ""
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
+++

DfRobot input and display plugin make generating a menu for DfRobot shields very simple. There's no configuration needed in order to produce a menu. This plugin auto configures the display to use LiquidCrystalIO library and sets up switches to use the micro-switches connected to analog input A0. 

## Setting up for your menu

First, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, to the right of the current input type will be a button named "Change". Click this button and choose one of the following new drivers by clicking select on the right.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/df-robot-shield-plugin-options.jpg" alt="DfRobot settings for input and displaying menu" title="DfRobot settings for input and displaying menu" >}}

## Controlling the menu with buttons

DfRobot plugin confiugures everything automatically, so there's no need to do anything other than choose the two options above during code generation. So, ensure your menu structure is saved and then choose Code -> Generate Code from the menu. Once the code generation dialog appears, to the right of the current display type will be a button named "Change". Click this button and choose the following new drivers by clicking select on the right.

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 