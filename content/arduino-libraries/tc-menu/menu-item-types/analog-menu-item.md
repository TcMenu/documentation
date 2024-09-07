+++
title = "Working with numeric values - AnalogMenuItem"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-11"
author =  "dave"
menu = "menu-item-types"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/title-types.jpg"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/tcmenu/html/index.html"
toc_needed = true
+++

## Working with Analog Items

An item that can represent an integer, fractional, or decimal numeric value that can be editable using a rotary encoder or touch scroll/slider control. Currently, the underlying value is a 16-bit unsigned integer value but the maximum range is from -32768 to +32767. This is because we can make it appear negative by providing a negative offset. We can also make it appear decimal by giving it a divisor.

Why the complexity? To enable direct editing with a rotary encoder or touch screen control, the value must start at 0 and go to a maximum value, regardless of the actual range of values. In terms of direct editing it's unlikely that even the full 16-bit range would be usable, this is why we also have the large number and floating point support.

You can apply an optional step to an analog item, which means that it goes up in value when edited by a rotary encoder or buttons at a rate other than 1, this does not apply when edited in touch based horizontal scrolling facilities, in those cases any value can be selected.

* If you need editable values that cover a much larger range see the [Large Number Support]({{< relref "largenum-menu-item.md" >}})
* If you need read-only status values outside this range use [Floating point Support]({{< relref "float-menu-item.md" >}}) 

## Type information for AnalogMenuItem

* Type: `AnalogMenuItem` and associated `AnalogMenuInfo` in MenuItems.h
* Type returned by `getMenuType()` is MENUTYPE_INT_VALUE
* [This item is based on an Info block]({{< relref "based-on-infoblock.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* [AnalogMenuItem reference documentation](https://www.thecoderscorner.com/ref-docs/tcmenu/html/class_analog_menu_item.html) 

## Creating an object from the designer

Choose to add a new menu item, and from the dialog choose Boolean item, once created the properties panel will look similar to:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-analog.png" title="Analog Item editor UI" alt="image showing editor for analog item" >}}

* Maximum Value - is the maximum integer value that can be represented, not including offset and divisor.
* Offset from zero - is for display only, it is added/subtracted from the current value.
* Divisor - is for display only, current value is divided by divisor.
* Step - the amount by which a change is applied on incremental updates such as from a rotary encoder or up/down presses.
* Unit name - is an optional unit for display, for example "dB". Leave blank for no unit.

## Examples of fixed point numbering

Let's say that we want to accurately hold values to two decimal places, starting at 0 and working up to 99.99. In this case, every whole digit increase requires a 100 increase in the fraction part. There is no offset, so that would be 0. Let's say the unit is power in watts.

    Divisor: 100
    Offset: 0
    Maximum Value: 9999
    Unit: W
    Step: 1
    Display value range: 00.00W -> 99.99W

Now let's say we have another decibel value that is incrementing in halves, it starts at -90 and has a maximum actual underlying value of 255. In this case every increment in whole value needs multiplying by 2. This time the offset is -90 * 2 so that is -180. The unit will be dB.

    Divisor: 2
    Offset: -180
    MaximumValue: 255 
    Unit: dB
    Step: 1
    Display value range: -90.0dB -> 37.0dB

Lastly, let's say we have an integer percentage between 0..100 with no fractional part. In this case there is no offset, and no divisor. However, we want to go up in steps of 2 when incrementally updated by an encoder or button presses:

    Divisor: 1
    Offset: 0
    MaximumValue: 100
    Unit: %
    Step: 2
    Display value range: 0% -> 100%

## Working with analog items in code

Converting to and from floating-point values that are automatically corrected by the offset and divisor. This avoids manually doing the fixed point arithmetic.

    float f = menuItem.getAsFloatingPointValue();
    menuItem.setFromFloatingPointValue(floatValue);

Converting to and from WholeAndFraction values, where the whole and the fractional part are in two integers, and automatically corrected by the offset and divisor. The fraction value is between 0 and divisor. This avoids manually doing the fixed point arithmetic.
 
    WholeAndFraction wf = menuItem.getWholeAndFraction()
    int wholePart = wf.whole;
    int fractPart = wf.fraction;
    bool neg = wf.negative;
    
    WholeAndFraction wf2(wholePart, fractPart, neg)
    menuItem.setFromWholeAndFraction(wf2);

For integer values that have an offset, you can also get the current integer value with the offset already applied as a convenience method.

    int valueIncOffset = menuItem.getIntValueIncludingOffset();

Although the above helpers make it easier to work with, you can also get and change the raw fixed point value. *Note that the divisor and offset will need to be applied manually by yourself in this case*:

    uint16_t currentValue = menuItem.getCurrentValue()
    menuItem.setCurrentValue(uint16_t val, bool silent = false)

## Creating an analog menu item from the CLI

To create an analog menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type analog --name AnalogName --eeprom AUTO [--localonly --readonly --hide]

The structure of an analog menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "analogItem",
      "item": {
        "maxValue": 0,
        "offset": 0,
        "divisor": 0,
        "unitName": "",
        "step": 1,
        "name": "AnalogName",
        "variableName": "AnalogName",
        "id": 1,
        "eepromAddress": -1,
        "functionName": "onVoltageChange",
        "readOnly": true,
        "localOnly": true,
        "visible": false,
        "staticDataInRAM": false
      }
    }

## Creating analog items manually

In nearly all cases it's better to create items using the designer. However, this is how you create an additional analog item manually should it be required. You can drop the `const` and `PROGMEM` from the INFO structure if you choose to create in RAM (isInProgmem parameter set to false). Even for RAM items never change the ID after adding to `menuMgr`.

    [const] AnalogMenuInfo minfoAnalogItem [PROGMEM] = { "Analog Item", myId, eepromLocation,
                                             maxValue, NO_CALLBACK, offset, divisor, unit };
    AnalogMenuItem menuAnalogItem(&minfoAnalogItem, 0, &nextMenuItem, [bool isInProgmem = true]);

Above we create an analog item along with it's associated info structure. `myId` should be replaced with the unique ID for the item, `eepromLocation` should be replaced with either -1 (no eeprom location) or a location in ROM, `NO_CALLBACK` signifies there is no callback, you can replace this with a callback if there is one.

Now for the numeric fields, maxValue is the largest represented value, divisor is the fixed point fraction and unit is the unit name to be displayed, up to 4 characters. 
