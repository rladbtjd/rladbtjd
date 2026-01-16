let battery = 100;
let alarms = [];
let isRestarting = false; // 재시작 창이 이미 떴는지 확인하는 변수

function updateClock() {
    const now = new Date();
    
    // 날짜 및 시간 포맷팅 (기존과 동일)
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}`;
    const timeStr = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(v => String(v).padStart(2, '0')).join(':');

    document.getElementById('date-display').innerText = dateStr;
    document.getElementById('time-display').innerText = timeStr;

    // 배터리 감소 로직
    if (battery > 0) {
        battery--;
        document.getElementById('battery-level').innerText = battery;
    }

    const clockScreen = document.querySelector('.clock-container');

    // 배터리가 0%가 되었을 때 처리
    if (battery <= 0) {
        clockScreen.classList.add('off'); // 화면 끄기

        // [새 기능: 5초 후 재시작 확인]
        if (!isRestarting) { // 중복 실행 방지
            isRestarting = true; 
            
            setTimeout(() => {
                const retry = confirm("다시 시작하시겠습니까?"); // 메시지 창 띄우기
                
                if (retry) {
                    // 'Yes'를 눌렀을 때: 초기화
                    battery = 100;
                    isRestarting = false;
                    clockScreen.classList.remove('off');
                    document.getElementById('battery-level').innerText = battery;
                } else {
                    // 'No'를 눌렀을 때: 아무것도 안 함 (또는 알림만 닫기)
                    isRestarting = false;
                }
            }, 5000); // 5000ms = 5초 대기
        }
    } else {
        clockScreen.classList.remove('off');
    }
}

//알람 관리
function addAlarm() {
    if (battery <= 0) return; // 배터리 없으면 동작 불가
    
    // 1. 입력값 가져오기
    const hInput = document.getElementById('alarm-h').value;
    const mInput = document.getElementById('alarm-m').value;
    const sInput = document.getElementById('alarm-s').value;

    // 2. 숫자로 변환
    const h = parseInt(hInput);
    const m = parseInt(mInput);
    const s = parseInt(sInput);

    // [검증 로직 시작]
    // 3. 빈 칸 확인
    if (hInput === "" || mInput === "" || sInput === "") {
        alert("모든 칸을 입력해주세요.");
        return;
    }

    // 4. 범위 확인 (실패 조건 설정)
    if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
        alert("올바른 시간 범위를 입력해주세요. (시: 0-23, 분/초: 0-59)");
        return;
    }

    // 5. 중복 알람 확인 (선택 사항)
    const alarmTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (alarms.includes(alarmTime)) {
        alert("이미 등록된 알람입니다.");
        return;
    }

    // 6. 개수 제한 확인
    if (alarms.length >= 3) {
        alert("알람 추가 실패: 알람은 최대 3개까지만 등록 가능합니다.");
        return;
    }
    // [검증 로직 끝]

    // 7. 성공 시 실행
    alarms.push(alarmTime);
    updateAlarmTable();
    alert("알람 추가 성공: " + alarmTime); // 성공 메시지 표시
}

function updateAlarmTable() {
    const tbody = document.getElementById('alarm-body');
    tbody.innerHTML = "";

    alarms.forEach((time, index) => {
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${time}</td>
            <td style="color: #38bdf8;">대기 중</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// 1초마다 실행
setInterval(updateClock, 1000);
updateClock(); // 초기 실행
