var fv = {
    Load: function(){
        var main = document.getElementById('file')
        main.innerHTML = `
        <div id='album ' width='20%' height='20%' style='verticalAlign: middle'></div>
        <div id='name 'width='100%' height='20%' style='verticalAlign: middle'>Choose a file</div>
        <div id='artist 'width='100%' height='20%' style='verticalAlign: middle'>Unknown Artist</div>
        <canvas id='visualizer' width='30%' height='10%'></canvas>
        <div id='MediaPlayerControls' style='verticalAlign: middle'>
            <div id='playpause' class='icon-play'></div>
            <div id='MediaPlayerRange' class='seekbar' width='100%' height='5px'></div>
        </div>
        `
    },
}
window.fv = fv
