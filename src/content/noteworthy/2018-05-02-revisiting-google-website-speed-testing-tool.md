---
title: Think with Google, revisiting Google's website speed testing tool
draft: false
cover_image: /img/featured-images/revisiting-google-page-speed-tool.png
tags:
  - Tools and Resources
  - Review
  - Google
  - Testing
  - Website Optimisation
  - stage/evergreen
---

Just over a year ago I posted [[Think with Google, website speed testing tool|my thoughts on "Think with Google" their speed testing tool]] which was at that time making the rounds around various blogger groups. My conclusion then was that the new _"tool"_ has a distinctively dodgy feel to it and felt as though it was largely a marketing funnel designed to ensnare non-technical savvy middle management types.

While I conceded that I am certainly not the tools target audience I felt it disingenuous that once it had provided you with largely meaningless results there was the suggestion that a hidden more detailed report could be obtained via email. This excuse to harvest emails for a marketing list is inexcusable and it was made worse by the fact that the emailed report was almost identical to the one displayed on the page.

Up to that point I had expected better of Google and the whole experience left me feeling as though the whole tool was a scam, or at least ethically questionable. 

![Google Mobile Website Speed Test Tool 2018](/img/revisiting-google-page-speed-tool-6.png)

A year later and upon revisiting the website it has an improved design aesthetic and is very much branded as a Google "product." There are two links near the bottom of the page one informs you that this tool is powered by [Web Page Test](http://www.webpagetest.org/) and the other a [link](https://developers.google.com/web/fundamentals/performance/why-performance-matters/) for "Experienced developers" directs to a Google article that largely lectures on the why as opposed to the how but is an interesting read regardless.

![Speed test results for bbc.co.uk showing a six-second page load time](/img/revisiting-google-page-speed-tool-1.png "The BBC should probably work on that load time...")

Upon entering PhotoGabble's url into the inviting input field and hitting return I am quickly presented with an "are you human" test that I somehow fail a number of times before finally my browser loads a visually appealing results page.

The three grades out of one hundred are gone, now replaced instead with three segments navigated to by use of a horrendous scroll-jacking that appears to disable your scroll wheel. The first segment, seen above, focuses on the mobile loading time over 3G which I am quite proud to say is an excellent three whole seconds for PhotoGabble.

![Industry comparison chart showing my website in the top 3% of sites tested](/img/revisiting-google-page-speed-tool-2.png "Look Ma, I'm a top performer!")

The next segment shows what is supposed to be a comparison with what I can only assume is an industrial average for the category that Google have placed the tested website into. However, while the information bubble does clarify that it has been _"calculated based upon internal Google study of over five million web pages"_ the data in this segment gives you no more insight than the first as it is simply repeating what has already been said.

The only new information that the second segment provides is the category that Google have placed the tested website into. In the case of PhotoGabble, Google thinks it is in the _Computers & Consumer electronics_ industry which given the alternatives is the best fit.

![Section suggesting that the BBC could speed up loading time by ~3 seconds, with a button to provide an email for the full report](/img/revisiting-google-page-speed-tool-3.png "If the report is **free** then why do you need my email?")

Finally, we come to the third and last segment. For PhotoGabble this segment gives no further details other than an "atta-boy", but for less performant websites it does provide an estimated reduction in loading time with some suggested fixes in a modal window as shown below.

![A section of titles each suggesting what could be included in the free report, if only you would click the button](/img/revisiting-google-page-speed-tool-4.png "This pleads, *click the button*")

You may have already noticed what all the above screen-grabs have in common and that is the giant call to action screaming to be clicked. Doing so reveals the below modal window that kindly informs you that the only way to retrieve the detailed results is to subscribe to their marketing list.

![Google Mobile Website Speed Test Tool 2018](/img/revisiting-google-page-speed-tool-5.png)

Not wanting to add additional burden to my personal email address I spun up the every so handy [Guerrilla Mail](https://www.guerrillamail.com) for a disposable temporary email address and waited about 40 minutes to receive my report.

In the past year this "speed testing" tool from Google has changed although the changes are largely cosmetic in nature with a switch in reporting methodology away from mobile usability, towards potential visitor loss caused due to slow loading time. What has not changed is that the whole tool is a front for harvesting email addresses and just like [last time](/blog/tools-and-resources/think-with-google-test-my-site/) the emailed report is basically a rehashing of what is contained on the web report.

The focus on estimated visitor loss due to slow loading times speaks to management and business owners a lot louder than it does to engineers or programmers in general and it is the former that this "tool" is most certainly aimed at. While I strongly disagree with its email harvesting tactic I do feel that as web developers we should use this and tools like it that are targeted towards non-tech-savvy people as a way of opening up discussion on making our websites better; because while the reports provided by services such as [Web Page Test](http://www.webpagetest.org/) are extremely detailed they are confusing and often scary to the very people that [testmysite.withgoogle.com](https://testmysite.withgoogle.com) has been designed to communicate with and comfort.
