// Fetch tasks from Django backend on load
let tasks = [];

async function loadTasksFromServer() {
    try {
        const response = await fetch('/api/tasks/');
        tasks = await response.json();
        showtasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
        showtasks();
    }
}

async function addtask() {
    let taskinput = document.getElementById("taskinput").value.trim();
    if (taskinput === "") return;
    
    try {
        const response = await fetch('/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: taskinput})
        });
        
        if (response.ok) {
            const newTask = await response.json();
            tasks.push(newTask);
            document.getElementById("taskinput").value = "";
            showtasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function cleartask() {
    if (!confirm("Are you sure you want to clear all tasks?")) return;
    
    try {
        const response = await fetch('/clear/', {
            method: 'POST',
        });
        
        if (response.ok) {
            tasks = [];
            showtasks();
        }
    } catch (error) {
        console.error('Error clearing tasks:', error);
    }
}

async function toggleTask(taskId, index) {
    try {
        const response = await fetch(`/toggle/${taskId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            tasks[index].completed = data.completed;
            showtasks();
        }
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

async function deleteTask(taskId, index) {
    try {
        const response = await fetch(`/delete/${taskId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            tasks.splice(index, 1);
            showtasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function showtasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let completedCount = 0;
    
    if (tasks.length === 0) {
        taskList.innerHTML = "<li>No tasks yet!</li>";
        document.getElementById('progress').textContent = "";
        return;
    }
    
    tasks.forEach((task, i) => {
        let li = document.createElement("li");
        li.setAttribute('tabindex', '0');
        li.style.transition = "all 0.3s";
        
        // Checkbox
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !!task.completed;
        checkbox.setAttribute('aria-label', 'Mark task completed');
        checkbox.onchange = function () {
            toggleTask(task.id, i);
        };
        
        // Star (important) button
        let starBtn = document.createElement("span");
        starBtn.textContent = task.important ? "⭐" : "☆";
        starBtn.style.cursor = "pointer";
        starBtn.className = "star-btn";
        starBtn.onclick = function () {
            task.important = !task.important;
            showtasks();
        };
        
        // Task text
        let taskText = document.createElement("span");
        taskText.textContent = `${i + 1}. ${task.title}`;
        taskText.style.marginRight = "10px";
        taskText.style.flex = "1";
        
        // Remove button
        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = function () {
            li.style.opacity = '0';
            setTimeout(() => {
                deleteTask(task.id, i);
            }, 300);
        };
        
        // Completed style
        if (task.completed) {
            li.classList.add('completed');
            completedCount++;
        }
        
        // Important style
        if (task.important) {
            li.style.background = "#fffbe6";
        }
        
        let actionDiv = document.createElement("div");
        actionDiv.style.display = "flex";
        actionDiv.style.alignItems = "center";
        actionDiv.appendChild(starBtn);
        actionDiv.appendChild(removeBtn);

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(actionDiv);
        taskList.appendChild(li);
    });
    
    let progress = document.getElementById('progress');
    progress.textContent = `done ${completedCount}/${tasks.length}`;
}

// Load tasks on page load
loadTasksFromServer();

document.getElementById("taskinput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        addtask();
    }
});

const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
