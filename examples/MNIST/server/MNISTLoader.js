//Library which loads files to js arrays
const fs = require('fs');

const IMAGES = [
    { name : 't10k-images-idx3-ubyte', label : 'TEST' },
    { name : 'train-images-idx3-ubyte', label : 'TRAIN' },
];
const LABELS = [
    { name : 't10k-labels-idx1-ubyte', label : 'TEST' },
    { name : 'train-labels-idx1-ubyte', label : 'TRAIN' }
];
const IMAGE_HEADER_MAGIC_NUMBER = 2051;
const LABEL_HEADER_MAGIC_NUMBER = 2049;

const IMAGE_HEADER_BYTES = 16;
const LABEL_HEADER_BYTES = 8;

const IMAGE_HEIGHT = 28;
const IMAGE_WIDTH = 28;

const IMAGE_SIZE = 784

function MNISTLoader(callback){
    let data = {
        "TEST" : {},
        "TRAIN" : {}
    };
    
    return Promise.all(LABELS.map(async file => {
        data[file.label]['LABELS'] = await loadLabels(file.name);
    })).then(Promise.all(IMAGES.map(async file => {
        data[file.label]['IMAGES'] = await loadImages(file.name);
    }))).then(() => callback(data));
}

async function loadImages(fileName){
    let fileBuffer = fs.readFileSync(__dirname + '/' + fileName);

    let headerValues = [];
    for(let i = 0; i < IMAGE_HEADER_BYTES / 4; i++){
        headerValues[i] = fileBuffer.readUInt32BE(i*4);
    }

    if(headerValues[0] != IMAGE_HEADER_MAGIC_NUMBER || headerValues[2] != IMAGE_HEIGHT || headerValues[3] != IMAGE_WIDTH) throw new Error("BAD FILE TYPE");

    let index = IMAGE_HEADER_BYTES;
    let images = [];
    while(index < fileBuffer.length){
        let pixels = [];
        for(let i = 0; i < IMAGE_SIZE; i++){
            pixels.push(fileBuffer.readUInt8(index))
            index++;
        }
        images.push(pixels);
    }

    if(headerValues[1] != images.length) throw new Error("BAD FILE TYPE");

    return images;
}
async function loadLabels(fileName){
    let fileBuffer = fs.readFileSync(__dirname + '/' + fileName);

    let headerValues = [];
    for(let i = 0; i < LABEL_HEADER_BYTES / 4; i++){
        headerValues[i] = fileBuffer.readUInt32BE(i*4);
    }

    if(headerValues[0] != LABEL_HEADER_MAGIC_NUMBER) throw new Error("BAD FILE TYPE");

    let index = LABEL_HEADER_BYTES;
    let labels = [];
    while(index < fileBuffer.length){
        labels.push(fileBuffer.readUInt8(index));
        index++;
    }

    if(headerValues[1] != labels.length) throw new Error("BAD FILE TYPE")

    return labels;
}
module.exports = MNISTLoader;