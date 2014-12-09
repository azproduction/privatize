# privatize
[![NPM Version](https://badge.fury.io/js/privatize.png)]
(https://npmjs.org/package/privatize)

[![Build Status](https://travis-ci.org/azproduction/privatize.png?branch=master)]
(https://travis-ci.org/azproduction/privatize)

Marks object properties as private. JFYI this module requires ES5 features.

## Example

```js
var privatize = require('privatize');

function A() {
    this.value = 123;
    
    setTimeout(function () {
        this.set(134); // Works
    }.bind(this), 1000);
    
    return privatize(this, 'set');
}

A.prototype = {
    set: function (value) {
        this.value = value;
    },
    
    get: function () {
        return this.value;
    }
};

var a = new A();
console.log(a.get()); // Works
a.set(111); // Error (Property is private)
a.set; // Error (Property is private)
```

# Backbone example

```js
var privatize = require('privatize'),
    Model = require('backbone').Model;

// Privatize all "write" methods
module.exports = privatize(new Model(), 'sync', 'set', 'fetch', 'attributes', 'clear', 'unset', 'save', 'destroy');
```
