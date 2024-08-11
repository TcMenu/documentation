+++
title = "Creating a tcUnicode or Adafruit font using the designer UI"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2024-08-11"
author =  "dave"
menu = "tc-menu"
banner = "/images/electronics/arduino/tcMenu/unicode-font-editor-banner.webp"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 99
toc_needed = true
+++

Assuming you already have [TcMenu Designer UI 4.3 or greater](https://github.com/TcMenu/tcMenu/releases) already open, from the `Code` menu choose `Font Creation Tool`. At this point you should see a Window similar to the one below. Note that it is best to have a project open first, as it will then offer to save within your project.

{{< figure src="/products/arduino-libraries/images/tcUnicode/tcunicode-front-screen-first-open.png" alt="Font Creator that exports for Adafruit and tcUnicode" title="Font Creator Screen at first open" >}}

Before going through each step in detail, lets examine the workflow first:

1. First we either use `Import Font` or `Open Embedded Font` to load a font into the tool.
2. We can then choose which Glyphs should be included, either by selecting blocks, or selecting single glyphs.
3. We can "touch up" any glyphs that do not look quite right using the inbuilt editor.
4. We save the XML using the `Save` option. If we do this, we can re-open the font later using the `Open Embedded Font` option.
5. We `Generate` the font into a suitable format, presently Adafruit_GFX and tcUnicode font formats are supported. 

## Step 1, opening or importing a font

We have two options here, we can choose the `Open Embedded Font` option to open a font that was previously output using `Save`. Otherwise, we choose `Import Font` to import a font from a font file. You can use any font supported by the FreeType library.  

{{< figure src="/products/arduino-libraries/images/tcUnicode/tcunicode-import-font-dialog.png" alt="Dialog for importing a font from disc" title="Import font from file dialog" >}}

In the above dialog you set the font size in points, defaulted to be at 100DPI which is around the resolution of most smaller embedded displays. Then you choose the `Unicode Blocks` that you want to include, make sure you choose all the ones you'll need as you can't alter these later. Finally select `Choose File` and the import starts.

****NOTE: It is your responsibility to check the usage license on the font you choose, to ensure you are legally allowed to use it in an embedded context.****

## Step 2, choosing which glyphs are included

There are two ways to choose which glyphs are included, either wholesale for a unicode block by clicking the `Select/Clear All` checkbox at the top right of the block, or to right-click on an item and choose to either exclude or include it (context menu shown highlighted by yellow frame in screenshot below):

{{< figure src="/products/arduino-libraries/images/tcUnicode/tcunicode-selecting-font-glyphs.png" alt="Selecting glyphs to be included in the font" title="Selecting Glyphs for inclusion in the font" >}}

As you select items you'll see the "Characters selected" indicator showing the approximate size of the font, along with the estimated yAdvance and baseline sizes. This gives you a good idea how much space the font will need, and also approximately how large it will be. 

## Step 3, touching up any glyphs that don't look quite right

If any glyphs have a couple of pixels in the wrong position, it is very easy to edit them and clean up those pixels. To do so right click on the glyph and select `Edit Glyph`. This will open the inbuilt bitmap editor with the selected glyph. 

Any changes you make here are automatically applied. Below you can see an example of how the bitmap editor looks, you can choose from a few drawing functions such as Pixel and Line, change colors using the palette, and clicking on a the magnified image allows you to change the pixels. There is no need to press save when in font mode, changes are automatically applied on closing.

{{< figure src="/products/arduino-libraries/images/tcUnicode/bitmap-editor-glyph-loaded.png" alt="Bitmap editor with font glyph loaded for modification" title="Bitmap Editor with font glyph loaded." >}}

See the full [bitmap editor documentation]({{< relref "creating-and-using-bitmaps-menu.md" >}}), especially the "Bitmap creation and editing - 4.3 onwards" section.

## Step 4, Saving the font

You can save the font as an XML file for later use, simply click the `Save` button at any time. These fonts can be loaded back using the `Open Embedded Font` option.

## Step 5, Exporting to a Adafruit or tcUnicode font header file

You can export to either the clipboard or to a file, clicking on the `Generate` button presents a menu, the first option is a check box that once ticked, will save to the clipboard, when un-ticked saves to file.

{{< relref src="/products/arduino-libraries/images/tcUnicode/tcunicode-export-button.png" alt="Generate button menu in the font editor" title="Generate button menu options" >}} 

### Export to Adafruit

Exporting to Adafruit font format will write a header file that can be loaded either directly by Adafruit_GFX or by our TcUnicode library.

The underlying format, stores every glyph between a starting point and an ending point, this means that we have to store an empty glyph for every item that you had de-selected. This is fine if there are not too many glyphs that you wish to skip, but if there are many, the size adds up. Also, the absolute maximum char is 0xFFFF.

### Exporting to TcUnicode font format

Exporting to TcUnicode font format will write a header file that can be loaded by our TcUnicode renderer, these fonts are supported on most graphical displays. Meaning full, customizable UTF-8 is available on nearly every display.

This format is more customizable than Adafruit fonts, but on the other hand in the simplest case, just LATIN, may take slightly more space. Why? This is because the format is genuinely Unicode, it can support Unicode blocks, and you choose which blocks you want and even can select at the character level. This means that for most unicode cases, it will be smaller than Adafruit.

### Exporting font Summary

Adafruit fonts take slightly less room for the basic latin case, but quickly get to a similar size when including characters above 127. TcUnicode support is compatible with both, you can take your pick which to use.
