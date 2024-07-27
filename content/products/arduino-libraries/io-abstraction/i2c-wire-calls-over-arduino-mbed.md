+++
title = "IOA I2C/Wire abstraction that works Across Arduino and mbed"
description = ""
tags = [ "arduino", "digital-io", "library" ]
type = "blog"
date = "2021-05-21"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
weight = 2
+++

IoAbstraction 2.0 onwards has core I2C/Wire functionality provided by several functions, these abstract the use of I2C over Arduino and mbed, and over time the implementation of these will be improved, such that asynchronous behaviour will be possible on certain boards.

Prior to 2.0, we had conditional I2C code scattered around the project, but now nearly all such functionality is separated out by platform, and sometimes even by board, we've made this available through the API, so you can use it too.

We wrap up the wire object with `WireType`; which on Arduino it is a TwoWire pointer and on mbed it is an I2C pointer. For example the default wire type on Arduino would be `&Wire`. Be aware that this is not a complete replacement for Wire/I2C, it is a simple set of calls for reading and write from I2C where the device is master. It works on a very wide range of boards without needing code changes.

## Initialise Wire/I2C and utility methods

To initialise the I2C layer, on mbed you call the following providing the I2C object to use:

    void ioaWireBegin(I2C* pI2cToUse);

For Arduino boards you would call the following to use the `Wire` default:

    void ioaWireBegin();

To set the speed at which the bus runs, set the frequency such as 100000, 400000:

    void ioaWireSetSpeed(WireType pI2c, long frequency);

To check if the bus can be used at the moment for a given address:

    bool ioaWireReady(WireType wire, int address);

On all boards there is a lock around the i2c bus, this ensures that only one thread deals with the bus at once.

    extern SimpleSpinLock i2cLock;

## Reading bytes from the bus

To read bytes from the bus:

    bool ioaWireRead(WireType wire, int address, uint8_t* buffer, size_t len);

Where:

* wire is a `WireType` as described above. EG `&Wire` on Arduino.
* address is the address as required on the platform. EG 7 bit on Arduino, 8 bit on mbed.
* buffer is where the bytes read should be stored
* len is the number of bytes to read
* returns true if the read is fully successful, otherwise false. 

## Writing bytes to the bus

    bool ioaWireWriteWithRetry(WireType pI2c, int address, const uint8_t* buffer, 
                               size_t len, int retriesAllowed = 0, bool sendStop = true);

Where:

* wire is a `WireType` as described above. EG `&Wire` on Arduino.
* address is the address as required on the platform. EG 7 bit on Arduino, 8 bit on mbed.
* buffer the bytes to write
* len is the number of bytes to write
* retriesAllowed is the number of times to attempt the operation, 0 = only once.
* sendStop allows you to keep the bus open ready for a repeated start, use with care.

[You can read more about this in the reference documentation](/ref-docs/ioabstraction/html/index.html)

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})