var fv = {
    Load: function(type){
        var main = document.getElementById('file')
        if (type==='audio') {
            main.innerHTML = `
            <div class='red1' id='album' width='20%' height='20%' style='vertical-align: middle'></div>
            <div class='red1' id='name' width='100%' height='20%' style='vertical-align: middle'>Choose a file</div>
            <div class='red1' id='artist' width='100%' height='20%' style='vertical-align: middle'>Unknown Artist</div>
            <canvas id='visualizer' width='15%' height='10%' style='vertical-align: middle'></canvas>
            <div id='MediaPlayerControls' style='vertical-align: middle'>
                <div id='playpause' class='icon-play' style='vertical-align: left'></div>
                <div id='MediaPlayerRange' class='seekbar' width='100%' height='5px'></div>
            </div>
            `
        }
    },
}
window.fv = fv
