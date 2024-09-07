# Documentation
[![Documentation](https://github.com/TcMenu/documentation/actions/workflows/hugo.yml/badge.svg)](https://tcmenu.github.io/documentation)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-green.svg)](https://github.com/TcMenu/documentation/blob/main/LICENSE)
[![davetcc](https://img.shields.io/badge/davetcc-dev-blue.svg)](https://github.com/davetcc)
[![JSC TechMinds](https://img.shields.io/badge/JSC-TechMinds-green.svg)](https://www.jsctm.cz)

This contains the library docs as found on theCodersCorner website. You can view the documentation [here](https://tcmenu.github.io/documentation).

This is completely self-contained and can be tested and developed locally with any recent build of hugo https://gohugo.io/

make sure when testing locally that in `config.toml` the `Production` parameter is 'N'. 

To develop the site just load the directory into an editor such as VS Code or IntelliJ.

To test the site, simply start hugo in development mode from this directory with `hugo -w server`. That's it. 

## Building the ref-docs documentation

Generally speaking, there is a link to the reference (or doxygen generated) documents within the site, these are usually hosted at the `/ref-docs` location and each of the library repositories and the tcMenu API are built in turn to this end. These are built on web server as the documentation changes.

## A few basic rules for committers

Avoid breaking links at all costs, do not refactor page names or positions without talking to one of the committers first. Check your spelling is correct, best to use a spell checker in the editor that you are using. Think about others needing to read your text, make it as short as you can while keeping the meaning.

## Limitations of use

Please ensure that if you host a copy of this site, that it links back to the original, and change any logos or company names to your own. License: Apache.
