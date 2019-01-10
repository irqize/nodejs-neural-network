let sigmoid: ActivationFunction = {
    func: (x: number) => (1 / (1 + Math.exp(-x))),
    derivative: (z: number) => {
        return sigmoid.func(z) * (1 - sigmoid.func(z));
    }
};

import Matrix from './matrix';

class NeutralNetwork {
    layers: Array<number>;
    weights: Matrix[];
    biases: Matrix[];
    activation_function: ActivationFunction;
    learning_rate: number;

    constructor(...layers: Array<number>) {
        this.layers = layers;
        this.activation_function = sigmoid;

        //Initialize neural network with random weigths and biases [-1;1]
        this.weights = [];
        for(let i=0; i<this.layers.length - 1; i++){
            this.weights.push(new Matrix(this.layers[i+1], this.layers[i]));
            this.weights[i].randomize();
        }
        this.biases = [];
        for(let i=1; i<this.layers.length; i++){
            this.biases.push(new Matrix(this.layers[i], 1));
            this.biases[i-1].randomize();
        }

        this.setActivationFunction();
        this.setLearningRate();
    }

    feedForward(originalInput: Array<number>): Array<number> {
        if(originalInput.length != this.layers[0]) throw new Error("corrupt input data");
        
        let input : Matrix = Matrix.createFromArray(originalInput);
        for(let i = 0; i < this.layers.length - 1; i++){
            let output = Matrix.multiply(this.weights[i], input);
            output.add(this.biases[i]);
            output.map(this.activation_function.func);
            input = output;
        }

        return input.toArray();
    }

    train(originalInput: Array<number>, originalTarget: Array<number>) {
        if(originalInput.length != this.layers[0]) throw new Error("corrupt training data");
        if(originalTarget.length != this.layers[this.layers.length - 1]) throw new Error("corrupt training data");

        let outputs : Matrix[] = [];
        let input : Matrix = Matrix.createFromArray(originalInput);
        //feed forward and save results of every layer
        for(let i = 0; i < this.layers.length - 1; i++){
            let output = Matrix.multiply(this.weights[i], input);
            output.add(this.biases[i]);
            output.map(this.activation_function.func);
            input = output;
            outputs.push(output);
        }

        //convert target result to matrix
        let target = Matrix.createFromArray(originalTarget);
        //calculate output errors derivative
        let errors = Matrix.subtract(target, outputs[this.layers.length - 2]);


        for(let i = this.layers.length - 2; i>=0; i--){
            //calculate gradients
            let gradients = Matrix.map(outputs[i], this.activation_function.derivative);
            gradients.multiply(errors);
            gradients.multiply(this.learning_rate);
        
            //calculate deltas
            let outputsOfLayerBeforeTransposed = Matrix.transpose(i > 0 ? outputs[i-1] : Matrix.createFromArray(originalInput));
            let deltas = Matrix.multiply(gradients, outputsOfLayerBeforeTransposed);

            //add gradients to biases
            this.biases[i].add(gradients);
            //add deltas to biases
            this.weights[i].add(deltas);
            
            //calculate errors for next layers
            let weightsTransposed = Matrix.transpose(this.weights[i]);
            errors = Matrix.multiply(weightsTransposed, errors);
        }


        //return original output for visual purposes
        return outputs[outputs.length - 1].toArray();
    }



    setActivationFunction(activationFunction = sigmoid) {
        this.activation_function = activationFunction;
    }
    setLearningRate(learning_rate = 0.05) {
        this.learning_rate = learning_rate;
    }
}


interface ActivationFunction {
    func(x: number): number;
    derivative(x: number): number;
}

export = NeutralNetwork;