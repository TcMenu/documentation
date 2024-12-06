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
referenceDocs = "/tcmenu/html/index.html"
weight = 2
toc_needed = true
+++

Embedded Java for Raspberry PI and Linux works slightly differently to the C++ project creator in that it is a starter project with a webserver and JavaFX UI built in. After project creation you then go about configuring the project how you like, and the designer will keep the menu callbacks up-to-date in the controller, the menu definitions that make up the menu tree, and any menu-in-menu definitions you create.

We will try and add Android support longer term but right now it is tested for Java on a Raspberry PI in kiosk mode. The Java version is well served with remote capabilities offering Serial (USB, Bluetooth, RS232) devices, Ethernet, WiFi and Webserver based protocols. Also, it's easy to write your own additional remote extension points if needed.

## Overview of the embedded Java version

The main components are shown in the diagram below. In the middle we see the `MenuManagerServer` that is the central point, it holds the menu tree, handles updates to the tree, notifies user and UI code when things change, and controls any remote communication. To listen to changes that take place within the manager, we register a `MenuManagerListener` that will receive any updates. For remote control, we register `RemoteServerManager` instances that can create and maintain connections. User interface components are covered in [OpenJFX rendering guide]({{< relref "tcmenu-openjfx-raspberrypi-plugin.md">}}).

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/java-embedded-raspberrypi-high-level.jpg" alt="embedded java on raspberry pi component overview" title="Overview of Embedded Java Components" >}}

An important thing to note here is that unlike with the C++ version, it is highly recommended that you use a "namespace" aka package name in lower case, usually using reverse domain name syntax. For example I may create a project that would start with something like "com.thecoderscorner.example". All the classes in this example would be created in `src/main/com/thecoderscorner/example`.

### Getting started

To get started with a Java project either create a new project within TcMenu Designer `File -> New` and choose the `Java/Raspberry PI` option, note that you must provide a package name. Alternatively, from the command line in the directory where the project should be created - [see CLI documentation]({{< relref "tcmenu-cli-workflow.md" >}}):

    tcmenu create-project -p RASPBERRY_PIJ -n my.package.name ProjectNameNoSpaces

The above command will create a Java starter project called `ProjectNameNoSpaces` under the current directory and the base Java package will be `my.package.name`. [Here is the the starter project](https://github.com/TcMenu/tcmenu-examples-starters/tree/main/java/embeddedJavaDeviceUI) that is used as the starting point. It also contains documentation on how each file works.

## Components of the application

This is a summary of the components, there is a deeper guide within the `README.md` of the created project. You should consult that for a more detailed view. 

### The MenuConfig app-context

Within the Java local application, we configure up all the components using our own very lightweight dependency container, it has far fewer features than most commercial ones, but is very light-weight.  We create a "context" that contains all the classes needed to start the application, it is in the class called `MenuConfig` in your created app. You can add extra bean configurations to this class, you can even change existing ones to add extra parameters / functionality. We will not touch this file after the initial creation so you can adjust as needed.

In summary, any method that is annotated with `@TcComponent` will be executed during initialisation and the resulting object will be added to the "context", it is then available for later use. Any parameters to a method annotated as above will be resolved from the context. The following example is taken from the README of the starter project:

Consider the `MenuConfig` class somewhat like a storage object that can hold instances of objects needed for the running of the application. You can add methods to the class that are annotated with `@TcComponent` and these will be added into the `context`, and any such method can take as many parameters as needed, and the parameters will be automatically wired where possible from the objects already available in the context. Some degree of dependency is allowed and supported. Let's take an example that we a `Car` and that object needs an `Engine`. In the menu config we'd add something like:

    public class MenuConfig extends BaseMenuConfig {
        // other configuration...
        public Engine myEngine() {
            int cylinders = Integer.parseInt(mandatoryStringProp("engine.cylinders"));
            return new Engine();
        }
        public Car myCar(Engine engine) {
            return new Car(engine);
        }
        // other configuration...
    }

### The App java class

The class ending with App in your package is the main class, it will start the application and get everything into a running state. We do not touch this file after project creation.

### The Controller java class

The controller class is where you receive updates as events happen on the menu, either locally or remotely. You can then take action based upon the new state. There are several ways that you can get updates:

1. You can get updates when a particular item changes, to do this we create a method that is annotated with `@MenuCallback(id=n)` where `n` is ID of the menu item. The function should follow the signature `void methodName(Object sender, MenuItem item)`. TcMenu Designer will generate these automatically wherever a callback is defined.
2. There is a callback for changes in every menu item, you can hook into this if you prefer and determine yourself which item is updated by overriding: `void menuItemHasChanged(Object sender, MenuItem item)`.
3. You can handle callbacks from list items by providing an additional parameter as follows `@MenuCallback(id=15, listResult=true)` and in this case we must add a parameter of type `ListResponse listResponse` after the `sender` and `item`, and the response tells you how the interaction with the list ended.
4. You can use the controller to populate scroll choice items. Again designer should do this automatically if it detects a scroll choice item. For this you annotate a method with the `@ScrollChoiceValueRetriever(id=n)` where n is the ID of the menu item. You will receive a callback whenever the scroll choice item needs a value and the signature is: `String myScrollChoiceNeedsValue(ScrollChoiceMenuItem item, CurrentScrollPosition position)`


### The menu definition java class

The menu definition file contains a helper method to get each menu item and also the tree of items for your menu. Don't edit this file, it is recreated at every code generation.

### The pom.xml file

This is the maven build file for the project, it can be used to import the project into most IDEs and also to build the project.

### The application.properties file

This contains definable properties for your application. So that you can have different properties for different environments, most settings for the application context are kept in this file.

### Components that are optional

* `JfxLocalAutoUI` and `LocalTreeComponentManager` provide the local UI, it produces a panel that fills the entire window and represents the menu structure.
* `StatusPanelDrawable` demonstrates how to override drawing with a custom arranged grid for the status submenu. It demonstrates custom drawing too.
* `TcJettyWebServer` and `TcJettyWebSocketEndpoint` both configure and serve up a website that contains EmbedControlJS, which can produce a lightweight remote control application in the browser.

## Working with Menu Manager

Normally, the designer will create a menu manager for us and start it during initialisation. The designer can also add remote control capabilities for most common cases without writing any code. However, should you need to write your own remote control facility, then you implement the `ServerConnectionManager` interface.  
