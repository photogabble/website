---
title: PHP Space Mines Introduction
tags:
  - GameDev
  - Programming
  - BASIC
  - PHP
growthStage: evergreen
---

I vividly remember first typing into QuickBasic the Space Mines program from a then already old Usborne book titled Computer Space-games. That very BASIC game totals around 100LoC but is able to simulate running a mining colony with the goal being to survive ten turns.

![Space Mines BASIC](/img/happy-fiftyth-birthday-basic-4.png "Space Mines BASIC")

Since first typing in and playing it; this game has stuck with me over the years as being my goto program to port when learning a new language. For five years or so I have had the idea to turn it into a traditional, yet basic, turn based browser game.

Space Mines is a simple game but does it translate well into a browser game?

Let's find out. The BASIC game has three key resources:
- Mines
- Food
- Ore

In addition to these there is also:
- Money
- People
- Satisfaction

People require food in order to remain satisfied, the ratio of people to mines also impacts satisfaction. Mines produce Ore based upon number of people and their satisfaction. Mines, Food and Ore can all be bought or sold for Money with the buy/sell values recalculated each turn. If satisfaction is high people will be attracted to the colony while if its low people will leave or eventually riot.

I think the foundation mechanics of the game will translate well, however I will need to add some layers on top this foundation to retain player interest. The original BASIC game is turn based with each turn being a year of in game time and decisions having to be made in the order of:

- display status
- sell ore
- sell mines
- buy food
- buy mines
- increment year and return to display status or game over condition

My intent with the browser version is to add a more realtime element to the game, with a turn taking 24 hours and ticking over at midnight GMT+0. Therefore, while the decision-making order works for the BASIC version I will need to eventually expand on the mechanics in order to make the game interesting enough to spend half an hour or so a day playing it.

## Data Structures
I will begin by building the data structures needed for storing the above values, I am using TypeScripts notation for defining types, only because its both short form and convenient - I will be using PHP when actually building this.

```ts
enum BuildingKind {
	Mine,
}

enum ResourceKind {
	Ore,
	Food
}
```

Here we have the one building type and two resource types defined as enums, I plan to add additional resources and buildings in the future so making this an enum value now makes that an _easier_ task.

```ts
interface Player {
	ore: Number
	food: Number
	population: Number
	happiness: Number
	money: Number
	day: Number
}
```

Next I have defined the `Player` interface. Their ore, population, happiness and money are all stored here, in addition I have added a day counter to track how many days the player has been playing for, once this reaches 30 their score is calculated.

```ts
interface Building {
	playerID: Number
	kind: BuildingKind
}
```

It would be simple to add a `mines` value to the `Player` interface however in addition to other building types I want to also be able to add building upgrades. Having buildings broken out into its own interface makes this a lot easier.

```ts
interface Market {
	kind: ResourceKind
	isBuy: Boolean
	price: Number
}
```

Finally, we come to the `Market` interface. A buy and sell record will exist for both food and ore; the price will be updated at midnight every day. Eventually I would like players to post market orders with their own price and those get fulfilled by other players or NPC traders in real time, thus the more complex interface.

Right now, in order to keep things simple there is no concept of world time, each player is within their own bubble and any server side backend is just there to persist state and run various game mechanics - this could be entirely front end only however as I intend on building this out into a more multiplayer experience I will focus on building a backend.

## Gameplay Mechanics
In my version of the game each player will begin with a population of 35 people, enough food to sustain the population for 14 days (105 meals x 14 days), zero ore reserve and three mines. Resources are collected in "real time" thus meaning the player can begin selling in order to obtain money in order to buy more food.

As discussed below, this starting combination starts the player in a neutral position however one intentionally positioned close to a cliff edge prompting action.

### Satisfaction
In the BASIC version of the game satisfaction is mutated depending upon how much food is purchased per turn and the game never tracks how much food is in stock, it's entirely consumed per turn.

I intend to have a similarly simple solution, however food will be a resource that can be stockpiled and therefore my satisfaction modifiers will be based upon people per mines and how much food is in reserve. For simplicity, I will be considering units of food as being meals and each person requiring three meals a day in order to feel satisfied.

To provide gradient of modifier values I will be using linear interpolation to set a value between -1.5 and +1.5 depending upon how many days reserve of meals the colony has on hand:

```php
<?php
function lerp($a, $b, $t): float  
{  
    return $a + ($b - $a) * $t;  
}  
  
function minMax($value, $min = 0, $max = 1)  
{  
    if ($value < $min) return $min;  
    if ($value > $max) return $max;  
    return $value;  
}  
  
function getSatisfactionFoodModifier(int $foodReserve, int $population): float  
{  
    $days = 28; // 4 weeks  
    $mealsPerDay = 3;  
    $mealsRequired = $population * $days * $mealsPerDay;  
    $foodReservePercentage = $foodReserve > 0 
		? minMax($foodReserve / $mealsRequired)
		: 0;

    return round(lerp(-1.5, 1.5, $foodReservePercentage), 2);  
}  
  
for ($i = 0; $i <= 28; $i++) {  
    $food = 3 * 35 * $i;  
    $mod = getSatisfactionFoodModifier($food, 35);  
    echo "$i days meals ($food food) -> $mod" . PHP_EOL;  
}
```

The output of the above program (shown below) shows the satisfaction modifier based upon how many days worth of food a player has in stock. There is a zero modifier for 14 days reserves which is why I will begin all players with 1,500 meals.

```
0 days meals (0 food) -> -1.5
1 days meals (105 food) -> -1.39
2 days meals (210 food) -> -1.29
3 days meals (315 food) -> -1.18
4 days meals (420 food) -> -1.07
5 days meals (525 food) -> -0.96
6 days meals (630 food) -> -0.86
7 days meals (735 food) -> -0.75
8 days meals (840 food) -> -0.64
9 days meals (945 food) -> -0.54
10 days meals (1050 food) -> -0.43
11 days meals (1155 food) -> -0.32
12 days meals (1260 food) -> -0.21
13 days meals (1365 food) -> -0.11
14 days meals (1470 food) -> 0
15 days meals (1575 food) -> 0.11
16 days meals (1680 food) -> 0.21
17 days meals (1785 food) -> 0.32
18 days meals (1890 food) -> 0.43
19 days meals (1995 food) -> 0.54
20 days meals (2100 food) -> 0.64
21 days meals (2205 food) -> 0.75
22 days meals (2310 food) -> 0.86
23 days meals (2415 food) -> 0.96
24 days meals (2520 food) -> 1.07
25 days meals (2625 food) -> 1.18
26 days meals (2730 food) -> 1.29
27 days meals (2835 food) -> 1.39
28 days meals (2940 food) -> 1.5
```

A similar calculation can be done for population per mine. Each mine requires ten operators in order to not over-work the population.

```php
function getSatisfactionMineModifier(int $mines, int $population): float  
{  
    // min of 10 people per mine until they get over-worked, 20 is the optimal  
    $skeletonCrew = 20 * $mines;  
  
    $workLoadPercentage = $population > 0  
        ? minMax($population / $skeletonCrew)  
        : 0;  
    return round(lerp(-1.5, 1.5, $workLoadPercentage), 2);  
}

for ($i = 0; $i <= 20; $i++) {  
    $mod = getSatisfactionMineModifier(1, $i);  
    echo "$i population for 1 mine -> $mod" . PHP_EOL;  
}
```

Each mine will operate with a skeleton crew of 10 with no satisfaction modifier, less than that and the population begin to be over-worked, while more than 10 upto a max of 20 we see below the modifier creeps to 1.5:

```
0 population for 1 mine -> -1.5
1 population for 1 mine -> -1.35
2 population for 1 mine -> -1.2
3 population for 1 mine -> -1.05
4 population for 1 mine -> -0.9
5 population for 1 mine -> -0.75
6 population for 1 mine -> -0.6
7 population for 1 mine -> -0.45
8 population for 1 mine -> -0.3
9 population for 1 mine -> -0.15
10 population for 1 mine -> 0
11 population for 1 mine -> 0.15
12 population for 1 mine -> 0.3
13 population for 1 mine -> 0.45
14 population for 1 mine -> 0.6
15 population for 1 mine -> 0.75
16 population for 1 mine -> 0.9
17 population for 1 mine -> 1.05
18 population for 1 mine -> 1.2
19 population for 1 mine -> 1.35
20 population for 1 mine -> 1.5
```

The above gradients are not necessarily ideal, or tuned in any way, but they are good enough for an MVP version.

Satisfaction will be modified every day at midnight so players have plenty of time to purchase food and/or reduce workload. In the BASIC version of the game a satisfaction below 0.9 is terrible and above 1.1 is awesome. This makes for a brutally difficult game because between one and ten people leave with bad satisfaction and the game is over with ten or less population.

For the purpose of the MVP version satisfaction will go from -20 to +20 staring at zero being neutral. This gives a large range of values for interesting game mechanics to work on at a future date.

### Mine Construction
For the MVP version I will be allowing players to purchase/sell mines instantly, in future additions purchasing mines will have a lead time before they are operational and mines will have the ability to be sold or switched off to reduce workload on a dwindling population.

In the BASIC version of Space Mines the buy/sell price of a mine is calculated at each turn as being between 2,000 and 4,000. For the purpose of the MVP I am going to set the buy price to 4,000 and the sell value to 2,000. Eventually with a global marketplace set up the buy values will be determined by supply and demand, with mines being destroyed at a cost rather than sold.

### Ore Production
I don't yet have anywhere in my MVP datastructures to store ore production per mine therefore it needs to be worked on procedurally. In the BASIC version of Space Mines, ore production per mine is derived as a random number between 40 and 80 at the beginning of the game; this is then modified by between -20 and +20 each year based upon satisfaction.

In my MVP version each mine will have a base production of 60 tons of ore per day which is increased based upon the number of people per mine and the overall satisfaction.

```php
function getMineProductionPopulationModifier(int $mines, int $population): float  
{  
    $skeletonCrew = 20 * $mines;  
  
    $workLoadPercentage = $population > 0  
        ? minMax($population / $skeletonCrew)  
        : 0;  
    return round(lerp(-1, 1, $workLoadPercentage), 2);  
}

for ($i = 0; $i <= 20; $i++) {  
    $mod = getMineProductionPopulationModifier(1, $i);  
    echo "$i population for 1 mine -> $mod" . PHP_EOL;  
}
```

The above function deals only with the mine production bonus via workload. The output below shows that it gives no bonus for a skeleton crew, but creeps up to doubling the output per mine if there is a full crew.

```
0 population for 1 mine -> -1
1 population for 1 mine -> -0.9
2 population for 1 mine -> -0.8
3 population for 1 mine -> -0.7
4 population for 1 mine -> -0.6
5 population for 1 mine -> -0.5
6 population for 1 mine -> -0.4
7 population for 1 mine -> -0.3
8 population for 1 mine -> -0.2
9 population for 1 mine -> -0.1
10 population for 1 mine -> 0
11 population for 1 mine -> 0.1
12 population for 1 mine -> 0.2
13 population for 1 mine -> 0.3
14 population for 1 mine -> 0.4
15 population for 1 mine -> 0.5
16 population for 1 mine -> 0.6
17 population for 1 mine -> 0.7
18 population for 1 mine -> 0.8
19 population for 1 mine -> 0.9
20 population for 1 mine -> 1
```

Any negative satisfaction will half overall mining output while any positive satisfaction will give a 15% boost up to +10 and a 25% boost thereafter:

```php
function getMineProductionSatisfactionModifier(float $satisfaction): int  
{  
    if ($satisfaction < 0) return -0.5;  
    if ($satisfaction > 0 &&  $satisfaction < 10) return 0.15;  
    return 0.25;  
}
```

Without playing through a game with these values it's tough to tell if they are too difficult to play or not. I have chosen to use percentage modifiers rather than go the same route the BASIC version went because I want to eventually add building upgrades and specialisations that come with their own mix of bonuses and buffs.

### Marketplace
As with the BASIC version of Space Mines, my MVP browser version will be setting the buy/sell price of ore and food at the beginning of each turn (in my case day.) The BASIC version sets the price of a ton of ore as between 7 and 12. As for food, the BASIC version weirdly lacks expected functionality. It says that it's approx $100 per food but the logic as written deducts $1 per unit of food.

There is also a mechanism in the BASIC version where you can suffer a market crash if your mines produce too much ore, resulting in the ore price becoming halved; however the BASIC code actually halves the amount of ore being produced per mine and then loops back round to the beginning whereupon the ore price is randomly chosen again.

I have a feeling that the BASIC version was about a third more LoC before being edited down for the book and this resulted in the oddities observed - they wouldn't intentionally introduce such bugs, would they?

Eventually I want to use geometric Brownian motion for simulating the price of ore and food overtime and then progress to actually having the market price modified as players sell with an increase in open sell orders causing a drift in the overall trade now price.

For now setting the price at random will be okay.

###  Population Growth
In the BASIC version of Space Mines, population growth is determined based upon satisfaction. If its greater than `1.1` then between one and ten people join the mining operation, if satisfaction drops below `0.9` then between one and ten people leave.

Because I will have satisfaction going from -20 to +20 I can half it for a reasonable maximum population change:

```php
function getPopulationModifier(float $satisfaction): int  
{  
    return floor($satisfaction / 2);  
}
for ($i = -20; $i <= 20; $i++) {  
    $mod = getPopulationModifier($i);  
    echo "$i satisfaction -> $mod" . PHP_EOL;  
}
```

This will work for the MVP launch of this game, but it isn't very balanced and should probably take into consideration the available food stocks (e.g. fewer people will want to join if there isn't reliable food source.)

### End Game Conditions
Ideally this kind of simulation can be played for as long as the player likes, however for the purpose of the MVP a score will be calculated once the player has been playing for 30 turns (days).

The game as a whole will have a public score board showing players who achieved the highest amount of ore mined in 30 days, money made and points scored as calculated by:

```php
function playerScore(  
    int   $population,  
    int   $oreMined,  
    int   $money,  
    float $satisfaction): int  
{  
    $mod = $satisfaction < 0  
        ? -0.2  
        : 0.2;  
    $score = (($population * 1000) + ($oreMined / 2) + ($money * 2));  
    return $score - ($score * $mod);  
}
```

In the BASIC version of Space Mines there are a handful of conditions that result in an instant game over:

- 1% chance per turn of a radiation leak that kills half your population, due to the brutal satisfaction calculation this can result in you lasting only one more turn
- Having less than 30 people ends the game with "not enough people left"
- Having less than 10 people per mine ends the game with "you overworked everyone"
- A satisfaction below 0.6 ends the game with "the people revolted"

The BASIC version isn't very well-balanced and these game over conditions can reduce the fun element of the simulation because they occur too often and at random completely removing any strategy element from the game.

I will be implementing conditions similar to those in the BASIC version but not to result in game over, instead there will be warnings that people are overworked and productivity is affected, people will revolt with lower satisfaction ratings (-10 and below) but this will result in zero production for a turn rather than the game being over.

## Development
There has been a mix of TypeScript and PHP code on this page. I will be writing this project in PHP using the Laravel framework, while also using Inertia.js + Vue3 for the front end. This means I will be writing this project in both TypeScript and PHP.

To begin with I will be setting up entirely vanilla HTML routes with zero css in order to get the core functionality of the gameplay finished, once complete I will then use tailwind and Vue3 to build out the interface as a series of components that get hydrated via inertia.js.

Over the coming weeks I will be releasing a build log of this project.