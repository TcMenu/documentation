+++
title = "Task Manager Low Power example for SAMD boards"
description = ""
tags = [ "arduino", "digital-io", "library", "power-management" ]
type = "blog"
date = "2019-09-25"
author =  "dave"
menu = "taskmanager-io"
githublink = "https://github.com/TcMenu/TaskManagerIO"
referenceDocs = "/ref-docs/taskmanagerio/html/index.html"
banner = "/images/electronics/arduino/tcMenu/low-power-arduino-battery-9v.jpg"
titleimg = "/images/electronics/arduino/tcMenu/low-power-arduino-battery-9v.jpg"
weight = 2
aliases = ["/products/arduino-libraries/io-abstraction/task-manager-low-power-samd-example/"]
+++

There are often cases when you'll need to run a micro controller from a battery power source. Unlike when running from mains power, every milli-amp matters. In these cases IoAbstraction's task manager is able to integrate easily with most low power libraries.

Task manager works by repeatedly calling the `runLoop()` function within `loop()` or `main`, during each loop task manager evaluates if any tasks are yet ready to run, and if they are it runs them. What we do here is to check how long there is to the next task, and if the length of time is long enough we enable low power mode for that time.   

Don't forget that SwitchInput (switches) also supports interrupt managed switches and buttons, and is always in interrupt mode for rotary encoders. This further reduces power by not needing polling to manage your input devices. You'll need to check if the attached peripherals can work in the mode you select, but other than that there's little more to it.  

## SAMD (MKR, Nano IOT, Zero) Low power example

Here is an example for SAMD boards that requires the following:

* An MKR or other SAMD based board
* TaskManagerIO from library manager or IoAbstraction up to 1.5.x
* ArduinoLowPower from library manager

```
/*
Low Power Timed blink, this example shows how to build the simple Blink application using both 
IoAbstraction and TaskManager also along with the low power library for SAMD21.

Requires SAMD based arduino board such as MKR
*/

#include<IoAbstraction.h>
#include <ArduinoLowPower.h>

// constant for the pin we will use
const int ledPin = LED_BUILTIN;

// the state of the pin, we will toggle it.
int ledOn = LOW;

// create an IO abstraction, so later we could put the led on a shift register or i2c.
IoAbstractionRef ioDevice = ioUsingArduino(); 

void setup() {
    // set the pin we are to use as output using the io abstraction
    ioDevicePinMode(ioDevice, ledPin, OUTPUT);
    
    // and create the task that toggles the led every second.
    taskManager.scheduleFixedRate(1000, toggle);
    
    // schedule something else at a slightly unusual rate to cause non rounding by 100..  
    taskManager.scheduleFixedRate(2345, [] { Serial.println("2345 millis past!"); });
}

// this is the call back method that gets called once a second
// from the schedule above.
void toggle() {
    // now we write to the device, the 'S' version of the method automatically syncs.
    ioDeviceDigitalWriteS(ioDevice, ledPin, ledOn);

    ledOn = !ledOn; // toggle the LED state.
}

void loop() {
    // this is all we should do in loop when using task manager.
    taskManager.runLoop();
    
    // after runLoop finishes, all tasks that are due have been run
    // now we see if we can go alseep for a while.
    int millisDelay = (taskManager.microsToNextTask() / 1000UL);
    if(millisDelay > 100) {
        // uncomment to see the delay
        Serial.print("Enter low power for ");
        Serial.println(millisDelay);
        
        // here we call into the low power library for SAMD to reduce power usage for
        // the time that no tasks are running.
        LowPower.idle(millisDelay);
    }
}
```

Example serial output:

    Enter low power for 107
    2345 millis past!
    Enter low power for 1000
    Enter low power for 953
    Enter low power for 906

The output of the above sketch is that the built in LED will flash on and off every second, with delays managed in low power mode. **You may need to use double reset to re-program the board after uploading this sketch; this is especially true if you choose to use the deeper sleep modes, as these affects the serial USB interface**.

## Going into a very low power state

You could essentially alter the loop above to go into an ultra low power state under some circumstances. You could essentially stop calling into task manager altogether for some time. There are many combinations that would reduce power even further.

[Go back to the TaskManagerIO page]({{< relref "taskmanager-io.md" >}})
