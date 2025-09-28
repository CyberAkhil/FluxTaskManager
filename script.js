let tasks = [];
let currentTaskId = null;
let currentFilter = 'all';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', function () {
    renderTasks();
    updateStats();
});

// Form submission
document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const priority = document.getElementById('priority').value;
    const comment = document.getElementById('comment').value;

    const newTask = {
        id: Date.now(),
        name: taskName,
        priority: priority,
        comment: comment,
        completed: false,
        remark: '',
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    this.reset();
    renderTasks();
    updateStats();
    showNotification('Task added successfully!');
});

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderTasks();
    });
});

function renderTasks() {
    const tasksList = document.getElementById('tasksList');

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 
            002 2h10a2 2 0 002-2V7a2 2 0 
            00-2-2h-2M9 5a2 2 0 
            002 2h2a2 2 0 002-2M9 5a2 2 0 
            012-2h2a2 2 0 012 2" />
        </svg>
        <h3>No ${currentFilter === 'all' ? '' : currentFilter} tasks</h3>
        <p>${currentFilter === 'completed' ? 'Complete some tasks to see them here' : 'Create a task to get started'}</p>
      </div>
    `;
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <div class="task-header">
        <div class="task-title">${task.name}</div>
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      </div>
      ${task.comment ? `<div class="task-comment">${task.comment}</div>` : ''}
      ${task.completed && task.remark ? `
        <div class="task-remark">
          <strong>Completion Remark:</strong>
          <p>${task.remark}</p>
        </div>
      ` : ''}
      <div class="task-actions">
        ${!task.completed ? `
          <button class="btn btn-complete" onclick="openRemarkModal(${task.id})">Mark Complete</button>
        ` : ''}
        <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function updateStats() {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('activeTasks').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
}

function openRemarkModal(taskId) {
    currentTaskId = taskId;
    document.getElementById('remarkModal').classList.add('active');
    document.getElementById('remarkText').value = '';
}

function closeRemarkModal() {
    document.getElementById('remarkModal').classList.remove('active');
    currentTaskId = null;
}

function saveRemark() {
    const remarkText = document.getElementById('remarkText').value.trim();

    if (currentTaskId) {
        const task = tasks.find(t => t.id === currentTaskId);
        if (task) {
            task.completed = true;
            task.remark = remarkText;
            task.completedAt = new Date().toISOString();
        }
    }

    closeRemarkModal();
    renderTasks();
    updateStats();
    showNotification('Task completed successfully!');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
        updateStats();
        showNotification('Task deleted successfully!');
    }
}

// Simple notification
function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.background = '#2d3748';
    notif.style.color = 'white';
    notif.style.padding = '12px 20px';
    notif.style.borderRadius = '8px';
    notif.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notif.style.animation = 'slideIn 0.3s ease';
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}
