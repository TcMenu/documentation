+++
title = "Simple Collection - Thread safe circular buffer"
description = ""
tags = [ "arduino", "digital-io", "library" ]
type = "blog"
date = "2020-11-28"
author =  "dave"
menu = "simple-collections"
githublink = "https://github.com/TcMenu/SimpleCollections"
referenceDocs = "/simple-collections/html/index.html"
banner = "/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
aliases = ["/products/arduino-libraries/io-abstraction/simple-collection-btree/"]
weight = 2
+++

Circular buffer provides an easy way to interact with events that take place on another thread or in an interrupt, it is not very efficient when used on a single thread because it uses atomic operations to ensure consistency of the buffer. It is an advanced collection for use by users that understand threading and writing interrupt safe code.

There are two implementations, an optmized version for storing bytes, and a generic version that can be used to store any type, the generic version can also be created as a memory pool, where it works slightly differently.

## How circular buffer works

        Buffer
        0
        1  <-- read pointer
        2
        3  <-- write pointer
        4
        5

A circular buffer has one pointer for read and one for write, each are controlled independently and wrap when they reach the end of the buffer. So in the case below, once we increment past 5 we go back to 0. In this sense, they will overwrite data and they will never block. This makes them safer for use in critical code areas such as interrupts.

When we want to check if something is available, we call the `available` method, when we want to get the next item and bump the count, we call `get`. To put something into the buffer we call `put`. That's it, the only restriction is that get must never be called when available returns false, and only one thread / interrupt should use the `available` and `get` methods. Any number of threads can put.

## Create a Circular Buffer instance

To create the dedicated byte based buffer with 32 bytes storage:

    SCCircularBuffer myBuffer(32);

To create a generic circular buffer with 8 slots:

    GenericCircularBuffer<MyStorageType> myBuffer(8, bufferMode);

Where `MyStorageType` must not be polymorphic, it must be primitive, struct or simple class type. The `bufferMode` can be either `CIRCULAR_BUFFER` or `MEMORY_POOL`.

## Advanced use cases

In circular buffer mode, it acts like a regular buffer as described above. In pool mode `available` ALWAYS returns true. It is a decision for you to make if you should allow this mode to be used. Whenever using pool mode, the size of the pool must be big enough for the largest possible case, or it will wrap.

When using the generic circular buffer you may want to store class types that are not atomic. In this case, create a buffer of pointers, create a pool as large as the buffer, take an object from the pool, populate it, and then put it into the buffer. This is the ONLY thread-safe way to populate an object, you must make sure that the object data visibility across threads is managed, either by using volatile or atomic primitives. 

For example:

    GenericCircularBuffer<MyStorageType> myPool(8, MEMORY_POOL);
    GenericCircularBuffer<MyStorageType*> myBuffer(8, CIRCULAR_BUFFER);

    auto myStorage = myPool.get();
    // populate values onto myStorage
    myBuffer.put(&myStorage);

There's an example for circular buffer packaged with the library. 