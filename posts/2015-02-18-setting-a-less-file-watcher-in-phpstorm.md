---

title: Creating a LESS File watcher in PHPStorm
categories:
    - tools-and-resources
tags:
    - less
    - nodejs
cover_image: /img/lessc-version.png
---

![Installing lessc on windows via npm](/img/lessc-version.png "Installing lessc on windows via npm")

To install less via node package manager (npm) at the command line run `npm install less -g`

Once installed type `lessc --version` to check that it was successfully installed.

Next we set up a file watcher in PHPStorm. Open project settings (File -> Settings) and click on the *File Watchers* section found under tools. Once in the file watchers section click on the green plus and select LESS from the drop down that appears.

A window called *New Watcher* will pop up, there are a few important bits of information we need to enter here, the most important of which is the *Program* field, this is where we tell the LESS watcher the location of the `lessc` tool that we installed. PHPStorm requires an absolute path to the program and to find that we run `where lessc` on the command line.

![Finding where lessc is on your computer](/img/lessc-where.png "Finding where lessc is on your computer")

Having done so you should see the above output in your command line, PHPStorm needs the path referencing `lessc.cmd` so copy that line into the *Program* field.

Clicking the OK button will save the new LESS file watcher and you will find that it will generate a css file from any less files you update from now on. You might wish to choose where the css file is output, to do that you need to edit your file watcher and amend the *Output paths to refresh* field to point to the directory you want your css output to. I use `../css/$FileNameWithoutExtension$.css` keep in mind that you may use a relative or absolute path in this field.
