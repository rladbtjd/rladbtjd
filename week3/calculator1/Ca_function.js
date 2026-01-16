let currentInput = '0';   // 현재 입력 중인 숫자
let previousInput = '';  // 이전에 입력된 숫자
let operator = null;     // 선택된 연산자
let memoryValue = 0;     // 5번 기능: 메모리 값 저장 변수
let isResultDisplayed = false; // 새로운 상태 변수: 결과가 화면에 표시 중인지 체크
const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');

// 화면 업데이트 함수 (1번 기능 포함)
function updateDisplay() {
    displayElement.innerText = currentInput;
    if (operator && previousInput) {
        historyElement.innerText = `${previousInput} ${operator}`;
    } else {
        historyElement.innerText = '';
    }
}

// 숫자 입력 (4번 기능: 7자리 제한)
function appendNumber(number) {
    // 1. 결과가 표시 중일 때 숫자를 누르면 화면을 초기화하고 새로 시작함
    if (isResultDisplayed) {
        currentInput = (number === '.') ? '0.' : number;
        isResultDisplayed = false; // 이제 결과 모드가 아님을 표시
    } 
    // 2. 일반적인 입력 상황
    else {
        if (currentInput.replace('.', '').length >= 7 && number !== '.') {
            alert("오류: 최대 7자리까지만 입력 가능합니다!"); // 브라우저 경고창 표시
            return; // 함수를 여기서 종료하여 숫자가 추가되지 않게 함
        }
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } 
        else {
            currentInput += number;
        }
    }
    updateDisplay();
}

// 연산자 선택 함수 수정
function appendOperator(op) {
    if (isResultDisplayed) {
        isResultDisplayed = false; // 결과값에서 바로 연산을 이어갈 수 있도록 설정
    }
    
    if (operator !== null) calculate(); 
    previousInput = currentInput;
    operator = op;
    currentInput = '0';
    updateDisplay();
}

// 초기화 (3번 기능)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

// 결과 계산 (2번 & 4번 기능: 10자리 에러 처리)
// 결과 계산 함수 수정
function calculate() {
    let result = 0;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    // --- [추가된 부분 시작] ---
    // 히스토리에 표시할 문구 미리 생성
    // 연산자가 있으면 '5 + 3 =' 형태, 없으면 '123 =' 형태로 만듭니다.
    let historyText = operator ? `${previousInput} ${operator} ${currentInput} =` : `${currentInput} =`; 
    // --- [추가된 부분 끝] ---

    // 연산자가 없는 경우(숫자만 입력하고 = 누른 경우) 처리
    if (operator === null) {
        isResultDisplayed = true;
        historyElement.innerText = historyText; // 상단에 '숫자 =' 표시
        return; 
    }

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': result = prev / current; break;
        case '%': result = prev % current; break;
        case '**': result = prev ** current; break;
        default: return;
    }

    // 결과 글자 수 체크 (10자리 에러 처리 유지)
    if (result.toString().length > 10) {
        currentInput = "Error";
    } else {
        currentInput = result.toString();
    }

    // 변수 초기화 전 히스토리 화면 업데이트
    historyElement.innerText = historyText; // 1번 기능: 상단에 수식과 '=' 표시
    
    operator = null;
    previousInput = '';
    isResultDisplayed = true;
    
    // updateDisplay() 대신 직접 결과값만 표시 (히스토리가 지워지지 않게 하기 위함)
    displayElement.innerText = currentInput;
}

// 초기화 함수 수정
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    isResultDisplayed = false; // 초기화 시 상태도 리셋
    updateDisplay();
}

// 5번 기능: 메모리 함수 구현
function handleMemory(type) {
    const currentNum = parseFloat(currentInput);
    switch (type) {
        case 'MC': memoryValue = 0; break;
        case 'MR': currentInput = memoryValue.toString(); break;
        case 'M+': memoryValue += currentNum; break;
        case 'M-': memoryValue -= currentNum; break;
    }
    updateDisplay();
}

