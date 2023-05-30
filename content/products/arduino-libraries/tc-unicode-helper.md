---
title: "TcUnicodeHelper library for Arduino and mbed"
description: ""
date: "2022-12-10"
author:  "system"
showChildren: false
type: "category"
githublink: "https://github.com/davetcc/tcUnicodeHelper"
referenceDocs: "/ref-docs/tc-unicode-helper/html/index.html"
banner: "/products/arduino-libraries/images/electronics/arduino/tcMenu/unicode-font-editor-banner.jpg"
titleimg: "/products/arduino-libraries/images/electronics/arduino/tcMenu/unicode-font-editor-banner.jpg"
menu:
    main:
        name: 'TcUnicodeHelper library'
        identifier: 'tc-unicode-helper'
        parent: 'arduino-libraries'
        weight: 4

---

TcUnicodeHelper is a library for presenting Unicode characters onto a wide range of display libraries, importantly, it works with standard versions of the libraries. It has its own font format that breaks the glyphs into Unicode block groups, and can even easily handle only a few of the glyphs with a block group being required very efficiently. At runtime it is quite light on memory and does not allocate anything outside initial setup.

From a user perspective, the library is very easy to use, just create a unicode helper object that works with your display technology and write UTF-8 data to the display. It works with both tcUnicode and Adafruit_GFX fonts. [Read more about the tcUnicode format]({{< relref "tc-unicode-font-documentation.md" >}})

{{< blockClear "left" >}}

## Platform support and parameters

* {{< library-overview >}}


## Why did we write TcUnicode?

Originally, we used the core of this code as part of the tcMenu project specifically for mbed boards, but deemed the format to be very useful, enough to make open to all libraries. It provides a very extensible Unicode format that works across many libraries and boards.

## What does tcUnicode support?

There is support for the following:

* All Adafruit_GFX based variants with no need for special forks.
* LTDC framebuffer - this code was originally written for this purpose.
* tcMenu - the Designer UI and library have been enhanced to work directly with it.
* U8G2 library - although it already has UTF-8 support, this is another option
* TFT_eSPI - although it already has UTF-8 support, this is another option

You can read more about how this [tcUnicode multi-library support]({{< relref "text-pipelines-for-drawing.md" >}}) is handled here.

If you just want to use tcUnicode without a particular graphics library "driver", the simply include as follows:
    
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


When using graphical device renderers with tcMenu, tcUnicode is available whenever it was enabled, and documented fully within tcMenu and tcMenu examples.

As the code that gets included is inline, it should work as above.

## How do I draw UTF-8 characters using TcUnicode?

Then we set the font we want to use:    

    fontHandler.setFont(unicodeOrAdaFont);

You can then get the dimensions providing the text and a baseline pointer reference, you're then provided the absolute size in return, also the baseline will contain the size in pixels below the baseline.

    int baseline;
    Coord sizeOfText = fontHandler.textExtents_P(helloText, &baseline);

Next we set the cursor position, and color that we want to draw using:

    fontHandler.setCursor(0, sizeOfText.y - baseline);
    fontHandler.setDrawColor(ILI9341_WHITE);

We can then print to the display using various functions:

    fontHandler.print_P(helloText);     // write from progmem
    fontHandler.print((int)textSize.x); // regular print, works as per Arduino.

And that is it.

## How do I create tcUnicode and Adafruit_GFX fonts?

TcMenu Designer from version 3.0 onwards has support to do this:

* [tcMenu Font documentation]({{< relref "using-custom-fonts-in-menu.md" >}}) - see the section of font creation
* [tcMenu Designer releases page](https://github.com/davetcc/tcMenu/releases) - ensure that you use at least 3.0.

## How do I use the UTF-8 decoder directly

**NOTE: This is only if you want to use the UTF-8 decoder outside of the helper class, normally the helper creates one of these for you.**

The UTF-8 decoder is asynchronous and strict/safe, it will disallow most known invalid cases. We first provide a callback that receives the characters as they are decoded. The only thing buffered in this class is the current 32 bit unicode word. It can handle up to 4 byte streams.

    void characterReceived(void* optionalUserData, uint32_t convertedCode) {
        Serial1.print("Unicode=");
        Serial1.println(convertedCode);
    }

Then you create the text processor globally, you can optionally provide user data that is passed to the callback. 

    void* optionalUserData = nullptr;
    Utf8TextProcessor textProcessor(characterReceived, optionalUserData, ENCMODE_UTF8); // ENCMODE_EXT_ASCII for extended ASCII processing mode

Nex during setup we "push" data through the encoder, as data is decoded it will call the character received callback that we provided:

    textProcessor.pushChars("Hello world");

You can also use the inbuilt streaming support, passing in one byte at a time:

    textProcessor.pushChar('A');

To reset the stream entirely:

    textProcessor.reset();

If an error occurs such as a bad sequence, the code in the callback will be set to `TC_UNICODE_CHAR_ERROR` which has value `0xffffffff`.

