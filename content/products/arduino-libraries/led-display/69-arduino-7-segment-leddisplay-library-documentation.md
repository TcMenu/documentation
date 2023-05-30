+++
title = "Arduino 7 segment LEDDisplay library documentation"
description = "<h2>Building your own application with LEDDisplay</h2><p>This library assumes the same circuit as the following tutorial, please assemble the circuit as described here: 1</p><p>By default the library assumes the display is four digits, if you have more or less, then do the following before the setup function:</p>"
tags = [ "arduino", "display-driver", "7-segment", "library" ]
type = "blog"
date = "2015-05-04"
author =  "dave"
menu = "led-display"
banner = "/images/electronics/arduino/7seg/complete-7seg-thumb.jpg"
githublink = "https://github.com/davetcc/leddisplay"
weight = 1
aliases = ["/products/arduino-downloads/led-display/69-arduino-7-segment-leddisplay-library-documentation/"]
+++
## Using the LEDDisplay library

LEDDisplay is an easy to use library that makes light work of multi-digit 7segment displays.
If you need help building the circuit or understanding the concepts, then refer to this guide: 
[Arduino multiple digit, 7 segment display tutorial](https://www.thecoderscorner.com/electronics/microcontrollers/driving-displays/45-arduino-example-for-driving-7-segment-led-s/).

{{< forumLink "LEDDisplay" >}}


## Setting up the LEDDisplay library

Before using any methods from the library, and usually in the global scope (outside of any function) 
you need to include the header file and initialise the library. 

    #include <leddisplay.h>
    
    LEDDisplay display(startingPin, commonHigh, [numberOfDigits optional]);
    
* startingPin: refers to the first pin where the A pin of the 7segment display is connected, others
must be sequential (eg segment B on startingPin + 1 etc).
* commonHigh: true if the common pins need to be HIGH (5V) to switch on.
* numberOfDigits: the number of digits, defaults to 4.

Should you wish to change brightness,

    display.setBrightness(newBrightness);

* newBrightness: between 0 and 3.

## Ways to refresh the display (choose only one option)

**Option 1**: If you want to use the interrupt support (then you don't need to worry about refreshing the display 100 times a second)

```
display.startInterrupt();
```
    
Option 2: If you don't want to use interrupts, you must refresh the display between 50 and 100 times a second
to avoid flicker, calling this method.

```
display.isr_display();
```
    
Option 3: Should you be using [IoAbstraction library already]({{< relref "io-abstraction.md">}}) 
then just do the following:

```
    // Only for users of IoAbstraction library
    taskManager.scheduleAtFixedRate(10, [] {
        display.isr_display();
    });
```

## Rendering values onto the display

At this point the LED display will be initialised, but will not display a value. You can populate 
the display in several ways.

### For displaying integer values:

```
display.setValueDec(value, [optional zeroPad]);
display.setValueHex(value);
```

Where

* value: the value to be display
* zeroPad: true if you want to pad with zeros

### For displaying floating points:

```
display.setValueFloat(value, precision, [optional zeroPad]);
```

Where:

* value: the value to be display
* precision: the number of decimal places
* zeroPad: true if you want to pad with zeros

### Setting characters directly

    display.setValueRaw(digit, character, dpOn);

Where:

* digit: the digit to be updated
* character: the character to write into the digit (see the character set lower down)
* dpOn: true to show the decimal point, otherwise false

### Setting a few of the digits to a numeric value

    display.setNumeric(value, base, startDigit, extendBy);
    
Where:

* value: the value to be displayed
* base: the base of the numbers to be displayed (decimal: 10, hex: 16)     
* startDigit: starting digit position
* extendBy: the number of extra digits to include

### A few examples of advanced usage
 
```
// Example 1: put character onto the display directly at position 1
display.setValueRaw(1, 0x12);

// Example 2: put character onto the display directly at position 1 and set the DP on.
display.setValueRaw(i, 0x14, true);

// Example 3: write the integer 23 as decimal into digits 1 and 2
display.setNumeric(23, 10, 1, 1); 
```

## Character set for setValueRaw 

When using setValueRaw(..) these are the values that can be displayed, use the Value field in
the call. For example to display the digit 'F' in position 1 `setValueRaw(1, 0x0F);`

| Value | Character | Binary (ABCDEFG)|
|-------|-----------|-----------------|
| 0x00  |  '0'      | 0b1111110       |
| 0x01  |  '1'      | 0b0110000       |
| 0x02  |  '2'      | 0b1101101       |
| 0x03  |  '3'      | 0b1111001       |
| 0x04  |  '4'      | 0b0110011       |
| 0x05  |  '5'      | 0b1011011       |
| 0x06  |  '6'      | 0b1011111       |
| 0x07  |  '7'      | 0b1110000       |
| 0x08  |  '8'      | 0b1111111       |
| 0x09  |  '9'      | 0b1111011       |
| 0x0A  |  'a'      | 0b1110111       |
| 0x0B  |  'b'      | 0b0011111       |
| 0x0C  |  'c'      | 0b1001110       |
| 0x0D  |  'd'      | 0b0111101       |
| 0x0E  |  'e'      | 0b1101111       |
| 0x0F  |  'f'      | 0b1000111       |
| 0x10  |  'g'      | 0b1111011       |
| 0x11  |  'h'      | 0b0110111       |
| 0x12  |  'i'      | 0b0110000       |
| 0x13  |  'j'      | 0b0111000       |
| 0x14  |  'l'      | 0b0001110       |
| 0x15  |  'n'      | 0b0010101       |
| 0x16  |  'o'      | 0b0011101       |
| 0x17  |  'p'      | 0b1100111       |
| 0x18  |  'r'      | 0b0000101       |
| 0x19  |  's'      | 0b1011011       |
| 0x1A  |  't'      | 0b0001111       |
| 0x1B  |  'u'      | 0b0011100       |
| 0x1C  |  'y'      | 0b0111011       |
| 0x1D  |  ' '      | 0b0000000       |

For more advanced usages see the header file on github: [https://github.com/davetcc/leddisplay/blob/master/LEDDisplay.h]