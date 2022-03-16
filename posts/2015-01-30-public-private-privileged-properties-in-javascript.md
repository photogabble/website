---
title: Achieving Public, Private and Privileged members in JavaScript
categories:
    - tutorials
tags:
    - programming
    - javascript
growthStage: budding
---

> While [writing my pixel editor tutorial series](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/) I noticed that I had neglected to explain the structure of the objects I had created and how I was making object members private and public. So here is a little introduction to JavaScript objects and their members.

Fundamentally JavaScript is a *wonderful* language with an obsession with objects; arrays are objects, functions are objects, [objects are objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) &ndash; pretty much everything in JavaScript is an object. However for those reading who are used to objects in conventional languages such as Java and C++, JavaScript objects are different. Each object in JavaScript is *usually* implemented as a [hashmap](http://en.wikipedia.org/wiki/Hash_table) with key-value pairs where the key is always a `string` while the value can be any of the data types that JavaScript supports.

If the value of an given key is a function then we can call it a **method**, otherwise we call it a **property**. Once a method of an object is invoked the `this` variable is set to the object and made available within the methods scope for example, the below code will output `10` to the console.

###Object Constructors
In JavaScript you can define an object in one of two contexts, with or without a constructor. In the non-constructor context the resulting object behaves identically to `new Object()` as shown in the following code example:

```javascript
var Plant = { commonName: 'Yellow Birch', age: 10, type: 'Tree' };
console.log(Plant);
// Plant is an instance of Object
```

Defining a JavaScript object with a constructor is identical to defining a function, the content of the function becomes the objects constructor when using the `new` operator to create a new instance. This is shown in the following code example:

```javascript
var Plant = function( commonName, age, type )
{
    this.commonName = commonName;
    this.type = type;
    this.age = age;
}

var myTree = new Plant( 'Yellow Birch', 10, 'Tree' );
console.log(myTree);
// myTree is an instance of Object with a type of Plant
```

You can create any number of defined object types by using `new` for example:

```javascript
var myShrub = new Plant( 'Ivy Hedera', 3, 'Shrub');
```

###Public Members
All members of an object are *public*, this means that as well as adding new members to an object &ndash; any function can access, modify or even delete them.

There are several methods of adding and populating public members of an object, taking our non-constructor example above you can amend and add new methods to it like so:

```javascript
var Plant = { commonName: 'Yellow Birch', age: 10, type: 'Tree' };
Plant.age = 20;
Plant.getDetails = function()
{
    return this.type + ' ' + this.commonName + ' is ' + this.age + ' years old.';
}

console.log(Plant.getDetails());
// Will output: "Tree Yellow Birch is 20 years old."

Plant.age = 35;
console.log(Plant.getDetails());
// Will output: "Tree Yellow Birch is 35 years old."
```

Alternatively an objects public members may be populated via its constructor. You can add public members to an instance of an object, however they will be attached to the scope of that instance and no others. To attach a public member to all instances of an object, you do so through that types [prototype property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype).

```javascript
var Plant = function( commonName, age, type )
{
    this.commonName = commonName;
    this.type = type;
    this.age = age;
}

var myTree = new Plant( 'Yellow Birch', 10, 'Tree' );
var myShrub = new Plant( 'Ivy Hedera', 3, 'Shrub');

Plant.prototype.getDetails = function()
{
    return this.type + ' ' + this.commonName + ' is ' + this.age + ' years old.';
}

console.log(myTree.getDetails());
console.log(myShrub.getDetails());
```

###Private Members
The inherent public nature of JavaScript object members has lead some to wrongly suggest that JavaScript lacks the property of information hiding. An Object constructor creates the wrapper for the given object Type, when that constructor returns `null` or `undefined`, as those in the above examples do, then the constructor will construct an object equal to `this`, otherwise if the constructor returns an Object, the resulting constructed instance will equal that Object.

Variables defined within the constructors scope are hidden outside of the created object and therefore can be seen as *private* members.

```javascript
var Plant = function( commonName, age, type )
{
    var privateMembers = {
        commonName: commonName,
        type: type,
        age: age
    };

    var publicMembers = {
        setCommonName: function( commonName ){
            privateMembers.commonName = commonName;
        },
        getCommonName: function(){
            return privateMembers.commonName;
        }
    };

    return publicMembers;
}

var myTree = new Plant( 'Yellow Birch', 10, 'Tree' );

console.log(myTree.getCommonName());
// Will output: "Yellow Birch"
```

Because `privateMembers` is defined within the scope of the `Plant` constructor and not as part of `this` it is effectively private and only accessible through the two public members that have been defined. While I have called these private members, they are technically private variables and not members of the object at all. 

###Privileged Members
A *privileged* member is an invokable object method that has access to private members. In the previous example both `setCommonName` and `getCommonName` are *privileged* members because they have access to the private `privateMembers` variable.

###Further reading
I hope that this short foray into JavaScript objects has been worth the time you have taken reading it. If you notice any errors or have questions please get in touch via the comment form below.

For further reading I would suggest you read the Mozilla docs on [Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) and the [new operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) followed by a browse of [Douglas Crockfords' writings about JavaScript](http://javascript.crockford.com/javascript.html).
