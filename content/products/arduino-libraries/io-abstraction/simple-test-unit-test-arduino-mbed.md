+++
title = "Simple Test - unit test framework for Arduino and mbed"
description = ""
tags = [ "arduino", "library" ]
type = "blog"
date = "2022-11-16"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/davetcc/IoAbstraction/"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/images/electronics/arduino/tcMenu/ioa-logging-example.jpg"
weight = 5
+++

Simple test is a no-frills unit testing framework that works on Arduino and mbed. It sits on top of IoAbstraction and SimpleCollections and works on a very wide range of Arduino boards and mbed. It uses a similar method of test creation to AUnit, and you'll probably find much of this very familiar.  

Why did we write this? We really liked using AUnit library, and had four sets of embedded tests that were based on that library. Unfortunately, as time went by more and more of the boards the libraries needed to support dropped off the supported list. This is not as complete as AUnit, it is the least number of components that provide a unit test framework. It meets our needs, it _might_ just meet yours too.

In order to see output from the unit tests, you'll need to turn on [the internal IoLogging logger]({{< relref "arduino-logging-with-io-logging.md">}})

## Getting started writing a unit test 

First create a directory, and put a main sketch file in it. We recommend your main file be a `cpp` file and not an `ino`. The contents should look like 

    #include <TaskManagerIO.h>
    #include <testing/SimpleTest.h>

    using namespace SimpleTest;

    // This makes the test mbed compatible, it will create a UsbSerial object in mbed
    // and assign it to TX and RX. It is ignored on Arduino
    IOLOG_MBED_PORT_IF_NEEDED(USBTX, USBRX)
    
    void setup() {
        // starts the serial component and sets the speed to 112500
        IOLOG_START_SERIAL
        // this prepares the tests
        startTesting();
    }
    
    // this creates a standard run loop, on mbed it creates a main
    DEFAULT_TEST_RUNLOOP

With this in place we can now write our first test, we start by creating the test with a global `test(name)` block as shown below. This creates and records a test to be run during the run phase later on. Note that expected values are always first with any equality tests.

    test(myImportantTest) {
        // numeric equality
        assertEquals(10, 5 + 5);
        assertLessThan(10, 9);
        assertMoreThan(10, 11); 
        assertEquals('A', 'A');

        // direct boolean equality
        assertFalse(false);
        assertTrue(true);
        fail("boom");

        // assert on string equality
        assertStringEquals("hello", "hello");

        // assert that a float is near a given value
        assertFloatNear(10.4, 10.4001, 0.01);
    }

You can also write tests that have fixtures, these give the advantage of having state within the fixture class, and also the `setup` and `teardown` methods are called before/after tests. Example below:

    class MyTestFixture : public SimpleTest::UnitTestExecutor {
    private:
        int myNum = 0;
    public:
        void setup() override {
            myNum = 10;
        }

        void teardown() override {
            myNum = 0;
        }

        bool isMyNum10() { return myNum == 10; }
    }

    testF(MyTestFixture, testNumIs10) {
        assertTrue(isMyNum10());
    }

What happened here, we created the fixture class when the testF was encountered, an instance is created and stored, once executed the `setup()` runs first, then the test method itself, finally `teardown()` is called. You can hold any state you like in the class too.

See the reference documentation for more information.

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
