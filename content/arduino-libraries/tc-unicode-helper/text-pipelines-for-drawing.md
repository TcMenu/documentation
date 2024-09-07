+++
title = "Text pipelines for drawing with tcUnicode"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2023-01-01"
author =  "dave"
menu = "tc-unicode-helper"
banner = "/images/electronics/arduino/tcMenu/unicode-font-editor-banner.jpg"
githublink = "https://github.com/TcMenu/tcUnicodeHelper"
referenceDocs = "/tc-unicode-helper/html/index.html"
weight = 99
toc_needed = true
+++

TcUnicodeHelper uses a text pipeline to draw onto the display. Text pipelines are how it supports so many library options, it is an interface that must be implemented in order for tcUnicode to be able to draw onto a device. It has the minimum set of functions for drawing text.

    class TextPlotPipeline {
    public:
        virtual ~TextPlotPipeline() = default;
        virtual void drawPixel(uint16_t x, uint16_t y, uint32_t color) = 0;
        virtual void setCursor(const Coord& where) = 0;
        virtual Coord getCursor() = 0;
        virtual Coord getDimensions() = 0;
    };

* Method drawPixel - takes the x and y location we want to draw at along with the color. Each pixel in the font will be drawn this way. 
* Method setCursor - move the cursor to a new x and y location. This is because some libraries hold the cursor within the library.
* Method getCursor - should return the position of the cursor.
* Method getDimensions - should return the dimensions of the screen.

If we think about this for a moment, the pipeline allows us a lot of freedom, in future pipelines that rotated text or performed other operations could be added, although at the moment it is only used for device independent drawing. There are out of the box implementations for the following libraries, these are built in and have a `UnicodeFontHandler` constructor so that you don't even need to create a pipeline.

* DrawableTextPlotPipeline - can render onto any DeviceDrawable, rarely useful, as device drawable optimize to the hardware themselves.
* U8g2TextPlotPipeline - can render fonts directly onto a U8G2 instance. 
* TftSpiTextPlotPipeline - can render fonts directly onto a TFT_eSPI instance.
* AdafruitTextPlotPipeline - can render fonts directly onto any Adafruit_GFX instance. 
