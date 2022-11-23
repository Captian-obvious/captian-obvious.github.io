function createAudio(url){
    var src = url
    var audio = new Audio()
    if (src != null) {
        audio.src=src
    }
    if (audio != null) {
        audio.hidden = true
        return audio
    }
}
