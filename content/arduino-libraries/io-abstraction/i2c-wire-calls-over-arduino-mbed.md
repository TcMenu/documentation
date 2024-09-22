+++
title = "SPI and I2C/Wire abstraction that works on Arduino, mbed, PicoSDK"
description = ""
tags = [ "arduino", "digital-io", "library" ]
type = "blog"
date = "2021-05-21"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/TcMenu/IoAbstraction"
referenceDocs = "/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
titleimg = "/products/arduino-libraries/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
weight = 2
+++

IoAbstraction has core I2C/Wire and SPI functionality provided by several functions, these abstract the use of I2C and SPI over Arduino, mbed, PicoSDK and other supported platforms. Over time the implementation of these will be improved, such that asynchronous behaviour will be possible on certain boards.

Prior to 2.0, we had conditional I2C code scattered around the project, but now nearly all such functionality is separated out by platform, and sometimes even by board simplifying access.

{{< blockClear "left" >}}

## Wire/I2C abstraction

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

### Reading bytes from the bus

To read bytes from the bus:

    bool ioaWireRead(WireType wire, int address, uint8_t* buffer, size_t len);

Where:

* wire is a `WireType` as described above. EG `&Wire` on Arduino.
* address is the address as required on the platform. EG 7 bit on Arduino, 8 bit on mbed.
* buffer is where the bytes read should be stored
* len is the number of bytes to read
* returns true if the read is fully successful, otherwise false. 

### Writing bytes to the bus

    bool ioaWireWriteWithRetry(WireType pI2c, int address, const uint8_t* buffer, 
                               size_t len, int retriesAllowed = 0, bool sendStop = true);

Where:

* wire is a `WireType` as described above. EG `&Wire` on Arduino.
* address is the address as required on the platform. EG 7 bit on Arduino, 8 bit on mbed.
* buffer the bytes to write
* len is the number of bytes to write
* retriesAllowed is the number of times to attempt the operation, 0 = only once.
* sendStop allows you to keep the bus open ready for a repeated start, use with care.

## The SPI abstraction

You can use SPI regardless of platform using the SPI abstraction. This is used in a few places within IoAbstraction so is already quite stable.

### Construction of SPI abstraction

In order to create an instance, you first need to create an `SPIWithSettings` object:

    SPIWithSettings spiObj(&SPIBus, csPin);

Then in your code somewhere:

    spiObj.init();

Where:

* SPIBus is the SPI bus on your hardware, for example on Arduino this may be `&SPI` for example.
* csPin is the chip select pin, doing any transfers automatically selects the pin first.

The class is quite small and has copy constructors, so you can safely copy it over by value, and this is often how its used within IoAbstraction.

### Transferring data over SPI

Normally on SPI you read and write data at the same time, therefore to `transfer` data call the following method that will first select the chip, do the transfer, and then deselect the chip:

    uint8_t readWriteData[dataSize];
    bool ok = spiObj.transferSPI(readWriteData, dataSize);

Where

* readWriteData is a uint8_t array of at least dataSize, the read data is put into the array after calling.
* dataSize is the number of bytes to transfer

{{< refdocs title="You can read more about this in the reference documentation" src="/ioabstraction/html/index.html" >}}

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})