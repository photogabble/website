---
title: Example usage of my Golang Scene Director package
tags:
  - Programming
  - GameDev
  - Go
  - stage/evergreen
---

About four years ago I got the itch to write a game engine based upon _libtcod_ in #Golang, suffice to say that side project never had much time off the shelf but over the years I did return to it. I most recently took a look four months ago because I wanted to make use of the scene director I had written, which I actually partitioned off into [go-rogue/scenes](https://github.com/go-rogue/scenes).

In game development, a scene director (or _scene manager_) is a stack that your various scenes get pushed onto, with the scene at the top of the stack being the current one being executed. Think about a pause menu, your player pauses the game and the `PauseScene` gets pushed onto the stack, your `MainGame` scene is still there, in memory but as it's not the top of the stack anymore its effectively halted until the `PauseScene` is popped off the stack.

To facilitate this functionality my library provides a `Director` struct with four methods: `PushState` to add a scene to the stack, `PopState` to remove the current scene, `ChangeState` to replace the current scene and `PeekState` to obtain the current scene. Both `PushState` and `ChangeState` expect the scene struct passed to them to implement the `IScene` interface, while `PeekState` returns the current scene as an `interface{}` so that you might cast it to your own extension of `IScene`.

Included with the director is a minimal implementation of `IScene` in the `Scene` struct and this is included with the intention that you extend from it with your own scene structure, for example:

```go
package main

import (
	"github.com/go-rogue/scenes"
)
type Scene interface {
	scenes.IScene
	HandleEvent(ev tcell.Event) bool
	Draw()
}
```

The `IScene` describes three mandatory methods: `Pushed` executed when the scene is added to the stack, `Popped` executed when the scene is removed from the stack and `GetName`[^1] which should return the scenes name.

Finally, the `Director` struct has a `ShouldQuit` boolean which is a hold-over from when I first wrote this code for a Rogue Like game, I am unsure whether to remove it.

Before we continue, in order to save you a lot of copy and paste, the code within this page has been published as [go-rogue/scenes-demo](https://github.com/go-rogue/scenes-demo) that demo and this page will be kept up to date as-and-when I modify the scenes package.

—

Onwards to the example usage; I will be making use of the [gdamore/tcell](https://github.com/gdamore/tcell) package to create a basic TUI application with three scenes: Introduction, MainGame and Settings. Settings will be navigable from Introduction or MainGame, while MainGame will replace the Introduction scene.

We begin not with `main` but with defining the three scenes, each will be implementing the `Scene` interface as shown above.

```go
type WelcomeScene struct {
	scenes.Scene
	screen tcell.Screen
}

type GameScene struct {
	scenes.Scene
	screen tcell.Screen
}

type SettingsScene struct {
	scenes.Scene
	screen tcell.Screen
}

func (s *WelcomeScene) Draw() {
	drawText(s.screen, 0, 1, 80, 1, tcell.StyleDefault, "[N]ew Game")
	drawText(s.screen, 0, 2, 80, 2, tcell.StyleDefault, "[S]ettings")
}

func (s *GameScene) Draw() {
	drawText(s.screen, 0, 1, 80, 1, tcell.StyleDefault, "[S]ettings")
}

func (s *SettingsScene) Draw() {
	drawText(s.screen, 0, 1, 80, 1, tcell.StyleDefault, "[B]ack")
}

func (s *WelcomeScene) HandleEvent(ev tcell.Event) bool {
	switch e := ev.(type) {
	case *tcell.EventKey:
		if e.Key() == tcell.KeyRune {
			switch e.Rune() {
			case 'Q', 'q':
				s.Director.ShouldQuit = true
				return true
			case 'N', 'n':
				s.screen.Clear()
				s.Director.ChangeState(NewGameScene(s.screen))
				return true
			case 'S', 's':
				s.screen.Clear()
				s.Director.PushState(NewSettingsScene(s.screen))
				return true
			}
		}
	}

	return false
}

// ... snip
```

Within the event handler of `WelcomeScene` you can see usage of both `ChangeState` and `PushState`, the former of these is one way, the `WelcomeScene` will be removed from the stack and the `GameScene` replace it, while the latter will push the `SettingsScene` onto the stack, temporarily pausing execution of `WelcomeState`.

The event handler for `GameScene` is almost identical to the `WelcomeScene` one shown above, except it's missing the `N`/`n` input handler:

```go
switch ev.Rune() {
case 'Q', 'q':
	s.ShouldQuit = true
	return true
case 'S', 's':
	s.screen.Clear()
	s.Director.PushState(NewSettingsScene(s.screen))
	return true
}
```

The `SettingsScene` is slightly different too in that it makes use of `PopState` to return to the previous scene:

```go
switch ev.Rune() {
case 'Q', 'q':
	s.ShouldQuit = true
	return true
case 'B', 'b':
	s.screen.Clear()
	s.Director.PopState()
	return true
}
```

The constructor function for these three scenes looks like the following:

```go
func NewWelcomeScene(screen tcell.Screen) *WelcomeScene {
	return &WelcomeScene{
		scenes.Scene{
			Name: "Welcome",
		},
		screen,
	}
}
```

Finally, in order to draw a string to the window I have borrowed the `drawText` function from [tcell's tutorial](https://github.com/gdamore/tcell/blob/main/TUTORIAL.md):

```go
func drawText(s tcell.Screen, x1, y1, x2, y2 int, style tcell.Style, text string) {
	row := y1
	col := x1
	for _, r := range []rune(text) {
		s.SetContent(col, row, r, nil, style)
		col++
		if col >= x2 {
			row++
			col = x1
		}
		if row > y2 {
			break
		}
	}
}
```

Finally, in order to tie everything together, we return to the `main` function:

```go
func main() {
	screen, err := tcell.NewScreen()

	if err != nil {
		log.Fatalf("%+v", err)
	}

	if err := screen.Init(); err != nil {
		log.Fatalf("%+v", err)
	}

	screen.Clear()

	director := scenes.NewDirector(NewWelcomeScene(screen))
	for director.ShouldQuit == false {
		scene := director.PeekState().(Scene)
		scene.Draw()

		screen.Show()

		ev := screen.PollEvent()
		scene.HandleEvent(ev)
	}
}
```

Boom, that's everything!

When built the program will begin executing the `WelcomeScene`, upon pressing the `S` key the `SettingsScene` will be pushed onto the stack and become the executed scene, this scene removes itself via `PopState` returning you to the previous scene, which in this case was the `WelcomeScene`, pressing `N` to go through to the `GameScene` will replace the `WelcomeScene` removing it from the stack completely and from the `GameScene` you can switch to the `SettingsScene` which will return back to the `GameScene`.

If you would like to see that for yourself you can pull down the [go-rogue/scenes-demo](https://github.com/go-rogue/scenes-demo) repository and run the demo application in your own terminal.

—

I wrote this package mostly for my own needs, which is why up until now it had remained public albeit undocumented. In 2024 I am going to do some TUI Game Development such as picking up my Roguelike game from several years ago, and making the [[Porting a 30 year old game to Go|30 year old BASIC game I ported to Go]] look a little nicer.

[^1]: I am likely to remove `GetName` in a future version as it really belongs in the interface extending `IScene` rather than within the library itself.
