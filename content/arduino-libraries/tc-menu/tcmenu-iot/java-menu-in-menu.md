+++
title = "Menu In Menu support for embedded Java on Linux / Raspberry PI"
description = ""
tags = [ "arduino", "sockets", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2022-04-21"
author =  "dave"
menu = "tcmenu-iot"
banner = "/products/arduino-libraries/images/apps/embed-control/menu-in-menu.png"
titleimg = "/products/arduino-libraries/images/apps/embed-control/menu-in-menu.png"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "https://www.thecoderscorner.com/ref-docs/tcmenujavaapi/html/index.html"
weight = 50
toc_needed = true
+++

You can combine many menu structures from different devices into a single menu, this works by each remote menu being represented by a `MenuInMenu` object being associated with a `RemoteConnection` and a `MenuManagerServer`. It maps the remote menu into an unused ID range on the local device and even handles dialog commands. Available from version 2.3 of tcMenu Designer and API.

{{< blockClear "left" >}}

## Menu In Menu range and submenu mapping

Each menu in menu definition that we create results in a remote connection to another device, and the selected sub-menu receiving all the menu items from that device as if they were local menus. To ensure there are no ID overlaps, the IDs of the remote menus are given an offset so they appear unique locally. However, should you alter any of these menu items they will be sent remotely with their original ID.

In the diagram below we have three MenuInMenus, `Device 1` maps all remote item ID by adding 100000 to them and the items appear in the "Device 1 SubMenu" locally. `Device 2` maps all remote item ID by adding 200000 to them and the items appear in the "Device 2 SubMenu" locally, and likewise `Device 3` maps all remote item ID by adding 300000 into the "Device 3 SubMenu" locally. 

{{< figure src="/products/arduino-libraries/images/apps/embed-control/menuInMenuExplainer.jpg" alt="Explaination of menu in menu operation showing ID range and submenu mapping" title="Menu In Menu operation showing ID and submenu mapping" >}}

In addition to the range of IDs we also provide the dialog manager that will be used to forward any dialogs from the remote, the submenu in the local tree where this menu should be replicated, and also the replication mode, there are tree possible modes:

* `REPLICATE_SILENTLY` - this does not tell the manager that the tree has structurally changed, useful only in certain circumstances.
* `REPLICATE_NOTIFY` - this mode notifies of any structural changes
* `REPLICATE_ADD_STATUS_ITEM` - this mode notifies and also creates a boolean menu item representing the state of the connection.

## Creating MenuInMenu connections

If you've not already read it first read the [Embedded Java core documentation]({{< relref "menu-control-with-embedded-java" >}})

## Notes about pairing

You must ensure that the UUID you have chosen is paired with the device as the MenuInMenu system has no means of pairing. Choices are:

* Do not use any authentication.
* Use read only authentication method that is pre-populated with the UUID and name.
* Use the EEPROM authentication but ensure you have already paired with that UUID and name.

## Adding Menu in Menu support via Designer 

MenuInMenu is a first class concept in the designer UI. To edit connections:

First ensure that you have the platform set to "RaspberryPI / Java". This is the only platform to support menu in menu. 

From the "Code" menu select the "Menu In Menu" option, this will present the menu in menu editor shown below:

{{< figure src="/products/arduino-libraries/images/apps/embed-control/menuInMenu-table.jpg" alt="Menu In Menu selection window" title="Menu In Menu selection window" >}}

In the above window the table shows the list of currently set up `MenuInMenu` items for this project. Here you can "Add", "Edit" and "Remove" items. When you add or edit an item the following dialog appears:

{{< figure src="/products/arduino-libraries/images/apps/embed-control/menuInMenu-itemEditor.jpg" alt="Menu In Menu item editor window" title="Menu In Menu item editor" >}}

In the above dialog the fields are as follows:

* **Name** is the name of this item, it will be used as a variable name by removing white space from it. 
* **Type of connection** can either be Socket to create a network connection, or Serial to create any type of Serial connection.
* **SubMenu to put items in** is the place where all the items will appear from the remote menu.
* **Replication mode** is described earlier in this page
* **Offset to add** is the amount to add to all incoming IDs to ensure they are unique
* **Maximum ID Range** is the amount of IDs needed for this remote menu

For Socket connections

* **IP Address / Hostname** is the address of the remote device
* **Port** is the port of which the remote device is listening

For Serial connections

* **Port** is the name of the port to connect to
* **Baud** is the baud rate to start the connection at

### How code generator generates these items

Once created, these items will appear in the "App" class in their own method.

## Adding Menu in Menu support manually

Although you can add MenuInMenu items manually, _it is far easier to add them using designer UI_, however the basic procedure for manual creation is:

1. Ensure you have access to the `MenuManagerServer` and `DialogManager` instances.
2. Create a RemoteServerConnection to the device you want to connect to, for example over RS232 or Socket.
3. Create a MenuInMenu instance based on the above parameters.
4. Start the MenuInMenu instance.

Once started, this will keep the menu from the remote up to date in our local menu. Any changes made to it will be reflected back to the device. This is very useful when combined with embedCONTROL, as the PI can serve up a single web application with the data from all your devices.
