+++
title = "Embedded Java for Raspberry PI and other embedded Linux"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2022-04-02"
author =  "dave"
menu = "tc-menu"
banner = ""
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 2
toc_needed = true
+++

Embedded Java for Raspberry PI and embedded Linux is supported from V2.3 onwards directly from the designer UI. We are building out the number of UI options, but presently No Local UI and JavaFX are supported, we will try and add Android longer term. The Java version is well served with remote capabilities offering Serial (USB, Bluetooth, RS232) devices, Ethernet, WiFi and Webserver based protocols. Also, it's easy to write your own additional remote extension point if needed.

## Overview of the embedded Java version

The main components are shown in the diagram below. In the middle we see the `MenuManagerServer` that is the central point, it holds the menu tree, handles updates to the tree, notifies user and UI code when things change, and controls any remote communication. To listen to changes that take place within the manager, we register a `MenuManagerListener` that will receive any updates. For remote control, we register `RemoteServerManager` instances that can create and maintain connections. User interface components are covered in [OpenJFX rendering guide]({{< relref "tcmenu-openjfx-raspberrypi-plugin.md">}}).

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/java-embedded-raspberrypi-high-level.jpg" alt="embedded java on raspberry pi component overview" title="Overview of Embedded Java Components" >}}

An important thing to note here is that unlike with the C++ version, it is highly recommended that you use a "namespace" aka package name in lower case, usually using reverse domain name syntax. For example I may create a project that would start with something like "com.thecoderscorner.example". All the classes in this example would be created in `src/main/com/thecoderscorner/example`.

Maven is used as the build system by default. It is set up automatically with the dependencies for your project. You can switch to using Gradle for the build system, but the designer will not automatically add dependencies. Read about [maven build system here](https://maven.apache.org/guides/) and probably start with one of the two getting started guides.

### Reference documentation

All the classes discussed here are documented, a few key entry points into the reference docs are linked below. Note that this documentation is taken from the source, so most Java IDEs should show it.

* [Using the JavaAPI guide]({{< relref "tcmenu-java-api-to-arduino-remote-control.md">}})
* [JavaAPI ref docs](https://www.thecoderscorner.com/ref-docs/tcmenujavaapi/html/annotated.html)
* [embedCONTROLCore ref docs](https://www.thecoderscorner.com/ref-docs/embedcontrol-core/html/annotated.html)

## Components of the application

### The MenuConfig app-context

Within the Java local application, we configure up all the components using a [Spring Container](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html), we create an application context that contains all the classes needed to start the application, it is in the class called `MenuConfig` in your created app. You can add extra bean configurations to this class, you can even change existing ones to add extra parameters / functionality, just don't change their method name, as that is how code generator detects that they are there.

### The App java class

The class ending with App in your package is the main class, it will start the application and should not be edited, it will regenerate completely every time generator is run. 

### The Controller java class

This class contains the mappings for your menu items. You can register as manu controllers as you want, and manually map events to them as discussed below. This controller is automatically added to the menu manager at start up.

You can create additional `MenuManagerListener` objects at runtime if you wish to further split things up. To do this, simply do not provide a callback in the designer UI, and then manually add it to another controller.

### The menu definition java class

The menu definition file contains a helper method to get each menu item and also the tree of items for your menu. Don't edit this file, it is recreated at every start up.

### The pom.xml file

This is the maven build file for the project, in most cases, the dependencies will automatically be added as you add additional plugins.

### The application.properties file

This contains definable properties for your application. So that you can have different properties for different environments, most settings for the application context are kept in this file.

### Any plugins that are included

As you include plugins, any files needed by the plugins will reside in the `plugins` package of your application. These are specific to each item and should not be edited.

## Working with Menu Manager

Normally, the designer will create a menu manager for us and start it during initialisation. The designer can also add remote control capabilities for most common cases without writing any code. However, should you need to write your own remote control facility, then you implement the `ServerConnectionManager` interface.  

