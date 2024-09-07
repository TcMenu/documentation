+++
title = "Working with menu structures using the CLI"
description = ""
tags = [ "arduino", "java", "data-comms", "embedded-menu", "library" ]
type = "blog"
date = "2021-05-01"
author =  "dave"
menu = "tc-menu"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/tcmenu-cli-banner.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenujavaapi/html/index.html"
weight = 50
toc_needed = true
+++

<iframe width="95%" height="315" src="https://www.youtube-nocookie.com/embed/hxFJxUFlWWM?start=338" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

From tcMenu 2.1 onwards the designer download also has a CLI available. This CLI can be used to completely round trip menus for those with a UI dislike, or even for small changes for the rest of us. We've optimized the flow so that it works really well with Visual Studio code (VS-code), but most editors would work fairly well. In the youtube video above, the later half of it demos how to use the CLI.

The below guide is broken down into the workflows that are supported, we'd recommend that the first time around you add the TcMenuDesigner app directory to set your path, so you can access the tcmenu command, and add the JSON schema that's in the directory to VS-code at the same time as it makes EMF file editing easier.

{{< blockClear "left" >}}

## Initial setup and overview

At any time you can type one of the sub-commands with no options to get help for example `tcmenu create-item`, you can also type `tcmenu --help` and get a list of sub-commands. Any option in square brackets can be omitted.

To access the CLI on Windows, add the following to your local path (assuming default location):

    "C:\Program Files (x86)\TcMenuDesigner"

To access the CLI on Linux/macOS, add the following to your start up profile script:

    # macOS - default location
    alias tcmenu=/Applications/tcMenuDesigner.app/Contents/MacOS/tcMenuDesigner
    # Linux - default location
    alias tcmenu=/opt/tcmenudesigner/bin/tcMenuDesigner

## To start a UI from the command line

    tcmenu

Run the command with no parameters to start the UI with a new project.

    tcmenu gui [--emf-file file.emf] 

Run the command with the gui parameter to start the UI with the first emf in the directory loaded, or the provided emf file.

## Get the application version

    tcmenu version

Prints the version information and release quality to the console. 

## Create a new project from the CLI 

    tcmenu create-project --platform ARDUINO_AVR [--cpp] [--directory a/directory] projectName

Creates a project in either the entered directory, or the default directory otherwise, in a folder called projectName, with an EMF file and main code file of the same name. You can then change directory into this folder to run the other commands. 

* platform: Any supported platform, you can use the list-platform command indicated below.
* cpp: Create a C++ file instead of INO
* directory: By default the current directory, use this to override.

### Getting a list of platforms

To get the platforms that you can generate a menu for use the list-platforms command

    tcmenu list-platforms

This returns a list of available platforms, there are no parameters to this command.

## Create a template menu item in the EMF file

    tcmenu create-item --type analog --parent id --eeprom AUTO --name "Item Name" [--callback onCallback] [--variable OverrideVarName] [--readonly] [--localonly] [--hide] [--emf-file file.emf]

Create the shell of a new menu item that will be in the right place in the file relative to the provided parent for easy editing. The options are as follows:

* type: one of analog, enum, boolean, submenu, float, action, list, largenum, text, choice, rgb
* parent: the ID of the parent item where this menu item should appear, ROOT is 0. 
* eeprom: can be provided as either NONE, AUTO or a numeric value. 
* name: the name of the item to create, usually provide in quotes.
* variable: use to override the variable name that will be used during generation.
* callback: You can optionally set up the callback function to be used, prepend with @ to define it without implementing.
* readonly: the item cannot be edited
* localonly: the item is only available on the device
* hide: when hidden the item is not rendered.
* emf-file: for advanced cases when you have more than one project in a directory.

## Delete a menu item from the EMF file

    tcmenu delete-item --id id [--recurse] [--emf-file file.emf]

Remove the menu item from the EMF file by its ID. If the item is a submenu, you must provide the recurse option. Be careful! If no emf-file is provided, the first EMF in the project is used.

## Verify if there is any overlap in EEPROM storage

    tcmenu verify [--verbose] [--emf-file file.emf]

Verifies if there is any overlap between menu items EEPROM storage location. If no emf-file is provided, the first EMF in the project is used.

## Generate the code from the command line

    tcmenu generate [--verbose] [--emf-file file.emf]

Runs full code generation including the evaluation of any plugins that are included in the project. If no emf-file is provided on the command line, the first EMF in the project is used. This is the equivalent of running code generator from within the UI.

## EMF file format

An EMF file is nothing more than a JSON file, there is a schema JSON packaged with the designer, check the directory that you installed it to. [You can install this schema into VS code](https://code.visualstudio.com/docs/languages/json) and many other editors.

The absolute core of the document is shown below. The `version` should always be `1.00`, but other than this the other fields can be edited, be careful changing the `applicationUUID` though as it can have unintended consequences when using with IoT. The `codeOptions` may also contain plugin definitions if you use plugins, it's best to use the UI to change these at the moment, or work with plugin code manually yourself.

    {
        "version": "1.00",
        "projectName": "C:\\Users\\dave\\temp\\projTest\\davesProject1\\davesProject1.emf",
        "author": "dave",
        "items": [],
        "codeOptions": {
            "embeddedPlatform": "ARDUINO",
            "applicationUUID": "6fe22458-29cd-4b5d-b4bb-ddc6acd1f971",
            "applicationName": "davesProject1",
            "lastProperties": [],
            "namingRecursive": false,
            "saveToSrc": false,
            "useCppMain": false
        }
    }

Each item will appear within the `items` block, and is structured as follows:

    {
      "parentId": 0,
      "type": "subMenu",
      "item": {
        "secured": false,
        "name": "Accelerometer",
        "id": 4,
        "eepromAddress": -1,
        "functionName": "",
        "readOnly": false,
        "localOnly": false,
        "visible": true
      }
    }

The above example shows a subMenu item, that has a parent of ROOT (root always has an id of 0). It's best to add new items using the `create-item` command, as it will put them in the right place and expose all the fields you need. Likewise, to delete items it's best to use the `delete-item` command.

There is a template create item request for each item type, along with a discussion of the fields in the [menu item types documentation]({{< relref "menu-item-types.md" >}}). Just scroll to the bottom of that document, and a page for each type is linked.