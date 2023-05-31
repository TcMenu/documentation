# Library documentation

This contains the library docs as they exist on theCodersCorner website.

This is completely self-contained and can be tested and developed locally with any recent build of hugo https://gohugo.io/

make sure when testing locally that in `config.toml` the `Production` parameter is 'N'. 

To develop the site just load the directory into an editor such as VS Code or IntelliJ.

To test the site, simply start hugo in development mode from this directory with `hugo -w server`. That's it. 

## Building the ref-docs documentation

Generally speaking, there is a link to the reference (or doxygen generated) documents within the site, these are usually hosted at the `/ref-docs` location and each of the library repositories and the tcMenu API are built in turn to this end. These are built on web server as the documentation changes.
