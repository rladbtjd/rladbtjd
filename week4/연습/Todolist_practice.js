// ============================================
// Calendar Module - 캘린더 관련 기능만 담당
// ============================================
const CalendarModule = {
  currentDate: new Date(),
  selectedDate: null,

  // 캘린더 초기화
  init() {
    this.render();
  },

  // 캘린더 렌더링
  render() {
    this.clearCalendar();
    this.updateMonthDisplay();
    this.renderDayHeaders();
    this.renderDays();
  },

  // 캘린더 초기화
  clearCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
  },

  // 월 표시 업데이트
  updateMonthDisplay() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    document.getElementById('current-month').textContent = `${year}년 ${month + 1}월`;
  },

  // 요일 헤더 렌더링
  renderDayHeaders() {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const calendarGrid = document.getElementById('calendar-grid');
    
    days.forEach(day => {
      const dayHeader = this.createDayHeader(day);
      calendarGrid.appendChild(dayHeader);
    });
  },

  // 요일 헤더 생성
  createDayHeader(dayText) {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = dayText;
    return dayHeader;
  },

  // 모든 날짜 렌더링
  renderDays() {
    const calendarGrid = document.getElementById('calendar-grid');
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    // 이전 달 날짜
    this.renderPreviousMonthDays(calendarGrid, firstDay, prevLastDate);
    
    // 현재 달 날짜
    this.renderCurrentMonthDays(calendarGrid, year, month, lastDate);
    
    // 다음 달 날짜
    this.renderNextMonthDays(calendarGrid, firstDay, lastDate);
  },

  // 이전 달 날짜 렌더링
  renderPreviousMonthDays(calendarGrid, firstDay, prevLastDate) {
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayDiv = this.createDayElement(prevLastDate - i, true);
      calendarGrid.appendChild(dayDiv);
    }
  },

  // 현재 달 날짜 렌더링
  renderCurrentMonthDays(calendarGrid, year, month, lastDate) {
    const today = new Date();
    
    for (let i = 1; i <= lastDate; i++) {
      const dayDiv = this.createDayElement(i, false);
      
      // 오늘 날짜 표시
      if (this.isToday(year, month, i, today)) {
        dayDiv.classList.add('today');
      }

      dayDiv.onclick = () => this.selectDate(year, month, i, dayDiv);
      calendarGrid.appendChild(dayDiv);
    }
  },

  // 다음 달 날짜 렌더링
  renderNextMonthDays(calendarGrid, firstDay, lastDate) {
    const remainingDays = 42 - (firstDay + lastDate);
    for (let i = 1; i <= remainingDays; i++) {
      const dayDiv = this.createDayElement(i, true);
      calendarGrid.appendChild(dayDiv);
    }
  },

  // 날짜 요소 생성
  createDayElement(day, isOtherMonth) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    dayDiv.textContent = day;
    
    if (isOtherMonth) {
      dayDiv.classList.add('other-month');
    }
    
    return dayDiv;
  },

  // 오늘 날짜인지 확인
  isToday(year, month, day, today) {
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  },

  // 날짜 선택
  selectDate(year, month, day, element) {
    this.clearAllSelections();
    element.classList.add('selected');
    this.selectedDate = new Date(year, month, day);
  },

  // 모든 선택 해제
  clearAllSelections() {
    document.querySelectorAll('.calendar-day').forEach(el => {
      el.classList.remove('selected');
    });
  },

  // 이전 달로 이동
  goToPreviousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  },

  // 다음 달로 이동
  goToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }
};

// ============================================
// TodoList Module - 할 일 목록 관련 기능만 담당
// ============================================
const TodoListModule = {
  // 할 일 추가
  addTodo(todoText) {
    if (!this.isValidTodo(todoText)) return;

    const todoList = document.querySelector("#todo-list");
    const todoItem = this.createTodoItem(todoText);
    todoList.appendChild(todoItem);
  },

  // 유효한 할 일인지 확인
  isValidTodo(todoText) {
    return todoText && todoText.trim().length > 0;
  },

  // 할 일 항목 생성
  createTodoItem(todoText) {
    const li = document.createElement('li');
    li.innerHTML = this.getTodoItemHTML(todoText);
    return li;
  },

  // 할 일 항목 HTML 생성
  getTodoItemHTML(todoText) {
    return `
      <input type="checkbox" class="checkbox" onclick="TodoListModule.toggleTodoComplete(this)"/>
      <span>${todoText}</span>
      <button class="delete-btn" onclick="TodoListModule.deleteTodo(this)">🗑️</button>`;
  },

  // 할 일 완료 토글
  toggleTodoComplete(checkboxElem) {
    const spanElem = checkboxElem.parentElement.querySelector("span");
    
    if (checkboxElem.checked) {
      this.markAsComplete(spanElem);
    } else {
      this.markAsIncomplete(spanElem);
    }
  },

  // 완료로 표시
  markAsComplete(spanElem) {
    spanElem.innerHTML = `<s>${spanElem.textContent}</s>`;
  },

  // 미완료로 표시
  markAsIncomplete(spanElem) {
    spanElem.innerHTML = spanElem.textContent.replace(/<\/?s>/g, '');
  },

  // 할 일 삭제
  deleteTodo(deleteButton) {
    deleteButton.parentElement.remove();
  }
};

// ============================================
// InputHandler Module - 사용자 입력 처리만 담당
// ============================================
const InputHandler = {
  // 입력 필드 가져오기
  getInputField() {
    return document.querySelector("#input-box");
  },

  // 입력 값 가져오기
  getInputValue() {
    const inputField = this.getInputField();
    return inputField.value.trim();
  },

  // 입력 필드 초기화
  clearInput() {
    const inputField = this.getInputField();
    inputField.value = "";
  },

  // 버튼 클릭 처리
  handleAddButtonClick() {
    const todoText = this.getInputValue();
    TodoListModule.addTodo(todoText);
    this.clearInput();
  },

  // Enter 키 처리
  handleEnterKey(event) {
    if (event.key === 'Enter') {
      this.handleAddButtonClick();
    }
  }
};

// ============================================
// Global Functions - HTML에서 호출하는 함수들
// ============================================
function onClickInputButton() {
  InputHandler.handleAddButtonClick();
}

function enterKey(event) {
  InputHandler.handleEnterKey(event);
}

function previousMonth() {
  CalendarModule.goToPreviousMonth();
}

function nextMonth() {
  CalendarModule.goToNextMonth();
}

// ============================================
// 초기화
// ============================================
window.onload = function() {
  CalendarModule.init();
};