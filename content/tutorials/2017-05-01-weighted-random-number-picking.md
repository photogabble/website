---
title: How to return a random list item by weight
draft: false
cover_image: /img/weighted-random-number-picking-featured-image.png
categories:
    - tutorials
tags:
    - JavaScript
    - random numbers
header:
    background:
        color: "#488247"
hasCodePen: true
---

Random number generation in JavaScript is as simple at typing `Math.random()`, however unlike C++11 with its [std::piecewise_constant_distribution](http://en.cppreference.com/w/cpp/numeric/random/piecewise_constant_distribution) there is no built in method for returning weighted random numbers.

Before I explain the optimal method for weighted random number picking, I shall first show a _cheap and dirty_ method where you fill an array with a copy of an object `n` times and pick at random an element from that array, for example:

```javascript
var animals = [
    {name: 'cat', weight: 5},
    {name: 'dog', weight: 2},
    {name: 'rabbit', weight: 2},
    {name: 'mouse', weight: 1}
];

var weightedArray = [];

for (var i = 0; i < animals.length; i++) {
    for (var n = 0; n < animals[i].weight; n++){
        weightedArray.push(i);
    }
}

console.log(animals[weightedArray[Math.floor(Math.random() * weightedArray.length)]]);
```

I have written a basic example below that shows the probability distribution of the above method; because cat is referenced inside `weightedArray` five times more than mouse it is as many times more likely to be picked. As you can see from the percentages in the codepen they roughly translate to their weightings with the accuracy increasing the more rolls you do.

<p data-height="265" data-theme-id="0" data-slug-hash="pPwEVq" data-default-tab="result" data-user="carbontwelve" data-embed-version="2" data-pen-title="pPwEVq" class="codepen">See the Pen <a href="https://codepen.io/carbontwelve/pen/pPwEVq/">pPwEVq</a> by Simon Dann (<a href="http://codepen.io/carbontwelve">@carbontwelve</a>) on <a href="http://codepen.io">CodePen</a>.</p>

This method of generating weighted random number picking is quite _"hacky"_ and far from optimal; this is because the bigger your input data set the bigger the `weightedArray` becomes, consuming memory unnecessarily.

## The ideal method

To efficiently pick an element from an array with the correct weighted random distribution you first need to normalise each items weight as a percentage of the sum total of all elements weights &ndash; this is the distribution weight.

```javascript
var animals = [
    {name: 'cat', weight: 5},
    {name: 'dog', weight: 2},
    {name: 'rabbit', weight: 2},
    {name: 'mouse', weight: 1}
];

// Normalise Weights
var weightTotal = 0;
for (var i = 0; i < animals.length; i++) {
    weightTotal += animals[i].weight;
}
for (var i = 0; i < animals.length; i++) {
    animals[i].distribution = animals[i].weight / weightTotal;
}

console.log(animals);
```

The above normalization will result in an animals array that looks like the following, with all the distribution values adding up to 1:

```javascript
var animals = [
    {name: 'cat', weight: 5, distribution: 0.5},
    {name: 'dog', weight: 2, distribution: 0.2},
    {name: 'rabbit', weight: 2, distribution: 0.2},
    {name: 'mouse', weight: 1, distribution: 0.1}
];
```

This can be visualised as a stacked graph with each element filling an area that is proportionate to their weight:

![Weighted Pool Pick Example](/img/weighted-random-number-picking-1.png "Weighted Pool Pick Example")

Now you have a pool of elements, each with a distribution value that is proportionate to their weight; to randomly select a item weighted by its distribution value you pick a random number between 0 and 1 called the _selector_ and loop through each element in the pool subtracting their distribution value from the selector until it becomes a negative number at which point you have the element to return.
 
For example if the selector is 0.7 you would get the cat element and subtract 0.5 resulting in 0.2, next you would subtract 0.2 for dog before hitting rabbit and subtracting 0.2 resulting in the selector hitting negative 0.2. You would then return the rabbit element. 

I have extended the above example to show the weighted pick algorithm:

```javascript
var animals = [
    {name: 'cat', weight: 5},
    {name: 'dog', weight: 2},
    {name: 'rabbit', weight: 2},
    {name: 'mouse', weight: 1}
];

// Normalise Weights
var weightTotal = 0;
for (var i = 0; i < animals.length; i++) {
    weightTotal += animals[i].weight;
}
for (var i = 0; i < animals.length; i++) {
    animals[i].distribution = animals[i].weight / weightTotal;
}

function pickOne(pool) {
    var key = 0;
    var selector = Math.random();
    while (selector > 0) {
        selector -= pool[key].distribution;
        key++;
    }
    // Because the selector was decremented before key was
    // incremented we need to decrement the key to get the
    // element that actually exited the loop.
    key--;
    
    // Using splice to return a copy of the element.
    return pool[key];
}

console.log(pickOne(animals));
```

As you can see from the codepen example below this method provides the same probability distribution with it becoming more accurate the more iterations that you do do, however unlike the array based method this one does not consume vast amounts of RAM and is a lot quicker to execute when iterating hundreds of thousands of times.

<p data-height="265" data-theme-id="0" data-slug-hash="XRgpgZ" data-default-tab="result" data-user="carbontwelve" data-embed-version="2" data-pen-title="Loop based weighted random pool selection" class="codepen">See the Pen <a href="https://codepen.io/carbontwelve/pen/XRgpgZ/">Loop based weighted random pool selection</a> by Simon Dann (<a href="http://codepen.io/carbontwelve">@carbontwelve</a>) on <a href="http://codepen.io">CodePen</a>.</p>
