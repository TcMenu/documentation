+++
title = "Control menus with embedCONTROL.JS from a webserver"
description = ""
tags = [ "arduino", "sockets", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2022-04-14"
author =  "dave"
menu = "tcmenu-iot"
titleimg = "/products/arduino-libraries/images/apps/embed-control/embedCONTROLJS.png"
banner = "/products/arduino-libraries/images/apps/embed-control/embedCONTROLJS.png"
githublink = "https://github.com/davetcc/embedcontrolJS"
referenceDocs = "/ref-docs/embedcontrol-core/html/index.html"
weight = 50
toc_needed = true
+++

Available from 2.3 onwards.

On larger embedded devices you can serve up embedCONTROL.JS from a web browser. It allows you to remotely control and monitor the menu items from a web page on any device that can run a web browser. It is a single page web application based on React.JS. It supports the most important functions from the full embedCONTROL application, having the advantage of not needing any installation.

In summary, to access the page, you'd simply go to a web-browser and enter the address of your device. The application will be immediately served up and will pair if needed. You can read more background material and the user guide: [Controlling embedded apps with embedCONTROL](https://www.thecoderscorner.com/products/apps/embed-control/).

## Webserver options for ESP32 boards

On ESP32 we require that you use the [ESP32 Async Web Server library](https://github.com/me-no-dev/ESPAsyncWebServer) and this should be installed either via library manager or manually. Once that is installed, you then choose the appropriate plugin for your board from code generator. For ESP32 the code generator plugin is the "ESP webserver browser based app" option.

### Use prepackaged application property

There are two options for the actual web-app source, IE the html, images, js and images:

* Ticked - We serve up gzipped versions of all files using the most recent release version of embedCONTROL.JS.
* Unticked - You will manually provide the files or request handlers yourself, if you're using a customized version of the app. See https://github.com/davetcc/embedcontrolJS for instructions.

### Concurrent connections property

Each connection uses memory to store the state and for buffers. Although ESP devices have adequate RAM for this purpose, you set the number of connections allowed upfront, and we create the objects globally.

### Websocket endpoint

Unless you have modified the source, or know the websocket is on a different endpoint, leave this set to the default value.

### Webserver port

Normally left at port 80. This is the port on which the webserver runs.

### Accessing the application

If your device were on IP address `192.168.2.4` for example, and the port were `80`, you'd simply type <pre>http://192.168.2.4/index.html</pre> into the browser address bar.

## Jetty Webserver version for Raspberry PI


## WebSocket with static hosting for Raspberry PI

