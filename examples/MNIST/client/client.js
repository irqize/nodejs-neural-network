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

let isDrawing = false;

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
}

drawing.onmousedown = () => {
	isDrawing = true;
	drawingCtx.lineWidth = 10;
	drawingCtx.lineJoin = drawingCtx.lineCap = 'round';
	drawingCtx.shadowBlur = 10;
	drawingCtx.shadowColor = 'rgb(0, 0, 0)';
	drawingCtx.moveTo(cursorPos.x, cursorPos.y);

	scaledCtx.lineWidth = 1;
	scaledCtx.lineJoin = scaledCtx.lineCap = 'round';
	scaledCtx.shadowBlur = .5;
	scaledCtx.shadowColor = 'rgb(0, 0, 0)';
	scaledCtx.moveTo(cursorPos.x * .05, cursorPos.y * .05);
}
drawing.onmousemove = (e) => {
	cursorPos = getCursorPos(drawing, e);
	if(mouseDown && (cursorPos.x > 0 && cursorPos.x < drawingSize && cursorPos.y > 0 && cursorPos.y < drawingSize)){
		drawingCtx.lineTo(cursorPos.x, cursorPos.y);
		drawingCtx.stroke();

		scaledCtx.lineTo(cursorPos.x * .05, cursorPos.y * .05);
		scaledCtx.stroke();
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
	drawingCtx.beginPath();
	scaledCtx.clearRect(0, 0, scaled.width, scaled.height);
	scaledCtx.beginPath();

}

function randomColor() {
	return Math.floor(Math.random() * 256);
}
function getCursorPos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}