document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    const speakButton = document.getElementById('speak');
    let currentInput = '';
    let operator = '';
    let firstOperand = '';
    let secondOperand = '';
    let memory = 0;

    const synth = window.speechSynthesis;

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        synth.speak(utterance);
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            if (button.classList.contains('number')) {
                currentInput += value;
                display.value = currentInput;
                speak(value);
            } else if (button.classList.contains('operator')) {
                if (currentInput !== '') {
                    firstOperand = currentInput;
                    operator = value;
                    currentInput = '';
                    speak(operator);
                }
            } else if (button.id === 'equals') {
                if (currentInput !== '' && firstOperand !== '') {
                    secondOperand = currentInput;
                    const result = eval(`${firstOperand} ${operator} ${secondOperand}`);
                    display.value = result;
                    speak(`${firstOperand} ${operator} ${secondOperand} 等于 ${result}`);
                    currentInput = '';
                    firstOperand = '';
                    secondOperand = '';
                    operator = '';
                }
            } else if (button.id === 'clear') {
                currentInput = '';
                firstOperand = '';
                secondOperand = '';
                operator = '';
                display.value = '';
            } else if (button.id === 'memory-add') {
                memory += parseFloat(display.value);
                speak(`メモリに ${display.value} を追加しました`);
            } else if (button.id === 'memory-subtract') {
                memory -= parseFloat(display.value);
                speak(`メモリから ${display.value} を引きました`);
            } else if (button.id === 'memory-recall') {
                display.value = memory;
                speak(`メモリの値は ${memory} です`);
            } else if (button.id === 'memory-clear') {
                memory = 0;
                speak(`メモリをクリアしました`);
            }
        });
    });

    speakButton.addEventListener('click', () => {
        if (firstOperand !== '' && operator !== '' && currentInput !== '') {
            speak(`${firstOperand} ${operator} ${currentInput}`);
        }
    });
});