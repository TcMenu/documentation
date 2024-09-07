+++
title = "Arduino text utilities in IoAbstraction"
description = ""
tags = [ "arduino", "library" ]
type = "blog"
date = "2022-11-15"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/ioa-logging-example.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/ioa-logging-example.jpg"
weight = 5
+++

IoAbstraction comes with a few text utilities that can be helpful when rendering text as raw character arrays. Internally, IoAbstraction and TcMenu DO NOT use any string objects to avoid runtime memory allocation. [See the complete text utility documentation](https://www.thecoderscorner.com/ref-docs/ioabstraction/html/_text_utilities_8h.html)

To use the text utilities you need to include the header

    #include "TextUtilities.h"

Often times, we need to build text up within a buffer, so it is useful to have a series of functions that can work on a buffer, appending to the end of the buffer. These functions are described here:

    void appendChar(char* buffer, char valueToAppend, int bufferLen);

To write a numeric into the first position in a buffer

    void ltoaClrBuff(char* buffer, long val, uint8_t dp, char padChar, int bufferLen);

As above but start at the zero terminated end of the buffer. Where you provide a buffer and length, the value to convert, the maximum number of decimal places, and the padding char for zero padding '0' or NOT_PADDED.

    void fastltoa(char* str, long val, uint8_t dp, char padChar, int len);

As above but start at the zero terminated end of the buffer, instead of decimal placees, provide the largest power of 10 directy, EG 10, 100, 1000 etc.

    void fastltoa_mv(char* buffer, long val, long divisor, char padChar, int bufferLen);

This works for floating point values, providing a number of decimal places 

    void fastftoa(char* sz, float fl, int dp, int strSize);

There is also a standardized abs function that works on most boards:

    float absVal = tcFltAbs(floatVal);

[See the complete documentation](https://www.thecoderscorner.com/ref-docs/ioabstraction/html/_text_utilities_8h.html)

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
