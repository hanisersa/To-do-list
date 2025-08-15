let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function addtask() {
    let taskinput = document.getElementById("taskinput").value.trim();
    if (taskinput === "") return;
    tasks.push({text: taskinput, completed: false, important: false});
    document.getElementById("taskinput").value = "";
    saveTasks();
    showtasks();
}

function cleartask() {
    if (!confirm("Are you sure you want to clear all tasks?")) return;
    tasks = [];
    saveTasks();
    showtasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ...existing code...
function showtasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let completedCount = 0;
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
            task.completed = checkbox.checked;
            saveTasks();
            showtasks();
        };
        // Star (important) button
        let starBtn = document.createElement("span");
        starBtn.textContent = task.important ? "⭐" : "☆";
        starBtn.style.cursor = "pointer";
        starBtn.className= "star-btn";
        starBtn.onclick = function () {
            task.important = !task.important;
            saveTasks();
            showtasks();
        };
        // Task text (editable)
        let taskText = document.createElement("span");
        taskText.textContent = `${i + 1}. ${task.text}`;
        taskText.style.marginRight = "10px";
        taskText.style.cursor = "pointer";
        taskText.ondblclick = function () {
            let input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.onblur = function () {
                task.text = input.value;
                saveTasks();
                showtasks();
            };
            taskText.replaceWith(input);
            input.focus();
        };
        // Remove button
        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = function () {
            li.style.opacity = '0';
            setTimeout(() => {
              tasks.splice(i, 1);
              saveTasks();
              showtasks();
            }, 300);
        };
        // Completed style
        if (task.completed) {
            li.classList.add('completed');
            completedCount++;
        }
        // Important style
        if (task.important) {
            li.style.background = "#fffbe6"; // light yellow for important
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
showtasks();

document.getElementById("taskinput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    addtask();
  }
});
  const toggleBtn = document.getElementById('theme-toggle');

  toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      toggleBtn.textContent = '☀️'; 
    } else {
      toggleBtn.textContent = '🌙'; 
    }
  });
