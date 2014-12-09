/*global describe, it, beforeEach, afterEach*/
/*jshint expr:true*/

var privatize = require('..'),
    expect = require('chai').expect;

function A() {
    this.value = 123;
}

A.prototype = {
    set: function (value) {
        this.value = value;
    },

    get: function () {
        return this.value;
    }
};

describe('privatize', function () {
    var a;

    beforeEach(function () {
        a = new A();
    });

    it('always returns new instance', function () {
        expect(privatize(a)).to.not.equal(a);

    });

    it('uses `what` object as prototype', function () {
        expect(privatize(a)).to.be.instanceof(A);
        expect(Object.getPrototypeOf(privatize(a))).to.eql(a);
    });

    it('privatizes any number of properties', function () {
        a = privatize(a, 'set', 'get');

        expect(function () {
            a.set;
        }).to.throw(Error);

        expect(function () {
            a.get;
        }).to.throw(Error);
    });

    it('privatizes even non existing and non-own properties', function () {
        a = privatize(a, 'fetch', 'toString');

        expect(function () {
            a.fetch;
        }).to.throw(Error);

        expect(function () {
            a.toString();
        }).to.throw(Error);
    });

    it('respects configurable and enumerable of existing property', function () {
        var originalDescriptor = {
            enumerable: false,
            configurable: false
        };

        Object.defineProperty(a, 'fetch', originalDescriptor);

        a = privatize(a, 'fetch');
        var descriptor = Object.getOwnPropertyDescriptor(a, 'fetch');

        expect(descriptor).to.have.property('enumerable', originalDescriptor.enumerable);
        expect(descriptor).to.have.property('configurable', originalDescriptor.configurable);
    });

    it('respects configurable and enumerable of existing non-own property', function () {
        var originalDescriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'toString');

        a = privatize(a, 'toString');

        var descriptor = Object.getOwnPropertyDescriptor(a, 'toString');

        expect(descriptor).to.have.property('enumerable', originalDescriptor.enumerable);
        expect(descriptor).to.have.property('configurable', originalDescriptor.configurable);
    });
});
