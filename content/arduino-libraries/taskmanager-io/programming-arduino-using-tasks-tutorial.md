+++
title = "Programming Arduino using tasks instead of loops - tutorial"
description = ""
tags = [ "arduino", "digital-io", "library", "eventing" ]
type = "blog"
date = "2018-02-09"
author =  "dave"
menu = "taskmanager-io"
githublink = "https://github.com/TcMenu/TaskManagerIO"
referenceDocs = "/taskmanagerio/html/index.html"
banner = "/images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
titleimg = "/images/electronics/arduino/7seg/16x2-display-over-i2c-small.jpg"
weight = 3
aliases = [ "/products/arduino-downloads/io-abstraction/programming-arduino-using-tasks-tutorial/",
            "/products/arduino-libraries/io-abstraction/programming-arduino-using-tasks-tutorial/"]
+++

In this tutorial for TaskManagerIO I explain the differences between traditional 
loop based programming; which is very common on the Arduino platform and event based
programming based on taskManager. 

Although event based programming looks slightly more complicated at first, as the sketch and
surrounding code gets more complex, eventing will scale to that much easier. Eventing task
frameworks make ongoing maintenance much easier.

{{< blockClear "left" >}}

## Example: Two LEDs blink at different rates.

Let's first take a look the traditional loop based approach, we'll start by setting 
things up:

    void setup() {
        pinMode(13, OUTPUT);
        pinMode(12, OUTPUT);
    }

And now lets add our blink example on pin 13, the loop would look something like:

    bool pin13State;
    void loop() {
        delay(1000);
        digitalWrite(13, pin13State);
        pin13State = !pin13State;
    } 

Great, but now we want to have pin 12 flash 10 times a second:

    bool pin12State;
    bool pin13State;
    int counter = 0;
    void loop() {
        delay(100);
        if((counter%10)==0) {
            digitalWrite(13, pin13State);
            pin13State = !pin13State;
        }
        digitalWrite(12, pin12State);
        pin12State = !pin12State;   
        counter++;
    }

As you can see above, we've only got two requirements in there now, and it's already starting
to look a bit complicated. At this point we will introduce task manager. TaskManager is an
eventing framework, you tell it when you want to do something, and it will call you back at
the right time to do it.

First we need to include the `TaskManagerIO` library at the top of the file and then change the
file to look like this:

    #include <TaskManagerIO.h>
    
    bool pin12State;
    bool pin13State;
    
    void togglePin12() {
        digitalWrite(12, pin12State);
        pin12State = !pin12State;           
    }
    
    void togglePin13() {
        digitalWrite(13, pin13State);
        pin13State = !pin13State;
    }
    
    void setup() {
        taskManager.scheduleFixedRate(100, togglePin12);
        taskManager.scheduleFixedRate(1, togglePin13, TIME_SECONDS);
    }
    
    void loop() {
        taskManager.runLoop();
    }
    
As you can see, the above code may be slightly longer, we can shorthand this using lambda
functions if you prefer, here I replace the two functions with inline C11 lambda's that are
supported on Arduino:

    void setup() {
        taskManager.scheduleFixedRate(100, [] {
            digitalWrite(12, pin12State);
            pin12State = !pin12State;           
        });
        taskManager.scheduleFixedRate(1, [] {
            digitalWrite(12, pin12State);
            pin12State = !pin12State;           
        }, TIME_SECONDS);
    }

## Example: The startup sequence of a power amplifier.

Let us now take a more complex example, the startup of a power amplifier where a state machine
is needed. In this example we map the following states to tasks:

* Task 1: Warm up: we must use reduced power to start the system
* Task 2: Power steady: after 10 seconds we go into steady, speakers still off
* Task 3: Ready: after another 5 seconds we are now ready for use.

```
// this code is not really to paste into Arduino IDE and run, its provided as an
// example of how a timed state machine can be implemented easily and cleanly 

void readyForUse() {
    // at this point we are ready for business 
}

void powerSteady() {
    // do any additional tasks here
    taskManager.scheduleOnce(5, readyForUse, TIME_SECONDS);
}

void startUpMode() {
    // enable reduced power relay        
    taskManager.scheduleOnce(10, powerSteady, TIME_SECONDS);
}

void setup() {
    // other setup tasks
    startUpMode();
}

void loop() {
    taskManager.runLoop();
}
```

For greater detail take a look at the examples shipped with the library. There's also the [complete documentation for the library]({{< relref "io-abstraction.md">}})

[Go back to the TaskManagerIO page]({{< relref "taskmanager-io.md" >}})
