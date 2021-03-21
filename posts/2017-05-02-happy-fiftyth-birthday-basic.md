---

title: Happy 53rd birthday BASIC
draft: false
cover_image: /assets/img/happy-fiftyth-birthday-basic-featured-img.png
categories:
    - programming
tags:
    - basic
    - quick basic
    - dos
    - retro
header:
    background:
        color: "#605F5E"
---

It was 4am in a cold [Dartmouth basement](http://www.dartmouth.edu/basicfifty/) fifty-three years ago that the programming language BASIC was born. With yesterday marking its 53rd year it looks as though BASIC is going strong with a variety of different implementations still being used today.

I personally had my first fleeting experience with BASIC on a Commodore-64 at a very young age. My earliest memories of "programming" are typing out lines from a magazine to input an asteroids-like game. I was quite young, perhaps four at the time; pretty much all I remember is painstakingly typing each character on the clunky keyboard before my father saved it to tape. 

My next brush with BASIC was on an Amiga A600, although this time it was with a variant called Dark BASIC. Once again my memory is quite hazy but I remember typing out from a book a program that simulated a ball bouncing along the screen.

![Basic Computer Games - Microcomputer edition](/assets/img/happy-fiftyth-birthday-basic-1.png "Basic Computer Games - Microcomputer edition")

That book in question was a large yellow one titled Basic Computer Games - Microcomputer edition[^1]. The _"game"_ I remember typing out all those years ago is called *Bounce* and can be found on page 24. 

Seeing the program now, it is more of a simulation than a game. However as a young child it was exciting to watch something working that you had made. Even if that act of making was simply copying to screen characters from a book. This is especially true as it took an hour or so of single key pushes to type all 440 lines! 

At the time I had no idea what velocity or a coefficient meant and nor did I care, I could enter numbers in and it animated a ball bouncing along the screen in response.

After my brief foray with BASIC on the Amiga and having been donated a Toshiba T3100e by a friends father who worked in e-waste, I eventually got hold of a legitimate copy of QBasic. It was at this point that I began writing things on my own, rather than simply copying them from books. 

I had no access to the internet at the time and still being quite young no money to purchase books. This meant that the only resources that I had available to me where my fathers old QBasic reference and a couple of BASIC books from the 70s. It took a while for me to figure out that there were different versions of BASIC and that some things just would not work on my version without some modification. 

![Microsoft Quick Basic - QBasic](/assets/img/happy-fiftyth-birthday-basic-2.png "Microsoft Quick Basic - QBasic")

Even with a lack of external resources, I still managed to make some simple games. These where mostly text based simulations or adventures. Although I did write a small _operating system_ that ran on top of MS-DOS with a pipe character interface and some 2-bit icons[^2] with which to access my newly created programs!

Eventually as time went on we ended up with a family desktop computer running Windows 98 and a copy of Visual Basic. I had also at this point in time managed to obtain from various charity shops several old Usborne programming books, most notably one from 1982 titled Computer Space-games.

![Usborne Programming Books](/assets/img/happy-fiftyth-birthday-basic-3.png "Usborne Programming Books")

The Computer Spacegames book is full of short, yet fun games, however there is one game that stands out in my mind as a real gem and that is _Space Mines_. Starting on page 24 of Computer Space-games, this game covered two pages of the book with pretty illustrations throughout. Back in 2009 I got in touch with a chap called [Ted Felix](http://www.tedfelix.com/books/index.html) whom kindly both obtained a copy of the book and emailed me scans of the pages in question:

![Space Mines BASIC](/assets/img/happy-fiftyth-birthday-basic-4.png "Space Mines BASIC")

Once I had a version working on DOSBox in Quick Basic, I quickly ported it to C and published it on one of the many code sharing websites of that time. Unfortunately I am unable to find either of my original source code or where it was uploaded to. 

However this is a game that continues to crop up in my mind every so often and really signifies to me something that made the era of BASIC games truly great, therefore I have gone and ported it to Golang and uploaded it to [github here](https://github.com/carbontwelve/go-space-mines).

BASIC has been a big influence in my life, it was the very first programming language that I remember using and I have fond memories in coding with it. If it had not been as easy to understand or get into then I probably would not have ended up with the career I have now. So happy fifty third birthday BASIC, I am sure you will be celebrating many more.

[^1]: You can download a scanned copy of this book from annarchive [here](https://annarchive.com/files/Basic_Computer_Games_Microcomputer_Edition.pdf)
[^2]: The Toshiba T3100e had an orange gas plasma display, quite a thing to view at the time however it was CGA and had limited shades of dark, so 2-bit graphics actually looked quite good.