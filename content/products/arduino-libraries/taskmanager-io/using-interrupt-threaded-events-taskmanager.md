+++
title = "Creating interrupt and threaded events with TaskManager"
description = ""
tags = [ "arduino", "library", "eventing" ]
date = "2020-08-20"
author =  "dave"
menu = "taskmanager-io"
githublink = "https://github.com/davetcc/TaskManagerIO/"
referenceDocs = "/ref-docs/taskmanagerio/html/index.html"
banner = "/images/electronics/arduino/taskmgr/taskmanager-conceptual-diagram.png"
titleimg = "/images/electronics/arduino/taskmgr/taskmanager-conceptual-diagram.png"
toc_needed = true 
type ="blog"
weight = 0
+++

In this guide we assume that you are familiar with the API for scheduling tasks on task manager. Let's first discuss what we consider an event to be, and what it means to be an interrupt or threaded event.

Interrupt or threaded events are subject to external actors (such as threads or interrupts). In this case the event will invariably be triggered by an external event. However, task manager will still ask your event class instance if it is ready to be triggered yet by polling, but in this case you have two choices as listed out below:
 
1. **Interrupt/Thread only**: we do nothing in the `timeOfNextCheck` other than return a large value. Then in the ISR we trigger and notify, task manager will then deem the event triggered and call the `exec()` method on the event, as it would for any `Executable`. At this point the event goes back to being in the un-triggered state again and starts again.

2. **Hybrid polled Thread/Interrupt**: in the interrupt handler we just ask task manager to re-run the events by calling `taskManager.triggerEvents()` without marking as triggered. At this point we get back into the `timeOfNextCheck()` method where we can re-evaluate if the event needs to fire or not.

## Creating the event class

BaseEvent is the base class of all events that can be registered with task manager. This means that in order to register an event, we must have an instance of a class that implements `BaseEvent`.

In order to implement `BaseEvent` we must also implement the two pure virtual methods that are on the base, these are described in the section below. To see an event in action, there is a packaged example demonstrating their use.

First, we need to provide the following method, that in this case does very little:

    virtual uint32_t timeOfNextCheck() = 0;

This method will be called immediately upon event registration, once called you are expected to do any checking that is needed, and return when you want to be called again in micro seconds. Because this event is interrupt or thread based, we just return a large value here, anything up to an hour in micro seconds. Be very careful returning 0 here, as task manager uses unfair semantics; which means it will run a task with 0 time to go constantly.

The other method you must implement is the method that will be called when the event gets triggered. This is the same method as used in the Executable class `exec`.

    virtual void exec() = 0;

## Registering the event with task manager

Once we have our event class, we then register an instance of it with task manager.

    taskid_t registerEvent(BaseEvent *eventToAdd, bool deleteWhenDone = false)
     
Where:

* eventToAdd is an instance of BaseEvent
* deleteWhenDone defaults to false, when true, task manager will delete the memory when the event is marked as complete.
* returns the ID of the task or TASKMGR_INVALIDID

## Triggering the event in the ISR or thread

When the raw interrupt occurs (not a task manager marshalled interrupt), or the thread detects the event condition, you would then mark the event as triggered. During this time, you could also mark the event as completed. The respective methods for this are shown below. Note that if you mark the event complete, from that point assume that it is not associated with task manager. If deleteWhenDone was true when the event was registered, it will also be deleted. 

    void markTriggeredAndNotify()
    void setCompleted(bool complete)

Both of the above methods are safe to call in either an interrupt context or on another thread. It is also safe to add tasks from another thread, *but it is NEVER safe to add a task from a raw ISR, only to trigger an event*, Be careful with variables in any classes when you work with a raw ISR or different threads, memory visibility may be a problem.

## Simple example of event triggering from interrupt

    // create a global instance of your event 
    class MyEvent : public BaseEvent {
        uint32_t timeOfNextCheck() overrride { return secondsToMicros(60); }
        void exec() override {
            // do the work here when triggered.
        }
    } myEvent;
    
    // during setup add to task manager
    taskManager.registerEvent(&myEvent);
    
    // register the interrupt handler
    ioDeviceAttachInterrupt(ioAbstractionRef, intPin, myISRFunction, RISING); 

    // globally declare the interrupt function.
    void myISRFunction() {
        // here we now mark the event as triggered.
        myEvent.markTriggeredAndNotify();
    }

## A work about safety critical systems

Systems that include life support and anything else that is safety critical must NOT use the open source version of the library in production. We can prepare custom versions that are tested on your hardware for a particular purpose. Please contact us for more information.

[Go back to the TaskManagerIO page]({{< relref "taskmanager-io.md" >}})
