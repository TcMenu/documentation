+++
title = "Changes in graphics configurations for renderers"
description = ""
tags = [ "arduino", "embedded-menu", "menu-plugin", "library" ]
type = "blog"
date = "2019-02-05"
author =  "dave"
menu = "tcmenu-plugins"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/plugs-for-plugin.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/plugs-for-plugin.jpg"
githublink = "https://github.com/davetcc/tcMenu"
referenceDocs = "/ref-docs/tcmenupluginapi/html/index.html"
weight = 99
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenudesigner-codegenerator-plugins/"]
+++

Like any library, we occasionally need to make changes to the way that things work, this makes the library more viable going forward, and often provides major improvements in what's possible for nearly everyone. However, sometimes we need to deprecate features so that it reduces the support burden, we do this as infrequently as possible, and try and give users long enough to move to the new version. 

Here we do not define all changes, just things that have changed in the library code by major version.


## Library code major changes from 2.1 -> 2.2

* Multiple remotes are now allowed. Within the designer you can add extra remote plugins from the code generator.
* The `remoteServer` object that was previously non-standard between different types of remote is now the same for all remotes. It is nearly entirely compatible with what went before. The main difference is that every type of connector uses a common base.
* Nearly all code should work with minimal (if any) changes.
* Much of the remote code is now in the namespace `tcremote`, by default this namespace is available automatically through the base include. 

## Library code major changes from 1.7 -> 2.0

The `ColorGfxMenuConfig` method of specifying configuration is still available but deprecated, in a future version it may be removed.

Further we made a few other changes, the easiest way to pick up these changes is to let the designer do code generation on your project, it will put the most recent plugin files in places automatically. However, if you cannot do that, and you don't want to copy in the latest plugin code yourself, then these are the most important changes:

* Most graphical components are moved to namespace `tcgfx` and `GfxMenuConfig.h` moved into the `graphics` directory.
* On BaseDialog, the header used to be held as a pointer to an item in program memory, it is now a character array held within the object. 

### Configuring a display using the AdaColorGfxMenuConfig structure

For users that are not able to move beyond tcMenu 1.7, the below documentation is left in place. For 2.0 see the [theme, grids and properties docs]({{< relref "rendering-with-themes-icons-grids.md" >}}).

Should you need to change the drawing settings such as font, spacing and colors to suit your display. For Adafruit_GFX this is the configuration type, if you leave the config field blank, the generator will provide a default with name `gfxConfig`.

    AdaColorGfxMenuConfig gfxConfig;

It is probable that you'll either want to completely override, or make some small adjustments to the graphics configuration. [See the graphical configuration section in this rendering guide.]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md">}})

When you don't choose a graphics configuration by leaving the property blank, the code generator will use a default one on your behalf, by adding it to your `<project>_menu.cpp` file:

    // for low resolution monochrome displays this is the default
    void prepareAdaMonoGfxConfigLoRes(AdaColorGfxMenuConfig* myConfig);
    // for OLED displays, this is the default
    void prepareAdaMonoGfxConfigOled(AdaColorGfxMenuConfig* myConfig);
    // for color displays, this is the default.
    void prepareAdaColorDefaultGfxConfig(AdaColorGfxMenuConfig* myConfig);

### Configuring a display with U8g2GfxMenuConfig

When using this driver, the font, spacing and colors are controlled by a graphics configuration. There are a lot of available options to customise how you display the menu. The default  assumption is a medium resolution screen of (128x64).

For this driver the graphical configuration is of type:

    U8g2GfxMenuConfig myConfig;

It is probable that you'll either want to completely override, or make some small adjustments to the graphics configuration. [See the graphical configuration section in this rendering guide.]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md">}})

### Display configuration for bitmapped displays (AdaGfx and U8G2)

We can set the font, color, and spacing around items on a bitmap display by adjusting the configuration. All bitmapped displays based on Adafruit_GFX and U8G2 require a graphics configuration. The menu designer will attempt to add sensible defaults for you, but in many cases, you'll need to tweak these settings to get the best results.

For Adafruit_GFX based displays the configuration type is `AdaColorGfxMenuConfig` and fonts are of type `GFXfont*`. There are many fonts provided with the library, and you can use any of those or create one. You can also set the text magnification.

For U8G2 based displays the configuration type is `U8g2GfxMenuConfig` and fonts are of type `const uint8_t*`. Again there are many provided fonts with the library that you can use. There is no text magnification with u8g2 so it should always be 1.

For Adafruit graphics colours are defined as 16 bit, and we have an RGB(r, g, b) macro that can be used. Where values are between 0 and 255. BLACK and WHITE are always defined.

Padding structures can be easily defined using this function:

    makePadding(MenuPadding& padding, int top, int right, int bottom, int left)

These are the fields that are available in the configuration structure.:

    template<typename FONTPTR> struct ColorGfxMenuConfig {
        uint32_t bgTitleColor;
        uint32_t fgTitleColor;
        MenuPadding titlePadding;
        FONTPTR titleFont;
    
        uint32_t bgItemColor;
        uint32_t fgItemColor;
        MenuPadding itemPadding;
        FONTPTR itemFont;
    
        uint32_t bgSelectColor;
        uint32_t fgSelectColor;
        uint32_t widgetColor;
        MenuPadding widgetPadding;
    
        const uint8_t* activeIcon;
        const uint8_t* editIcon;
        uint8_t editIconWidth;
        uint8_t editIconHeight;
            
        uint8_t titleBottomMargin;
        uint8_t titleFontMagnification;
        uint8_t itemFontMagnification;
    }

To override the graphics configuration there are two options, you can either completely define your own structure, or you can adjust a few values on the existing one that the designer provides:

### Create your own graphics config from scratch

* In your sketch create a variable of the appropriate type for your display.
* Ensure the setup of the config is BEFORE calling setupMenu() during initialisation.
* Fully populate the fields - this is imperative as it's a struct type.
* The fonts can be NULL as can the `activeIcon` and `editIcon`. This implies the default values.
* In the designer's code generator window, put the name of the config variable into the CONFIG property.
* See the examples for more on how to override configuration.

### Modify designer provided graphics config

In this case, leave the graphics config variable blank in the code generator dialog, this means that the config will be provided by the designer. For all Adafruit and U8g2 options the designer will create a config variable called `gfxConfig`.
