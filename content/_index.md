---
title: "Arduino and mbed Libraries"
description: "Arduino and mbed Libraries"
date: "2015-05-04"
author: "system"
showChildren: true
type: "category"
toc_needed: true

---

## TcMenu organisation documentation for our libraries 

There are several core libraries that we keep in lock step in terms of compatibility and board support. These libraries are:

* [TaskManagerIO]({{< relref "taskmanager-io.md">}}) provides core event and task scheduling services to Arduino sketches.
* [IoAbstraction]({{< relref "io-abstraction.md">}}) provides user input, EEPROM and IO helper classes.
* [tcMenu]({{< relref "tc-menu.md">}}) a fully fledged embedded menu framework with a designer UI and IoT capabilities
* [tcUnicodeHelper]({{< relref "tc-unicode-helper.md">}}) UTF-8 unicode support for Adafruit_GFX, tcMenu, U8G2, LTDC, and TFT_eSPI.
* [SimpleCollections]({{< relref "simple-collections.md">}}) a simple binary searchable list and a thread/interrupt safe circular buffer that work on a very wide range of boards.
* [LiquidCrystalIO]({{< relref "liquidcrystal-io.md">}}) a task manager friendly fork of the Arduino LCD library that works over many IO devices.

The above libraries support a wide range of hardware, including nearly every official Arduino board, most ESP boards, along with many mbed version 5 and 6 boards with or without an RTOS. We test with everything from Uno to ESP32 and large STM32F4 boards.

## What boards do our libraries support?

| Processor   | Platform         | Libraries    | Locking | DAC | Developer boards we test with      | 
|-------------|------------------|--------------|---------|-----|------------------------------------|
| AVR         | Arduino          | Fully tested | Atomic  | No  | Uno - some features limited        |
| AVR         | Arduino          | Fully tested | Atomic  | No  | MEGA 2560, WifiR2                  |
| SAMD        | Arduino          | Fully tested | Atomic  | Yes | MKR1300                            |
| SAMD        | Seeed Arduino    | Fully tested | Atomic  | Yes | MG126 board                        |
| nrf52840    | Arduino(mbed)    | Fully tested | CAS     | Yes | Nano 33 BLE devices                |
| RPI Pico    | Arduino(mbed)    | Fully tested | CAS     | No  | Raspberry PI pico, TFT, encoder    |
| RPI Pico    | Arduino(EarlePH) | Fully tested | CAS     | No  | Raspberry PI pico, TFT, encoder    |
| ESP8266     | Arduino          | Fully tested | Atomic  | No  | Node MCU, Heltek Wifi 8            |
| ESP32       | Arduino          | Fully tested | CAS     | Yes | Wifi32, AZ Dev Kit                 |
| ESP32S2     | Arduino          | Fully tested | CAS     | Yes | ESP32S2 Saloma                     |
| ESP32S3     | Arduino          | Fully tested | CAS     | No  | ESP32S3 Tiny                       |
| STM32F4     | Stm32Duino       | Fully tested | Hybrid  | Yes | Nucleo STM32F4x9ZI OLED            |
| Particle    | Photon           | User tested  | Atomic  | No  | Unknown, user tested               |  
| SAM         | Arduino          | Compilation  | Atomic  | Yes | Arduino Due compile test only      |
| STM32F4     | mbed RTOS        | Fully tested | CAS     | Yes | Nucleo/Disc1 STM32F4x9ZI LTDC/OLED |
| RP2040      | Pico-SDK/CMake   | Fully tested | CAS     | No  | Tested fully within TcLibSDK       |

Although we only test on some Arduino mbed boards, it should work on nearly all that we know of, you can take a look at [the list of mbed boards we check for](https://github.com/TcMenu/IoAbstraction/blob/main/src/PlatformDetermination.h#L19) here, if another springs to light that we haven't added please try adding it to that define statement, and if it works let us know.

* For both mbed direct and Arduino that's based on mbed we rely on mbed inbuilt CAS locking. We've tested on a few different Arduino mbed and direct mbed boards.
* For ESP32 we use the underlying CAS capabilities to ensure cross core locking
* On ESP boards we call yield more often within the run loop to prevent watchdog resets.
* On Raspberry PI pico [earlephilhower core](https://github.com/earlephilhower), circular buffers and task manager use a critical section to synchronize data. 
* On STM32Duino at the moment we are transitioning from using Arduino Atomic functions to using direct LDREX/STREX calls. Completed for CircularBuffer but not TaskManager.

## Defining Build Flags and Platform settings

Most of our libraries support adding a file locally in the root of your source called `zio_local_definitions.h`, once added this will be included by the platform determination before doing anything else. This allows two ways of setting build level flags, firstly by providing them in the build options, secondly within this file. This means that you can easily define build options when using Arduino 1.x IDE.

### In TaskManagerIO

Whenever you include `TaskManagerIO.h` this pulls in `TaskPlatformDeps.h` to work out what platform you're building for, and to create suitable thread safety and CAS or Atomic based locking constructs for that platform. Again the thread safety is so that you can put events into task manager from any thread, or trigger events from interrupts. You should only ever call runLoop from a single thread, usually for the default `taskManager` instance that would be the `loop()` method on Arduino, or `main()` on mbed.

The follow build flags can be set either in your build tool or in `zio_local_definitions.h`:

* `DEFAULT_TASK_SIZE` - sets the number of tasks in each block, if you define this you MUST define `DEFAULT_TASK_BLOCKS` too
* `DEFAULT_TASK_BLOCKS` - sets the number of timesd task manager can allocate a block of size `DEFAULT_TASK_SIZE`
* `TM_ENABLE_CAPTURED_LAMBDAS` redefine task manager callback functions as std::function on boards that support it, therefore allowing argument capture.

### In IoAbstraction

Whenever you include `IoAbstraction.h` or include `PlatformDetermination.h` directly, then IoAbstraction need to work out how to provide all input output features that it supports. This allows the rest of IoAbstraction not to concern itself with platform differences. This goes right down to GPIO, the way I2C works, and even analog IO support. For ESP32 we provide analog input and output using IDF functions, allowing the analog support on ESP32 to support the inbuilt DAC, ADC and PWM (using LEDC).

Platform related settings:

* `TMIOA_FORCE_ARDUINO_MBED` force Arduino mbed for an undetected mbed board.
* `IOA_DEVELOPMENT_EXPERIMENTAL` only to enable untested features in development.
* `IOA_USE_ESP32_EXTRAS` use ESP32 specifc calls instead of the Arduino ones. Can easily be turned on/off, whatever works for your case.
* `IOA_ENABLE_STM32_HAL_EXTRAS` enable STM32 specifc HAL features, such as battery backed ROM support.
* `IO_MKR_FORCE_LOWRES_ANALOG` force MKR to use lower 8 bit resolution analog output.

Logging compile time settings:

* `IO_LOGGING_DEFAULT_LEVEL` the default logging levels that are on, see the `SerLoggingLevel` enum for possible values that are ORed.
* `IO_LOGGING_DEBUG` turn logging on by defining this.
* `LoggingPort` override the default logging port on Arduino which is `Serial`, on mbed this should be dealt with at runtime.

Switches and encoder settings:

* `SWITCH_POLL_INTERVAL` the poll interval in milliseconds, defaults to 20, changing this alters the other dependent parameters
* `HOLD_THRESHOLD` the number of poll interval ticks before the key is considered held
* `SWITCHES_ACCELERATION_DIVISOR` the divisor to apply to acceleration 0 = extremely fast (untested!), 1 = fast, 2 = regular, 3 = slower
* `REJECT_DIRECTION_CHANGE_THRESHOLD` for hardware rotary encoder debouncing - how long in micros before accepting a direction change.
* `MAX_KEYS` the number of keys to define upfront, the array will be reallocated if needed at runtime.
* `MAX_ROTARY_ENCODERS` the maximum number of rotary encoders that can be used, will not reallocate.
* `MAX_JOYSTICK_ACCEL` the maximum acceleration for analog joystick encoder emulation
* `ALLOWABLE_RANGE` the floating point amount that is used to determine if an analog button press is in range +/-, default is 0.01F
* `TC_LEGACY_ENCODER` if defined the legacy `HardwareRotaryEncoder` class will be used instead of the newer state based class. 

Touch specific settings:

* `TOUCH_THRESHOLD` the threshold at which a touch is considered to be made, floating point value, default is 0.05F

### In TcUnicode library

Whenever you use TcMenu, TcUnicode is always included as well. It provides UTF-8 unicode support to many display libraries. Here are the configurable options:

* `HUGE_FONT_BITMAPS` switch on 32 bit support for font bitmap ranges, only needed for TcUnicode fonts that are particularly large, as font bitmaps are per unicode block already.

### In TcMenu library

Whenever you include tcMenu.h you include `IoAbstraction`, `SimpleCollections` and `TaskManagerIO` by default. There are a few compile time settings for tcMenu itself, but you can also adjust all the settings for the dependant libraries too. 

Menu item and iteration settings:

* `MAX_MENU_DEPTH` the maximum depth for non-recursive iteration, defaults to 4 levels deep. 
* `NAV_ITEM_ARRAY_SIZE` defines the default stack size for navigation, defaults to 4 levels.
* `NAME_SIZE_T` sets the size of the char field for name items, defaults to 20 chars.
* `UNIT_SIZE_T` sets the size of the char field for analog item units, defaults to 5 chars.
* `TCMENU_NO_DEFAULT_ENCODER` do not allocate a default encoder when there is no other encoder.

Remote connectivity settings:

* `CLIENT_DESC_SIZE` the size of the client information received from a remote device, normally 16.
* `MAX_PIN_LENGTH` the size of the pin storage field, normally 16.
* `HEARTBEAT_INTERVAL` the milliseconds between heartbeat messages
* `MAX_VALUE_LEN` the largest value that can be received in a tag value message, must be at least 40.

Should you need serial number management, (IE you have more than one board):

* `TC_MANUAL_SERIAL_NO_IMPL` indicate that you want to implement `uint32_t getBoardSerialNumber()` yourself
* `TC_BOARD_SERIAL_NO` long 32 bit integer containing the board serial number. Defaults to `999999999L`

Drawing specific:

* `NEED_32BIT_COLOR_T_ALPHA` use 32-bit colour information instead of 16-bit
* `MINIMUM_CURSOR_SIZE` ensure that any cursor on a graphical display is at least this many pixels
* `TC_TOUCH_DEBUG` turn on additional visual diagnotics for touch screens

### In SimpleCollections

Simple collections circular buffer is thread and interrupt safe, this is achieved by checking the board type we have compiled to providing a suitable atomic compare and update facility for that platform. On mbed it uses mbed atomic, on STM32Duino F4 it uses LDREX, on ESP32 it uses the RTOS constructs. On other boards it uses standard Arduino atomic functions. It should be safe on all the boards listed in the supported section, and probably more besides.

* `TMIOA_FORCE_ARDUINO_MBED` force Arduino mbed for an undetected mbed board.
* `SC_USE_ARM_ASM_CAS` **advanced users only**, force the use of ARM LDREX/STREX where we've not carefully tested it.

## Java UIs and frameworks

In addition to this the Java UI framework which is heavily based on JavaFX is used for the designer, embedCONTROL UI and embedded java apps is tested on a wide range of hardware, we suggest using the excellent [Liberica JDK](https://bell-sw.com/) as it has JavaFX built in, and a 32bit build for Raspberry PI available.

| Platform       | Designer     | embedCONTROL | Java Embedded | JDK Used |
|----------------|--------------|--------------|---------------|----------|
| Windows 10/11  | Fully tested | Fully tested | Fully tested  | Liberica |
| MacOS          | Fully tested | Fully tested | Fully tested  | Liberica |
| Ubuntu desktop | Fully tested | Fully tested | Fully tested  | Liberica |
| Raspberry PI   | Fully tested | Fully tested | Fully tested  | Liberica |

## JavaScript embedCONTROL.JS

The webserver version of embedCONTROL is built in TypeScript, we target most modern browsers and test with desktop and mobile version of both Chrome and Safari. The generated website is highly standards compliant, based on React.JS, and therefore should work with a very wide range of browsers.

## Are there differences between platforms

We have tried as hard as we can to avoid any user-level differences in core features between platforms. It should work close to identically on all platforms that we support. There are obviously a few extra features on some platforms that are available to use, but when using these it should be pretty clear they platform specific.
