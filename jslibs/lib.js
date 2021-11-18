import { jsmediatags } from 'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js'
import { ace } from 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/ace.js'

var libsName = {}
libsName.Name = "lib"

libsName.prototype.jsmediatags = jsmediatags

libsName.prototype.ace = ace

window.lib = libsName
