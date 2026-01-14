let battery = 100;
let alarms = [];

// FR1 & FR2: 시계 및 배터리 로직
function updateClock() {
    const now = new Date();
    
    // 날짜 포맷
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}`;
    
    // 시간 포맷 (hh:mm:ss)
    const timeStr = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(v => String(v).padStart(2, '0')).join(':');

    document.getElementById('date-display').innerText = dateStr;
    document.getElementById('time-display').innerText = timeStr;

    // 배터리 감소 (1초에 1%)
    if (battery > 0) {
        battery--;
        document.getElementById('battery-level').innerText = battery;
    }

    // FR2: 배터리 0% 처리
    const clockScreen = document.querySelector('.clock-container');
    if (battery <= 0) {
        clockScreen.classList.add('off');
    } else {
        clockScreen.classList.remove('off');
    }
}

// FR3 & FR4: 알람 관리
function addAlarm() {
    if (battery <= 0) return; // 배터리 없으면 동작 불가
    
    const h = document.getElementById('alarm-h').value;
    const m = document.getElementById('alarm-m').value;
    const s = document.getElementById('alarm-s').value;

    if (h === "" || m === "" || s === "") {
        alert("시간을 모두 입력해주세요.");
        return;
    }
    
    if (alarms.length >= 3) {
        alert("알람은 최대 3개까지만 등록 가능합니다.");
        return;
    }

    const alarmTime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
    alarms.push(alarmTime);
    updateAlarmTable();
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
