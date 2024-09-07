+++
title = "Using Arduino Pins and Io Expanders at the same time"
description = ""
tags = [ "arduino", "digital-io", "library" ]
type = "blog"
date = "2018-08-10"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
titleimg = "/images/electronics/arduino/power/input-library-8574.jpg"
weight = 5
+++

Sometimes there is a need for more IO than can be catered for using an single set of pins, even on the MEGA, or maybe you just want to combine Arduino pins with some pins on an PCF8574 IO expander chip.

In this case IoAbstraction now supports that, you create an abstraction of type `MultiIoAbstraction`. See the sketch that has [Arduino pins and PCF8574 on the same IoAbstraction](https://github.com/TcMenu/IoAbstraction/tree/main/examples/multiIoExample) in the packaged examples.

We have an example that you can look at, build the circuit exactly as per the [standard i2c expander example]({{< relref "pcf8574-i2c-io-expander-arduino-mbed.md" >}}), but this time this sketch also switches on and off the built in LED pin as well, showing it is possible to use both built in pins and the expander at the same time.

{{< blockClear "left" >}}

## Using MultiIoAbstraction

Step 1 create an instance globally, telling it how many pins to allocate to Arduino (defaults to 100):

    MultiIoAbstraction multiIo(100);
    
Step 2 in the setup method register additional devices. You can add up to 7 more IO expanders, and the pins follow on sequentially.

    void setup() {
        Wire.begin();
        // add an 8574 expander on address 0x20 allocating 10 pins (IE from 100-109)
        multiIo.addExpander(ioFrom8574(0x20), 10);
        // and the next follows sequentially with another 10 pins, from 110-119,
        multiIo.addExpander(ioFrom8574(0x20), 10);

        // other setup tasks..    
    }
    
Then use it just like you would any other IoAbstractionRef.

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})