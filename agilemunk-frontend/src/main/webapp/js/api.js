// API Base URL - Change this to match your backend deployment
const API_BASE_URL = 'http://localhost:8080/agilemunk/api';

// API Helper Functions
const api = {
    // Boards
    async getAllBoards() {
        const response = await fetch(`${API_BASE_URL}/boards`);
        if (!response.ok) throw new Error('Failed to fetch boards');
        return response.json();
    },

    async getBoardById(id) {
        const response = await fetch(`${API_BASE_URL}/boards/${id}`);
        if (!response.ok) throw new Error('Failed to fetch board');
        return response.json();
    },

    async createBoard(board) {
        const response = await fetch(`${API_BASE_URL}/boards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(board)
        });
        if (!response.ok) throw new Error('Failed to create board');
        return response.json();
    },

    async updateBoard(id, board) {
        const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(board)
        });
        if (!response.ok) throw new Error('Failed to update board');
        return response.json();
    },

    async deleteBoard(id) {
        const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete board');
    },

    async getBoardCount() {
        const response = await fetch(`${API_BASE_URL}/boards/count`);
        if (!response.ok) throw new Error('Failed to fetch board count');
        return response.json();
    },

    // Tasks
    async getTasksByBoard(boardId) {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    async createTask(boardId, task) {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    async updateTask(boardId, taskId, task) {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    async deleteTask(boardId, taskId) {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/tasks/${taskId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete task');
    },

    async getTaskCount() {
        const response = await fetch(`${API_BASE_URL}/tasks/count`);
        if (!response.ok) throw new Error('Failed to fetch task count');
        return response.json();
    },

    async getTaskCountByStatus(status) {
        const response = await fetch(`${API_BASE_URL}/tasks/count/status/${status}`);
        if (!response.ok) throw new Error('Failed to fetch task count by status');
        return response.json();
    }
};
