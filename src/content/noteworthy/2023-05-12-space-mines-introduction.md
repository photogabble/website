---
title: "Space Mines, Introduction"
tags: 
  - Space Mines
  - series/Space Mines Build
  - stage/budding
---

## Preface

In the Summer of 2022 I set about beginning to work on a project that has been on my mind for close to a decade: a modern re-imagination of a rather simple #BASIC game called Space Mines; thus started my [[Space Mines|Space Mines Project]].

{% figure "/img/happy-fiftyth-birthday-basic-4.png", "The BASIC source that spawned this obsession", "Space Mines BASIC source code listing in Usborne Computer Space Games book" %}

In August (2022) I wrote [[PHP Space Mines: Introduction]] which can be considered the pretext to this introduction. That article investigated if the BASIC version of Space Mines could translate well into a browser game and discussed the original game mechanics, it does but in doing so it would feel quite limited and unbalanced; the original game is after all only supposed to play for a maximum of ten turns.

Thanks due to [Nick McDonald's](https://nickmcd.me) geomorpohology simulator: [SoilMachine](https://github.com/weigert/SoilMachine), by [[2022 Week 38 & 39 in Review|October (2022)]] I had managed to nerd snipe myself into working out how SoilMachine generates landscape in order to use it for procedurally generating the game map in Space Mines.

Eventually, the increasing amount of [[yak shaving]] resulted in me getting bogged down and the project stalling.

This introduction is to a revival of last year's (2022) attempts. However, this time I will be planning out a project roadmap in order to remove scope creep and define [[what finished looks like|the finish line]].

## Technology Choices
My initial attempt at this project was a Nuxt3 application built when Nuxt3 was in beta preview; it made use of Nuxts api routes and hybrid rendering and use Prisma for interfacing with a MySQL database. I then began a rewrite using [Laravel Jetstream](https://jetstream.laravel.com/) because while I enjoy working with Vue3 on the front end, I missed the kitchen sink solution that Laravel provides for the backend.

Most recently I started a fresh Nuxt3 project and copied my prior efforts into it. However, this time I feel building both the interface and backend mechanics has been the overwhelming factor in causing excessive [[Yak Shaving]].

I was recently introduced to the [Space Traders API](https://spacetraders.io/), it's helped me decide to do similar but for Space Mines. I can still have a [[Space Mines, Design Language|design language]] in mind for the eventual UI but to begin with I will be building the whole game as an API with the first user agent being the test suite.

Painfully this is the same conclusion I came to August last year (2022) it's just taken some beating around the bush to finally concede that it _is_ the best way to get this project launched!

## Game Mechanics
To begin with there will be a one to one relationship between the player and their outpost, in the future I would like to expand the game by adding exploration so that players might navigate the universe and start new outposts.

Once completed the game will have the following mechanics:

- [[Space Mines, Resource Extraction|Resource Extraction]]: mine construction, prospecting and resource storage
- [[Space Mines, Resource Processing|Resource Processing]]: reacting multiple extracted resourced to produce a tier two product, two or more tier two products can be reacted to produce a tier three product
- [[Space Mines, Manufacturing|Manufacturing]]: using extracted resources and/or processed products to construct items and buildings. Building plans will need to be bought or discovered in order to be manufactured, once manufactured they can be placed into the players outpost
- [[Space Mines, Research|Research]]: research will be used as a way of unlocking various capabilities, buildings will require research in order to be manufactured, maintenance costs and crew requirements can be reduced via research. This will be a mix between [[Startopia|Startopia's]] research mechanism and Eve Online
- [[Space Mines, Outfitting|Outfitting]]: All mines will be able to extract a base **Ore**, however the players map will have been seeded with veins of other minerals that can be prospected. The mines can then be outfitted with modifications that improve their yield for certain minerals. Outfitting modules are researched, most will be discoverable via the research tree with some being reserved as rare mods provided by agents or sold via the market
- [[Space Mines, Maintenance|Maintenance]]: All structures will require maintenance, mines for example have a cool down period between yields during which a crew can do maintenance. Each structure will have a slowly decreasing wear and tear value that can only be restored by spending time on maintenance.
- [[Space Mines, Crew & Morale|Crew and Morale]]: the players outpost will have a population of people from which they can hire crew, the population will wax and wane in response to outpost satisfaction. Crew will resign if their morale falls too far, running structures with a skeleton crew will result in more on the job injuries and deaths.
- [[Space Mines, Markets|Markets]]: this will initially be the only multiplayer aspect of the game as the market will be shared between all players and prices react to players buy/sell orders. There will be a number of trade agents that will add large buy/sell orders for various products each week. To begin with purchases will result in instant delivery, however I would like to add in a future expansion the concept of delivery shuttles, where the player then has to store sold items until a shuttle comes to retrieve it.
- [[Space Mines, Agents|Agents]]: to begin with these will be largely for trade. I like the idea of a travelling merchant like the one from [[Startopia]] who comes offering sometimes rare items for trade.

Over the coming weeks I will be writing a detailed article on each of these mechanics.

## Roadmap

- 2023: Get the API complete with full test coverage
- 2024: Build an official user agent either via Nuxt3 or building Vue3 into the Laravel application via Jetstream
