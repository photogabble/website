---
title: "Generating random numbers over a range in Go"
tags:
  - GoLang
growthStage: budding
---

Included in the Go standard library is support for generating pseudo-random numbers using the [math/rand](https://pkg.go.dev/math/rand) package. While unsuitable for security-sensitive work these generators are good for #GameDev.

My daily language is #PHP, and its [rand](https://www.php.net/manual/en/function.rand.php) function supports generating a pseudo-random number in a given min/max range. Unfortunately no such support exists in Go's rand package. It instead provides a number of top-level functions that we can use as a source of random numbers.

For the purpose of this post I am going to focus on the `func Intn(n int) int` random number source. `Intn` returns as an int a non-negative pseudo-random number between 0 up to less than `n` from the default source, it panics if `n` is less than zero.

The math for the range is quite simple. You want to generate a random number between zero and your max minus your min plus one and then add your min to that random number.

For example to generate a number between 5 and 12 you will want a random number between 0 and 7. You then add five to what is generated:

```
Random Int  + Min (5)
----------  ------------
0           5
1           6
2           7
3           8
4           9
5           10
6           11
7           12
```

A common misconception I have seen in other examples and the cause of a sneaky off by one error that the functions provided by Go will generate a number from zero upto the max you give it, but not inclusive of it. For example  `rand.Intn(100)` will return numbers in the range `0 <= n < 100`. That is _excluding_ the max so in this case we would be getting a number between 0 and 99!

In order to remove the off by one error we will want to add one to the result of max minus min. The following code will output three random numbers between 10 and 30.

```go
package main

import (
    "fmt"
    "math/rand"
)

func rng(min, max int) int {
	return rand.Intn(max - min + 1) + min
}

func main() {
	fmt.Println(rng(10,30))
	fmt.Println(rng(10,30))
	fmt.Println(rng(10,30))
}
```
Upon execution, you will notice it output the same three numbers every time the program is run. This is because all the top level functions provided by the math/rand library use a shared source that produces a deterministic sequence of values.

In order to get different random numbers each time the program is run you will want to seed the random number generator, our `main` function from above therefore becomes:

```go
func main() {
	rand.Seed(time.Now().UnixNano())

	fmt.Println(rng(10,30))
	fmt.Println(rng(10,30))
	fmt.Println(rng(10,30))
}
```

Random number seeding is quite useful with #ProceduralGeneration because you can provide a fixed seed and guarantee a given result.