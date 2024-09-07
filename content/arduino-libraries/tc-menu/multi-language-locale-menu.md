+++
title = "Multi language locale based menu for Arduino and mbed"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2023-05-30"
author =  "dave"
menu = "tc-menu"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-locale-language-configure.png"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 2
toc_needed = true
+++

TcMenu 4.0 onward supports multi-language menus based on [resource bundles](https://www.baeldung.com/java-resourcebundle) which are effectively properties files containing language translations. The designer lets you set up translations on a per-locale basis for the app name, each menu item, and even for additional strings in your application. Once enabled the properties files are turned into a series of C++ include header files that you can choose between using a TC_LOCALE_?? setting described below.

## Enabling and setting up languages

To enable the bundle support, or setup additional languages from the "Code" menu select "Configure Locales". This will bring up the following dialog where you can add and remove locales from the list of available languages. Please note that designer will not erase locale files that already exist to avoid accidental data loss.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-locale-language-configure.png" alt="Configure locale dialog showing enabled and available locales" title="Locale Configuration dialog" >}}

### Adding and removing languages

To select a locale choose the language first, and then if required you can add a country as well, once both are selected click the ">>" button to move it selected. You can only automatically remove items before a file is created as discussed above.

## Properties file storage

Let's take a project file that has been localized to both English and French. We normally always treat English as the default language. We will end up with an i18n directory at the same level as the `emf` project file with each translation within it.

    projectDirectory
        projectName.emf
        i18n
            project-lang.properties
            project-lang_fr.properties

Within one of the properties files, any localized menu items will have their translations, here are some examples:

    # Created by TcMenu to hold menu translations, will always be written in UTF-8
    menu.3.enum.1=Item2
    menu.3.enum.0=Item 1
    menu.3.name=Enum
    menu.5.name=Settings
    menu.3.enum.2=ChangeMe
    menu.1.name=Analog
    menu.1.unit=V
    menu.2.name=Float
    menu.4.name=Power
    menu.8.name=YesNo
    menu.7.name=RGB
    menu.6.name=Action
    project.name=Adafruit Dashboard

We can see that entries are in the form `key`="value". Code generator supports locale entries for `name` fields, `AnalogMenuItem` unit field, `EnumMenuItem` entries, list menu item values, and the project name field. You can also easily create your own localized values for your own use too (explained further down).

When we localize a string, it's name/unit/value in the `emf` then its name start with a `%`, which means it is localized and the translation is within the resource bundle. The exception is `%%` which escapes the `%` symbol. Resource bundles are fully documented in many places online, this is just a getting started guide. Example:   

        "unitName": "%menu.1.unit"

To escape a `%` at the start of the text:

        "unitName": "%%"

## Editing items in designer

In designer, once an application is internationalized, above the menu tree on the left, a new combo box appears where you can select the locale for both menu tree display, and for previewing of values. Importantly, designer does not directly edit the properties files, but will reload them automatically when they are changed. The recommended way to work is to load the properties file into an editor alongside TcMenu Designer, then as you edit the properties they will be reloaded.

Once the menu item properly editor is opened, next to the name field you'll see a preview of the name in the chosen locale. Also, if you type in a resource bundle reference that doesn't exist, you'll get a warning until you create it. Let's take an example below:

Property file content:

    menu.1.name = Hello
    menu.1.unit = V

Field values examples:

 | Field        | Output | Comment           |
 |--------------|--------|-------------------|
 | %menu.1.name | Hello  | Taken from bundle |
 | %menu.1.unit | V      | Taken from bundle |
 | %%           | %      | Escaped to %      |
 | Text         | Text   | Not from bundle   |
 | V            | V      | Not from bundle   |

## I18N and code generator

As of 4.0 there are extended save locations, where you can generate files into a "generated" directory (note this is compatible with PlatformIO and CMake but _not_ with Arduino UI/CLI). If supported on your build, this is recommended when combined with locales, as the number of files increases with each language. To change save location simply select the Root item in the tree and change the save location:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-locale-save-locations.png" alt="Possible save locations for both your and the generated code" title="Choosing a save location" >}}


In the generated output directory there will be several new files. Firstly `projectName_langSelect.h` that will include the right language header file based on a compile time flag, then each of the language files following the pattern `picoAdafruitDashboard_lang.h`. Here's an example:

    generated
        projectName_lang.h
        projectName_lang_fr.h
        projectName_langSelect.h
        projectName_menu.cpp
        projectName_menu.h

Looking inside a language header file we can see it follows a pattern to convert the above properties keys into definitions (capitalize and separate by underscore):

    #define TC_I18N_MENU_2_NAME "Float"
    #define TC_I18N_MENU_8_NAME "YesNo"
    #define TC_I18N_MENU_5_NAME "Settings"
    ... skipped
    #define TC_I18N_PROJECT_NAME "Adafruit Dashboard"


Always only include `projectName_langSelect.h` as this will select the right locale. Locales use the standard language and country format. For example to choose global French set the follow compile flag:

    TC_LOCALE_FR

The lack of such a compile flag means use the default locale. Even most TcMenu internal strings are now localized and use the same locale definition file, there are presently translations into English, French, Slovak, German, Ukrainian, and Czech. Any other translations would be greatly welcomed, see the tcMenuLib github repo.

## Using in your own code

You can create extra entries in the resoure bundles and use then in your own code, they follow exactly the same format as in the previous chapter, let's take a simple example:

We add the following resource entry:

    my.custom.value = Hello World

After code generation, in the language definition header files, we'll find `TC_I18N_MY_CUSTOM_VALUE` is defined for each locale.

Now we include the header `projectName_langSelect.h` where projectName is your project name.

Finally, we can use it as if it were a defined string. For example: `strlen(TC_I18N_MY_CUSTOM_VALUE)`.
