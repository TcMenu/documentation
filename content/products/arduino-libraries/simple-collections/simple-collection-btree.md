+++
title = "Simple Collection - btree list"
description = ""
tags = [ "arduino", "digital-io", "library" ]
type = "blog"
date = "2020-11-28"
author =  "dave"
menu = "simple-collections"
githublink = "https://github.com/davetcc/SimpleCollections/"
referenceDocs = "/ref-docs/simple-collections/html/index.html"
banner = "/images/electronics/arduino/power/io-abstraction-encoder-pcf8574-thumb.jpg"
toc_needed = true
aliases = ["/products/arduino-libraries/io-abstraction/simple-collection-btree/"]
weight = 2
+++

IoAbstraction contains a very simple collection that is relatively lightweight and works on a wide range of boards. It is a btree list that provides ordering and list storage. It works on anything from Arduino Uno upwards!

It's memory usage is very configurable, and the way it resizes arrays is also configurable too. You can set the initial size if you know how many items to expect, and do not wish for it to resize, or you can rely on platform defaults, for more general purpose cases. It is a hybrid collection that uses templates only as a shim, to reduce FLASH memory usage to the minimum possible. 

There are two limitations of btree list that you should be aware of, firstly that any type that is stored in the list absolutely must have a `KEY_TYPE getKey() const` method, that returns the key for the instance. The object must be of a known type and not be in any way polymorphic. However, this does not stop you holding a pointer to a polymorphic type. Any object to be stored must implement a no-args constructor, copy constructor and equals operator (even if just using =default).

Notes for advanced users: 

* You must understand that to make this library work on boards as small as Uno, we actually store the objects "whole" allocating enough space for the initial set, and re-allocating as needed. Objects are copied in using the copy constructor, and moved around using operator equals. This means you cannot use polymorphic objects. Underneath the thin template wrapper there is a lot of non-template code to keep the library very small.
* Given the above, you can override the key lookup function that is used to get the key if using pointer de-referencing doesn't work for your case, see the second constructor in the reference documentation. 
* You should note that this collection is not thread safe, it can be used in as many tasks as you like without locking, but locking is needed when another thread or core is used.

[Reference guide to btree list](https://www.thecoderscorner.com/ref-docs/ioabstraction/html/class_btree_list.html)

## Creating the list and type to be stored

In order to create an instance of BtreeList, you need to provide the key type and also the actual type to be stored. The list will be created with the initial `size` provided in the constructor – allocated as an array. It will grow in size using the parameter `howToGrow`,  These spaces will be initialised with the default constructor. Note that key type must not exceed the size of uint32_t and must compare with less than, greater than and equals.

    BtreeList<KEY_TYPE, STORAGE_TYPE> myList(
                bsize_t size=DEFAULT_LIST_SIZE, 
                GrowByMode howToGrow=DEFAULT_GROW_MODE);

    // possible grow modes: GROW_NEVER, GROW_BY_5, GROW_BY_DOUBLE

Now we implment the class to be stored in the list, it must implement at a minimum the default no args constructor, a copy constructor, and the `KEY_TYPE getKey() const` method. Let's take a look at an example:

    // Template paraemters: KEY_TYPE=int, STORAGE_TYPE=ErrorCode
    class ErrorCode {
    private:
        char text[20];
        int  num;
        
    public:
        // Required no args constructor
        ErrorCode() {
            num = 0;
            text[0]=0;
        }
        
        // Required copy constructor
        ErrorCode(const ErrorCode& otherCode) {
            num = other.num;
            strncpy(text, other.text, sizeof(text));
        }
        
        // This is to allow us to create instances with fields set to values 
        ErrorCode(int error, const char* name) {
            num = error;
            text = name;
        }
        
        // Required getKey method, must return the key type
        int getKey() const { return num; }
    };
    
So for the above class, the KEY_TYPE is int, and the STORAGE_TYPE is ErrorCode. Let's now fill those in:

    BtreeList<int, ErrorCode> myList;
    
## Adding and retrieving items

BtreeList is a sorted list, it is sorted by key and will re-order on each insert, it is therefore optimised for reading and get by key operations.

    myList.add(ErrorCode(100, "File error");
    myList.add(ErrorCode(1, "Boom");
    myList.add(ErrorCode(2, "Bang");

Even though above we add key=100 first, it will be at the end of the list, as it is ordered by key. Here we show how to iterate over the whole set:

    for(bsize_t i = 0; i < myList.count(); ++i) {
        auto errCode = myList.itemAtIndex(i);
        // work with errCode here.
    }
    
To get an item by key:

        auto error2 = myList.getByKey(2);
        if(error2 != nullptr) {
            // work with error2 here.
        }

To find the nearest index to a given key, not the exact key:

    bsize_t nearestIndex = myList.nearestLocation(1000);

[Go back to the IoAbstraction page]({{< relref "io-abstraction.md" >}})
