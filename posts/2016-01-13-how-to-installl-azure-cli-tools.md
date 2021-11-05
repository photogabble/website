---

title: How to install Azure CLI via node on Windows/Linux and OSX
cover_image: /img/tagged-default/tutorial.png
header:
    background:
        color: "#675f58"
categories:
    - tutorials
tags:
    - azure
    - cloud hosting
    - windows power shell
---

![Azure CLI Tool](/img/azure-cli-1.png "Azure CLI Tool")

I initially attempted to install the Windows Azure Powershell, having followed the official documentation [available here](https://azure.microsoft.com/en-gb/documentation/articles/powershell-install-configure/) which due to my computer only having Windows PowerShell[^1] version 2.0 meant upgrading it to at least 3.0 or greater (at the time of writing, version 4.0 is available and can be installed from [here](https://www.microsoft.com/en-us/download/details.aspx?id=40855). However once installed I couldn't get half the cmdlets on the install test documentation to work so I switched gears and decided to give the Azure CLI a bash instead.

Unlike the Windows Azure Powershell component, the CLI Azure Command-Line Interface is a breeze to install and Microsoft have made executable install packages [available here](https://azure.microsoft.com/en-gb/documentation/articles/xplat-cli-install/) for Windows, OSX and Linux. However they also provide installation via Node.js and npm. Doing so is as easy as entering the following command into your command prompt (assuming you already have node installed):

```
npm install azure-cli -g
```

During my install node kicked up a fuss about Python not being available on my system, stating that the optional dependancy `fibers@1.0.8` failed but regadless of this it eventually completed the install regardless. 

Once node decides to inform you that it has finished (mine sort of just hung, both at home and on my work computer; pressing return a few times after waiting two or so minutes set it on its way to completion,) you can test your install by issuing the command `azure --version`; it should return one line with the version of the tool followed by the node version, for example mine displayed `0.9.13 (node: 0.12.0)`.

## Logging in
Once you have installed the Azure CLI you can log in to your azure account via issuing the command `azure login`. The tool will ask you to open a url in your web browser and enter a code to authenticate. You can alternatively supply a username and password via the `--username` and `--password` arguments, but I find the token authentication quite usefull.

## Man Pages
The Azure CLI tool has quite excelent command line help documentation, enough to work out how to use the commands. To get a list of all the commands that have help documentation available type `azure help` into your command line and then if for example you wanted help with the vm disk command you might enter `azure help vm disk` and it will return with descriptions of all the commands arguments.

## Updating
As with all other packages installed globally via npm you can easily update your install of the Azure CLI by running:

```
npm upgrade -g azure-cli
```

[^1]: Otherwise known as the Windows Management Framework, that was fun, trying to find an upgrade without knowing what you're looking for!
