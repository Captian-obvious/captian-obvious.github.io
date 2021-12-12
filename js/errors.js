function detectQuery(name) {
    var currentQuery = window.location.search;
    if (currentQuery === "?"+name) {
        return true;
    } else {
        return false;
    };
};
window.addEventListener('load', function() {
    var is404 = detectQuery('code=404');
    var is500 = detectQuery('code=500');
    var is502 = detectQuery('code=502');
    var main = document.getElementById('page-container');
    if (is404 === true) {
        document.title = '404';
        main.innerHTML=`
        <h1 style="color: #980000">Not Found (404)</h1>
        <h4 style="color: #980000">The page you were looking for has been moved or deleted.</h4>
        <img src="/images/404.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
    };
    if (is500 === true) {
        document.title = 'Internal Server Error (500)';
        main.innerHTML=`
        <h1 style="color: #980000">Server Error (500)</h1>
        <h4 style="color: #980000">The server encountered an error, please try again later.</h4>
        <img src="/images/404.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
    };
    if (is502 === true) {
        document.title = 'Gateway Error (502)';
        main.innerHTML = `
        <h1 style="color: #980000">Bad Gateway. (502)</h1>
        <h4 style="color: #980000">Gateway error, please try again later.</h4>
        <img src="/images/404.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
    };
});
