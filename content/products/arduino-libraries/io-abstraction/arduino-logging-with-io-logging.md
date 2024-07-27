+++
title = "Arduino logging using io-logging"
description = ""
tags = [ "arduino", "library" ]
type = "blog"
date = "2022-08-10"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/ioa-logging-example.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/tcMenu/ioa-logging-example.jpg"
toc_needed = true
weight = 5
+++

Logging is part of the IoAbstraction offering, it has a moderately complete logging framework that is still lightweight enough to work on small boards. It can easily be turned off completely for very small boards too. Both IoAbstraction and tcMenu use this logging to provide information about internal state and operations.

The logging is fully integrated into both IoAbstraction and TcMenu, and this change is backward compatible at a code level.

{{< blockClear "left" >}}

## Initialise the logging

To use the logging in your project you first include the logging header file:

    #include <IoLogging.h>

Secondly you define the following build switch to turn on logging: `IO_LOGGING_DEBUG`. For example on platformIO that would be:

    build_flags = -DIO_LOGGING_DEBUG=1

If you are using the original Arduino IDE, it does not support build flags, you can in this case open IoLogging.h in the IoAbstraction library and uncomment the entry to define it in there. This would need to be done after each upgrade and is not recommended.

You can set the logging levels at compile time using `IO_LOGGING_DEFAULT_LEVEL` by ORing together entries from `SerLoggingLevel`. An is shown below for only warning and error logs:

    build_flags = -DIO_LOGGING_DEFAULT_LEVEL=(SER_WARNING|SER_ERROR)

You can also adjust logging at runtime

    void serEnableLevel(SerLoggingLevel level, bool active)

Where you provide the level and if the level is active. The available levels are:

    enum SerLoggingLevel {
        SER_WARNING = 0x0001,
        SER_ERROR = 0x0002,
        SER_DEBUG = 0x0004,
        SER_TCMENU_INFO = 0x0008,
        SER_NETWORK_INFO = 0x0010,
        SER_IOA_INFO = 0x0020,
        SER_USER_1 = 0x0040,
        SER_USER_2 = 0x0080,
        SER_USER_3 = 0x0100,
        SER_USER_4 = 0x0200,
        SER_USER_5 = 0x0400,
        SER_USER_6 = 0x0800,
        SER_TCMENU_DEBUG = 0x1000,
        SER_NETWORK_DEBUG = 0x2000,
        SER_IOA_DEBUG = 0x4000,
        SER_LOG_EVERYTHING = 0xffff
    };

At this point you can now use the logging. Whenever we refer to level below, it is one of the above levels.

## Using the logging framework

Each function generally has two variants, one that reads the first string from RAM, and one that reads the first string from FLASH. The ones for flash use the regular Arduino F macro. We mostly use the F variants everywhere, as it compiles out to nothing when not needed.

To log a single text string:

    serlogF(level, "This is a log line");
    serlog(level, "This is not using F(..)");

To log a text string with an extra value (the value can be anything supported by print):

    serlogF2(level, "Int value = ", 22);

To log a text string with two extra values (the value can be anything supported by print):

    serlogF3(level, "X, Y = ", 10, 20);

To log a text string with three extra values (the value can be anything supported by print):

    serlogF3(level, "X, Y, Z = ", 10, 20, 30);

To log a text string with one hex printed int value

    serlogFHex(level, "Hex Val = ", 0xf0);

To log a text string with two hex printed int values

    serlogFHex2(level, "Hex Vals = ", 0xf00d, 0xd00d);

To dump an array as a hex dump 

    serlogHexDump(level, "Hex dump", data, dataLen);

## Where does it log to?

On all Arduino boards, the logging defaults to `Serial`, you can easily change it to another location that supports the `Print` interface, such as any other serial port by defining the build flag: `LoggingPort` to another location. Example to change logging to Serial3 on PlatformIO:

    build_flags = -DLoggingPort=Serial3

On mbed proper (IE using mbed without Arduino), **we must define the print interface that will be used** that we need to use, as there is no straightforward way to know where to log to on mbed proper. An example of doing this is shown below. It first creates a serial port, then it creates the `LoggingPort` using the `MBedLogger` support class. Why does this work, it works because `IoAbstraction` implements Print for mbed boards.    

    BufferedSerial serPort(USBTX, USBRX);
    MBedLogger LoggingPort(serPort);

In summary, the logging framework is a compromise between functionality and size, biased slightly toward size.

## Example of the logging format on device

    3414-WRN:EEPROM Key NOT found D00D
    3419-TCM:Run EEPROM empty cb
    3420-DBG:Initialising server
    3658-TCM:root has changed

In the above examples we can see the time in mills since board start, followed by the level in three digits, then the text of the log line follows that. Any parameters are at the end after the title text.
