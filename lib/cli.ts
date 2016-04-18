/// <reference path="../typings/main.d.ts" />

'use strict';

export module Cli {
    let colors = require('colors');
    let pkg = require("../package.json");

    export function print(options) {
        if (options && options.message && typeof options.message === 'string') {
            return console.log("[", "powerbi"["white"], "]", options.message.toString().cyan);
        } else {
            throw new Error('no message defined to print!');
        }
    }
    
    export function warn(options){
        if (options && options.message && typeof options.message === 'string') {
            return console.log("[", "powerbi"["white"], "]", options.message.toString().yellow);
        } else {
            throw new Error('no message defined to print!');
        }
    }
    
    export function error(options){
        if (options && options.message && typeof options.message === 'string') {
            return console.log("[", "powerbi"["white"], "]", options.message.toString().red);
        } else {
            throw new Error('no message defined to print!');
        }
    }
}