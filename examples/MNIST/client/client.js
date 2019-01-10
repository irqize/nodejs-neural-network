let drawingSize = 560;
const scaledSize = 28;

let digitCanvasCtx;
let drawing, scaledDrawing;
let drawingCtx;
let scaledCtx;

let socket = io();

initDrawing();
let mouseDown = false;
let cursorPos = {
	x : null,
	y : null
}

function initDrawing() {
	socket.off('progress');

	drawing = document.getElementById('drawing');
	scaledDrawing = document.getElementById('scaled');


	drawingCtx = drawing.getContext('2d');
	scaledCtx = scaledDrawing.getContext('2d');

	drawing.width = drawingSize;
	drawing.height = drawingSize;

	scaledDrawing.width = scaledSize;
	scaledDrawing.height = scaledSize;

	document.body.onmousedown = () => mouseDown = true;
	document.body.onmouseup = () => mouseDown = false;

	drawing.onmousemove = e => {
		draw(getMousePos(drawing, e));
	}

}

function draw(pos){
	if(mouseDown){
		if( pos.x > 0 && pos.x < drawingSize && pos.y > 0 && pos.y < drawingSize){
			drawingCtx.beginPath();
			drawingCtx.arc(pos.x, pos.y, 20, 0, 2*Math.PI);
			drawingCtx.fillStyle = 'black';
			drawingCtx.fill();

			scaledCtx.beginPath();
			scaledCtx.arc(pos.x * .05, pos.y * .05, 1 , 0, 2*Math.PI);
			scaledCtx.fillStyle = 'black';
			scaledCtx.fill();
		}
	}
	
}

setInterval(predict, 500);

function predict(){
	let imgData = scaledCtx.getImageData(0,0,scaledSize,scaledSize);
	let predictData = [];
	for(let i = 0; i < imgData.data.length; i+=4){
		predictData.push(imgData.data[i + 3] / 255);
	}
	socket.emit('predict', predictData);
	socket.once('prediction response', n => {
		document.getElementById('prediction').innerHTML = n;
	})
}

function clearCanvas(){
	drawingCtx.clearRect(0, 0, drawing.width, drawing.height);
	scaledCtx.clearRect(0, 0, scaled.width, scaled.height);
}

function randomColor() {
	return Math.floor(Math.random() * 256);
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}