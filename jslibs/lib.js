var jsmediatags = import('https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js');
var ace = import('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/ace.js');

var lib = {};

lib.Name = "lib"

lib.jsmediatags = jsmediatags;

lib.ace = ace;

console.log(lib)

window.lib = lib;
