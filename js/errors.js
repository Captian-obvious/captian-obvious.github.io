function detectQuery(name) {
    var currentQuery = window.location.search;
    if (currentQuery === "?"+name) {
        return true;
    }else{
        return false;
    };
};
window.addEventListener('load', function() {
    var is404 = detectQuery('code=404');
    if (is404 === true) {
        document.getElementById('page-container').innerHTML=`
        
        `
    };
});
