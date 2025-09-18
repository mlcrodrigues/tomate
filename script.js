// Seleciona os elementos HTML que vamos manipular
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Define os estados iniciais do timer
const POMODORO_TIME = 25 * 60; // 25 minutos em segundos
const SHORT_BREAK_TIME = 5 * 60; // 5 minutos em segundos
let timeRemaining = POMODORO_TIME;
let isRunning = false;
let timerInterval;

// Função para formatar o tempo (de segundos para MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Função para atualizar o display do timer
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeRemaining);
}

// Função para iniciar ou retomar o timer
function startTimer() {
    if (isRunning) return; // Se o timer já estiver rodando, não faz nada
    isRunning = true;

    // Configura um intervalo que executa a cada 1 segundo
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            // Quando o tempo acaba, para o timer
            clearInterval(timerInterval);
            isRunning = false;
            // CHAMAR O TEMPO DE DESCANSO E O JOGO
            startShortBreak();
        }
    }, 1000); // 1000 milissegundos = 1 segundo
}

// Função para pausar o timer
function pauseTimer() {
    if (!isRunning) return; // Se o timer já estiver pausado, não faz nada
    isRunning = false;
    clearInterval(timerInterval);
}

// Função para parar e resetar o timer
function resetTimer() {
    pauseTimer(); // Pausa o timer
    timeRemaining = POMODORO_TIME; // Reseta o tempo
    updateTimerDisplay(); // Atualiza o display para 25:00
}

// Adiciona "escutadores de eventos" aos botões
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Atualiza o display do timer ao carregar a página
updateTimerDisplay();

// --- LÓGICA DA LISTA DE TAREFAS ---

// Seleciona os elementos HTML da lista de tarefas
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks');

// Função para criar um novo item de tarefa
function createTaskItem(taskText) {
    // Cria um novo elemento <li>
    const listItem = document.createElement('li');
    
    // Adiciona o texto da tarefa
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    listItem.appendChild(taskSpan);

    // Cria um contêiner para os botões de ação
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('task-actions');
    
    // Cria o botão de "concluir"
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = '&#10003;'; // Símbolo de checkmark
    completeBtn.classList.add('complete-btn');
    actionsContainer.appendChild(completeBtn);

    // Cria o botão de "excluir"
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '&#10006;'; // Símbolo de 'x'
    deleteBtn.classList.add('delete-btn');
    actionsContainer.appendChild(deleteBtn);

    // Adiciona os botões ao item da lista
    listItem.appendChild(actionsContainer);
    
    return listItem;
}

// Função para adicionar uma nova tarefa
function addTask() {
    const taskText = newTaskInput.value.trim(); // Pega o texto e remove espaços em branco
    
    // Verifica se o campo de texto não está vazio
    if (taskText !== '') {
        const newTaskItem = createTaskItem(taskText);
        tasksList.appendChild(newTaskItem);
        newTaskInput.value = ''; // Limpa o campo de texto
    }
}

// Função para lidar com o clique na lista (delegando os eventos)
tasksList.addEventListener('click', (event) => {
    const clickedElement = event.target;
    
    // Se o clique foi no botão de "concluir"
    if (clickedElement.classList.contains('complete-btn')) {
        const listItem = clickedElement.closest('li'); // Encontra o elemento <li> mais próximo
        listItem.classList.toggle('completed'); // Adiciona/remove a classe 'completed'
    } 
    
    // Se o clique foi no botão de "excluir"
    if (clickedElement.classList.contains('delete-btn')) {
        const listItem = clickedElement.closest('li'); // Encontra o elemento <li> mais próximo
        listItem.remove(); // Remove o item da lista
    }
});

// Adiciona "escutadores de eventos"
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (event) => {
    // Adiciona tarefa ao apertar "Enter" no campo de input
    if (event.key === 'Enter') {
        addTask();
    }
});

// --- LÓGICA DA QUEBRA E DO JOGO ---

// Seleciona os elementos das seções
const pomodoroSection = document.getElementById('pomodoro-timer');
const taskSection = document.getElementById('task-list-section');
const gameSection = document.getElementById('game-section');
const gameContainer = document.getElementById('bubble-game-container');

let isBreak = false;
let breakTimeRemaining = SHORT_BREAK_TIME;
let bubbleInterval;

// Função para iniciar o tempo de descanso
function startShortBreak() {
    isBreak = true;
    timeRemaining = SHORT_BREAK_TIME;
    updateTimerDisplay(); // Atualiza para o tempo de descanso
    
    // Esconde as seções de produtividade e mostra a do jogo
    pomodoroSection.classList.add('hidden');
    taskSection.classList.add('hidden');
    gameSection.classList.remove('hidden');

    // Inicia o timer de descanso
    timerInterval = setInterval(() => {
        if (breakTimeRemaining > 0) {
            breakTimeRemaining--;
        } else {
            // Quando o descanso acaba, volta para o foco
            clearInterval(timerInterval);
            resetToPomodoro();
        }
    }, 1000);
    
    // Inicia a criação de bolhas a cada 500ms
    bubbleInterval = setInterval(createBubble, 500);
}

// Função para voltar ao timer Pomodoro
function resetToPomodoro() {
    isBreak = false;
    timeRemaining = POMODORO_TIME;
    updateTimerDisplay();
    
    // Mostra as seções de produtividade e esconde a do jogo
    pomodoroSection.classList.remove('hidden');
    taskSection.classList.remove('hidden');
    gameSection.classList.add('hidden');

    // Limpa todas as bolhas restantes
    gameContainer.innerHTML = '';
    clearInterval(bubbleInterval);
}

// Função para criar uma nova bolha
function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Tamanho aleatório para a bolha
    const size = Math.random() * 50 + 20; // Tamanho entre 20px e 70px
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Posição inicial aleatória na horizontal
    const startPosition = Math.random() * (gameContainer.offsetWidth - size);
    bubble.style.left = `${startPosition}px`;
    
    // Adiciona a bolha no contêiner do jogo
    gameContainer.appendChild(bubble);

    // Evento de clique para estourar a bolha
    bubble.addEventListener('click', () => {
        bubble.classList.add('popped');
        // Remove a bolha depois da animação
        setTimeout(() => {
            bubble.remove();
        }, 200);
    });
}
