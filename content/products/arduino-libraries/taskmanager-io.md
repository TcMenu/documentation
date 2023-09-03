---
title: "TaskManagerIO library for Arduino and mbed"
description: ""
date: "2020-08-10"
author:  "system"
showChildren: false
type: "category"
githublink: "https://github.com/davetcc/TaskManagerIO/"
referenceDocs: "/ref-docs/taskmanagerio/html/index.html"
banner: "/products/arduino-libraries/images/electronics/arduino/taskmgr/taskmanager-conceptual-diagram.png"
menu:
    main:
        name: 'TaskManagerIO library'
        identifier: 'taskmanager-io'
        weight: 3
        parent: 'arduino-libraries'
aliases:
   - "/products/arduino-libraries/io-abstraction/task-manager-scheduling-guide/"
---

# TaskManagerIO - Summary

TaskManagerIO provides scheduling, events and interrupt marshalling, all while remaining thread safe across a wide range of boards. By thread safe we mean that you can add tasks to task manager from another thread while it's still running. However, the task manager itself will always run on one thread, making it easy for you to write code.

This library contains the original scheduling support class TaskManager that was previously built into IoAbstraction.

## Getting started and scheduling things to be done

<iframe width="95%" height="315" src="https://www.youtube-nocookie.com/embed/N1ILzBfu5Zc?si=15pkQ2omW3iC97ll" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Task manager can schedule tasks to be done either now, or at some point in the future. Available in all versions of task manager. 
 
 * [Task Manager scheduling guide]({{< relref "task-manager-scheduling-guide.md" >}})
 * [Tutorial - programming an Arduino using tasks]({{< relref "programming-arduino-using-tasks-tutorial.md" >}})
 * [Timed blink example (packaged with IoAbstraction)]({{< relref "timedBlink-example-ioAbstraction-library.md">}})
 * {{< library-overview >}}
 * [Read the reference documentation](/ref-docs/taskmanagerio/html/index.html)
 * [Go to the code repo on github](https://github.com/davetcc/TaskManagerIO/)

 
## Marshalling interrupts to task manager tasks
 
Task Manager can add an interrupt on your behalf that is marshalled into a task execution. Available in all versions of task manager.

* [Add a marshalled interrupt to task manager]({{< relref "marshalling-interrupts-using-taskmanager.md">}}) 
 
 
## Polling, Interrupt based and multi-threaded events

TaskManagerIO has a complete eventing framework built into it, on top of this many types of event based programs can be built.

* [Using polled events with TaskManager]({{< relref "using-polled-events-taskmanager.md">}})
* [Using interrupt event with TaskManager]({{< relref "using-interrupt-threaded-events-taskmanager.md">}})
* [Using spin-lock with TaskManager]({{< relref "task-manager-spin-lock-guide.md">}})

## Power management
 
 * [Low power task manager example - SAMD]({{< relref "task-manager-low-power-samd-example.md" >}})
 
## Adding tasks from other threads

If you are using an RTOS such as FreeRTOS on ESP32 or mbed RTOS 6 you can safely add tasks and trigger events from other threads. However, you should never run the run loop from more than one thread at a time. You can however, start another task-manager on another thread.

Remember that one of TaskManagerIO's main advantages is that your embedded apps don't need to be concerned with the possibility of access across more than one thread, or working out how to handle raw interrupt handlers. Removing these from the mix allows code to be cleaner.  

