---
title: "TcUnicodeHelper library for Arduino and mbed"
description: ""
date: "2022-12-10"
author:  "system"
showChildren: false
type: "category"
githublink: "https://github.com/TcMenu/tcUnicodeHelper"
referenceDocs: "/ref-docs/tc-unicode-helper/html/index.html"
banner: "/products/arduino-libraries/images/electronics/arduino/tcMenu/unicode-font-editor-banner.webp"
titleimg: "/products/arduino-libraries/images/electronics/arduino/tcMenu/unicode-font-editor-banner.webp"
menu:
    main:
        name: 'TcUnicodeHelper library'
        identifier: 'tc-unicode-helper'
        parent: 'arduino-libraries'
        weight: 4

---

TcUnicodeHelper is a library that can draw Unicode characters using stock display libraries including Adafruit_GFX, U8G2, TFT_eSPI, our mbed graphics library and tcMenu. Importantly, it works with standard versions of the libraries and does not do any allocation outside of initialisation. It has its own font format that breaks the glyphs into Unicode block groups, and can even easily handle only a few of the glyphs with a block group being required very efficiently.

From a user perspective, the library is very easy to use, just create a unicode helper object that works with your display technology and write UTF-8 data to the display. It works with both tcUnicode and Adafruit_GFX fonts. [Read more about the tcUnicode format]({{< relref "tc-unicode-font-documentation.md" >}})

{{< blockClear "left" >}}

## What does tcUnicode support?

There is support for the following:

* All Adafruit_GFX based variants with no need for special forks. The `AdafruitGfxUnicode` that ships with the library demonstrates how to do this.
* LTDC framebuffer - this code was originally written for this purpose.
* tcMenu - the Designer UI and library have been enhanced to work directly with it.
* U8G2 library - although it already has UTF-8 support, this is another option
* TFT_eSPI - although it already has UTF-8 support, this is another option

You can read more about how this [tcUnicode multi-library support]({{< relref "text-pipelines-for-drawing.md" >}}) is handled here. You could even add another pipeline for your drawing library. 

## Platform support and parameters

{{< library-overview >}}

## How to use TcUnicode

The main include file for the library needs to be included first:
    
    #include <tcUnicodeHelper.h>

To pick up the pre-written driver for a given library use one of the following.

For Adafruit_GFX use the following include and construction:

    #include <tcUnicodeAdaGFX.h>

    UnicodeFontHandler fontHandler(newAdafruitTextPipeline(&myGfx), ENCMODE_UTF8);

For U8G2 use the following include and construction:

    #include <tcUnicodeU8G2.h>

    UnicodeFontHandler fontHandler(newU8G2TextPipeline(&myU8g2), ENCMODE_UTF8);


For TFT_eSPI use the following include and construction:

    #include <tcUnicodeTFT_eSPI.h>

    UnicodeFontHandler fontHandler(newTFT_eSPITextPipeline(&myTFTeSPI), ENCMODE_UTF8);

At this point you have a font handler, you can now draw text onto your display! 

## How do I draw UTF-8 characters using TcUnicode?

Firstly, set the font we want to use:    

    fontHandler.setFont(unicodeOrAdaFont);

You can then get the dimensions providing the text and a baseline pointer reference, you're then provided the absolute size in return, also the baseline will contain the size in pixels below the baseline.

    int baseline;
    Coord sizeOfText = fontHandler.textExtents_P(helloText, &baseline);

Next we set the cursor position by providing integer x and y coordinates (as discussed earlier these are relative to the baseline), and color that we want to draw using. Note that the color is passed directly through to the library unchanged:

    fontHandler.setCursor(0, sizeOfText.y - baseline);
    fontHandler.setDrawColor(ILI9341_WHITE);

We can then print to the display using various functions:

    fontHandler.print_P(helloText);     // print data from progmem memory
    fontHandler.print((int)textSize.x); // regular print, works as per Arduino.

Don't forget that just like many other libraries, the print above will not clear the pixels, it is your responsibility to clear the pixels by filling the rectangle with a background color where the text will go.

I'd recommend that you take a look at the packaged example `adafruitGfxUnicode` in the library. 

## Coordinate system and how fonts are rendered

Fonts are rendered with the baseline being considered coordinate 0,0. The letters ascend above the baseline, and lower case letters such as `y,g` also descend below it. This is exactly as custom fonts work in Adafruit_GFX library.

{{< figure src="/products/arduino-libraries/images/tcUnicode/unicode-drawing.png" alt="TcUnicode font coordinate system showing ascent, descent etc" title="TcUnicode Coordinate System" >}}

## How do I create tcUnicode and Adafruit_GFX fonts?

TcMenu Designer from version 4.3 onwards has a font creation utility built into it, it can import several desktop font formats and export them to either Adafruit font format, or tcUnicode format. Since 4.3.0 the results are bit perfect and optimized for lower resolution, non aliased fonts. Consult the documentation below for more: 

* [tcMenu Font documentation]({{< relref "using-custom-fonts-in-menu.md" >}}) - see the section of font creation
* [tcMenu Designer releases page](https://github.com/TcMenu/tcMenu/releases) - ensure that you use the latest available for best results.

## How do I use the UTF-8 decoder directly

**NOTE: This is only if you want to use the UTF-8 decoder outside the helper class, normally the helper creates one of these for you.**

The UTF-8 decoder is stream based, asynchronous and strict, it will disallow most known invalid cases. We first provide a callback that receives the characters as they are decoded. The only thing buffered in this class is the current 32 bit unicode word. It can handle up to 4 byte streams.

    void characterReceived(void* optionalUserData, uint32_t convertedCode) {
        Serial1.print("Unicode=");
        Serial1.println(convertedCode);
    }

Then you create the text processor globally, you can optionally provide user data that is passed to the callback. You can have as many `Utf8TextProcessor` instances as you like, they are lightweight. Probably less than 20 bytes in size on AVR and around 40 bytes on 32-bit boards.

    void* optionalUserData = nullptr;
    Utf8TextProcessor textProcessor(characterReceived, optionalUserData, ENCMODE_UTF8); // ENCMODE_EXT_ASCII for extended ASCII processing mode

Nex during setup we "push" data through the encoder, as data is decoded it will call the character received callback that we provided:

    textProcessor.pushChars("Hello world");

You can also use the inbuilt streaming support, passing in one byte at a time:

    textProcessor.pushChar('A');

To reset the stream entirely:

    textProcessor.reset();

If an error occurs such as a bad sequence, the code in the callback will be set to `TC_UNICODE_CHAR_ERROR` which has value `0xffffffff`.

