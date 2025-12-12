// Global state
let currentBoard = null;
let boards = [];
let tasks = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeModals();
    loadHomePage();
});

// Navigation
function initializeNavigation() {
    document.getElementById('homeBtn').addEventListener('click', () => {
        switchPage('homePage');
        loadHomePage();
    });

    document.getElementById('boardsBtn').addEventListener('click', () => {
        switchPage('boardsPage');
        loadBoards();
    });

    document.getElementById('backToBoards').addEventListener('click', () => {
        document.getElementById('boardsList').style.display = 'grid';
        document.getElementById('boardDetails').style.display = 'none';
        currentBoard = null;
    });
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');

    if (pageId === 'homePage') {
        document.getElementById('homeBtn').classList.add('active');
    } else {
        document.getElementById('boardsBtn').classList.add('active');
    }
}

// Home Page
async function loadHomePage() {
    try {
        const [boardCount, taskCount, todoCount, inProgressCount, doneCount] = await Promise.all([
            api.getBoardCount(),
            api.getTaskCount(),
            api.getTaskCountByStatus('TODO'),
            api.getTaskCountByStatus('IN_PROGRESS'),
            api.getTaskCountByStatus('DONE')
        ]);

        document.getElementById('totalBoards').textContent = boardCount.count;
        document.getElementById('totalTasks').textContent = taskCount.count;
        document.getElementById('todoTasks').textContent = todoCount.count;
        document.getElementById('inProgressTasks').textContent = inProgressCount.count;
        document.getElementById('doneTasks').textContent = doneCount.count;
    } catch (error) {
        console.error('Error loading home page:', error);
        alert('Failed to load statistics. Make sure the backend is running.');
    }
}

// Boards Page
async function loadBoards() {
    try {
        boards = await api.getAllBoards();
        renderBoards();
    } catch (error) {
        console.error('Error loading boards:', error);
        alert('Failed to load boards. Make sure the backend is running.');
    }
}

function renderBoards() {
    const boardsList = document.getElementById('boardsList');
    boardsList.innerHTML = '';

    if (boards.length === 0) {
        boardsList.innerHTML = '<p style="text-align: center; color: #666;">No boards yet. Create your first board to get started!</p>';
        return;
    }

    boards.forEach(board => {
        const boardCard = document.createElement('div');
        boardCard.className = 'board-card';
        boardCard.innerHTML = `
            <h3>${escapeHtml(board.name)}</h3>
            <p>${escapeHtml(board.description || 'No description')}</p>
            <div class="board-card-footer">
                <small>Created: ${new Date(board.createdAt).toLocaleDateString()}</small>
                <button class="btn btn-danger" onclick="deleteBoard(${board.id}); event.stopPropagation();">Delete</button>
            </div>
        `;
        boardCard.onclick = () => openBoard(board.id);
        boardsList.appendChild(boardCard);
    });
}

async function openBoard(boardId) {
    try {
        currentBoard = await api.getBoardById(boardId);
        tasks = await api.getTasksByBoard(boardId);

        document.getElementById('boardsList').style.display = 'none';
        document.getElementById('boardDetails').style.display = 'block';
        document.getElementById('boardTitle').textContent = currentBoard.name;

        renderTasks();
    } catch (error) {
        console.error('Error opening board:', error);
        alert('Failed to load board');
    }
}

function renderTasks() {
    const todoColumn = document.getElementById('todoColumn');
    const inProgressColumn = document.getElementById('inProgressColumn');
    const doneColumn = document.getElementById('doneColumn');

    todoColumn.innerHTML = '';
    inProgressColumn.innerHTML = '';
    doneColumn.innerHTML = '';

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);

        switch (task.status) {
            case 'TODO':
                todoColumn.appendChild(taskCard);
                break;
            case 'IN_PROGRESS':
                inProgressColumn.appendChild(taskCard);
                break;
            case 'DONE':
                doneColumn.appendChild(taskCard);
                break;
        }
    });
}

function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.innerHTML = `
        <h4>${escapeHtml(task.title)}</h4>
        <p>${escapeHtml(task.description || 'No description')}</p>
        <div class="task-meta">
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
            <div class="task-actions">
                <select onchange="updateTaskStatus(${task.id}, this.value)">
                    <option value="TODO" ${task.status === 'TODO' ? 'selected' : ''}>To Do</option>
                    <option value="IN_PROGRESS" ${task.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
                    <option value="DONE" ${task.status === 'DONE' ? 'selected' : ''}>Done</option>
                </select>
                <button class="btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `;
    return taskCard;
}

async function updateTaskStatus(taskId, newStatus) {
    try {
        const task = tasks.find(t => t.id === taskId);
        task.status = newStatus;
        await api.updateTask(currentBoard.id, taskId, task);
        await openBoard(currentBoard.id);
    } catch (error) {
        console.error('Error updating task status:', error);
        alert('Failed to update task status');
    }
}

// Modals
function initializeModals() {
    document.getElementById('createBoardBtn').addEventListener('click', () => {
        openModal('createBoardModal');
    });

    document.getElementById('createTaskBtn').addEventListener('click', () => {
        openModal('createTaskModal');
    });

    document.getElementById('createBoardForm').addEventListener('submit', handleCreateBoard);
    document.getElementById('createTaskForm').addEventListener('submit', handleCreateTask);

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'createBoardModal') {
        document.getElementById('createBoardForm').reset();
    } else if (modalId === 'createTaskModal') {
        document.getElementById('createTaskForm').reset();
    }
}

async function handleCreateBoard(e) {
    e.preventDefault();

    const board = {
        name: document.getElementById('boardName').value,
        description: document.getElementById('boardDescription').value
    };

    try {
        await api.createBoard(board);
        closeModal('createBoardModal');
        await loadBoards();
    } catch (error) {
        console.error('Error creating board:', error);
        alert('Failed to create board');
    }
}

async function handleCreateTask(e) {
    e.preventDefault();

    const task = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value
    };

    try {
        await api.createTask(currentBoard.id, task);
        closeModal('createTaskModal');
        await openBoard(currentBoard.id);
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task');
    }
}

async function deleteBoard(boardId) {
    if (!confirm('Are you sure you want to delete this board? This will also delete all tasks.')) {
        return;
    }

    try {
        await api.deleteBoard(boardId);
        await loadBoards();
    } catch (error) {
        console.error('Error deleting board:', error);
        alert('Failed to delete board');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        await api.deleteTask(currentBoard.id, taskId);
        await openBoard(currentBoard.id);
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
