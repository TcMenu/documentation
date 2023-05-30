+++
title = "Arduino 7 segment LEDDisplay library download"
description = "<p>This Arduino library makes it easy to drive a multiple digit 7 segment display without having to worry about constantly redrawing the digits. To avoid this the library uses the timer 1 interrupt to refresh the display. Flexibility was the main goal and as such methods are available to write decimal, floating point, hex and character data onto the display. It is even possible to mix numbers with character data and lots of examples are provided with the library.</p>"
tags = [ "arduino", "display-driver", "7-segment", "library" ]
type = "blog"
date = "2015-05-04"
author =  "dave"
menu = "led-display"
banner = "/products/arduino-libraries/images/electronics/arduino/7seg/complete-7seg-thumb.jpg"
youtube = "https://www.youtube.com/embed/P6uFmbIfwaY"
githublink = "https://github.com/davetcc/leddisplay"
weight = 0
aliases = ["/electronics/microcontrollers/driving-displays/47-arduino-7-segment-led-display-library/",
           "/products/arduino-downloads/led-display/68-arduino-7-segment-leddisplay-library-download/"]
+++

This Arduino library makes it easy to drive a multiple digit 7 segment display with the option of using a timer1 interrupt 
to constantly redraw the digits. Therefore, this avoids having to call in continuously to refresh the display.

Flexibility was the main goal and as such methods are available to write decimal, floating point, hex and character data 
onto the display. Many examples are provided with the library.

Many thanks to <a href="https://www.dudley.nu/hacks/">http://www.dudley.nu/hacks/</a> for some contributions to the library.
Most of his patch-fixes and improvements have been applied to the library now.

## Download a packaged version

* [Get the latest version directly from github](https://github.com/davetcc/leddisplay) (recommended version)
* <a href="/downloads/leddisplay/LEDDisplay-V1_0.zip"><strong>Old snapshot: LEDDisplay V1.0</strong></a>
* <a href="/downloads/leddisplay/LEDDisplay-20140413.zip">Old snapshot: LEDDisplay 20140413</a>

## Documentation

* [Arduino 7 segment LEDDisplay library documentation]({{< relref "69-arduino-7-segment-leddisplay-library-documentation.md">}})

## Change history

### Version 2.0:

* Significant tidy up of examples to remove all pointers from sketches. 
* Significant improvements to documentation.

### Version 1.0:

* Ability to dim the display with one of four levels.
* Fixed a bug when displaying floats.
* Character mappings stored in program memory (saves 30 bytes RAM).

### Initial version snapshot

* First version of library.