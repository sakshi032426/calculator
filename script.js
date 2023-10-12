
// Function to get the content of the history element
function getHistory() {
    return document.getElementById('history-value').innerText;
}

// Function to set the content of the history element
function printHistory(num) {
    document.getElementById('history-value').innerText = num;
}

// Function to get the content of the output element
function getOutput() {
    return document.getElementById('output-value').innerText;
}

// Function to set the content of the output element with formatting
function printOutput(num) {
    if (num == "") {
        document.getElementById('output-value').innerText = num;
    } else {
        // Format the number and set it as the output value
        document.getElementById('output-value').innerText = getFormattedNumber(num);
    }
}

// Function to format a number with commas
function getFormattedNumber(num) {
    if (num == "-") {
        // If the number is negative, return an empty string
        return "";
    }
    // Convert the number to a formatted string using commas
    var n = Number(num);
    var value = n.toLocaleString("en");
    return value;
}

// Function to remove commas from a formatted number
function reverseNumberFormat(num) {
    // Remove commas from the formatted number and convert it back to a number
    return Number(num.replace(/,/g, ''));
}

// Get all elements with class 'operator' and add click event listeners
var operator = document.getElementsByClassName('operator');
for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener('click', function () {
        // Clear button clicked
        if (this.id == "clear") {
            // Clear both history and output values
            printHistory("");
            printOutput("");
        }
        // Backspace button clicked
        if (this.id == "backspace") {
            // Get the output, remove the last character, and update the output
            var output = reverseNumberFormat(getOutput()).toString();
            if (output) {
                output = output.substr(0, output.length - 1);
                printOutput(output);
            }
        } else {
            // Operator other than clear or backspace
            var output = getOutput();
            var history = getHistory();
            // Handle cases where there is existing output and history
            if (output == "" && history != "") {
                if (isNaN(history[history.length - 1])) {
                    // If the last character in history is not a number, remove it
                    history = history.substr(0, history.length - 1);
                }
            }
            if (output != "" || history != "") {
                // Condition?true:false
                // If output is empty, use output; otherwise, use the reverse formatted output
                output = output == "" ? output : reverseNumberFormat(output);
                history = history + output;
                if (this.id == "=") {
                    // If equals button clicked, evaluate the expression
                    var result = eval(history);
                    printOutput(result);
                    printHistory("");
                } else {
                    // Operator other than equals, update history and clear output
                    history = history + this.id;
                    printHistory(history);
                    printOutput("");
                }
            }
        }
    });
}

// Get all elements with class 'number' and add click event listeners
var number = document.getElementsByClassName('number');
for (var i = 0; i < number.length; i++) {
    number[i].addEventListener('click', function () {
        // Get the reversed formatted output
        var output = reverseNumberFormat(getOutput());
        // If output is a number, concatenate the clicked number and update the output
        if (!isNaN(output)) {
            output = output + this.id;
            printOutput(output);
        }
    });
}

// Handle microphone button click
var microphone = document.getElementById('microphone');
microphone.onclick = function () {
    // Add 'record' class to the microphone
    microphone.classList.add("record");
    // Create a new SpeechRecognition instance
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    // Define operations for speech recognition
    operations = {
        "plus": "+",
        "minus": "-",
        "multiply": "*",
        "x": "*",
        "multiplied": "*",
        "multiply by": "*",
        "multiplied by": "*",
        "divide": "/",
        "divided": "/",
        "divide by": "/",
        "divided by": "/",
        "reminder": "%"
    }
    // Handle speech recognition results
    recognition.onresult = function (event) {
        // Get transcribed speech input
        var input = event.results[0][0].transcript;
        // Replace recognized operation words with symbols
        for (property in operations) {
            input = input.replace(property, operations[property]);
        }
        // Set the transcribed input as the output value
        document.getElementById("output-value").innerText = input;
        // Delay before evaluating the input
        setTimeout(function () {
            evaluate(input);
        }, 750);
        // Remove 'record' class from microphone
        microphone.classList.remove("record");
    }
}

// Function to evaluate the input expression
function evaluate(input) {
    try {
        // Evaluate the input expression and update the output value
        var result = eval(input);
        document.getElementById("output-value").innerText = result;
    }
    catch (e) {
        // Handle errors by logging to the console and clearing the output
        console.log(e);
        document.getElementById("output-value").innerText = "";
    }
}
