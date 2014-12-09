/* global define: true */
(/* istanbul ignore next */
    function (root, factory) {
        'use strict';
        if (typeof exports === 'object') {
            // CommonJS
            module.exports = factory();
        } else if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define([], factory);
        } else {
            // Browser globals
            root.functionCallApply = factory();
        }
    })
(this, function () {
    /**
     * Works as getOwnPropertyDescriptor but also digs into prototype chain
     *
     * @param {Object} object
     * @param {String} name
     * @returns {Object|undefined}
     */
    function getPropertyDescriptor(object, name) {
        object = Object(object);

        var descriptor;

        while (true) {
            descriptor = Object.getOwnPropertyDescriptor(object, name);

            if (descriptor) {
                return descriptor;
            }

            object = Object.getPrototypeOf(object);

            if (object === null) {
                return;
            }
        }
    }

    function commonGetter() {
        throw new Error('Property is private');
    }

    /**
     * Marks properties as private
     *
     * @param {Object} what
     * @returns {Object}
     */
    function privatize(what/*...properties*/) {
        what = Object(what);

        var properties = Array.prototype.slice.call(arguments, 1);

        return Object.create(what, properties.reduce(function (propertiesObject, name) {
            var realPropertyDescriptor = getPropertyDescriptor(what, name) || {};

            propertiesObject[name] = {
                get: commonGetter,
                configurable: realPropertyDescriptor.configurable,
                enumerable: realPropertyDescriptor.enumerable
            };

            return propertiesObject;
        }, {}));
    }

    return privatize;
});
