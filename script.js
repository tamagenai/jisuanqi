const display = document.getElementById('display');
const outputDiv = document.getElementById('output');
let expression = '';
var { pinyin } = pinyinPro;

const numberToChinese = {
    '0': '零',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '七',
    '8': '八',
    '9': '九',
    '.': '点' // 小数点の追加
};

const operatorToChinese = {
    '+': '加',
    '-': '减',
    '*': '乘',
    '/': '除',
    '=': '等于'
};

 
const numberMap = {
  '0': '零', '1': '一', '2': '二', '3': '三', '4': '四',
  '5': '五', '6': '六', '7': '七', '8': '八', '9': '九', '.': '点'
};

const unitMap = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];

function convertNumberToChinese(num) {
  
  let str = num.toString();
  let result = '';
  let isDecimal = false;
  let decimalPart = '';

  for (let i = 0; i < str.length; i++) {
      let n = str[i];
      if (n === '.') {
          isDecimal = true;
          result += numberMap[n];
      } else {
          if (isDecimal) {
              decimalPart += numberMap[n];
          } else {
              result += numberMap[n];
          }
      }
  }

  // 桁の単位を追加
  let integerPart = result.split('点')[0];
  let integerResult = '';
  let zeroCount = 0;

  for (let i = 0; i < integerPart.length; i++) {
      if (integerPart[i] === '零') {
          zeroCount++;
      } else {
          if (zeroCount > 0) {
              integerResult += '零';
              zeroCount = 0;
          }
          integerResult += integerPart[i];
          if (integerPart.length - i - 1 > 0) {
              integerResult += unitMap[integerPart.length - i - 1];
          }
      }
  }

  // 連続する零を一つにまとめる
  integerResult = integerResult.replace(/零+/g, '零');
  // 末尾の零を削除
  integerResult = integerResult.replace(/零$/, '');
  // "一十"を"十"に変換
  integerResult = integerResult.replace(/^一十/, '十');

  return integerResult + (isDecimal ? '点' + decimalPart : '');
}

/**
 * 数式を中国語に変換する関数。
 * 
 * @param {string} expression - 数式を表す文字列。例: "3+5=8"
 * @returns {string} - 中国語で表現された数式。例: "三 加 五 等于 八"
 */

// 
function convertExpressionToChinese(expression) {
    const operators = {
        '+': '加',
        '-': '减',
        '*': '乘',
        '/': '除',
        '=': '等于'
    };

    let result = '';
    let num = '';

    for (let char of expression) {
        if (char in numberMap || char === '.') {
            num += char;
        } else {
            if (num) {
                result += convertNumberToChinese(num);
                num = '';
            }
            if (char in operators) {
                result += ' ' + operators[char] + ' ';
            }
        }
    }

    if (num) {
        result += convertNumberToChinese(num);
    }

    // 計算結果が0の場合に零と表示
    if (expression.endsWith('=0')) {
        result += '零';
    }

    return result;
}
function appendNumber(number) {
    expression += number;
    display.innerText = expression;
    speak(numberToChinese[number]);
}

function appendOperator(operator) {
    expression += operator;
    display.innerText = expression;
    speak(operatorToChinese[operator]);
}

function clearDisplay() {
    expression = '';
    display.innerText = '';
    outputDiv.textContent = '';

    speak('归零');
}

function calculate() {
    try {
        const result = eval(expression);
        expression += '=' + result.toString();
        display.innerText = expression;
        speak(operatorToChinese['='] + result);
    } catch (error) {
        display.innerText = '错误';
    }
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh-CN';
    window.speechSynthesis.speak(msg);
}

function speakExpression() {
    const output = convertExpressionToChinese(expression);
    speak(output);
    let wPinyin = pinyin(output);
    console.log(wPinyin);
    outputDiv.innerHTML = output + '<br>' + wPinyin;

    outputDiv.addEventListener('click', () => {
        speechSynthesis.cancel(); // 既存の音声出力をキャンセル
        const utterance = new SpeechSynthesisUtterance(output);
        utterance.lang = 'zh-CN';
        speechSynthesis.speak(utterance);
    });
}