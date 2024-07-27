+++
title = "Rendering using themes - properties, grids and icons"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2021-09-05"
author =  "dave"
menu = "themes"
banner = "/products/arduino-libraries/images/electronics/arduino/themes/color-blue-example.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/themes/color-blue-example.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 2
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-plugins/rendering-with-themes-icons-grids/"]
+++

Most display plugins can be customized using a grid layout, with graphical displays additionally using themes to configure fonts, colors, spacing and icons. To the left you can see cool-blue theme with a multi-column grid layout.

Grid positions are used to define an items position in the menu, and even break rows up into multiple columns. Each grid position also defines the justification and drawing mode too. 

{{< blockClear "left" >}}

## Choosing a theme to get started in a new project

To avoid having to define the fonts, spacing, colors and other details from scratch, we have themes that can be applied out of the box. Whenever a graphical display plugin is selected that needs a theme, then the theme is shown underneath the display plugin choice. There are a few pre-canned choices to choose from, so  to get started, pick one that works for your display. The manual theme applies no style whatsoever and is not recommended for beginners.

**NOTE: Do not pick a color theme for a monochrome display, it is unlikely to work.**

Once you've run code generator for the first time, a new header file for the theme will be added to your project. Once added, this will not be altered or overwritten, so you are safe to edit it. However, if you want to regenerate the theme, delete the file and the designer will generate it again.

## Drawing in grid positions


{{< figure src="/products/arduino-libraries/images/electronics/renderer-docs/grid-layout-example.jpg" title="Grid Layout example" alt="Grid layout showing various column layout possibilities" >}}

Menu items are drawn in a grid layout as presented in the image above. We can draw a menu item at any grid and row position, just be careful that the row definition comes before the natural menu row, otherwise the row will already be taken and can't be overridden.

A row can have either the default height, or the grid position can override the height (in multi-column arrangements all items on one row must be the same height), it can also define the drawing mode and justification. To make a row become multi-column set the grid size parameter to other than 1, and create a grid position for each column position, starting at 1 and working upwards.

Further, if the item at row 0 is the title, then any title widgets will also be rendered onto the right. If you choose to use active and edit icons, then appear on the left and are not considered part of the item.    

There are three ways to draw with this type of renderer:

* Fully on the fly, don't configure any grid positions, every item will be on a new row by default.
* Partial overriding of the grid positions
* Full overriding of grid positions for every menu item in a given submenu.

Let's say we want `menuBtn1` and `menuBtn2` in a single row, here's how we do it, further let's say that we want them to justify center with the item name only (without the value being presented):

    // We define grid positions for menuBtn1 and menuBtn2, with a grid width of 2.
    factory.addGridPosition(&menuBtn1, GridPosition(GridPosition:: DRAW_TEXTUAL_ITEM,
                                                    GridPosition::JUSTIFY_CENTER_NO_VALUE, 2, 1, 4, 45));
    factory.addGridPosition(&menuBtn2, GridPosition(GridPosition:: DRAW_TEXTUAL_ITEM,
                                                    GridPosition::JUSTIFY_CENTER_NO_VALUE, 2, 2, 4, 45));

* see [GridPosition docs](https://www.thecoderscorner.com/ref-docs/tcmenu/html/classtcgfx_1_1_grid_position.html)
* see the `addGridPosition` method in [ItemDisplayPropertiesFactory](https://www.thecoderscorner.com/ref-docs/tcmenu/html/classtcgfx_1_1_item_display_properties_factory.html)

### Adding icons for actionable items

In order to be able to render as an icon we first need to tell our display properties about the icon, we do this by registering an icon with an association to a particular menu item. Let's say for example that we had a sub-menu called `menuSettings` that we wanted to draw as an icon. First we would add the icon to the cache:

    // step 1, get the graphics factory
    auto & factory = renderer.getGraphicsPropertiesFactory();
    // step 2, add an icon to the image cache
    Coord iconSize(32, 32);
    factory.addImageToCache(DrawableIcon(menuSettings.getId(), iconSize, DrawableIcon::ICON_XBITMAP, 
                            settingsIconData, optionalSelectedIcon));
    // step 3, tell the renderer that the settings icon should be in a grid of three, column 1, 45 high, drawn as icon 
    factory.addGridPosition(&menuSettings, GridPosition(GridPosition::DRAW_AS_ICON_ONLY,
                                    GridPosition::JUSTIFY_CENTER_NO_VALUE, 3, 1, 4, 45));

### Some take away notes

* Many of the examples create grid layout overrides, you can take a look how they do it.
* Apart from SSD1306Ascii and LCD Uno, all other renderers draw in grids.
* For an override to work, the item must appear in the menu structure before the row would be rendered normally. Otherwise it would have been placed automatically.
* An override contains the position, the columns, drawing mode, and optional height.
* When a new submenu is shown, the renderer sets up a drawingCache as shown in the pseudocode below:

```
FOR each item in the current menu
    LET gridPosition = gridOverrides.getForItem(item)
    IF gridPosition was found 
        Put item in drawingCache at the position specified by gridPosition
    ELSE
        Put item in drawingCache at next available grid row, colums=1, height=0
    END IF
END FOR
```

## ItemPropertiesFactory and graphical displays

Our flexible configuration based rendering is made possible by a display factory. The display factory stores all the grids, icons and drawing properties in high performance btree lists that are optimised for reading. Graphical displays nearly always have a [ConfigurableItemDisplayPropertiesFactory](https://www.thecoderscorner.com/ref-docs/tcmenu/html/classtcgfx_1_1_configurable_item_display_properties_factory.html) that can be obtained using `renderer.getGraphicsPropertiesFactory()`. The themes are always a good starting point for making adjustments to these values.

### Changing the drawing parameters

You can also change the font, color, padding, size and default justification at three levels (shown below in priority order):

* Item level, where there is a match on menu item
* SubMenu level, when there is no match at item level
* Default settings when no others match
* Last chance item that's compiled in just in-case there is a severe mis-configuration to avoid returning `nullptr`.

To change the default settings use `setDrawingPropertiesDefault` on the factory, providing the component type and the drawing settings. This will take effect when there are no other overrides

To change the properties for all items that belong to a submenu use `setDrawingPropertiesForItem` on the factory, providing the component type and drawing settings. This will take effect when there are no item level overrides.

To change the properties for a single item use `setDrawingPropertiesAllInSub` on the factory, providing the component type and drawing settings. This item will always have priority over anything else.

* [ItemDisplayProperties documentation](https://www.thecoderscorner.com/ref-docs/tcmenu/html/classtcgfx_1_1_item_display_properties.html)

Here is an example that provides an override for a specific item, it is overridden to display as a title, provides a custom palette, padding, spacing, font and height:

    color_t specialPalette[] { ILI9341_WHITE, ILI9341_RED, ILI9341_BLACK, ILI9341_BLUE};
    factory.setDrawingPropertiesForItem(ItemDisplayProperties::COMPTYPE_TITLE, menuStatus.getId(), specialPalette,
                                        MenuPadding(4), nullptr, 4, 10, 30,
                                        GridPosition::JUSTIFY_CENTER_WITH_VALUE );

## The properties cache in more detail

{{< figure src="/products/arduino-libraries/images/electronics/renderer-docs/item-properties-cache-example.jpg" title="Graphical representation of properties cache" alt="The item properties cache that is used for rendering" >}}

There is a properties cache within any graphical menu application, the cache stores the grid positions, icon cache and also a list of drawing properties as described above. These are stored in high performance btree lists, and memory usage is quite minimal for most applications.

Each time a new menu is displayed, the rows are calculated upfront to avoid having to query these lists and perform the priority defaulting during each run. 

## Common structures and classes

Along with this overview, please see the reference documentation for more complete details, they will not be repeated here:

* [GfxMenuConfig.h documentation - core types](https://www.thecoderscorner.com/ref-docs/tcmenu/html/_gfx_menu_config_8h.html)
* [DrawingPrimitives.h documentation - core types](https://www.thecoderscorner.com/ref-docs/tcmenu/html/_drawing_primitives_8h.html)

### struct Coord - coordinates

Stores an X and Y coordinate in a 32bit bit-packed struct. It supports copy construction and assignment. You can directly access `x` and `y`.

    Coord myCoord(10, 4);     // create a coord with x=10 and y=4
    Coord copyCoord(myCoord); // copy myCoord into copyCoord
    int x = myCoord.x;
    int y = myCoord.y;

### struct MenuPadding - item padding

Works similar to padding in HTML, You can directly access the `top`, `bottom`, `left`, `right` values.

    MenuPadding equalPadding(4);                        // all sides have padding of 4
    MenuPadding perSidePadding(top, right, bottom, left); // per side padding.


## Color palettes and how they relate to menu items

Color palettes can be provided at the default level, the submenu level, or for a given item. They are defined as part of the properties. Each property current takes a four color palette, each color in the palette has a special meaning as follows:

### Palette 0 - TEXT

Used to draw the textual components for COMPTYPE_ITEM, COMPTYPE_TITLE and COMPTYPE_ACTION types

### Palette 1 - BACKGROUND

used to draw the background for any item, but for COMPTYPE_ITEM it is also the entire background color.

### Palette 2 - HIGHLIGHT1 

Highlight 1 is used for various additional drawing components, and varies by the type of item being drawn.

* For the title this refers to the widget color.
* For Up/Down items, this refers to the color of the button backgrounds.
* For slider controls it is the active part of the slider area.

### Palette 3 - HIGHLIGHT2

* For sliders this is the inactive part of the slider area.
* For icon actionable items, this is the colour of the icon when it is not active. 

### Selected color

You can also set the selected text and background color, these will override other choices when the item is selected, so they should be as compatible as possible with the rest of the color scheme.

## Title visibility, enabling sliders

You can set how the `renderer` object displays the title as shown below:

    void setTitleMode(TitleMode mode);

Where title mode which is defined with BaseGraphicalRenderer is one of:

* BaseGraphicalRenderer::NO_TITLE - the title will not be displayed
* BaseGraphicalRenderer::TITLE_FIRST_ROW - the title will be displayed as if it were the first row
* BaseGraphicalRenderer::TITLE_ALWAYS - the title will always be displayed regardless of row.

You can turn on or off slider support, which gives a visual indicator of the range between 0 and the maximum value for analog items:

    void setUseSliderForAnalog(bool useSlider);

## Font overview

Read the [guide for setting up fonts in the menu designer]({{< relref "using-custom-fonts-in-menu.md" >}}).

[Back to tcMenu main page]({{< relref "tc-menu" >}}) 
