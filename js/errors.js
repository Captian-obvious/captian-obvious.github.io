function detectQuery(name) {
    var currentQuery = window.location.search;
    var queryTable = currentQuery.split('&')
    if (queryTable[0] === "?"+name) {
        return true;
    } else {
        return false;
    };
};

window.addEventListener('load', function() {
    require('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
    var is400 = detectQuery('code=400');
    var is403 = detectQuery('code=403');
    var is404 = detectQuery('code=404');
    var is500 = detectQuery('code=500');
    var is502 = detectQuery('code=502');
    var is503 = detectQuery('code=503');
    var main = document.getElementById('page-container');
    if (is400 === true) {
        document.title = 'Bad Request (400)';
        main.innerHTML=`
        <h1 style="color: #980000">Bad Request (400)</h1>
        <h4 style="color: #980000">Your browser sent a request that this server could not understand.<br>Sorry about that. Please check your request for errors and try again.</h4>
        <img src="/images/404.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
    };
    if (is403 === true) {
        document.title = 'Forbidden (403)';
        main.innerHTML=`
        <h1 style="color: #980000">Forbidden. (403)</h1>
        <h4 style="color: #980000">You do not have permission to view this page.</h4>
        <img src="/images/404.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
    };
    
    if (is404 === true) {
        document.title = 'Page Not Found (404)';
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
        <img src="/images/500.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        <p style="color: #980000">for error info, click this icon <i class="fa-solid fa-arrow-right-long"></i><div id="err-info"></div></p>
        <div id="hiddeninfo" hidden>
            <h3 style="color: #980000">Try:</h3><br>
            <h6 style="color: #980000">1. Checking your connection</h6><br>
            <h6 style="color: #980000">2. Checking your proxy settings</h6><br>
            <h6 style="color: #980000">3. Reloading the page</h6><br>
            <h6 style="color: #980000">4. Checking for errors in your request.</h6><br>
        </div>
        <script>
        var button = document.getElementById("ICON")
        var info = document.getElementById("hiddeninfo")
        button.addEventListener('click', function() {
            if info.hidden = true {
                info.hidden = false
            }else{
                info.hidden = true
            }
        });
        </script>
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
    if (is503 === true) {
        document.title = 'Page Unavailable (503)';
        main.innerHTML = `
        <h1 style="color: #980000">Page Temporarily Unavailable (503)</h1>
        <h4 style="color: #980000">Service Unavailable. Try again later.</h4>
        <img src="/images/500.png" width="120px" height="120px" />
        <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home.</p>
        `
        $.ajax({
            statusCode: {
                503: function() {
                    console.log('HTTP-ERR: Server offline.')
                    main.innerHTML = `
                    <h1 style="color: #980000">Page Temporarily Unavailable (503)</h1>
                    <h4 style="color: #980000">Service Unavailable. Try again later.</h4>
                    <img src="/images/500.png" width="120px" height="120px" />
                    <p style="color: #980000">click <a style="color: #ff0000" href="/"><em>here</em></a> to return home, <br>and wait until this error goes away.</p>
                    `
                }
            }
        });
    };
});
