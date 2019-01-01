let sigmoid = {
    func: (x) => (1 / (1 + Math.exp(-x))),
    derivative: (x) => (x * (1 - x))
};
class NeutralNetwork {
    constructor(...layers) {
        this.layers = layers;
        this.activationFunction = sigmoid;
        //Initialize neural network with random weigths and biases [-1;1]
        this.weights = new Array(this.layers.length - 1);
        for (let i = 1; i < this.layers.length; i++) {
            let layer = [];
            for (let j = 0; j < this.layers[i]; j++)
                layer.push(createArrayWithRandomValues(this.layers[i - 1]));
            this.weights[i - 1] = layer;
        }
        this.biases = new Array(this.layers.length - 1);
        for (let i = 1; i < this.layers.length; i++) {
            this.biases[i - 1] = createArrayWithRandomValues(this.layers[i]);
        }
    }
    feedForward(originalInput) {
        let input = originalInput, output = [];
        for (let i = 1; i < this.layers.length; i++) {
            for (let j = 0; j < this.weights[i - 1].length; j++) {
                let weight_sum = 0;
                for (let k = 0; k < this.weights[i - 1][j].length; k++) {
                    weight_sum += this.weights[i - 1][j][k] * input[k];
                }
                output.push(this.activationFunction.func(weight_sum + this.biases[i - 1][j]));
            }
            input = output;
            output = [];
        }
        return input;
    }
}
function createArrayWithRandomValues(length) {
    let array = new Array();
    for (let i = 0; i < length; i++)
        array.push(randomInit());
    return array;
}
function randomInit() {
    return Math.random() * 2 - 1;
}
let n = new NeutralNetwork(5, 4, 3, 2);
console.log(n.feedForward(createArrayWithRandomValues(5)));
//# sourceMappingURL=index.js.map