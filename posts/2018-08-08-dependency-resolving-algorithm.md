---

title: Dependency Resolving Algorithm
draft: false
cover_image: /assets/img/featured-images/dependency-resolving-algorithm.png
categories:
    - programming
date: 2018-08-08
tags:
    - php
    - tapestry
---

While writing version two of my static site generator [Tapestry](https://www.tapestry.cloud) I begun researching various data structures and complementary algorithms that would aid in optimising the build process. To improve how Tapestry build projects I would need to utilise both dependency resolution and an Abstract Syntax Tree.

Starting with dependency resolution, after what was admittedly a quick Google search I ended up reading [this paper by Ferry Boender](https://www.electricmonk.nl/docs/dependency_resolving_algorithm/dependency_resolving_algorithm.html) authored in 2010 titled the same as this blog post. Aside from being well written, Ferry's paper explains in detail how a dependency resolving algorithm functions.

In this article I will be documenting details about my implementation of Ferry's dependency resolving algorithm within Tapestry and some of the debugging tools I wrote to aid in visualising the generated graph. To do so I use a mock project with all the source code being open source and available on [GitHub here](https://github.com/photogabble/dependency-resolving-tutorial).

## Project Boilerplate

To begin I set up a basic project directory structure as shown below, if you're following along you can obtain this folder state from [this git commit](https://github.com/photogabble/dependency-resolving-tutorial/tree/5446134e97d5891370e11173d1e3b650b78f143c):

```bash
photogabble/dependency-graph
├── .gitignore
├── composer.json
├── phpunit.xml
├── tests
|   └── GraphTest.php
└── src
    └── Node.php
```

This may seem like a lot of boilerplate for what will eventually become a handful of classes but starting with a test framework and a _"standard"_ directory layout makes for easier development &ndash; especially if you're into Test Driven Development[^1].

## Representing the Data

![Graphvis is quite fun](/assets/img/dependency-resolving-algorithm-1.png "Graphvis is quite fun")

As you can see from the above diagram, Graphs are very simple data structures. They consist of _nodes_ (circles labeled a to e) connected to one another via _edges_ (the arrows). It is the _nodes_ themselves that store their _edge_ references and this means that a very simple class in PHP is all that is needed to define one:

```php
<?php

namespace Photogabble\DependencyGraph;

class Node
{
    /**
     * @var string Name of this Node
     */
    public $name;

    /**
     * @var Node[] Array of edge nodes
     */
    public $edges = [];

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function addEdge(Node $node)
    {
        array_push($this->edges, $node);
    }
}
```

As you can see the _Node_ class as defined in `src/Node.php` weighs in at just 17 LOC! This is somewhat helped by the use of public properties and a lack of meta data. However as a basic implementation the above is complete.
 
## Resolving Dependencies

In order to resolve dependencies a function needs to walk the graph starting at a root node, following each _nodes_ defined _edges_ before doubling back and recording the path taken. In the above diagram our graph resolver function would walk from A → B, then from B → E, then returning to B it would walk from B → C, then from C → D before returning to C then B and finally A before walking from A → D and returning its result.

This results in an output of `d e c e b d a`; which once the duplicates are removed boils down to `d e c b a`. That is to say that `d` must be parsed before `b` can be, and `b` before `c` and do on. Resolving dependencies in this way is useful for Tapestry in order for it to identify when to execute a generator in the most efficient manor possible.

I packaged the above described functionality into a class called `GraphResolver` by creating  the file `src/GraphResolver.php` with the following content:

```php
<?php

namespace Photogabble\DependencyGraph;

class GraphResolver
{
    private $resolved = [];

    private $unresolved = [];

    public function resolve(Node $node): array
    {
        $this->resolved = [];
        $this->unresolved = [];
        $this->resolveNode($node);
        return $this->resolved;
    }

    private function resolveNode(Node $node)
    {
        array_push($this->unresolved, $node);
        foreach ($node->edges as $edge)
        {
            if (! in_array($edge, $this->resolved)){
                if (in_array($edge, $this->unresolved)){
                    throw new \Exception('Circular reference detected: ' . $node->name . ' -> '. $edge->name);
                }
                $this->resolveNode($edge);
            }
        }
        array_push($this->resolved, $node);
        if (($key = array_search($node, $this->unresolved)) !== false) {
            unset($this->unresolved[$key]);
        }
    }
}
```

The code within the `resolveNode` method is an almost direct port to PHP of the Python code Ferry wrote in their article[^2]. If you happen to know of a better way that I could have ported this please do [raise an issue on the repository here](https://github.com/photogabble/dependency-resolving-tutorial); I would like to make this example the best available.

## Testing Dependency Resolution

Now that everything is set up the next step is to write a couple of tests to check that firstly the graph resolver is working as expected and secondly that an exception is thrown upon a circular dependency being detected. This is done by adding the following content to `tests\GraphTest.php`:

```php
<?php

namespace Photogabble\Tests;

use Photogabble\DependencyGraph\GraphResolver;
use Photogabble\DependencyGraph\Node;

class GraphTest extends \PHPUnit\Framework\TestCase {

    public function testGraphResolver()
    {
        /** @var Node[] $nodes */
        $nodes = [];
        foreach (range('a', 'e') as $letter) {
            $nodes[$letter] = new Node($letter);
        }
        $nodes['a']->addEdge($nodes['b']); // b depends on a
        $nodes['a']->addEdge($nodes['d']); // d depends on a
        $nodes['b']->addEdge($nodes['c']); // c depends on b
        $nodes['b']->addEdge($nodes['e']); // e depends on b
        $nodes['c']->addEdge($nodes['d']); // d depends on c
        $nodes['c']->addEdge($nodes['e']); // e depends on c

        $class = new GraphResolver();
        $result = $class->resolve($nodes['a']);

        $this->assertSame(['d', 'e', 'c', 'b', 'a'], array_map(function(Node $v){
            return $v->name;
        }, $result));
    }

    public function testGraphResolverCircularDetection()
    {
        /** @var Node[] $nodes */
        $nodes = [];
        foreach (range('a', 'e') as $letter) {
            $nodes[$letter] = new Node($letter);
        }
        $nodes['a']->addEdge($nodes['b']); // b depends on a
        $nodes['a']->addEdge($nodes['d']); // d depends on a
        $nodes['b']->addEdge($nodes['c']); // c depends on b
        $nodes['b']->addEdge($nodes['e']); // e depends on b
        $nodes['c']->addEdge($nodes['d']); // d depends on c
        $nodes['c']->addEdge($nodes['e']); // e depends on c
        $nodes['d']->addEdge($nodes['b']); // b depends on d - circular

        $class = new GraphResolver();
        $this->expectExceptionMessage('Circular reference detected: d -> b');
        $class->resolve($nodes['a']);
    }
}
```

## Keeping an Adjacency List

Given that the above is a porting of a known working example tested against the original output it isn't anything more special than functioning as a box ticking exercise for 100% code coverage[^3]. However Tapestry does not simply need to resolve the order in which dependencies should be parsed. It also need's to be able to identify if they should be parsed at all. It's the latter functionality that is useful for cache invalidation.

![Graphvis is quite fun](/assets/img/dependency-resolving-algorithm-2.png "Graphvis is quite fun")

For example, given the same graph as before, if `b` is the only node to have changed since the previous run then all but `a` need to be re-compiled because they depend on `b` in one way or another.

Representing our example graph as an adjacency list makes it clear how many dependents each _node_ has and which files would need to be compiled if their ancestors were modified. For example looking at the below you know that if `e` were modified then no other _nodes_ would need to be compiled while if `b` were modified then three other _nodes_ would need to be also compiled.

```php

$graph = [
    'a' => ['d','e','c','b'],
    'b' => ['d','e','c'],
    'c' => ['d','e'],
    'd' => [],
    'e' => [],
];

```

## Testing Adjacency List Generation

In the spirit of TDD and because its known that the above `$graph` output should be the result of the code written to generate an adjacency list; the following test can be added to `tests\GraphTest.php`:

```php
public function testGraphAdjacencyList()
{
    /** @var Node[] $nodes */
    $nodes = [];
    foreach (range('a', 'e') as $letter) {
        $nodes[$letter] = new Node($letter);
    }

    $nodes['a']->addEdge($nodes['b']); // b depends on a
    $nodes['a']->addEdge($nodes['d']); // d depends on a
    $nodes['b']->addEdge($nodes['c']); // c depends on b
    $nodes['b']->addEdge($nodes['e']); // e depends on b
    $nodes['c']->addEdge($nodes['d']); // d depends on c
    $nodes['c']->addEdge($nodes['e']); // e depends on c

    $class = new GraphResolver();
    $class->resolve($nodes['a']);

    $this->assertSame([
        'a' => ['d','e','c','b'],
        'b' => ['d','e','c'],
        'c' => ['d','e'],
        'd' => [],
        'e' => [],
    ], array_map(function(array $v){
        return array_map(function(Node $n){
            return $n->name;
        }, $v);
    }, $class->getAdjacencyList()));
}
```

## Writing an Adjacency List into GraphResolver

In order to generate an adjacency list and pass the new `testGraphAdjacencyList` test the `GraphResolver` class needs to be modified in a surprisingly small way by adding just fourteen lines of code that update an `$adjacencyList` array for each node of the graph it resolves:

```php
class GraphResolver
{

    // ...
    
    private $adjacencyList = [];
    
    public function resolve(Node $node): array
    {
        $this->resolved = [];
        $this->unresolved = [];
        $this->adjacencyList = [];
        $this->resolveNode($node);
        return $this->resolved;
    }
    
    public function getAdjacencyList()
    {
        return $this->adjacencyList;
    }
    
    private function resolveNode(Node $node, $parents = [])
    {
        if (! isset($this->adjacencyList[$node->name])){
            $this->adjacencyList[$node->name] = [];
        }

        array_push($this->unresolved, $node);
        foreach ($node->edges as $edge)
        {
            if (! in_array($edge, $this->resolved)){
                if (in_array($edge, $this->unresolved)){
                    throw new \Exception('Circular reference detected: ' . $node->name . ' -> '. $edge->name);
                }
                array_push($parents, $node);
                $this->resolveNode($edge, $parents);
            }
        }
        foreach($parents as $p){
            if ($node->name !== $p->name && !in_array($node, $this->adjacencyList[$p->name])) {
                array_push($this->adjacencyList[$p->name], $node);
            }
        }
        array_push($this->resolved, $node);
        if (($key = array_search($node, $this->unresolved)) !== false) {
            unset($this->unresolved[$key]);
        }
    }
}
```

Scanning through the above for `adjacencyList` you should be able to easily tell which lines have been added to the previous version of `GraphResolver` so I shall skip ahead to explaining how the changes to the `resolveNode` method work.

For each node if its `name` property doesn't already exist as a key in `$adjacencyList` its added by lines 24-26. Next once each nodes edges have been resolved lines 39 through to 43 loop over each of the nodes parents, looks up `$adjacencyList` using the parent's name as key and then pushes the current node on to its value. 

If it looks simple, that is because it is. There is some cheating in using the recursive nature of the `resolveNode` method and essentially logging its resolution path as it resolves but that's the art of programming. With all tests now passing we can continue onto trimming changed nodes.

## Trimming Changed Files
 
To keep this demonstration simple I opted to add a _changed_ flag to each _node_ by adding the public property `$changed` and setting its value on `__construct`:

```php

class Node
{
    // ...

    public $changed;
    
    public function __construct(string $name, bool $changed = false)
    {
        $this->name = $name;
        $this->changed = $changed;
    }

    // ...
}
```

Next in the spirit of TDD I wrote the following test method in `tests\GraphTest.php`:

```php
public function testGraphReduction()
{
    /** @var Node[] $nodes */
    $nodes = [];
    foreach (range('a', 'f') as $letter) {
        $nodes[$letter] = new Node($letter);
    }

    $nodes['c']->changed = true;

    $nodes['a']->addEdge($nodes['b']); // b depends on a
    $nodes['a']->addEdge($nodes['d']); // d depends on a
    $nodes['b']->addEdge($nodes['c']); // c depends on b
    $nodes['b']->addEdge($nodes['e']); // e depends on b
    $nodes['c']->addEdge($nodes['d']); // d depends on c
    $nodes['c']->addEdge($nodes['e']); // e depends on c

    $class = new GraphResolver();
    $class->resolve($nodes['a']);
    $reduced = $class->reduce();

    $this->assertCount(3, $reduced);
    $this->assertSame([$nodes['c'],$nodes['d'], $nodes['e']], $reduced);

    $nodes['e']->addEdge($nodes['f']); // f depends on e
    $class = new GraphResolver();
    $class->resolve($nodes['a']);
    $reduced = $class->reduce();

    $this->assertCount(4, $reduced);
    $this->assertSame([$nodes['c'],$nodes['d'], $nodes['f'], $nodes['e']], $reduced);
}
```

This test asserts that once the `GraphResolver` has resolved the same nodes list as the other tests. By running the yet-to-be-written `reduce` method the resulting array will contain three elements equal to `c`, `d` and `e`. This is followed by modifying the node list with node `f` depending on `e`, re-running the `resolve` and `reduce` methods to assert a resulting array containing four elements equal to `c`, `d`, `f` and `e`. It's easy to see the expected results of the when put against the visualisation generated by Graphviz below.

![It sometimes helps to visualise these things](/assets/img/dependency-resolving-algorithm-3.png "It sometimes helps to visualise these things")
 
The test will obviously fail when ran because the `reduce` method does not yet exist on the `GraphResolver` class:

```php
public function reduce(): array
{
    $modified = [];

    foreach ($this->resolved as $node){
        if ($node->changed === true){
            array_push($modified, $node);
            foreach ($this->adjacencyList[$node->name] as $affected) {
                array_push($modified,$affected);
            }
        }
    }

    return $modified;
}
```

Before reading Boender's paper on dependency resolving algorithms the subject itself felt quite daunting in its complexity. However I have a feeling that the LOC written for the unit tests is more or less equal to the code being tested, therefore it is fair to say that those fears were unfounded. The amount of complexity in the implementation is surprisingly minimal being easily understood after spending a few minutes walking through the execution.

If you would like to review the code, or have a comment/suggestion the whole lot is available on [GitHub here](https://github.com/photogabble/dependency-resolving-tutorial). I very much welcome all suggestions for how it can be improved.
 
[^1]: I'm not 100% bought in, but it's one of those words that will win you B.S bingo...
[^2]: You should honestly [check it out](https://www.electricmonk.nl/docs/dependency_resolving_algorithm/dependency_resolving_algorithm.html). It's really well written and has an iterative approach to teaching how the algorithm works.
[^3]: Much like TDD, I'm not bought into 100% code coverage. Often a project simply can't attain that golden standard while also being well tested enough to be trusted not to break unexpectedly.