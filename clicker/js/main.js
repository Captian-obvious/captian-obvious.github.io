var active = false
function wait(time) {
    const date = Date.now();
    let milliseconds = time * 1000
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
function init() {
    var sdis = document.getElementById('scoredisplay')
    var cdis = document.getElementById('cursorsdisplay')
    var cl = document.getElementById('clickme')
    var buyCursor = document.getElementById('cursor')
    var score = 0
    var cursors = 0
    var autoclickers = 0
    active = true
    function addScore(val) {
        score += val
        sdis.innerHTML = 'Clicks: '+score
    }
    function cursorFunction() {
        addScore(1 * cursors)
    }
    function autoclickerFunction(){
        addScore(5 * autoclickers)
    }
    buyCursor.addEventListener('click',function(){
        if (score > 99) {
            cursors += 1
            cdis.innerHTML = 'Cursors: '+cursors
            addScore(-100)
        }else{
            var n = sdis.style.color
            sdis.style.color = '#ff0000'
            wait(0.2)
            sdis.style.color = n
        }
    })
    cl.addEventListener('click', function(){
        addScore(1)
        if (cursors > 0) {
            cursorFunction()
        }
    })
    while (active===true) {
        wait(1)
        if (autoclickers > 0) {
            autoclickerFunction()
        }
    }
}
window.addEventListener('load', function(){
    active = false
    document.getElementById('canvas').innerHTML=`
    <div class='center' id='scoredisplay'>Clicks: 0</div><br>
    <div style='height: 12px;' class='center' id='cursorsdisplay'>Cursors: 0</div><br>
    <button id='clickme'>Click Me!</button><br>
    <button id='cursor'>Buy a cursor: 100 Clicks.</button>
    <button id='autoclicker'>Buy an autoclicker: 500 Clicks.</button>
    `
    wait(0.1)
    init()
})
