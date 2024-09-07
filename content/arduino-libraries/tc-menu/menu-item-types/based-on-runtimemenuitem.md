+++
title = "Detailed description of RuntimeMenuItem"
description = ""
tags = [ "arduino", "embedded-menu", "library" ]
type = "blog"
date = "2020-11-10"
author =  "dave"
menu = "menu-item-types"
banner = "/products/arduino-libraries/images/electronics/arduino/tcMenu/runtime-menuitem-desc.png"
githublink = "https://github.com/TcMenu/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
toc_needed = true
+++

Items that extend from runtime menu item use a callback at runtime that can be used to get more or less every property, but will use the INFO block if it is available (not null). That being the case, they _don't need_ but _can use_ an info block (that is defined ahead of time) ahead of time. However, in general use they work almost identically to regular menu items in nearly every way. In addition, they are still quite memory efficient.

* [See the main menu types page]({{< relref "menu-item-types.md" >}})
* [See the reference documentation showing the full hierarchy](https://www.thecoderscorner.com/ref-docs/tcmenu/html/class_menu_item.html) 

Runtime menu items main difference is that a "render callback" function can be used to get the static values such as EEPROM address, name and even it's current value. If you stick to creating items using the designer UI, you do not need to understand this fully. For all cases apart from list and custom scroll choice items you probably wouldn't even see the callback. Normally, in most cases, you'd still use an INFO block with runtime items, as they are just easier to create that way. 

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/runtime-menuitem-desc.png" title="Runtime menu item association with callback" alt="Runtime menu item callback view" >}}

It's important to understand that the render callbacks follow a kind of chain of command pattern, generally you provide a callback function that is capable of handling the things you want to override, and then delegates everything else to the parent. For most cases, you don't write a callback yourself, instead you'd normally use the INFO block method to create one, however if you really wanted to avoid an info block, you could use the following which fully implements a render function with name, EEPROM and invoke method:

    RENDERING_CALLBACK_NAME_INVOKE(fnName, parent, namepgm, eepromPosition, invoke)

From 3.1 onwards more complex cases requiring overriding of the control behaviour can use the override support. This works for text, large number and RGB items, you provide an override function that is called first and should delegate to the core. Your callback should always include a handler for name that returns false to use the default, or fills the buffer and returns true. The designer UI creates these when the function names ends in RtCall on supported types:

    RENDERING_CALLBACK_NAME_OVERRIDDEN(fnName, parent, namepgm, eepromPosition)

Where:

* fnName is the name to give to this function, usually something that indicates which menu it belongs to.
* parent the parent function to call. See the types below for the appropriate one to use.
* namepgm the name of the menu item - must be a progmem declared string
* eepromPosition the position to use in EEPROM for storage or -1.
* invoke the callback to invoke when changes occur.

Table of parent render functions by type

| Menu Item Type              | Parent Render Function |
|-----------------------------|------------------------|
| BackMenuItem                | backSubItemRenderFn    |
| SubMenuItem                 | backSubItemRenderFn    |
| TextMenuItem                | textItemRenderFn       |
| IpAddressMenuItem           | ipAddressRenderFn      |
| DateFormattedMenuItem       | dateItemRenderFn       |
| TimeFormattedMenuItem       | TimeItemRenderFn       |
| EditableLargeNumberMenuItem | largeNumItemRenderFn   |
| Rgb32MenuItem               | rgbAlphaItemRenderFn   |
| ScrollChoiceMenuItem        | enumItemRenderFn       |

## The callback definition

Below is the actual callback definition, although unless you are writing your own menu item extension, implementing a list callback, or implementing a custom scroll choice renderer you won't need to fully understand this. 

    int runtimeRenderingFn(RuntimeMenuItem* item, uint8_t row, RenderFnMode mode, 
                           char* buffer, int bufferSize);

Where:

* item is the runtime item making the callback
* row is the row number (or part in the case of multi edit items)
* mode is one of the below RenderFnMode enumeration
* buffer is provided for operations where a result is needed
* bufferSize is the size of the buffer

| RenderFnMode              | Meaning                                                               |
|---------------------------|-----------------------------------------------------------------------|
| RENDERFN_VALUE            | Copy the current value into buffer provided                           |
| RENDERFN_NAME             | Copy the name of the item at row into buffer provided                 |
| RENDERFN_EEPROM_POS       | Return the eeprom position for storage or -1                          |
| RENDERFN_INVOKE           | Invoke the action callback if there is one                            |
| RENDERFN_ACTIVATE         | From 3.1 on lists only, indicates a list index has become active      |
| RENDERFN_SET_VALUE *      | Set the value at index row to the buffer from an encoder (zero based) |
| RENDERFN_SET_TEXT_VALUE * | Set the value at index row to the buffer from its character value     |
| RENDERFN_GETRANGE *       | Get the zero based range of values at index row                       |
| RENDERFN_GETPART *        | returns the value of a single part of                                 |

\* multi edit only 

## Methods common to all RuntimeMenuItems

You can get the value of any runtime menu item by casting it to a `RuntimeMenuItem` and calling `copyValue`

    if(isMenuRuntime(item->getType()) {
        asRuntimeItem(item)->copyValue(buffer, bufferSize);
    }

You can get the number of parts, or it's size (when appropriate):

    uint8_t item->getNumberOfParts();
    uint8_t item->getNumberOfRows();    

## For MultiEditItems

There's a special case of `RuntimeMenuItem` called `EditableMultiPartMenuItem` that supports editing of complex types such as IP Address, Dates, Times, Large Numbers, and character arrays on the device. For these item types, they are edited one part at a time. For example, we edit an IPV4 address one part at a time.

For these types, row 0 is indicating that we are before the editing has started, row 1 indicates we are editing the first part and so on. The way that multi edit works is as follows:

    Editing starts (row is set to 0, isEditing = true)
    While more parts are left to edit
        Increment the row by 1
        Get the range of values for the current row (RENDERFN_GETRANGE)
        Get the current value of the part (RENDERFN_GETPART)
        Allow editing of the value
        Set the modified value (RENDERFN_SET_VALUE) 
    End While

## Customising multi edit item functionality

Text menu items and a few other multi edit controls support overriding the renderFN to create a custom control. For example, you can filter text input or create a completely custom implementation with this. There are several different cases covered in the examples. In the designer UI to create such menu item simply click "edit" next to the callback, and then select one of the "Runtime render FN" options from the callback type list, see the dialog below:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/callback-function-dialog.png" alt="Advanced editing of the callback function parameter"  title="Advanced callback parameter editor" >}}

Let's take a look at what gets generated for this:

In the projectName_menu.cpp file the following is generated:

    RENDERING_CALLBACK_NAME_OVERRIDDEN(fnAdditionalCustomHexRtCall, customHexEditorRtCall, "Custom Hex", -1)
    TextMenuItem menuAdditionalCustomHex(fnAdditionalCustomHexRtCall, "", 32, 4, NULL);

Then, in the sketch the following is generated:

    int CALLBACK_FUNCTION RtCall(RuntimeMenuItem* item, uint8_t row, RenderFnMode mode, char* buffer, int bufferSize) {
        switch(mode) {
        case RENDERFN_NAME:
            return false; // use default
        }
        return textItemRenderFn(item, row, mode, buffer, bufferSize); // pass thru to default
    }

So what happens is, by default if the RENDERFN_NAME request returns false, the default name is used, otherwise you can return true, and copy the name into the buffer. You can override as much or little of the functionality as needed, but for anything you don't handle, pass it through to the default handler as shown above. 

Note: Should you select the "definition only" mode, you will need to copy the implementation provided in the code definition to a suitable CPP file.

