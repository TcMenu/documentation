+++
title = "Timed blink - IO Abstraction library example"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "switches" ]
type = "blog"
date = "2017-10-20"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/davetcc/IoAbstraction/"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/power/input-library-8574.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/power/input-library-8574.jpg"
weight = 1
aliases = ["/products/arduino-downloads/io-abstraction/timedBlink-example-ioAbstraction-library/"]
+++

Timed blink is a version of [well known Arduino blink example](https://www.arduino.cc/en/Tutorial/Blink) 
that is shipped with the standard IDE, but is redesigned to use the Abstraction and 
timer library.

Example circuit for the code is exactly the same a blink, and if you use the inbuilt LED
pin (which it does by default) then there's no need to build any circuit whatsoever.

Instead of using `delay()` calls to set the duration of the led flash, it uses the task 
management library to schedule a task. In addition it uses the libraries IOAbstraction 
facilities to switch the LED on and off. This means that the LED could be located on
a shift register or i2c IO device.

[Source for the example is included in the examples section of the library](https://github.com/davetcc/IoAbstraction/blob/master/examples/timedBlink/timedBlink.ino),

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
