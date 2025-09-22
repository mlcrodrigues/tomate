const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const POMODORO_TIME = 25 * 60; // 25 minutos em segundos
let timeRemaining = POMODORO_TIME;
let isRunning = false;
let intervalId = null;

function updateTimerDisplay() {
    const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
    const seconds = String(timeRemaining % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateClock() {
    const canvas = document.getElementById('clock-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#86d7a5ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourAngle = ((hours + minutes / 60) * Math.PI / 6) - Math.PI / 2;
    const minuteAngle = ((minutes + seconds / 60) * Math.PI / 30) - Math.PI / 2;
    const secondAngle = (seconds * Math.PI / 30) - Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(
        radius + Math.cos(hourAngle) * (radius - 50),
        radius + Math.sin(hourAngle) * (radius - 50)
    );
    ctx.strokeStyle = '#86d7a5ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(
        radius + Math.cos(minuteAngle) * (radius - 30),
        radius + Math.sin(minuteAngle) * (radius - 30)
    );
    ctx.strokeStyle = '#86d7a5ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(
        radius + Math.cos(secondAngle) * (radius - 15),
        radius + Math.sin(secondAngle) * (radius - 15)
    );
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.stroke();
}

setInterval(updateClock, 1000);

function startTimerDisplay() {
    if (isRunning) return;
    isRunning = true;

    intervalId = setInterval(() => {

        updateClock();

        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            pauseTimerDisplay();
            alert('Tempo esgotado! Faça uma pausa.');
        }
    }, 1000);

    updateClock();
    updateTimerDisplay();
}

function pauseTimerDisplay() {
    isRunning = false;
    clearInterval(intervalId);
}

function resetTimerDisplay() {
    pauseTimerDisplay();
    timeRemaining = POMODORO_TIME;
    updateTimerDisplay();
    updateClock();
}

startBtn.addEventListener('click', startTimerDisplay);
pauseBtn.addEventListener('click', pauseTimerDisplay);
resetBtn.addEventListener('click', resetTimerDisplay);

updateTimerDisplay();
updateClock();


const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks');

// Lista de tarefas
function createTaskItem(taskText) {

    const listItem = document.createElement('li');
    
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    listItem.appendChild(taskSpan);

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('task-actions');

    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = '&#10003;';
    completeBtn.classList.add('complete-btn');
    actionsContainer.appendChild(completeBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '&#10006;';
    deleteBtn.classList.add('delete-btn');
    actionsContainer.appendChild(deleteBtn);

    listItem.appendChild(actionsContainer);
    
    return listItem;
}

function addTask() {
    const taskText = newTaskInput.value.trim();
    
    if (taskText !== '') {
        const newTaskItem = createTaskItem(taskText);
        tasksList.appendChild(newTaskItem);
        newTaskInput.value = ''; 
    }
}

tasksList.addEventListener('click', (event) => {
    const clickedElement = event.target;
    
    if (clickedElement.classList.contains('complete-btn')) {
        const listItem = clickedElement.closest('li');
        listItem.classList.toggle('completed'); 
    } 
    
    if (clickedElement.classList.contains('delete-btn')) {
        const listItem = clickedElement.closest('li'); 
        listItem.remove();
    }
});

addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (event) => {
   
    if (event.key === 'Enter') {
        addTask();
    }
});