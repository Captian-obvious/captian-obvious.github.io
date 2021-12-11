window.require = function(src, ret){
    var d = document.createElement('script');
    d.src = src;
    document.head.appendChild(d);
    var fullURL = src.split('://');
    var neededURL = fullURL[fullURl.length];
    var nameParts = neededURL.split('/');
    var fileName = nameParts[nameParts.length];
    var g = fileName.split('.')
    var global = g[0]
    if (ret===true) {
        return window[global]
    };
};
