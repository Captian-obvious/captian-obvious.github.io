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
        ID3.read(file, {
            onSuccess: function (tag) {
                console.log(tag);
                    const data = tag.tags.picture.data;
                    const format = tag.tags.picture.format;
                    const title = tag.tags.title;
                    const artist = tag.tags.artist;
                    if (data.length != 0 && format != null) {
                        let str = "";
                        for (var o = 0; o < data.length; o++) {
                            str += String.fromCharCode(data[o]);
                        }
                        var url = "data:" + format + ";base64," + window.btoa(str);
                        album.style.backgroundImage = "url(" + url + ")";
                    }
                    if (title != "" && artist != "") {
                        filetitle.textContent = artist + " - " + title;
                    }
                },
                onError: function (error) {
                    console.log(error);
                },
            });
    },
}
