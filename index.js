'use strict';
/* *************** Отлавливаем необработанные исключения *************** */
process.on('uncaughtException', (err) => {
    console.log('Неотловленное исключение: ', err);
});

let { exec } = require('child_process');

// ************************* Scandir *************************
function getFiles() {
    return new Promise((resolve, reject) => {
	let scandir = require('scandir').create();
	let files = [];

	scandir.on('file', (file, stats) => {
	    files.push(file);
	});

	scandir.on('error', (err) => {
	    reject(err);
	});

	scandir.on('end', () => {
	    resolve(files);
	});


	scandir.scan({
            dir: './images/',
	    recursive: true,
	    filter: /.png/i
	});
    });
}

(async function() {
    let files = await getFiles();
    let firstFrames = [];
    files.forEach((item) => {
        if (item.indexOf('0001.png') + 1) {
            firstFrames.push(item);
        }
    });
    //console.log(firstFrames);

    firstFrames.forEach((item) => {
        let itemArray = item.split('\\');
        //console.log(itemArray);

        let pattern = itemArray[ itemArray.length - 1 ].replace('0001', '%04d');
        //console.log(pattern);

        exec('ffmpeg -f image2 -r 25 -i ./' + itemArray[0] + '/' + itemArray[1] + '/' + pattern + ' -s 1200x1000 -b:v 3.5M  -y -an -r 25 -vcodec h264 ./video/' + itemArray[1] + '.mp4');
    })
})();