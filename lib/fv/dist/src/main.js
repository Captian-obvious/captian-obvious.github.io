var fv = {
    Load: function(type){
        var main = document.getElementById('file')
        if (type==='audio') {
            main.innerHTML = `
            <div class='red1 middle' id='album' style='width: 60px; height: 60px;'></div> 
            <div class='red1 middle' id='name' style='width: 100%; height: 20%; top: 20%;'>Choose a file</div> 
            <div class='red1 middle' id='artist' style='width: 100%; height: 20%; top: 40%;'>Unknown Artist</div> 
            <canvas class='middle' id='visualizer' style='width: 15%; height: 10%; top: 60%;'></canvas>
            <div class='red1 middle' id='MediaPlayerControls' style='top: 70%'>
                <div id='playpause' class='MediaPlayerIcon icon-play' style='width: 16px; height: 16px; top: 70%;'></div>
                <input class='middle' type='range' id='MediaPlayerSeek' class='MediaPlayerControl seekbar' style='width: 95%; height: 5px; left: 4%; top: 70% 8px;'></input>
            </div>
            `
        }
    },
}
window.fv = fv
