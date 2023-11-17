const todoForm = document.getElementById('todoform');
const todoInput = document.getElementById('todoinput');
const todoList = document.getElementById('todolist');

let tasks = [];

function renderTasks() {
    todoList.innerHTML = "";
    const sortedTasks = tasks.sort((a, b) => {
        const categoryOrder = { 'office': 1, 'family': 2, 'personal': 3 };
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        const deadlineA = new Date(a.deadline);
        const deadlineB = new Date(b.deadline);

        if (deadlineA < deadlineB) {
            return -1;
        } else if (deadlineA > deadlineB) {
            return 1;
        }

        return categoryOrder[a.category] - categoryOrder[b.category];
    });

    sortedTasks.forEach(function (task, index) {
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.className = 'deadline';
        span.textContent = task.deadline;

        li.textContent = `${task.title} [${task.category}] : `;
        li.appendChild(span);

        if (task.completed) {
            li.classList.remove('button1');
            li.classList.add('completed');
        }

        const categoryClassMap = {
            'office': 'office',
            'family': 'family',
            'personal': 'personal'
        };

        if (categoryClassMap[task.category]) {
            li.classList.add(categoryClassMap[task.category]);
        }

        let deleteButton = document.createElement('button1');
        deleteButton.className = "delete-icon button1";

        deleteButton.addEventListener('click', function (event) {
            event.stopPropagation();
            deleteTask(index);
        });

        li.appendChild(deleteButton);
        li.addEventListener('click', function () {
            task.completed = !task.completed;
            renderTasks();
        });
        todoList.appendChild(li);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const taskTitle = todoInput.value.trim();
    const taskCategory = getCategoryFilter();
    const taskDeadline = document.getElementById('deadlineInput').value;

    if (taskTitle !== "" && taskCategory !== "" && taskDeadline !== "") {
        const task = {
            title: taskTitle,
            category: taskCategory,
            completed: false,
            deadline: taskDeadline
        };
        tasks.push(task);
        renderTasks();
        todoInput.value = "";
        document.getElementById('deadlineInput').value = "";
    } else {
        console.log("Please enter a task, select a category, and set a deadline.");
    }
});

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

document.addEventListener('DOMContentLoaded', function () {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
});

function getCategoryFilter() {
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    return selectedCategory ? selectedCategory.value : '';
}
