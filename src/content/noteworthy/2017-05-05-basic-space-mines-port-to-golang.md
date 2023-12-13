---
title: Porting BASIC Space Mines Game to Go
draft: false
cover_image: /img/featured-images/basic-space-mines-port-to-golang-featured-img.png
categories:
  - programming
tags:
  - Programming
  - BASIC
  - Quick BASIC
  - Go
  - Retro
growthStage: evergreen
---

I recently spent a little time going down memory lane and reminiscing about my first experiences with programming. I even wrote a [short article](/blog/2017/05/02/happy-fiftyth-birthday-basic/) of the journey during which I wished BASIC a happy 53rd birthday. 

While writing that article I also sat down and ported a BASIC game called Space Mines to Go. Now I am far from an expert in Golang, and would actually call myself a beginner. However, I found it remarkably easy to port the game and wanted to document my thoughts while doing so &ndash; so lets talk about that.

![Space Mines BASIC](/img/happy-fiftyth-birthday-basic-4.png "Space Mines BASIC")

Space Mines is a command line strategy/management game. It was published in 1982 by Usborne as BASIC source code within the book [[Computer spacegames]]. In the same year it was also released on tape for the ZX Spectrum 16K, for more information on that release [click here](http://www.worldofspectrum.org/infoseekid.cgi?id=0019122).

The aim of the game is to survive 10 years in office managing a mining colony in space. While this sounds simple enough the game is somewhat weighted against you with the food mechanic being the worst. It is however possible to win, you just need to pray to the random number gods that they provide numbers in your favour.

The BASIC source code begins by defining some initial environment variables: `L` is the number of mines, `P` the number of people, `M` the amount of money, `FP` the price of food, `CE` the amount of ore produced per mine, `C` the amount of ore in storage, `S` the satisfaction factor, `Y` the year, `LP` the buying/selling price mines and `CP` the selling price for ore.

```basic
10 LET L=INT(RND*3+5)
20 LET P=INT(RND*60+40)
30 LET M=INT(RND*50+10)*P
40 LET FP=INT(RND*40+80)
50 LET CE=INT(RND*40+80)

60 LET C=0

70 LET S=1
80 LET Y=1
90 LET LP=INT(RND*2000+2000)
100 LET CP=INT(RND*12+7)
110 CLS
```

For some reason that the `FP` variable is used nowhere else in the game, I don't personally know the history behind this or whether the version available on tape for the ZX Spectrum was different however the variables purpose is referenced in the book, it is just never used.

To generate the random numbers in Go I chose to use the [math/rand](https://golang.org/pkg/math/rand/) package as it is simple to use so long as you remember to seed it before you request a random number. To save a lot of lines of code I created a `random` function that could produce a random number within a range:
 
```go
func random(min, max int) int {
    rand.Seed(time.Now().UnixNano())
    return rand.Intn(max - min) + min
}
```

As for the variables, they lend themselves nicely to being part of a Colony `struct` resulting in the following Go code:

```go
type Colony struct {
    numMines int            // L
    numPeople int           // P
    money int               // M
    food int
    foodPrice int           // FP - not used?
    oreProduction int       // CE
    oreStorage int          // C
    year int                // Y
    satisfaction float32    // S
    minePrice int           // LP
    orePrice int            // CP
    failed bool
}

func initColony() *Colony {
    c := Colony{}
    c.numMines = random(3,6)
    c.numPeople = random(40, 60)
    c.money = random(10, 50) * c.numPeople
    c.foodPrice = random(40,80)
    c.oreProduction = random(40,80)
    
    c.oreStorage = 0
    c.year = 1;
    c.satisfaction = 1
    
    c.rollPriceDice()
    
    c.failed = false
    return &c;
}

func (c *Colony) rollPriceDice() {
    c.minePrice = random(2000, 4000)
    c.orePrice = random(7, 12)
}
```

As you can see from the above code, a new Colony object is created through use of the `initColony` constructor. The BASIC source uses `GOTO` at the end of each year to return to line 90, therefore the mine and ore selling prices are broken out into the `rollPriceDice` function because they are re-rolled each year.

Once all the variables have been set the BASIC source then proceeds to print the current state of affairs in the colony:

```basic
120 PRINT "YEAR";Y
130 PRINT
140 PRINT "THERE ARE ";P;" PEOPLE IN THE COLONY"
150 PRINT "YOU HAVE ";L;" MINES, AND $";M
160 PRINT "SATISFACTION FACTOR ";S
170 PRINT
180 PRINT "YOUR MINES PRODUCED ";CE;" TONS EACH"
190 LET C=C+CE*L
200 PRINT "ORE IN STORE=";C;" TONS"
```

In Go I wrote the above as a `displayColonyStats` method attached to the Colony `struct`, the big difference being that I decided not to use all caps:

```go
func (c *Colony) displayColonyStats() {
    fmt.Println("Year", c.year)
    fmt.Println("There are", c.numPeople, "people in the colony")
    fmt.Println("You have", c.numMines, "mines and $", c.money)
    fmt.Println("Satisfaction Factor ", c.satisfaction)
    fmt.Println("")
    fmt.Println("Your mines produced ", c.oreProduction, "tons each")
    
    c.oreStorage += c.oreProduction * c.numMines
    
    fmt.Println("Ore in store:", c.oreStorage, "tons")
}
```

Once the colony status has been output the BASIC source enters a "selling mode" by first printing the ore and mine selling prices before asking how much of each you would like to sell:

```basic
210 PRINT "SELLING"
220 PRINT "ORE SELLING PRICE=";CP
230 PRINT "MINE SELLING PRICE=";LP;"/MINE"
240 PRINT "HOW MUCH ORE TO SELL?"
250 INPUT CS
260 IF CS<0 OR CS>C THEN GOTO 240
270 LET C=C-CS
280 LET M=M+CS*CP
290 PRINT "HOW MANY MINES TO SELL?"
300 INPUT LS
310 IF LS<0 OR LS>L THEN GOTO 290
320 LET L=L-LS
330 LET M=M+LS*LP
```

Being a beginner at Go it took me a few attempts at getting the desired functionality in Go as `INPUT` provides in BASIC. I didn't want to include any additional packages if possible and turned to the `Scanf` method of the fmt package already in use. This resulted in a `askForIntInput` function that loops until a valid user input is provided. I then used this in two methods attached to the Colony `struct`: `oreSale` and `mineSale`:

```go
func askForIntInput(s string) int {
    var output int
    for {
        fmt.Printf("%s", s)
        _, err := fmt.Scanf("%d\n",&output)
        
        if err != nil {
            fmt.Println("That input was invalid")
            continue
        } else {
            break
        }
    }
    return output
}

func (c *Colony) oreSale() {
    for {
        oreToSell := askForIntInput("How much ore to sell? ")
        if oreToSell >= 0 && oreToSell <= c.oreStorage{
            c.oreStorage -= oreToSell
            c.money += oreToSell * c.orePrice
        break
        }
    }
}

func (c *Colony) mineSale() {
    for {
        minesToSell := askForIntInput("How many mines to sell? ")
        if minesToSell >= 0 && minesToSell <= c.numMines{
            c.numMines -= minesToSell
            c.money += minesToSell * c.minePrice
            break
        }
    }
}
```

It is quite a few more lines of code to replicate the same functionality in Go as is provided in BASIC, but both sources do exactly the same thing and I am sure someone who knows Go better than me could probably get the line count down if they where feeling like a little code-golf.

I output the market prices within the `main` function of my Go port, which we will get to in a moment. First lets go back to the BASIC source where it is now outputting the players amount of money and switching to buy mode:

```basic
340 PRINT
350 PRINT "YOU HAVE $";M
360 PRINT
370 PRINT "BUYING"
380 PRINT "HOW MUCH TO SPEND ON FOOD? (APPR. $100 EA.)"
390 INPUT FB
400 IF FB<0 OR FB>M THEN GOTO 380
410 LET M=M-FB
420 IF FB/P>120 THEN LET S=S+.1
430 IF FB/P<80 THEN LET S=S-.2
440 PRINT "HOW MANY MORE MINES TO BUY?"
450 INPUT LB
460 IF LB<0 OR LB*LP>M THEN GOTO 440
470 LET L=L+LB
480 LET M=M-LB*LP
```

Most notable in the original BASIC source code here is the hardcoded output of _"(APPR. $100 EA.)"_ and in a section where you would expect to see the `FP` variable used, it is missing. This may be because of limited space being made available in the book to this particular game and another longer version may be out there. It is also possible that the ZX Spectrum version makes use of the `FP` variable &ndash; I have yet to do further research on either prospect.

The core difficulty of this game comes from lines 420 and 430. For a population of 40 you need to spend at least $4000 on food to keep the satisfaction increasing otherwise by your third year you will have a satisfaction below 0.6 and it will be game over. However with a high satisfaction you end up with your population increasing and so you're always inevitably spending the majority of your money on food.

The above fifteen or so lines translates to the following in Go:

```go
func (c *Colony) foodBuy() {
    for {
        foodToBuy := askForIntInput("How much to spend on food? (Appr. $100 EA.) ")
        if foodToBuy >= 0 && foodToBuy <= c.money{
            c.food += foodToBuy
            c.money -= foodToBuy
            
            if foodToBuy / c.numPeople > 120 {
                c.satisfaction+=.1
            }
            
            if foodToBuy / c.numPeople < 80 {
                c.satisfaction-=.2
            }
            break
        }else{
            fmt.Println("You don't have enough money to afford that amount of food.")
        }
    }
}

func (c *Colony) mineBuy() {
    for {
        minesToBuy := askForIntInput("How many more mines to buy? ")
        if minesToBuy >= 0 && (minesToBuy * c.minePrice) <= c.money{
            c.numMines += minesToBuy
            c.money -= minesToBuy * c.minePrice
            break
        }
    }
}
```

I think at the time of porting this game from BASIC to Go I got confused by the variables being used and though that the game tracked the amount of food that you had in store thus the `c.food += foodToBuy`. This is not actually the case as you can see from the BASIC code above but I left it in because I aim to to implement that functionality in the future.

Now the game has taken the users input it begins the final phase for the in-game year &ndash; working out if there is a game over:

```basic
490 IF S<.6 THEN GOTO 660
500 IF S>1.1 THEN LET CE=CE+INT(RND*20+1)
510 IF S<.9 THEN LET CE=CE-INT(RND*20+1)
520 IF L/L<10 THEN GOTO 680
530 IF S>1.1 THEN LET P=P+INT(RND*10+1)
540 IF S<.9 THEN LET P=P-INT(RND*10+1)
550 IF P<30 THEN GOTO 700
560 IF RND>.01 THEN GOTO 590
570 PRINT "RADIOACTIVE LEAK....MANY DIE"
580 LET P=INT(P/2)
590 IF CE<150 THEN GOTO 620
600 PRINT "MARKET GLUT - PRICE DROPS"
610 LET CE=INT(CE/2)
620 LET Y=Y+1
630 IF Y<11 THEN GOTO 90
640 PRINT "YOU SURVIVED YOUR TERM OF OFFICE"
650 STOP
660 PRINT "THE PEOPLE REVOLTED"
670 STOP
680 PRINT "YOU'VE OVERWORKED EVERYONE"
690 STOP
700 PRINT "NOT ENOUGH PEOPLE LEFT"
710 STOP
```

As mentioned before, if the satisfaction reaches less than .6 then the people will revolt and its game over; however there are two other end games that are just as likely: not having enough people left with a population of less than 30 and having over worked everyone with less than 10 people per mine.

When satisfaction is high (> 1.1) you get an increase to both your population and productivity however when its low (<.9) you get a decrease to both. There is also a small chance that half your population will be wiped out by a radioactive leak and without a high satisfaction, selling off most your mines and extremely good luck with the next migration of people this almost certainly means game over.

In my Go port, this was all rolled into the `main` function, with the addition of a `randomFloat` helper function because I thought I might need it in the future:

```go
func randomFloat() float64 {
    rand.Seed(time.Now().UnixNano())
    return rand.Float64()
}

func main(){
    c := initColony()
    
    for c.year <= 10 && c.failed == false {
        c.displayColonyStats()
        
        // Selling
        fmt.Println("Selling:")
        fmt.Println("Ore selling price: $", c.orePrice, "/ton")
        fmt.Println("Mine selling price: $", c.minePrice, "/mine")
        
        c.oreSale()
        c.mineSale()
        
        // Buying
        fmt.Println("")
        fmt.Println("You have $", c.money)
        fmt.Println("")
        fmt.Println("Buying")
        
        c.foodBuy()
        c.mineBuy()
        
        // If there are less than 10 people per mine then game over
        if c.numPeople / c.numMines < 10 {
            c.failed = true
            fmt.Println("You've overworked everyone, Game Over!")
            break
        }
        
        // If satisfaction is high, more people arrive
        if c.satisfaction > 1.1 {
            c.numPeople += random(1,10)
        }
        
        // People leave if satisfaction is low
        if c.satisfaction < 0.9 {
            c.numPeople -= random(1,10)
        }
        
        // If the satisfaction is too low then game over
        if c.satisfaction < 0.6 {
            c.failed = true
            fmt.Println("The people revolted, Game Over!")
            break
        }
        
        // If there are less than 30 people in total then game over
        if c.numPeople < 30 {
            c.failed = true
            fmt.Println("Not enough people left, Game Over!")
            break
        }
        
        // Introduce a small chance that half the population gets killed
        if randomFloat() < 0.1 {
            fmt.Println("RADIOACTIVE LEAK....MANY DIE!")
            c.numPeople /= 2
        }
        
        // If the amount produced per mine is very high, ore price is halved
        if c.oreProduction > 150 {
            fmt.Println("Market Glut - Price Drops!")
            c.foodPrice /= 2
        }
        
        // Player has survived another year
        c.rollPriceDice()
        c.year++
        fmt.Println("")
    }
    
    if c.failed == false {
        fmt.Println("You survived your term of office")
    }
}
```

The BASIC version comes in at 71 lines in total, with the Go port having 144 more lines; however that also includes formatting and comments so without actually stripping those out I am sure both versions are close regarding LOC.

For some reason this game has stuck in my mind, it could be because the book that I found it in has very pretty illustrations that captured my imagination the first time I typed this out into my Toshiba T3100e all those years ago.

![Space Mines MS-DOS](/img/basic-space-mines-port-to-golang-1.png "Space Mines MS-DOS")
 
I have in the past seen other peoples ports to languages such as C++ where they have extended it with additional end games as well as refining the satisfaction and food mechanism. I have made my port available on [github here](https://github.com/carbontwelve/go-space-mines) and would very much appreciate a fork if you would like to add your own spin on this text based game from the 80s.