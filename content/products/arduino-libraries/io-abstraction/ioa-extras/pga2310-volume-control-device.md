+++
title = "PGA2310 Volume Control device for IoAbstraction"
description = ""
tags = [ "arduino", "library" ]
type = "blog"
date = "2023-05-22"
author =  "dave"
menu = "ioa-extras"
githublink = "https://github.com/davetcc/IoAbstraction/"
referenceDocs = "/ref-docs/ioabstraction/html/index.html"
banner = ""
titleimg = ""
toc_needed = true
weight = 5
+++

## PGA2310 Volume Control device

Provides a simple analog device that can be used to control a PGA2310 volume device. Left channel is 0 and right channel is 1. The device should be connected on the SPI bus as usual. This should work with Arduino now, and mbed in a patch release coming soon. To use first include the header:

    #include <extras/Pga2310VolumeControl.h>

Then initialise globally:

    SPIWithSettings spiSettings(&SPI, CS_PIN);
    Pga2310VolumeControl pga2310(spiSettings);

And to use it as a floating point value

    pga2310.setCurrentFloat(volFlt); // where the value is between 0F and 1F 
    float f = pga2310.getCurrentFloat(); // where the value is between 0F and 1F 

or as an integer

    pga2310.setCurrentValue(intVal);  // where the value is between 0 and 255
    unsigned int val = pga2310.getCurrentValue();  // where the value is between 0 and 255

This covers everything for this device.
