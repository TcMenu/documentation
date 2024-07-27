+++
title = "Task Manager - Spin Lock guide"
description = ""
tags = [ "arduino", "library", "eventing" ]
date = "2021-04-20"
author =  "dave"
menu = "taskmanager-io"
githublink = "https://github.com/TcMenu/TaskManagerIO"
referenceDocs = "/ref-docs/taskmanagerio/html/index.html"
banner = "/images/electronics/arduino/taskmgr/taskmanager-marshalling-interrupt.png"
toc_needed = true
type ="blog"
weight = 5
+++

Task Manager supports the concept of Spin Locks to protect sensitive asynchronous operations  from becoming interleaved. For example, to protect sensitive blocks of code. Be very aware that this does not include a memory barrier.

A spin lock loops waiting for the lock to become available, you can either spin for a period of time, or until the lock is acquired. While waiting for the lock in the spin, TASKS DO NOT RUN, and you must **never call yieldForMicros while holding a lock.** It is designed for very short locking operations in microseconds.

The `SimpleSpinLock` class itself provides the locking functions; which are [covered in detail here](). However, there is also the `TaskMgrLock` object that provides a convenient way to use the locking within a C++ code block, the constructor calls `lock`, the destructor calls `unlock`, so if you use it within a code block, it will protect that block with the lock. However, when you lock synchronously as below, you should ensure that these locks are of a very short duration (low order milliseconds) as they do prevent yieldForMicros(..) from returning.

    SimpleSpinLock spinLock;

    void setup() {
        taskManager.scheduleOnce(1000, [] {
            TaskMgrLock locker(spinLock);
            // do some work here that needs the lock
            // it is unlocked as the lambda exits
        });
    }

You can also use `spinLock` that will try for a period of time in microseconds to take the lock, or `tryLock` that will tell you if the task you're in already owns the lock, this allows for asynchronous statemachine type usages. Be very careful when using the locks in an asynchronous manner as it is far more complex to ensure every lock has an associated unlock. Do not use yieldForMicros in an asynchronous lock.

Events taking place completely outside of task manager can use this lock.

So basically, be aware that these locks have limitations, keep the time locked to an absolute minimum and follow the guide above carefully.