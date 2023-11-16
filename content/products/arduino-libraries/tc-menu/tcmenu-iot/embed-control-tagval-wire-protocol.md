+++
title = "TcMenu - TagVal protocol documentation"
description = ""
tags = [ "arduino", "display-driver", "embedded-menu", "library" ]
type = "blog"
date = "2018-10-25"
author =  "dave"
menu = "embed-control"
banner = "/images/electronics/arduino/tcMenu/tagval-proto-title.jpg"
titleimg = "/images/electronics/arduino/tcMenu/tagval-proto-title.jpg"
githublink = "https://github.com/davetcc/tcMenu"
referenceDocs = "/ref-docs/tcmenu/html/index.html"
weight = 99
toc_needed = true
aliases = ["/products/arduino-libraries/tc-menu/tcmenu-tagval-protocol-documenation/"]
+++

embedCONTROL local area transmissions use a protocol called TagVal with the option of sending binary data using Raw messages. TagVal is a simple and lightweight protocol that has implementations on device for Arduino and mbed, [Java as an API]({{< relref "tcmenu-java-api-to-arduino-remote-control.md" >}}), [Javascript using embedCONTROL.JS](https://github.com/davetcc/embedcontrolJS) and there is also a .NET implementation should someone step forward to help productionize it. As its name suggests TagVal is a Tag to Value protocol, somewhat like a Map in most high level languages.

If you are working in a language where an API is provided, you don't need to understand the protocol as the API deals with the protocol.

Before reading this, I recommend that you've tried generating a menu, read through at least the [quick start documentation]({{< relref "tcmenu-overview-quick-start.md" >}}) and the reference material (see getting the code section on the right).

{{< blockClear "left" >}}

## The basics of a TagVal message

In tcMenu a message always starts with the byte `0x01` followed by the protocol; which in the case of TagVal is `0x01`. Following the protocol ID is the protocol specific block, here we discuss TagVal protocol. Finally all messages end with a <0x02> regardless of protocol.

Let us take a look at the simplest possible message in wire format:

    <0x01><0x01>HBHI=3000|<0x02>

Now lets breakdown that message into parts:

| Byte | Data    | Meaning                  |
|------|---------|--------------------------|
| 0    | <0x01>  | Start of msg             |
| 1    | <0x01>  | Protocol (tag val is 1)  |
| 2    | HB      | Message type field       |
| 4    | HI=3000 | Heartbeat interval field |
| 11   | &#124;  | Field separator          |
| 12   | <0x02>  | End of msg               |

We can see from the above table that messages start with 0x01 and are followed immediately by the protocol, following this for TagVal messages the two character field will be followed by an equals sign and the value. Field keys must be exactly two characters and the values must be shorter than the definition `MAX_VALUE_LEN` on the Arduino side (default 40). Every field must be terminated with a pipe symbol, after the last pipe symbol there must be a `<0x02>` which marks the end of message.

### Binary message within a tagval stream

A binary message can be sent over a tag value stream, it uses the second available protocol, which is PROTOCOL_BIN_GZIP which means binary data gzipped, and is usually used for static data that is served from the application, such as form data. You should note that this is relatively new being introduced at tcMenu 4.2.

| Byte   | Data        | Meaning                               |
|--------|-------------|---------------------------------------|
| 0      | <0x01>      | Start of msg                          |
| 1      | <0x01>      | Protocol (bin gzip is 2)              |
| 2      | MT          | Message type field                    |
| 4      | Length      | uint16 length of data (hi byte first) |
| 6..end | binary data | the binary data of the length above   |

### Types supported within messages

String fields are free-form and can contain the pipe character by escaping it the same way as C language strings. Anything marked as defaultable may not appear in the message at all, and you have to then ensure that your processor can handle the message when that field is missing.

Version fields in TagVal are packed into an integer, where major version is multiplied by 100 and the minor version added to it. For example 1.2 would be (100 * 1) + 2 or `102`. The most minor version is not presented, as it's assumed that breaking changes would never occur in a patch release.

MenuIDs are integer values that represent a menu item uniquely.

Boolean values are `0` for false and `1` for true.

The platforms and types are defined within `RemoteTypes.h` within the embedded library and also in the APIs.

## Messages and their contents

In TagVal protocol, every message has a message type which is the first two characters of the message, and there must be a processor on both sides that can convert this message into something appropriate. Message types, like fields are restricted to two bytes in length. It again makes them very easy to process on the embedded side. There is a list of message types and fields in `RemoteTypes.h` within TcMenu library, along with all API.

Below, we go through the format of each message type.

{{< figure src="/products/arduino-libraries/images/apps/embed-control/embed-control-protocol-state-machine.png" alt="Embed Control/TcMenu Protocol diagram, showing approximate message flow" title="Embed Control/TcMenu Protocol diagram, showing approximate message flow" >}}

All connections start by sending a heartbeat with mode set to START to the remote. The remote wil respond to this by sending back a join message. Next, we send either a join or pairing request to either start a connection or in the case of pairing, to store our ID with the device.

In the case of pairing, the device sends back an Acknowledgement, indicating if the pairing succeeded. This is the end of the connection and a hearbeat of type END should be sent and the connection closed.

In the case of a regular connection, the device also sends an acknowledgement, and if unsuccessful that is the end of the connection, a heartbeat of type END should be sent and the connection closed. Otherwise, we proceed to bootstrapping, where the menu structure on the device is communicated to the client. This starts with a bootstrap start, followed by the boot items then a bootstrap end. Once the bootstrap end is received the connection is ready.

### Pairing message (type: PR)

Authentication can be enabled on to the embedded side, and when it's enabled before the first connection the application will need to pair it's UUID with the server. UUID's are a 36 character string that universally uniquely identifies that client. In most cases the UI or other connecting component would generate a UUID on installation or first run and keep that ID for subsequent connections. *Any connection that is used for pairing should be closed after receiving an acknowledgement from the server.*

Example:

    PRNM=Lighting|UU=575d327e-fe76-4e68-b0b8-45eea154a126|

Field definitions:

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| NM  | String  | The name of your UI           |
| UU  | String  | UUID of your UI               |

### Join Message (type: NJ)

Join message is used when a new connection is made, to indicate the details about that connection. It MUST be sent on a connection before any other message. It contains the name and UUID key for a given client which will be checked with the authenticator. If you receive an acknowledgement indicating an error immediately after joining, then the join attempt failed.

Example:

    NJNM=Lighting|UU=575d327e-fe76-4e68-b0b8-45eea154a126|VE=100|PF=0|US=999999999|

Field definitions:

| Field | Type     | Description                     |
|-------|----------|---------------------------------|
| NM    | String   | Name for connection             |
| IC    | UUID     | UUID Key for UI                 |
| VE    | Version  | The version of the sender       |
| PF    | Platform | The platform of the sender      |
| UU    | UUID     | The UUID of the remote app      |
| US    | Integer  | The serial number of the remote |

### Heartbeat Message (Type HB)

Used when there are no messages going to or from the host to keep the connection open. Without these being sent and received at regular intervals, the connection will close at both sides. The server (embedded) side determines the interval by sending it in the first heartbeat. The server must pick up and then use this as the heartbeat interval. The timestamp if set, is for purely informational purposes.

Example:

    HBHI=3000|HM=1948119|

HbType:
* 0 - NORMAL a normal heartbeat
* 1 - START indicates the start of a connection
* 2 - END indicates we should close the connection now

Field definitions:

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| HI  | Integer | Duration between heartbeats   |
| HM  | Integer | Timestamp when sent           |
| HR  | HbType  | One of the above enum values  |

### Bootstrap Message (type: BS)

Used to indicate the start and end of a bootstrap. This is normally used to send the contents of the menu tree to the remote side. Usually when items are being sent to the remote, a boot start will occur before, and a boot end after.

Example:

    BSBT=START|

Field definitions:

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| BT  | String  | Either `START` or `END`       |

### AnalogItem boot Message (type: BA)

Represents an `AnalogMenuItem` that belongs to the menu tree being remotely controlled. Analog items are generally smaller integer values (up to 65355 unique values) that can be controlled by a rotary encoder. The value can be divided to make a fixed point value and an offset can be provided. Any unit name is shown after the value.

Example:

    BAPI=0|ID=1|RO=0|NM=Hall|AU=%|AM=100|AO=0|AD=1|VC=0|

Field definitions:

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |
| VC  | Integer | The current value             |
| AU  | String  | The unit name, EG: `dB`       |
| AM  | Integer | The maximum value             |
| AO  | Integer | The offset for the value      |
| AD  | Integer | The divisor for the value     |


### EnumItem boot Message (type: BE)

Represents an `EnumMenuItem`  that belongs to the menu tree being remotely controlled. These items generally represent a series of choices similar to a combo box.

Examples:

    BEPI=0|ID=4|RO=0|NM=On Alm|VC=0|NC=2|CA=All On|CB=Silient|

Field definitions:

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |
| VC  | Integer | The current value             |
| NC  | Integer | Number of choices to follow   |

Each choice starts at field `CA` onwards so choice 2 would be `CB`:

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| Cn  | String  | String value for a choice     |


### BooleanItem boot Message (type: BB)

Represents a `BooleanMenuItem` that belongs to the menu tree being remotely controlled. These items generally represent yes/no choices. The naming can be set to:

* 0 - TRUE / FALSE
* 1 - YES / NO
* 2 - ON / OFF

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |
| VC  | Boolean | The current value             |
| BN  | Integer | The naming used see above     |

### TextItem boot Message (type: BT)

Represents any type of menu item that extends from `EditableMultiPartMenuItem` that belongs to the menu tree being remotely controlled. These items generally represent some text that can be changed in accordance with the type of value the item can hold.

    enum EditType { PLAIN_TEXT = 0, IP_ADDRESS = 1 }

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| EM  | EditType| The type of data supported    |
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |
| VC  | String  | The current value             |
| ML  | Integer | The maximum length            |

### FloatMenuItem boot Message (type: BF)

Represents a `FloatMenuItem` that belongs to the menu tree being remotely controlled. These items hold a floating
point representation up to a given number of decimal places.

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |
| VC  | Float   | The current value             |
| FD  | Integer | Decimal places of precision   |

### RuntimeListMenuItem boot Message (type: BL)

Represents a `RuntimeListMenuItem` that belongs to the menu tree being remotely controlled. These menu items hold more a list of items. List items are sent as a series of values similar to an enum item, where the value items start with C followed by A onwards for the second char. Where CA would be the first value and CB would be next. Likewise the names for each value use keys starting with cA.

Example:

    BLPI=0|ID=4|RO=1|NM=list item|NC=2|cA=N0|cB=N1|CA=0|CB=1|

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| MT  | MsgType | Must be `BL`                  |
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |
| NC  | Integer | Number of list items          |
| cn  | String  | Name of item N                |
| Cn  | String  | Value of item N               |

### ActionMenuItem boot Message (type: BC)

Represents an `ActionMenuItem` that belongs to the menu tree being remotely controlled. These items can only be triggered, and don't really have a state. When triggered then immediately run the associated callback.

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |

### SubMenuItem (type: BS)

Represents a nested menu in the remote menu.

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |

### Large Integer Boot Message (type: BN)

|Field|Type     |Description                    |
|-----|---------|-------------------------------|
| PI  | MenuID  | The parent ID (or 0 for ROOT) |
| ID  | MenuID  | The menu ID                   |
| RO  | Boolean | Readonly field. True: readonly|
| NM  | String  | Name of the menu item         |
| VI  | Boolean | True if item is visibile      |
| ML  | String  | Maximum length of the number  |
| FD  | String  | The number of decimal places  |
| VC  | Decimal | The latest value              |

### Scroll choice Boot Message (type: BZ)

| Field | Type    | Description                    |
|-------|---------|--------------------------------|
| PI    | MenuID  | The parent ID (or 0 for ROOT)  |
| ID    | MenuID  | The menu ID                    |
| RO    | Boolean | Readonly field. True: readonly |
| NM    | String  | Name of the menu item          |
| VI    | Boolean | True if item is visibile       |
| NC    | String  | Number of choices              |
| WI    | Integer | For array mode, the item width |
| EM    | Mode    | 0:Ram, 1:EEPROM 2:Custom       |
| VC    | String  | Text for choice - see note     |

Note the text for the current choice also contains the current index, it is in the form `index-text` so for example index 10 with value "Pizza" would be `10-Pizza`. Unlike enum all the values are not known, and there may be many, and they could change.

### RGBA8 or RGB8 color Boot Message (type: BK)

| Field | Type     | Description                    |
|-------|----------|--------------------------------|
| PI    | MenuID   | The parent ID (or 0 for ROOT)  |
| ID    | MenuID   | The menu ID                    |
| RO    | Boolean  | Readonly field. True: readonly |
| NM    | String   | Name of the menu item          |
| VI    | Boolean  | True if item is visibile       |
| RA    | Boolean  | True if alpha is included      |
| VC    | RGBColor | Html color string - see note   |  

We send the value as a color string in HTML hex format, depending on if alpha is present, it will be either 7 or 9 characters long. EG: `#FF55AA` or `#FF55AADD`.

### Dialog message (type: DM)

Represents a dialog update in either direction. A dialog is a simple informational message or question that needs to be dismissed in order to proceed. The remote can send an action message in response to a dialog in order to simulate the equivalent of pressing a button. The only type of dialog message that is valid from the remote to the embedded device is ACTION (IE simulating a button press).

    enum DialogMode { SHOW = 'S', HIDE = 'H', ACTION = 'A'}
    
    enum ButtonType: byte { BTNTYPE_NONE = 0, BTNTYPE_OK, BTNTYPE_ACCEPT, BTNTYPE_CANCEL, BTNTYPE_CLOSE }

| Field | Type        | Description                                  | Defaultable |
|-------|-------------|----------------------------------------------|-------------|
| MO    | DlgMode     | One of the dialog mode values                | No          |
| B1    | BtnType     | One of the button types                      | No          |
| B2    | BtnType     | One of the button types                      | No          |
| HF    | String      | Free form text of the header (not mandatory) | Yes blank   |
| BU    | String      | Free form text of the buffer (not mandatory) | Yes blank   |
| CI    | Correlation | (not mandatory)                              | Yes 0       |

### Change value Message (type: VC)

Represents a remote change to a menu item. Depending on the type of menu item that sent the change request the value itself will differ. When you send this type of message, the ordering of fields is important, as the remote cannot store the value. Stick to the order of fields shown in the list below. Correlation ID should be 8 characters long in the form of a 32 bit unsigned hex value. It will be returned to you in the ACK message.

There are four types of change: `absolute`, `relative`, `list_state_change` and `list`.

* Absolute changes are supported for all types, the present value is overwritten with the new one.
* Relative changes are only supported for Analog and Enum items. The change value is added to the existing value.
* List selection has changed is used to tell the local device that the list selection has changed on a remote UI, it is in two parts with the action (0-select, 1-invoke) from the row number by a `:`.
* List items are sent as a series of values similar to an enum item, where the value items start with C followed by A onwards for the second char. Where CA would be the first value and CB would be next. Likewise, the names for each value use keys starting with cA.

Example for most value types:

    VCPI=0|ID=4|TC=1|VC=0|

Example for list entries.

    VCPI=0|ID=4|TC=1|CA=0|CB=1|cA=K0|cB=K1|

Example for list response (in this case item 3 is invoked).

    VCPI=0|ID=4|TC=1|VC=1:3|


Field definitions:

| Field | Type        | Description                                              | Defaultable |
|-------|-------------|----------------------------------------------------------|-------------|
| ID    | MenuID      | The menu ID                                              | No          |
| IC    | Correlation | Will be returned in the ACK                              | Yes 0       |
| TC    | Integer     | Relative: 0, Absolute: 1, List: 2, List-State-Changed: 3 | Yes 1       |
| VC    | Depends     | The change value - see above                             | Yes blank   |
| Cn    | Optional    | The values for a list                                    | Only list   |
| cn    | Optional    | The keys for a list                                      | Only list   |

### Server Acknowledgement Response Message (type: AK)

This message indicates the success or failure of a change sent to the server. It will contain the correlation ID you sent in the request.

The status codes are generally defined below, 0 indicates success, negative values are soft errors that can still be treated as success; whereas positive values indicate hard errors.

| Status | Meaning             |
|--------|---------------------|
| -1     | Value out of range  |
| 0      | Successful          |
| 1      | ID lookup failed    |
| 2      | Invalid credentials |
| 10000  | Unspecified error   |

Field definitions:

| Field | Type        | Value                |
|-------|-------------|----------------------|
| IC    | Correlation | Same as the request  |
| ST    | Integer     | Status code as above |

## Message processing on the remote side

On the embedded side of the protocol, (eg Arduino device) the messages are managed by a `TagValueRemoteConnector`. There is a remote connector for each client connecting remotely. It has methods to encode messages onto the wire, take a look at the encode\<MsgToSend\> methods on the object. Incoming messages are handled by `CombinedMessageProcessor` of which there is a default implementation that handles everything needed for TcMenu in `MessageProcessors.h`.

## Regular Bluetooth connections

You can establish a Bluetooth connection using regular bluetooth serial, for the embedCONTROL UI and the C# API there is no need to map the device to a COM port (although it may be easier to do so). However, for the Java API you do need to do this step on at least Windows (there should be no need on a Unix system).

## Custom message processing

### Java and TypeScript/JavaScript APIs 

In the Java API custom messages can be added at the protocol level by using a `ConfigurableProtocolConverter`, there are several methods on this class to add additional commands. Each command should extend from `MenuCommand` and should have a unique message type, this is signified by the return of the `getCommandType()` method on the menu command object. Likewise in the TypeScript/JavaScript API you can also add custom messages in a very similar way.

### On the embedded device

On the embedded device you add customizable messages in two halves, for messages that are sent from an API/UI to the device, then you add a `MsgHandler` message processor to the `CombinedMessageProcessor`. You access the combined message processor from the `tcMenuServer` instance.

For sending messages from the device to the remote, simply call `myRemoteConnector.encodeCustomTagValMessage(messageType, functionToAddFields)` where the message type is a unique type that's generally prepared using `msgFieldToWord`, and the function is able to write fields onto the provided transport. See the C++ tcMenu library ref docs.  


[Back to tcMenu main page]({{< relref "tc-menu" >}}) 
