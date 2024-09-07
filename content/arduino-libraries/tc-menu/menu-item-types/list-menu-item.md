+++
title = "Working with lists of data - ListRuntimeMenuItem"
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

Runtime lists support the displaying of list based data, where each row can have a name and values. There are three types of list item:

* Firstly FLASH based items, these work similar to enum items as the items are predefined at compile time. You can build these in designer directly.
* Secondly there's the option to have RAM based values, where an array of strings is provided, and designer will present whatever is in these strings.
* Lastly, there's the option for completely custom, each value is obtained from the runtime callback.

On most devices lists work somewhat like sub menu's when displayed on the renderer, and when presented through the API or on a remote UI, they show up as regular lists.

Lists are highly memory efficient, there's one MenuItem that handles every row, the back item, and the "parent item" when it's not the active menu. In your callback the request for the "title text" name comes through as row `LIST_PARENT_ITEM_POS`. Every other row comes through zero based up to the current size.

## Class types for ListRuntimeMenuItem

* `ListRuntimeMenuItem` is defined in RuntimeMenuItem.h
* Enum returned by `getMenuType()` is MENUTYPE_RUNTIME_LIST
* [This item is based on RuntimeMenuItem]({{< relref "based-on-runtimemenuitem.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* [Runtime List menu item documentation](https://www.thecoderscorner.com/ref-docs/tcmenu/html/class_list_runtime_menu_item.html)

## Adding a list item from the designer

To add a list item in the designer select add item and then choose "List". The properties area will switch to look similar to below:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-list.png" title="List Item Editor UI" alt="image showing the list editor">}}

When you choose list, you can choose from the three types discussed above:

* `CUSTOM_RTCALL` - you will provide the values by a callback in your sketch, this gives you the most freedom but is more complex to implement. every time an item is needed the callback is called. Initial rows is editable by you.
* `RAM_ARRAY` - you will put strings into an array of a fixed size in RAM, which starts off populated with nullptr entries. You can vary the number of items in the list, but must never exceed  the initial array size. Initial rows is editable by you and is the size of the array created.
* `FLASH_ARRAY` - designer will take the values upfront and generate them in the code, note that this is entirely in FLASH and the values can't be modified at runtime. With this mode, you add the text entries directly in designer, the list of entries will become editable. Initial rows is set to the number of items in the FLASH array.

Callbacks in the INFO block, and from designer work exactly as any other item, when an item is selected in the list, the callback is called.

## Creating a list menu item from the CLI

To create a list menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type list --name ListName [--localonly --readonly --hide]

The structure of a list menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "runtimeList",
      "item": {
        "initialRows": 0,
        "name": "ListName",
        "variableName": "ListName",
        "id": 11,
        "eepromAddress": 0,
        "readOnly": false,
        "localOnly": false,
        "visible": true,
        "staticDataInRAM": false
      }
    }

## Accessing List Runtime items in code 

To set the number of items (your callback must be immediately able to provide data for this many rows):

    setNumberOfRows(uint8_t rows)
    
As discussed earlier, we use one list item for everything. We discuss these methods here for completeness, but most of the time they're used only by renderers. These methods make the list item switch into different modes - after use always call asParent() to reset the state back to the default:

    // to act as a back menu
    RuntimeMenuItem* asBackMenu();

    // to act as a sub menu
    RuntimeMenuItem* asParent();

    // to act as a particular child for a given index
    RuntimeMenuItem* getChildItem(int requiredIndex);

Now let us look at this in terms of how lists show up on the renderer. Below, we see an image showing an example of how lists render onto displays. Remember from above that there is only one list item, when we call one of the above three methods the list prepares itself to act as it should for that item. Notice that there is a number in brackets next to each list item, this is the row number sent to the name and value callbacks.

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/runtime-menuitem-rendering.png" title="Left, list in parent menu. Right, list drawn similar to submenu" alt="List item presentation on most renderers" >}}

Now we will take a look at how to send a list via the API conceptually.

    // Psuedocode for Remote Message:
    Message.ID = ListItem.ID
    Message.Name = [call RENDERFN_NAME row =  LIST_PARENT_ITEM_POS]
    For N in 0..(ListItem.NumberOfRows-1)
        Message.ListItem[N] = [call RENDERFN_NAME row = N] + [RENDERFN_VALUE row = N]
    End For
    Send Message

Then in the API lists we use a List<string> to represent them. 
 
## Generating code and for various mode

### FLASH Based Lists

For simple cases you can use a list that is based on an array, either in RAM or in FLASH and read only. If the list is read only, then you choose to locate the items in `FLASH_ARRAY`. In this mode the designer will create a constant array of strings. Each entry in the array is stored in the project `emf` as follows:

    {
      "id": itemID,
      "listItems": [
        "entry 1",
        "entry 2"
      ]
    }

In code, the designer will then generate as follows:

    const char enumStrSubRamList1_0[] PROGMEM = "entry 1";
    const char enumStrSubRamList1_1[] PROGMEM = "entry 2";
    const char* const enumStrSubRamList1[] PROGMEM  = { enumStrSubRamList1_0, enumStrSubRamList1_1 };
    const PROGMEM AnyMenuInfo minfoSubRamList1 = { "Name", myId, myEeprom, 0, myListCallback };
    ListRuntimeMenuItem menuSubRamList1(&minfoSubRamList1, 2, enumStrSubRamList1, ListRuntimeMenuItem::FLASH_ARRAY, &menuSubRamListRam, INFO_LOCATION_PGM);

### RAM based lists
 
If you want a simple list of items that do not go above a fixed size, then use a RAM based array. For this you simply set the inital rows large enough to cope with any list size you need, and then you can assign a RAM based string to each entry. Initially each entry in the RAM list will be set to nullptr will just render as empty. You can resize the rows to any number up to the array size.

In designer you simply set the number of rows to be the largest possible size you need, and it will create an array of nullptr's that size. Here is an example:

    char* enumStrSubRamListRam[] = { nullptr, nullptr, nullptr, nullptr, nullptr, nullptr };
    AnyMenuInfo minfoSubRamListRam = { "My Name", myId, myEeprom, 0, myCallbackFunction };
    ListRuntimeMenuItem menuSubRamListRam(&minfoSubRamListRam, 6, enumStrSubRamListRam, ListRuntimeMenuItem::RAM_ARRAY, &menuSubRamListCustom, INFO_LOCATION_RAM);

The character array will be available in your sketch, you can repopulate the list, and then set it as changed.

## Implementing the list rendering callback

Before reading this please ensure you've read [items based on RuntimeMenuItem]({{< relref "based-on-runtimemenuitem.md">}}), it provides the  core knowledge needed to understand the following code.

It is up to you to implement the render function, it will default to present the row number for each row when designer generated the rendering code. To choose this option simply choose the custom list option and set the number of initial rows. 

The code generator will create a custom render function for you in your project file and the following is the example:

    int CALLBACK_FUNCTION exampleListRenderFn(RuntimeMenuItem* item, uint8_t row, RenderFnMode mode, char* buffer, int bufferSize) {
        switch(mode) {
        default:
            return defaultRtListCallback(item, row, mode, buffer, bufferSize);
        }
    }

Into the above, we can handle the various `mode` and `row` cases with the most likely candidates described below, you can see the full list in the runtime menu item main page linked above:

* `RENDERFN_NAME` - for scroll choice items, you don't need to implement this unless you want to override the default name.
* `RENDERFN_VALUE` - is called for each `row` and should return the value at that position.
* `RENDERFN_ACTIVATE` - a new list row has become the active `row`.
* `RENDERFN_INVOKE` - a new list `row` has activated, you can use a regular callback defined in the INFO instead of using this.

Example of creating a custom item in code:

    const PROGMEM AnyMenuInfo minfoSubRamListCustom = { "My Name", myId, myEeprom, 0, myActivateCallback };
    ListRuntimeMenuItem menuSubRamListCustom(&minfoSubRamListCustom, 10, fnSubRamListCustomRtCall, nullptr, INFO_LOCATION_PGM);

## Notes around performance and sizing of lists

Although lists are efficient on the device, we need to be able to send them remotely, and to do that we send the whole list every time. The absolute maximum number of items a list can handle is 254, but there are limits you'll hit before that in the protocol because it uses a single ASCII character to store the index, so the remote limit is probably around 100 items, and if it updates very frequently, possibly less.

In the future we may provide a configurable higher limit, that attempts to improve matters so that lists could hold far more items, and change the remote API to do delta publication, but right now follow the rules of thumb above. 
