+++
title = "Marshalling interrupts into TaskManagerIO tasks"
description = ""
tags = [ "arduino", "library", "eventing" ]
date = "2020-08-15"
author =  "dave"
menu = "taskmanager-io"
githublink = "https://github.com/TcMenu/TaskManagerIO"
referenceDocs = "/ref-docs/taskmanagerio/html/index.html"
banner = "/images/electronics/arduino/taskmgr/taskmanager-marshalling-interrupt.png"
titleimg = "/images/electronics/arduino/taskmgr/taskmanager-marshalling-interrupt.png"
toc_needed = true 
type ="blog"
weight = 5
+++

Interrupt handling is generally an advanced topic, but this library provides a very simple way to handle interrupts. There are two ways to handle interrupts in TaskManagerIO, the first is by marshalling, and the second is by writing an event. 

We recommend that all new code uses [the event method to handle interrupts]({{< relref "using-interrupt-threaded-events-taskmanager.md" >}}), although we have no plans to deprecate the method below. 

When you tell the library to handle an interrupt, the library registers the interrupt handler on your behalf, then when the condition is met the internal handler is triggered, it sets a flag to tell the library an interrupt has been raised. The task library treats this as the highest priority, and as soon as the current task is completed the interrupt code runs. This may not be real time enough for all uses, but will be fine for most cases.
 
 Note that all events and interrupts trigger the same interrupt handler, so you should check that the event is actually one you're interested in before acting on it.

## Registering an interrupt handler

Before anything else, to use interrupt support, you need a class that extends from `InterruptAbstraction`. Any `IoAbstractionRef` will do this. However, if you are not using IoAbstraction, on Arduino we provide a basic one within TaskManagerIO itself, it should support most boards.

    #include <BasicInterruptAbstraction.h>

You must provide a function that will be called back when the interrupt triggers. You can call any Arduino functions as normal during the callback, as you are not in the interrupt handler, the task library has 'marshalled' it into a task.

    void onInterrupt(uint8_t interruptNumber) {
        // do something with interrupt.
        // For pins 1, 2, 3, 5, 18 the number will be set. Otherwise 0xff
    } 

To register the interrupt callback, and add an interrupt on a pin whenever the pin changes:

	taskManager.setInterruptCallback (onInterrupt);   // <--- always do this first
	taskManager.addInterrupt(ioDevice, pin, interruptMode); 
	
Where

* ioDevice is an IO abstraction, see next section
* pin is the pin on which to register the interrupt
* interruptMode is one of RISING, FALLING, CHANGE.

That's it, your interrupt function will be called by task-manager when an interrupt gets triggered. This provides a very simple way to work with interrupts, and it work across a wide range of devices..

[Go back to the TaskManagerIO page]({{< relref "taskmanager-io.md" >}})
