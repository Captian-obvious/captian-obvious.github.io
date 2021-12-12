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
    var main = document.getElementById('page-container');
    if (is404 === true) {
        main.innerHTML=`
        <h1 style="color: #980000">Not Found (404)</h1>
        <h4 style="color: #980000">The page you were looking for has been moved or deleted.</h4>
        <img src="/images/404.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
    };
    if (is500 === true) {
        main.innerHTML=`
        <h1 style="color: #980000">Server Error (500)</h1>
        <h4 style="color: #980000">The server encountered an error, please try again later.</h4>
        <img src="/images/404.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
    };
});
