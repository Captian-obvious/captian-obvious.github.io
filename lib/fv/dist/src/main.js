var fv = {
    Load: function(type){
        var main = document.getElementById('file')
        if (type==='audio') {
            main.innerHTML = `
            <div class='red1 middle' id='album' width='20%' height='20%'></div> 
            <div class='red1 middle' id='name' width='100%' height='20%'>Choose a file</div> 
            <div class='red1 middle' id='artist' width='100%' height='20%'>Unknown Artist</div> 
            <canvas id='visualizer' width='15%' height='10%'></canvas>
            <div class='red1 middle' id='MediaPlayerControls'>
                <div id='playpause' class=' MediaPlayerIcon icon-play' style='vertical-align: left'></div>
                <input class='middle' type='range' id='MediaPlayerSeek' class='MediaPlayerControl seekbar' width='100%' height='5px'></input>
            </div>
            `
        }
    },
}
window.fv = fv
