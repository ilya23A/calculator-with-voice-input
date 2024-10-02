// Выбираем все кнопки и элементы экрана
const buttons = document.querySelectorAll('button');
const screenResult = document.getElementById('result');
const screenExpression = document.getElementById('expression');
const microphoneButton = document.getElementById('microphone');
const clearButton = document.querySelector('.btn-clear') // кнопка с классом btn-clear


let expression = '';  // Переменная для хранения выражения
let inputStarted = false; // Флаг для отслеживания начала ввода

//Функция для обновления текста кнопки очистки 
function updateClearButton() {
    if (inputStarted) {
        clearButton.textContent = 'C'; // Меняем на С при вводе
    } else {
        clearButton.textContent = 'AC'; // По умолчанию "AC"
    }
}


// Обработчик нажатий на кнопки
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value === 'AC'|| value === 'C') {
            // Очистка экрана
            expression = '';
            screenExpression.textContent = '';
            screenResult.textContent = '0';
            inputStarted = false; // Сброс флага
            updateClearButton(); // Вернуть текст кнопки на "AC"
        } else if (value === '=') {
            // Выполнение вычислений только по нажатию равно
            try {
                screenResult.textContent = eval(expression.replace(/×/g, '*').replace(/÷/g, '/')) || '0';
            } catch {
                screenResult.textContent = 'Error'; // Обработка ошибок
            }

        } else if (value === '+/-') {
            // Инвертируем знак последнего числа
            expression = expression.includes('-') ? expression.replace(/-/, '') : '-' + expression;
            screenExpression.textContent = expression;
        }else if (value === '%') {
            //Применяем процент к последнему числу
            expression = (parseFloat(expression) /100).toString();
            screenExpression.textContent = expression;
        } else {
            // Добавление числа/оператора в выражение
            expression += value;
            screenExpression.textContent = expression;
            // Убираем обновление результата до нажатия равно
            inputStarted = true; // Пользователь начал ввод
            updateClearButton();//  Меняем на "С" после ввода
        }
    });
});

// Использование Web Speech API для голосового ввода
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = false;  // Включаем окончательные результаты
recognition.lang = 'en-US';  // Язык распознавания

// Обработчик нажатия на кнопку микрофона
microphoneButton.addEventListener('click', () => {
    recognition.start();  // Начало распознавания речи
});

// Обработчик для результата распознавания речи
recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    // Добавление распознанной речи в выражение
    expression += transcript;
    screenExpression.textContent = expression;
    inputStarted = true; // Пользователь ввел что-то голосом
    updateClearButton();// Меняем на "C" после ввода голосом
});

// Автоматический перезапуск распознавания после завершения
recognition.addEventListener('end', recognition.start);
