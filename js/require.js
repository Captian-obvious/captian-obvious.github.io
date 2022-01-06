window.require = function(src, ret){
    var global = null
    if (src==='jsmediatags') {
        src = 'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js';
    };
    if (src==='dropzone') {
        src='https://unpkg.com/dropzone@5/dist/min/dropzone.min.js'
        global = 'Dropzone'
    };
    var d = document.createElement('script');
    d.src = src;
    document.head.appendChild(d);
    var fullURL = src.split('://');
    var neededURL = fullURL[1];
    var nameParts = neededURL.split('/');
    var nameNUM = nameParts.length - 1;
    var fileName = nameParts[nameNUM];
    var g = fileName.split('.');
    if (global===null) {
        global = g[0];
    };
    if (ret===true) {
        return window[global]
    };
};
