var globals = {
    replaceUrl: function(paramText) {
        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + paramText;
        window.history.pushState({ path: newurl }, '', newurl);
    },
};

window.g = globals;
