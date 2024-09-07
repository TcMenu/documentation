+++
title = "Monochrome themes for rendering menus onto OLED/5110."
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "menu-plugin" ]
type = "blog"
date = "2021-05-11"
author =  "dave"
menu = "themes"
banner = "/products/arduino-libraries/images/electronics/arduino/themes/mono-u8g2-oled-2col.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
weight = 50
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-plugins/monochrome-themes-for-oled-5110/"]
+++

## Examples of this theme

[Information about themes in general]({{< relref "rendering-with-themes-icons-grids.md" >}}).

Below we show three examples of this theme, first you see an inverse title example, but with sliders turned on, we don't do this by default as it comes with some issues, but some may like it. Second, we show inverse video on a dual color OLED, and lastly, we show the bordered theme.

{{< figure class="pull-left" title="oled menu using border theme plugin" alt="menu library on oled screen bordered" src="/products/arduino-libraries/images/electronics/arduino/themes/mono-u8g2-example.jpg">}}
{{< figure class="pull-left"  title="Two color oled inverse theme plugin" alt="menu library on 2 color oled screen inverse" src="/products/arduino-libraries/images/electronics/arduino/themes/mono-u8g2-oled-2col.jpg">}}
{{< figure class="pull-left" title="oled menu using inverse title theme plugin" alt="menu library on oled screen inverse title" src="/products/arduino-libraries/images/electronics/arduino/themes/mono-u8g2-oled-border.jpg">}}

{{< blockClear "both" >}}

TcMenu ships with two monochrome themes, one that uses borders for the title and avoids the use of inverse video to a large extent, and one where the title and selection use inverse video.

Depending on the display you have, inverse video may not work particularly well, so this gives a bordered option too.

## Configuring the theme

Themes add a theme header file to your sketch, _which once generated will not be touched again by designer_. This means that you can edit the theme file to meet your needs. Should you wish to regenerate the file, delete it, and then it will be regenerated.

### Font for items

This is the default font that menu items will draw using. See [Fonts in the menu designer]({{< relref "using-custom-fonts-in-menu.md" >}})

### Font for title

This is the title font that will be used for header text. See [Fonts in the menu designer]({{< relref "using-custom-fonts-in-menu.md" >}})

### Border size of the title / title padding

This defines either the border size of the title in bordered mode, or the padding around the title in inverse video mode.

### Spacing between title and first item

If you're using a two color OLED display then you may need to slightly adjust the spacing before the first item.

### How to show title

There are various ways that the title can be drawn, always, as the first row, or never.

## Additional documentation

* [Information about themes in general]({{< relref "rendering-with-themes-icons-grids.md" >}}).
* [Full documentation of tcMenu rendering]({{< relref "rendering-with-tcmenu-LCD-TFT-OLED.md" >}}).
