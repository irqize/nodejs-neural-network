
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let path = require('path');

let router = express.Router();

let MNISTLoader = require('./MNISTLoader');
let NN = require('../../../lib/index');

let trainingBatch = 60000;

n = new NN(784, 256, 10);


MNISTLoader((data)=>{
	console.log('Loaded MNIST data.');

	//Start Training
	let i=0
	for(i; i<trainingBatch; i++){
		n.train(data['TRAIN']['IMAGES'][i].map(n => n/255), labelToArray(data['TRAIN']['LABELS'][i]));
		if((i%1000) == 0) console.log(i + ' / ' + trainingBatch);
	}
	console.log('Finished traning.');


	//Check accuraccy of the network on test data
	let predictedRight = 0;
	for(let i=0; i < 10000; i++){
		let r = n.feedForward(data['TEST']['IMAGES'][i].map(n => n/255));
		r = arrayToLabel(r)
		if(r == data['TEST']['LABELS'][i]) predictedRight++;
	}
	console.log(`Accuraccy of the network based on test data - ${predictedRight / 100}%.`);
	initWebsite();
	console.log('Ready for user input');
});

function initWebsite(){
	//Static files
	router.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname + '/../client/index.html'));
	});
	router.get('/client.js', (req, res) => {
		res.sendFile(path.resolve(__dirname + '/../client/client.js'));
	});
	app.use(router);
	server.listen(80);
	io.on('connect', (socket) => {
		socket.emit('init');

		socket.on('predict', data =>{
			let r = n.feedForward(data);
			r = arrayToLabel(r)
			socket.emit('prediction response', r);
		})
	})
}

function labelToArray(n){
	let arr = [];
	for(let i=0; i<10; i++){
		if(i == n) arr.push(1);
		else arr.push(0);
	}
	return arr;
}
function arrayToLabel(n){
	let biggest = -1, biggestIndex;
	n.forEach((r, i)=> {
		if(r > biggest){
			biggestIndex = i;
			biggest = r;
		}
	});
	return biggestIndex;
}