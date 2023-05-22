function loadMedia(mediaElements) {
    var ctx = new AudioContext()
    var source = ctx.createMediaElementSource(mediaElements)
    var gainNode = ctx.createGain()
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.value = source.volume
    return source
}
function createAudio(url,loopBoolean,volume) {
    var src = url
    var audio = document.createElement('AUDIO')
    audio.hidden=true
    audio.controls=true
    audio.src=src
    audio.loop = loopBoolean
    audio.volume = volume/100
    audio.load()
    setTimeout(function(){
        document.getElementById('audios').appendChild(audio)
    },100)
    return audio
}
function wait(time) {
    const date = Date.now();
    let milliseconds = time * 1000
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
function finale() {
    var th = createAudio('./sounds/music5.ogg', false, 100);
    var ttz = createAudio('./sounds/tentozero.ogg', false, 100);
    var exp = createAudio('./sounds/explosion.ogg', false, 100);
    th.play()
    wait(40)
    ttz.play()
    wait(12)
    exp.play()
    wait(50)
    document.getElementById('audios').innerHTML = ''
}
function doMeltdown() {
    var meltdownStarting = createAudio('./sounds/meltdownStarting.ogg', false, 100);
    var theme = createAudio('./sounds/theme.ogg', false, 100);
    var alarm = createAudio('./sounds/alarm.ogg', true, 100);
    var lockdown = createAudio('./sounds/lockdown.ogg', false, 100);
    var cei = createAudio('./sounds/coreExplosionImminent.ogg', false, 100);
    var epa = createAudio('./sounds/emergencyPowerActivated.ogg', false, 100);
    var me = createAudio('./sounds/metalexplosion.ogg', false, 80);
    var evac = createAudio('./sounds/EVAC.ogg', false, 100);
    var danger = createAudio('./sounds/danger.ogg', false, 100);
    var di = createAudio('./sounds/destruction-imminent.ogg', false, 100);
    var ut = createAudio('./sounds/ultimate_travesty.ogg', false, 100);
    var sd = createAudio('./sounds/selfDestructMessage.ogg', false, 100);
    var sda = createAudio('./sounds/selfDestructInitiated.ogg', false, 80);
    var hint = document.getElementById('hint')
    var timer = 0
    var timerDisplay = document.getElementById('timer')
    wait(1)
    meltdownStarting.play()
    wait(25)
    danger.play()
    wait(4)
    alarm.play()
    wait(10)
    alarm.pause()
    wait(5)
    evac.play()
    alarm.play()
    wait(10)
    alarm.pause()
    theme.play()
    wait(40)
    lockdown.play()
    wait(15)
    evac.play()
    wait(19)
    epa.play()
    wait(7)
    cei.play()
    wait(7)
    me.play()
    wait(5)
    alarm.play()
    wait(10)
    alarm.pause()
    wait(15)
    evac.play()
    wait(49)
    theme.pause()
    hint.hidden = false
    hint.TextContent = 'ALERT! REACTOR INSTABILITY AND THERMAL RUNAWAY!'
    wait(2.5)
    di.play()
    wait(8)
    hint.TextContent = 'Generators Offline!'
    wait(6)
    hint.hidden = true
    wait(25)
    evac.play()
    wait(9)
    hint.hidden = false
    hint.TextContent = 'Evacuate to LAUNCH SILOS!'
    wait(30)
    hint.hidden = true
    wait(2)
    sd.play()
    wait(16)
    hint.TextContent = 'Self Destruct System Initiated!'
    hint.hidden = false
    wait(4)
    hint.TextContent = 'Have a nice day!'
    wait(4)
    hint.hidden = true
    wait(1)
    evac.play()
    wait(1)
    hint.hidden = false
    hint.TextContent = 'Evacuate the facility immiediatly!'
    timer = 185
    timerDisplay.TextContent = ''+timer
    timerDisplay.hidden = false
    var currentTime = 185
    for (var i = 0; i < (timer - 10); i++) {
        wait(1)
        currentTime = timer - i
        if (currentTime === 175) {
            hint.hidden = true
        }
        if (currentTime === 145) {
            ut.play()
            di.pause()
        }
        if (currentTime === 50) {
            ut.pause()
            setTimeout(finale, 0); 
        }
        timerDisplay.TextContent = ''+currentTime
    }
}
window.addEventListener('load', function(){
    var main = document.getElementById('codesystem')
    main.innerHTML = `
    <div class='red1' id='hint' hidden></div>
    <div class='red1' id='timer' hidden></div>
    <button id='test'>meltdown</button>
    `
    wait(3)
    var button = document.getElementById('test')
    button.addEventListener('click', function(){
        doMeltdown()
    })
})
