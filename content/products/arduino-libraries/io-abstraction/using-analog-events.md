+++
title = "Working with Analog input events in IoAbstraction"
description = ""
tags = [ "arduino", "mbed", "library", "analog-io" ]
date = "2020-12-02"
author =  "dave"
menu = "io-abstraction"
githublink = "https://github.com/davetcc/IoAbstraction/"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = "/products/arduino-libraries/images/electronics/arduino/power/input-library-8574.jpg"
toc_needed = true 
type ="blog"
weight = 0
+++

IoAbstraction has a class named `AnalogInEvent` to support event based programming for Analog Inputs, it is based on the `BaseEvent` class within [the base library TaskManagerIO]({{< relref "taskmanager-io.md">}}). The class itself is very flexible and can work with both polling and interrupt based approaches, or even a hybrid of the two. If you are not familiar with events, I recommend reading about them in the above TaskManagerIO link.

You can see the [reference guide for analog event here](https://www.thecoderscorner.com/ref-docs/ioabstraction/html/class_analog_in_event.html).

`AnalogInEvent` is configurable and can be set to trigger on a level being breached, in either direction - IE less than or greater than. To be able to use an AnalogInEvent, you'll first need an [analog abstraction for the device with the ADC]({{< relref "using-ioabstraction-analog-core.md" >}}) in order to create an event class.

## Creating an analog event

First include the header:

#include <DeviceEvents.h>

Then create a new class that extends the `AnalogInEvent` class similar to the one below:

    class MyAnalogEvent : public AnalogInEvent {
    public:
        MyAnalogEvent(AnalogDevice* device, pinid_t pin) :
                AnalogInEvent(device, pin, threshold, eventType, pollInterval) {
        }
    
        void exec() override {
            // if you get here, the event has triggered, IE the condition
            // on analog in is true.
        }
    };

Possible values for `eventType`:

* ANALOGIN_EXCEEDS - Trigger the event when it goes above the threshold
* ANALOGIN_BELOW - Trigger the event when it goes below the threshold
* ANALOGIN_CHANGE - Trigger the event when there is a change greater than threshold

`pollInterval` is the number of microseconds between each polling check, you can use helper functions `millisToMicros` and `secondsToMicros` to help you convert. You change this at any time using `setPollInterval`.

`threshold` is the parameter to the event, and its meaning depends on the `eventType`

Once you've got a class, create a global instance and register the event:

    // here we create the object using new, and tell taskmanager to 
    // own the memory (and delete it if it becomes completed) 
    taskManager.registerEvent(new MyAnalogEvent(myDeviceRef, myPin), true);
    
    // here we assume a global instance of the event class instead
    taskManager.registerEvent(&myGlobalEvent);

Should you want to register some kind of analog-in interrupt, you can register the interrupt, then within the raw ISR it is safe to do the following. It just triggers the event in taskManager, and does not do anything in the ISR.

    void myRawAnalogIsr() {
        myAnalogEvent.readingAvailable();
    }
 
[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
