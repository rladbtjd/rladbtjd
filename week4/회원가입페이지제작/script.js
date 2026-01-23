// 이미 사용중인 아이디 목록 (실제로는 서버에서 확인해야 함)
const existingUserIds = ['admin', 'user123', 'test', 'guest'];

// 아이디 중복 확인 상태
let isIdChecked = false;
let isIdAvailable = false;

// 비밀번호 유효성 상태
let isPasswordValid = false;

// 아이디 입력란의 값이 변경되면 중복 확인 상태 초기화
document.getElementById('userId').addEventListener('input', function() {
    isIdChecked = false;
    isIdAvailable = false;
    const messageEl = document.getElementById('duplicateMessage');
    messageEl.textContent = '';
    messageEl.className = 'message';
});

// 중복 확인 버튼 클릭
document.getElementById('checkDuplicateBtn').addEventListener('click', function() {
    const userId = document.getElementById('userId').value.trim();
    const messageEl = document.getElementById('duplicateMessage');
    
    // 아이디가 비어있는지 확인
    if (!userId) {
        messageEl.textContent = '아이디를 입력해주세요.';
        messageEl.className = 'message error';
        return;
    }
    
    // 아이디 길이 확인 (4~12자)
    if (userId.length < 4 || userId.length > 12) {
        messageEl.textContent = '아이디는 4~12자 사이여야 합니다.';
        messageEl.className = 'message error';
        return;
    }
    
    // 아이디 형식 확인 (영문, 숫자만 허용)
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
        messageEl.textContent = '아이디는 영문과 숫자만 사용할 수 있습니다.';
        messageEl.className = 'message error';
        return;
    }
    
    // 중복 확인 (실제로는 서버 API 호출)
    isIdChecked = true;
    if (existingUserIds.includes(userId)) {
        isIdAvailable = false;
        messageEl.textContent = '이미 사용중인 아이디입니다.';
        messageEl.className = 'message error';
    } else {
        isIdAvailable = true;
        messageEl.textContent = '사용 가능한 아이디입니다.';
        messageEl.className = 'message success';
    }
});

// 비밀번호 실시간 유효성 검사
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const messageEl = document.getElementById('passwordMessage');
    
    // 비밀번호가 비어있으면 메시지 제거
    if (!password) {
        messageEl.textContent = '';
        messageEl.className = 'message';
        isPasswordValid = false;
        return;
    }
    
    // 비밀번호 길이 확인 (8~14자)
    if (password.length < 8) {
        messageEl.textContent = '비밀번호는 최소 8자 이상이어야 합니다.';
        messageEl.className = 'message error';
        isPasswordValid = false;
        return;
    }
    
    if (password.length > 14) {
        messageEl.textContent = '비밀번호는 최대 14자 이하여야 합니다.';
        messageEl.className = 'message error';
        isPasswordValid = false;
        return;
    }
    
    // 영문 대문자 확인
    if (!/[A-Z]/.test(password)) {
        messageEl.textContent = '영문 대문자를 포함해야 합니다.';
        messageEl.className = 'message error';
        isPasswordValid = false;
        return;
    }
    
    // 영문 소문자 확인
    if (!/[a-z]/.test(password)) {
        messageEl.textContent = '영문 소문자를 포함해야 합니다.';
        messageEl.className = 'message error';
        isPasswordValid = false;
        return;
    }
    
    // 숫자 확인
    if (!/[0-9]/.test(password)) {
        messageEl.textContent = '숫자를 포함해야 합니다.';
        messageEl.className = 'message error';
        isPasswordValid = false;
        return;
    }
    
    // 특수문자 확인
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        messageEl.textContent = '특수문자를 포함해야 합니다.';
        messageEl.className = 'message error';
        isPasswordValid = false;
        return;
    }
    
    // 연속된 숫자 확인 (123, 234, 321, 210 등)
    for (let i = 0; i < password.length - 2; i++) {
        const char1 = password.charCodeAt(i);
        const char2 = password.charCodeAt(i + 1);
        const char3 = password.charCodeAt(i + 2);
        
        // 연속 증가 (예: 123, 456)
        if (char2 === char1 + 1 && char3 === char2 + 1) {
            messageEl.textContent = '연속된 숫자를 사용할 수 없습니다. (예: 123, 456)';
            messageEl.className = 'message error';
            isPasswordValid = false;
            return;
        }
        
        // 연속 감소 (예: 321, 654)
        if (char2 === char1 - 1 && char3 === char2 - 1) {
            messageEl.textContent = '연속된 숫자를 사용할 수 없습니다. (예: 321, 654)';
            messageEl.className = 'message error';
            isPasswordValid = false;
            return;
        }
    }
    
    // 모든 조건을 만족하면 성공 메시지
    messageEl.textContent = '사용 가능한 비밀번호입니다.';
    messageEl.className = 'message success';
    isPasswordValid = true;
    
    // 비밀번호 확인란도 같이 체크
    checkPasswordMatch();
});

// 비밀번호 확인 실시간 체크
document.getElementById('checkPassword').addEventListener('input', function() {
    checkPasswordMatch();
});

// 비밀번호 일치 여부 확인 함수
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const checkPassword = document.getElementById('checkPassword').value;
    const messageEl = document.getElementById('checkPasswordMessage');
    
    if (!checkPassword) {
        messageEl.textContent = '';
        messageEl.className = 'message';
        return;
    }
    
    if (password === checkPassword) {
        messageEl.textContent = '비밀번호가 일치합니다.';
        messageEl.className = 'message success';
    } else {
        messageEl.textContent = '비밀번호가 일치하지 않습니다.';
        messageEl.className = 'message error';
    }
}

// 폼 제출
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;
    const checkPassword = document.getElementById('checkPassword').value;
    const name = document.getElementById('name').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const email = document.getElementById('email').value.trim();
    const consent = document.getElementById('consent').checked;
    
    // 아이디 중복 확인 여부 체크
    if (!isIdChecked) {
        alert('아이디 중복 확인을 해주세요.');
        return;
    }
    
    // 아이디 사용 가능 여부 체크
    if (!isIdAvailable) {
        alert('사용 불가능한 아이디입니다. 다른 아이디를 입력해주세요.');
        return;
    }
    
    // 비밀번호 유효성 체크 (실시간 검사로 이미 확인됨)
    if (!isPasswordValid) {
        alert('비밀번호가 유효하지 않습니다. 비밀번호 조건을 확인해주세요.');
        return;
    }
    
    // 비밀번호 확인
    if (password !== checkPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // 이메일 형식 확인
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    
    // 회원가입 성공
    alert('회원가입이 완료되었습니다!');
    console.log('회원가입 정보:', {
        userId,
        name,
        phoneNumber,
        email
    });
    
    // 폼 초기화
    this.reset();
    isIdChecked = false;
    isIdAvailable = false;
    isPasswordValid = false;
    document.getElementById('duplicateMessage').textContent = '';
    document.getElementById('duplicateMessage').className = 'message';
    document.getElementById('passwordMessage').textContent = '';
    document.getElementById('passwordMessage').className = 'message';
    document.getElementById('checkPasswordMessage').textContent = '';
    document.getElementById('checkPasswordMessage').className = 'message';
});