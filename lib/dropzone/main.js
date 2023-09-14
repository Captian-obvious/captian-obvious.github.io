var dropzone = {
    handleDragOver: function(ev,callback){
        ev.preventDefault();
        callback(ev)
    },
    handleDrop: function(ev,callback){
        ev.preventDefault();
        callback(ev)
    }
    removeDragData: function(ev,callback) {
        console.log('Removing drag data')
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to remove the drag data
            ev.dataTransfer.items.clear();
        }
    }
    getFiles: function(items,callback) {
        if (callback!=null){
            var files = []
            for (var i = 0; i < items.length; i++) {
                // If dropped items aren't files, reject them
                if (items[i].kind === 'file') {
                    var file = items[i].getAsFile();
                    console.log('... file[' + i + '].name = ' + file.name);
                    files[i] = file
                }
            }
            callback(files)
        } else {
            var files = []
            for (var i = 0; i < items.length; i++) {
                // If dropped items aren't files, reject them
                if (items[i].kind === 'file') {
                    var file = items[i].getAsFile();
                    console.log('... file[' + i + '].name = ' + file.name);
                    files[i] = file
                }
            }
            return files
        }
    }
}
window.dropzoneAPI = dropzone
