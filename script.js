let focusTime = 40; 
let seconds;
let focusMinutes;
let timerInterval;
let totalTime = 0;
let totalHours;
let totalMinutes;

window.onload = () => {
    loadTimer(); 
    updateDisplay(); 
    updateTotalDisplay();
    if (focusMinutes !== focusTime  && (focusMinutes > 0 || seconds > 0)) {
        start(); 
    }
};

function loadTimer() {
    const storedFocustime = localStorage.getItem('focusTime');
    const storedMinutes = localStorage.getItem('focusMinutes');
    const storedSeconds = localStorage.getItem('seconds');
    const storedTotalTime=localStorage.getItem('totalTime');
    const storedTotalHours=localStorage.getItem('totalHours');
    const storedTotalMinutes=localStorage.getItem('totalMinutes');
    if (storedMinutes !== null && storedSeconds !== null) {
        focusMinutes = parseInt(storedMinutes);
        seconds = parseInt(storedSeconds);
    } else {
        focusMinutes = focusTime;
        seconds = 0;
    }
    totalTime = parseInt(storedTotalTime) || 0;
    totalHours = parseInt(storedTotalHours) || 0;
    totalMinutes = parseInt(storedTotalMinutes) || 0;
    focusMinutes= parseInt(storedFocustime) || 40;
}

function saveTimer() {
    localStorage.setItem('focusTime', focusTime);
    localStorage.setItem('focusMinutes', focusMinutes);
    localStorage.setItem('seconds', seconds);
    localStorage.setItem('totalTime', totalTime);
    localStorage.setItem('totalHours', totalHours);
    localStorage.setItem('totalMinutes', totalMinutes);
}

function clearTimer() {
    localStorage.removeItem('focusMinutes');
    localStorage.removeItem('seconds');
}


function updateDisplay() {
    document.getElementById('minutes').innerHTML = focusMinutes;
    document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;
}

function updateTitle() {
    //document.title = `${focusMinutes}분 ${seconds < 10 ? '0' + seconds : seconds}초 - To do list`;
}

function updateTotalDisplay() {
    document.getElementById('totalTime').innerHTML = totalHours+"시간 "+ totalMinutes +"분";
}


function start() {
    const alarmSound = document.getElementById('alarmSound');

    if (timerInterval) {
        clearInterval(timerInterval);
    }
    seconds = seconds === undefined || seconds < 0 ? 0 : seconds;
    focusMinutes = focusMinutes === undefined || focusMinutes < 0 ? focusTime - 1 : focusMinutes;
    
    timerInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            focusMinutes--;
           
        }

        else if (focusMinutes < 0) {
            focusMinutes = 0;
            seconds = 0;
            alarmSound.play(); 
            clearInterval(timerInterval);
            clearTimer(); 
        }
        else if(seconds==0){
            totalTime++;
            totalHours= Math.floor(totalTime/60);
            totalMinutes= totalTime % 60;
        }

        updateDisplay(); 
        updateTitle();
        updateTotalDisplay();
        saveTimer(); 
    }, 1000); 
}
function pause(){
    if (timerInterval) {
        clearInterval(timerInterval); 
        timerInterval = null; 
        saveTimer(); 
    }
    alarmSound.pause();
    alarmSound.currentTime = 0;
}
function reset() {
    clearInterval(timerInterval);
    timerInterval = null; 
    focusMinutes = focusTime;
    seconds = 0;
    updateDisplay(); 
    updateTitle();
    clearTimer();
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

document.getElementById("settingBtn").addEventListener("click",function(){
    document.querySelector(".popup").style.display= "flex";
})
const gearIcon = document.getElementById("gear");
gearIcon.addEventListener("click", function() {
    document.querySelector(".popup").style.display = "flex";
});

function changeTime() {
    const newInput = document.getElementById('timeVar');
    focusTime = newInput.value;
}
document.querySelector(".close").addEventListener("click",function(){
    document.querySelector(".popup").style.display= "none";
})

document.getElementById("saveClose").addEventListener("click",function(){
    document.querySelector(".popup").style.display= "none";
    clearTimer();
    changeTime();
    saveTimer();
    loadTimer(); 
    updateDisplay(); 
    updateTitle();
    updateTotalDisplay();
    
})










document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('input');
    const notCompleted = document.querySelector('.notCompleted');
    const lists = [];

    const btn = document.getElementById('addList');
    btn.addEventListener("click", addList);

    // 페이지 로드 시 저장된 목록 불러오기
    const storedLists = localStorage.getItem('lists');
    if (storedLists) {
        lists.push(...JSON.parse(storedLists));
        lists.forEach(list => {
            const newLi = createListItem(list.text, list.checked);
            notCompleted.appendChild(newLi);
        });
        updateStats();
    }

    function addList() {
        if (input.value.trim() === '') {
            alert("할 일을 입력해주세요!");
            return;
        }

        const newLi = createListItem(input.value.trim(), false);
        input.value = "";
        notCompleted.appendChild(newLi);

        lists.push({ text: newLi.textContent.trim(), checked: false });
        saveLists();
        updateStats();
    }

    function createListItem(text, checked) {
        const newLi = document.createElement('li');
        const checkBtn = document.createElement('button');
        const delBtn = document.createElement('button');
        const editBtn = document.createElement('button');

        checkBtn.innerHTML = "<i class='fa fa-check'></i>";
        delBtn.innerHTML = "<i class='fa fa-trash'></i>";
        editBtn.innerHTML = "<i class='fa fa-pencil'></i>";

        newLi.textContent = text;
        if (checked) newLi.classList.add('checked');
        newLi.appendChild(checkBtn);
        newLi.appendChild(delBtn);
        newLi.appendChild(editBtn);

        checkBtn.addEventListener('click', function (e) {
            const item = e.target.closest('li');
            const listItemText = item.textContent.trim();
            const listItem = lists.find(list => list.text === listItemText);
            if (listItem) {
                listItem.checked = !listItem.checked;
            }
            item.classList.toggle('checked');
            saveLists();
            updateStats();
        });

        delBtn.addEventListener('click', function () {
            const parent = this.parentNode;
            parent.remove();
            lists.splice(lists.findIndex(list => list.text === parent.textContent.trim()), 1);
            saveLists();
            updateStats();
        });

        editBtn.addEventListener('click', function () {
            const parent = this.parentNode;
            const inputList = document.getElementById('inputList');
            const listText = parent.textContent.trim();
            inputList.value = listText;
            parent.remove();
            const listIndex = lists.findIndex(list => list.text === listText);
            if (listIndex !== -1) {
                lists.splice(listIndex, 1);
            }
            saveLists();
            updateStats();
        });

        return newLi;
    }

    function saveLists() {
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function updateStats() {
        const completedLists = lists.filter(list => list.checked).length;
        const totalLists = lists.length;
        const progress = totalLists ? completedLists / totalLists : 0;
        const progressBar = document.getElementById('progress');
        progressBar.style.width = `${progress * 100}%`;
        if (totalLists && completedLists === totalLists) {
            blaskHappy();
        }
    }

    input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            addList();
        }
    });
});

const blaskHappy=()=>{
    const count = 200,
      defaults = {
        origin: { y: 0.7 },
      };

    function fire(particleRatio, opts) {
          confetti(
            Object.assign({}, defaults, opts, {
              particleCount: Math.floor(count * particleRatio),
            })
          );
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });

        fire(0.2, {
          spread: 60,
        });

        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
};










