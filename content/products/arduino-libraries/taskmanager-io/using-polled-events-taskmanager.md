+++
title = "How to create a polled event with TaskManager"
description = ""
tags = [ "arduino", "library", "eventing" ]
date = "2020-08-20"
author =  "dave"
menu = "taskmanager-io"
githublink = "https://github.com/TcMenu/TaskManagerIO"
referenceDocs = "/ref-docs/taskmanagerio/html/index.html"
banner = "/images/electronics/arduino/taskmgr/taskmanager-conceptual-diagram.png"
titleimg = "/images/electronics/arduino/taskmgr/taskmanager-conceptual-diagram.png"
toc_needed = true 
type ="blog"
weight = 0
+++

In this guide we assume that you are familiar with the API for scheduling tasks on task manager. Let's first discuss what we consider an event to be, and what it means to be a polled event.

By polling we mean no external actors (such as threads or interrupts) are involved. Task manager will ask your event instance frequently if it is ready to be triggered yet, if it is not then task manager will take your instruction on how long to wait, and then call again. Once the event indicates that it is ready to be triggered, task manager will then call the `exec()` method on the event, as it would for any `Executable`. At this point the event goes back to being in the un-triggered state again and starts polling again.

## Creating the event class

BaseEvent is the base class of all events that can be registered with task manager. This means that in order to register an event, we must have an instance of a class that implements `BaseEvent`.

In order to implement `BaseEvent` we must also implement the two pure virtual methods that are on the base, these are described in the section below. To see an event in action, there's packaged examples demonstrating their use.

First, we need to provide the polling method:

    virtual uint32_t timeOfNextCheck() = 0;

This method will be called immediately upon event registration, once called you are expected check if the event needs to be triggered, and also return when you want to be called again in micro seconds. For example if you wanted to check your event every millisecond, you would return 1000. Be very careful returning 0 here, as task manager uses unfair semantics; which means it will run a task with 0 time to go constantly. 

If during this poll, you determine that the event has triggered, you would then mark the event as triggered and return as normal. During this time, you could also mark the event as completed. The respective methods for this are shown below. Note that if you mark the event complete, from that point on it will no longer associated with task manager. If deleteWhenDone was true when the event was registered, it will also be deleted. 

    void setTriggered(true) 
    void setCompleted(bool complete)
    
    // To trigger an event from outside of the polling loop, and force event re-evaluation ASAP.
    void markTriggeredAndNotify()


The other method you must implement is the method that will be called when the event gets triggered. This is the same method as used in the Executable class `exec`. This code gets executed by task-manager once triggered. 

    virtual void exec() = 0;

## Registering an event instance

    taskid_t TaskManager::registerEvent(BaseEvent *eventToAdd, bool deleteWhenDone = false)
 
Where:

* eventToAdd is an instance of BaseEvent
* deleteWhenDone defaults to false, when true, task manager will delete the memory when the event is marked as complete.
* returns the ID of the task or TASKMGR_INVALIDID

[Go back to the TaskManagerIO page]({{< relref "taskmanager-io.md" >}})
