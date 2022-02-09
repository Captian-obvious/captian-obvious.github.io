var ID3 = require('jsmediatags', true);
class MediaPlayerElementNode {
    volume = 0,
    sourceElement = null,
    currentTrack = 0,
    createElementSource: function(element) {
        if (sourceElement===null) {
            sourceElement = element;
        }else{
            throw TypeError("Cannot connect this node to another source element!")
        };
    },
    readFile: function(file) {
        ID3.read(file, function(tag){
            var tags = tag.tags
            
        })
    },
}
