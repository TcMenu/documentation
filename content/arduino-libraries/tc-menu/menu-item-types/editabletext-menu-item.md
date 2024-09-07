+++
title = "Working with text, date, time and IP address items  - "
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

An item that represents a complex data type that needs to be edited a part at a time. The value is generally held in RAM and can usually be saved in EEPROM between sessions. These items take various forms on the embedded side, either an Ip Address, date, time or plain text.  Time menu items allow for the editing of time values, either to the hundredth of a second or to the second either as 24 hour or 12 hour. Ip address items are IPV4 addresses edited in 4 parts. Text fields can be regular text fields or password text fields, each character is edited separately. Date fields allow for the editing of gregorian dates.

## Class types for MultiEdit items

* Type: `TextMenuItem` with default callback `textItemRenderFn` in RuntimeMenuItem.h
* Type: `IpAddressMenuItem` with default callback `ipAddressRenderFn` in RuntimeMenuItem.h
* Type: `TimeFormattedMenuItem` with a default callback function of `timeItemRenderFn` in `RuntimeMenuItem.h`
* Type: `DateFormattedMenuItem` with a default callback function of `dateItemRenderFn` in `RuntimeMenuItem.h`
* [This item is based on RuntimeMenuItem]({{< relref "based-on-runtimemenuitem.md">}})
* [Information applicable to all menu items]({{< relref "menu-item-types.md" >}})
* {{< refdocs title="Documentation page for these types" src="/tcmenu/html/_runtime_menu_item_8h.html" >}}

Table showing what `getMenuType()` returns for each class type

| Class type               | MenuType Enumeration   |
| ------------------------ | ---------------------- |
| TextMenuItem             | MENUTYPE_TEXT_VALUE    |
| IpAddressMenuItem        | MENUTYPE_IPADDRESS     |
| TimeFormattedMenuItem    | MENUTYPE_TIME          |
| DateFormattedMenuItem    | MENUTYPE_DATE          |

## Creating an object from the designer

From the add dialog choose to create a text menu item and once it's selected the editor panel will look similar to:

{{< figure src="/products/arduino-libraries/images/electronics/arduino/tcMenu/generatorui-edit-text.png" title="Text Item Editor UI" alt="image showing the text editor">}}

* maxLength: the allocated size of the string, anything copied in that's longer will be truncated.
* editorType: at the moment plain text or IP address

Note that PLAIN_TEXT is one of the few menu item types that is variable length, so you should set the length before generating any other items and using the EEPROM auto allocation, otherwise an overlap may be possible.

## Working with complex editable items in code

To get and set the value of a plain text menu item:

	void setTextValue(const char* text, bool silent = false);
	const char* getTextValue() { return data; }

To get/set the password field status use the below. Once the field is marked as password, the value will show as '*' symbols. Upon editing only the current character will reveal itself:

    void setPasswordField(bool pwd)
    bool isPasswordField()

To get and set the value of an IpAddress menu item:

    // set IP address from text
	void setIpAddress(const char* source);

    // as four parts.
    void setIpAddress(uint8_t p1, uint8_t p2, uint8_t p3, uint8_t p4);
    
    // get the four parts of the address.
    byte* getIpAddress()
    
    // or as a string
    void copyValue(char* buffer, int bufferSize);

To get and set the value of a time item:

    // First we can get and set the time storage object
    TimeStorage getTime()
    void setTime(TimeStorage storage)
    
    // On the TimeStorage object we can access the hours, minutes, seconds and hundreds 
    uint8_t hours;
    uint8_t minutes;
    uint8_t seconds;
    uint8_t hundreds;

To get and set the value of a date item:

    DateStorage getDate()
    void setDate(DateStorage date)
    
    // On the DateStorage object we can access the years, months and days.
    uint16_t year;
    uint8_t  month;
    uint8_t  day;

## Creating a text menu item from the CLI

To create a text menu item [from the CLI]({{< relref "tcmenu-cli-workflow.md" >}}) here is a template command (options in square brackets are optional):

    tcmenu create-item --parent 0 --type text --eeprom AUTO --name TextName [--localonly --readonly --hide]

The structure of a text menu item in the EMF file is:

    {
      "parentId": 0,
      "type": "textItem",
      "item": {
        "textLength": 0,
        "itemType": "PLAIN_TEXT",
        "name": "TextName",
        "variableName": "TextName",
        "id": 6,
        "eepromAddress": 6,
        "readOnly": false,
        "localOnly": false,
        "visible": true,
        "staticDataInRAM": false
      }
    }

Where itemType is one of:

    PLAIN_TEXT
    IP_ADDRESS
    TIME_24H
    TIME_12H
    TIME_24_HUNDREDS
    GREGORIAN_DATE
    TIME_DURATION_SECONDS
    TIME_DURATION_HUNDREDS
    TIME_24H_HHMM
    TIME_12H_HHMM

## Creating items manually

As always, the easiest way to generate items is in the designer. All the items have similar constructors, which can be looked up in the reference docs linked above. However, here we give a couple of examples to get you started:

    // ipAddress item
    [const] [PROGMEM] AnyMenuInfo minfoIpAddress = { "IpAddress", myId, myEepromAddress, 0, NO_CALLBACK };
    IpAddressMenuItem menuIpAddress(&minfoIpAddress, IpAddressStorage(127, 0, 0, 1), &nextMenuPtr, [bool isInfoProgmem = true]);

    // Text item  
    [const] [PROGMEM] AnyMenuInfo minfoExtrasText = { "Text", myId, myEepromLocation, 0, NO_CALLBACK };
    TextMenuItem menuExtrasText(&minfoExtrasText, "initial", size, nextItemPtr, [bool isInfoProgmem = true]);

Above we create two textual items, one for text, one for IP addresses, the name of the callback method is `fnIpAddressRtCall/fnConnectivityTextCb` and most requests pass through to `ipAddressRenderFn/textItemRenderFn`. The menu item name will be "Text" or "IpAddress" and the callback is not set `NO_CALLBACK` for both. Change `myId` to the desired ID and `myEepromLocation` to a suitable storage location or 0xFFFF.
