# Node.js Neural Network
Just another simple machine learning library made for reasearch and learning purposes.
## Description
Impressed with possibilities of neural networks I decided to learn how it actually works and write it myself. So here it is, Node.js neural network with training function using written in TypeScript.
## Instalation
Clone this repo `git@github.com:irqize/nodejs-neural-network.git` and require index.js file from src folder.
```js
let NeuralNetwork = require('./lib/index.js');
```

## Creating new network
```js
let network = new NeuralNetwork(...layers);
```
For layers you have to specify structure of the network. For example
```js
let network = new NeuralNetwork(10, 5, 5, 2);
```
will create 4 layer neural network. Input layer with 10 neurons, output layer with 2 neurons, and two hidden layers with 5 neurons each.
## Training
```js
let predictions = network.train([...inputData], [...desiredOutput]);
```
### Input
- Array with input data (with size the same as the input layer's number of neurons)
- Array with desired output (with size the same as the output layer's number of neurons)
#### Output
- Array with predictions (with size the same as the output layer's number of neurons)
## Predicting
```js
let predictions = network.feedForward([...inputData]);
```
### Input
- Array with input data (with size the same as the input layer's number of neurons)
#### Output
- Array with predictions (with size the same as the output layer's number of neurons)
## Setting learning rate
```js
network.setLearningRate(learning_rate);
```
### Input
- Learning rate (default 0.05)
## Setting custom activation function
```js
network.setctivationFunction(activation_function);
```
### Input
- activation_function object with two methods (default sigmoid)
1. func
2. derivative
# Examples
## MNIST Handwritten Digit Recognition
![digit recognition](https://media.giphy.com/media/yq2rF6BgfalFHO0aep/giphy.gif)

Placed in `examples/MNIST` directory.
To run just go to library's directory and type in your terminal
```
node examples/CursorFollowing/server/app.js
```
and wait for the network to be trained and go to `localhost`.

Network achieves around 87% of accuracy on test data.



### Have Fun!


#
TODOS:
- Add more activation functions
- Add more examples
- Add GUI to MNIST example, improve canvas content prediction accuracy