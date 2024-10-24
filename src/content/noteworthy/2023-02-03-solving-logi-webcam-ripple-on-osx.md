---
title: "Solving Logi webcam ripple on OSX"
tags: 
  - Tips
  - OSX
  - stage/budding
issueUri: https://github.com/photogabble/website/issues/206
---

## Preface
When not out and about I use a [Logi HD Pro C920 USB Webcam](https://www.logitech.com/en-gb/products/webcams/c920-pro-hd-webcam.960-001055.html) for video calls; it's not a cheap webcam by any means and yet in my office it has a terrible ripple effect when the lights are on. I had been solving this by having meetings with the lights switched off, which works when its daylight outside but not so much when the sun goes away.

## The solution
I suspected the problem was caused by the webcams 60Hz refresh rate picking up a mains frequency flicker from the lights but there is no way of adjusting the webcams refresh rate natively in OSX. Interestingly the MacBooks own webcam doesn't have this problem or if it does OSX intelligently adjusts to remove it.

In any case a _quick_ internet search uncovered a stack exchange question with an [answer by James Geddes](https://apple.stackexchange.com/a/441747) suggesting installing [CameraController.app](https://github.com/Itaybre/CameraController) in order to tell the webcam to operate at 50Hz.

To install I used homebrew, however you can grab the latest`.zip` from [Releases](https://github.com/itaybre/CameraController/releases/latest) and install the `CameraController.app` manually. Installing via homebrew is a matter of running the following two commands:

```
$ brew tap homebrew/cask-drivers
$ brew install --cask cameracontroller
```

Once installed, open `CameraController`, select your webcam and the Advanced settings tab. Therein you will see "Powerline Frequency", by setting this to 50Hz you should see the ripple effect stop in the preview video.

This worked for my webcam, your mileage may vary.
