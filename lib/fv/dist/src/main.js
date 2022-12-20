var fv = {
    Load: function(type){
        var main = document.getElementById('file')
        if (type==='audio') {
            main.innerHTML = `
            <div class='red1 middle' id='album' width='20%' height='20%'></div> 
            <div class='red1 middle' id='name' style='width: 100%; height: 20%;'>Choose a file</div> 
            <div class='red1 middle' id='artist' style='width: 100%; height: 20%;'>Unknown Artist</div> 
            <canvas id='visualizer' style='width: 15%; height: 10%;'></canvas>
            <div class='red1 middle' id='MediaPlayerControls'>
                <div id='playpause' class='MediaPlayerIcon icon-play' style='width: 5%; height: 5%;'></div>
                <input class='middle' type='range' id='MediaPlayerSeek' class='MediaPlayerControl seekbar' style='width: 95%; height: 5px; left: 4%;'></input>
            </div>
            `
        }
    },
}
window.fv = fv
