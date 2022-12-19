var fv = {
    Load: function(file){
        var main = document.getElementById('file')
        main.innerHTML = `
        <canvas id='visualizer'></canvas>
        <div id='name'></div>
        <div id='album'></div>
        <div id='MediaPlayerControls'>
            <div id='MediaPlayerIcon1' class='icon-play'></div>
            <div id='MediaPlayerRange' class='seekbar' style='verticalAlign: middle'></div>
        </div>
        <div id='artist'></div>
        `
    },
}
window.fv = fv
