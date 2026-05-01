# Documentation

This contains the library docs as found on theCodersCorner website. This site uses the layout of our internal systems, it converts markdown to HTML and then uses a custom spring boot and freemarker application to serve the pages.

To develop the site just load the directory into an editor such as VS Code or IntelliJ. You can use most regular markdown conventions, including fenced code blocks and tables.

## Building the ref-docs documentation

Generally speaking, there is a link to the reference (or doxygen generated) documents within the site, these are usually hosted at the `/ref-docs` location and each of the library repositories and the tcMenu API are built in turn to this end. These are built on web server as the documentation changes.

## A few basic rules for committers

Avoid breaking links at all costs, do not refactor page names or positions without talking to one of the committers first. Check your spelling is correct, best to use a spell checker in the editor that you are using. Think about others needing to read your text, make it as short as you can while keeping the meaning.

If you are adding a new page, or making more than a small correction or readabilty/style change, then please reach out to us first to avoid wasted time later explaining the purpose of the change.

## Limitations of use

We'd prefer that you didn't host site this externally without discussing with us first. However, please ensure that if you do decide to host a copy of this site, that it links back to the original. Also, change any logos or company names to your own. License: Apache.
