+++
title = "TcUnicode Font format documentation"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2023-01-01"
author =  "dave"
menu = "tc-unicode-helper"
banner = "/images/electronics/arduino/tcMenu/unicode-font-editor-banner.jpg"
githublink = "https://github.com/davetcc/tcUnicodeHelper"
referenceDocs = "/ref-docs/tc-unicode-helper/html/index.html"
weight = 99
toc_needed = true
+++

TcUnicode is a font format suitable for the presentation of a larger number of glyphs from different Unicode blocks. On most boards the size difference to Adafruit fonts is relatively insignificant. The advantage being that you can have fonts with glyphs from multiple unicode blocks efficiently. 

TcUnicode rendering is also compatible with Adafruit fonts, so you can use both `Adafruit_GFX` and `TcUnicode` fonts at the same time with `TcUnicodeHelper`. For use within TcMenu, it is supported on all our graphical displays and is easily enabled in the display setup from the code generator dialog.

The library is fully backward compatible with AdafruitGFX fonts, and can interchange between them without any effort. In the examples we show both `TcUnicode` and `Adafruit_GFX` fonts being used in the same example. The `TcUnicode` format is quite similar to the Adafruit font format, so an understanding of that helps when understanding our format.

* [AdafruitGFX font format documentation](https://learn.adafruit.com/creating-custom-symbol-font-for-adafruit-gfx-library/understanding-the-font-specification)
* [AdafruitGFX font format helpful guide](https://glenviewsoftware.com/projects/products/adafonteditor/adafruit-gfx-font-format/)

Internally the font is arranged as an array of unicode blocks, each block contains glyphs, usually in any font on an embedded device, there would be a limited number of blocks normally containing just enough for the job. Blocks are searched sequentially in reverse numeric order to find the right starting group. Once the right block is found, we then need to find the glyph, unlike Adafruit fonts, glyphs can be selected per item, which given than some ranges have over 30,000 items, with millions of possibilities, this is needed. To find a glyph we use a binary search algorithm, which provides fast access to the right glyph.

The bitmaps are stored within the block, and can be up to 64KB in size for each block, and the char-code is an offset to the block's starting point, with up to 64K range allowed in each block. Bitmap format, offset parameters, and sizing is exactly as per AdafruitGFX (that's why we can easily be backward compatible with a few lines of code). You can see more about this in the reference documentation linked below.

See https://www.thecoderscorner.com/ref-docs/tc-unicode-helper/html/_unicode_font_defs_8h.html for the reference documentation.