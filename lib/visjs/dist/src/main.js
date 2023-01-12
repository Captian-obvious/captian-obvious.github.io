var vm = {
    init: function() {
        var VE = document.getElementsByTagName('visualizer')
        var returnedData = new Array(VE.length)
        for (var i=0; i < VE.length; i++) {
            var element = VE[i]
            element.style.display = 'block';
            var type = element.getAttribute('data-vis-type')
            if (type==='fft1') {
                var visualizer={
                    visType: 'fft',
                    visPattern: 'bars',
                    currentAudio: null,
                    running: false,
                    openFile: function(file) {
                        if (this.currentAudio===null) {
                            this.currentAudio = window.vm.load(URL.createObjectURL(file))
                        }else{
                            this.currentAudio.src=URL.createObjectURL(file)
                        }
                        if (this.running===false) {
                            this.run()
                        }
                    },
                    run: function(){
                        this.running = true
                        this.currentAudio.play()
                        var str = element.getAttribute('data-fft-size')
                        var fftSize = Number(str)
                        if (typeof fftSize === 'number') {
                            window.vm.fft(this.currentAudio, fftSize, this.visPattern,element)
                        }
                    },
                }
                returnedData[i] = visualizer
            }
            if (type==='fft2') {
                var visualizer={
                    visType: 'fft',
                    visPattern: 'cbars',
                    currentAudio: null,
                    running: false,
                    openFile: function(file) {
                         if (this.currentAudio===null) {
                            this.currentAudio = window.vm.load(URL.createObjectURL(file))
                        }else{
                            this.currentAudio.src=URL.createObjectURL(file)
                        }
                        if (this.running===false) {
                            this.run()
                        }
                    },
                    run: function(){
                        this.running = true
                        this.currentAudio.play()
                        var str = element.getAttribute('data-fft-size')
                        var fftSize = Number(str)
                        if (typeof fftSize === 'number') {
                            window.vm.fft(this.currentAudio, fftSize, this.visPattern,element)
                        }
                    },
                }
                returnedData[i] = visualizer
            }
        }
        return returnedData
    },
    load: function(url, looped) {
        var audio = new Audio()
        audio.src = url
        audio.load()
        audio.loop = looped
        audio.volume = 1
        return audio
    },
    fft: function(audio,fftSize,pattern,element) {
        var maxrms = 255
        function getRMS(arr) {
            var square = 0;
            var mean = 0;
            var intrms = 0;
            var n = arr.length;
            for (var i = 0; i < n; i++) {
                square += Math.pow(arr[i], 2);
            };
            mean = square / n;
            intrms = Math.sqrt(mean);
          	maxrms = Math.max(intrms,maxrms);
          	var rms = intrms/maxrms;
            return rms*255;
        }
        var actx = new AudioContext()
        var src = actx.createMediaElementSource(audio);
        var analyser = actx.createAnalyser();
        src.connect(analyser);
        analyser.connect(actx.destination);
        analyser.fftSize = fftSize;
        analyser.maxDecibels = -3;
        analyser.minDecibels = -150;
        var l = analyser.frequencyBinCount;
        var array = new Uint8Array(l);
        var div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.position = 'relative';
        element.appendChild(div);
        var canvas = document.createElement('canvas');
        div.appendChild(canvas);
        canvas.width = element.style.width;
        canvas.height = element.style.height;
        var range = document.createElement('input')
        range.type = 'range'
        range.addEventListener('change', function() {
            
        });
        var ctx = canvas.getContext("2d");
        function frame() {
            analyser.getByteFrequencyData(array)
            if (pattern==='bars') {
                var WIDTH = canvas.width;
                var HEIGHT = canvas.height;
                var barWidth = (WIDTH / l) * 2.5;
                var barHeight;
                var x = 0;
                for (var i=0; i < l; i++) {
                    barHeight = array[i];
                    var r = barHeight + (25 * (i/l));
                    var g = 250 * (i/l);
                    var b = 50;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }
            }
            if (pattern==='cbars') {
                var WIDTH = canvas.width;
                var HEIGHT = canvas.height;
                var barWidth = (WIDTH / l) * 2.5;
                var barHeight;
                var x = 0;
                var centerX = canvas.wdith/2
                var centerY = canvas.height/2
                var loud = getRMS(array)
                let rad = (loud/255) * 5;
                for (var i=0; i < l; i++) {
                    barHeight = (array[i]/255)* HEIGHT/3;
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(90 + i * ((Math.PI * 2) / l));
                    var r = barHeight + 25 * (i / l);
                    var g = 250 * (i / l);
                    var b = 50;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(0, 0 + rad, barWidth, barHeight);
                    ctx.fillStyle = "rgb(255,255,255)";
                    ctx.fillRect(0, 0 + rad + barHeight, barWidth, 1);
                    ctx.restore();
                }
                ctx.beginPath();
                ctx.arc(centerX, centerY, rad, 0, Math.PI * 2, false);
                ctx.fillStyle = "rgb(" + loud + ", " + loud + ",0)";
                ctx.fill();
                ctx.closePath();
            }
            requestAnimationFrame(frame)
        }
    },
}
window.vm = vm
