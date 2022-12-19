var fv = {
    Open: function(file){
        var main = document.getElementById('file')
        main.innerHTML = `
        <div id='name'></div>
        <div id='album'></div>
        <canvas id='visualizer'></canvas>
        <div id='MediaPlayerControls'>
            <div id='MediaPlayerIcon1' class='icon-play'></div>
            <div id='MediaPlayerRange' class='seekbar'></div>
        </div>
        <div id='artist'></div>
        `
    },
}
window.fv = fv
