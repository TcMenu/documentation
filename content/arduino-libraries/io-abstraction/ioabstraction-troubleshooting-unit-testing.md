+++
title = "Troubleshooting and mock objects for testing"
description = ""
tags = [ "arduino", "digital-io", "library", "button-press", "eventing", "switches" ]
date = "2017-11-15"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/power/input-library-8574.jpg"
toc_needed = true 
type ="blog"
weight = 0
+++

## Troubleshooting IO issues using LoggingIoAbstraction

Within the MockIoAbstraction.h header there is an implementation of BasicIoAbstraction that delegates through a logging layer. If you are having difficulty determining what your code is sending and receiving, this could be useful. You simply introduce the logging abstraction between your regular abstraction and the device you're having trouble with. For example:

    LoggingIoAbstraction loggingAbstraction(internalDigitalIo());

    ComponentThatNeedsDebugging debugging(internalDigitalIo());
    ComponentThatNeedsDebugging debugging(asIoRef(loggingAbstraction));

## Mock objects for use with Unit testing

This library itself is quite well tested using our simple test facilities, and further it makes unit testing your code easier. There is a MockIoAbstraction that provides very easy support for mocking out an IoAbstraction. You just provide how many `sync()` calls to store in the internal buffer: 

    MockedIoAbstraction mockIo(numberOfCycles = 6);

There is a simulated version of the EepromAbstraction, this uses a small amount of memory to store the EEPROM state, to avoid writes to ROM during testing.

    MockEepromAbstraction myRom(romSize = 128);

There is no need for a mock task manager, just use the regular instance, it has accessors to get hold of tasks if needed. Be sure to call `reset()` after each test that interacts with it.

These Mock interfaces are [fully documented in the reference docs](/ref-docs/ioabstraction/html/index.html).

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})