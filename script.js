// Wait until the page is fully loaded before doing anything
document.addEventListener('DOMContentLoaded', () => {
    // Grab all the important stuff from the page
    const taskInput = document.getElementById('task-input'); // The input box
    const addTaskBtn = document.getElementById('add-task-btn'); // The "+" button
    const taskList = document.getElementById('task-list'); // Where tasks will live
    const emptyImage = document.querySelector('.empty-image'); // The "no tasks" image

    // Load saved tasks when the page loads
    loadTasks();

    // Show/hide the "no tasks" image based on whether we have tasks
    function toggleEmptyState() {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    }

    // Save our tasks to browser storage
    function saveTasks() {
        const tasks = [];
        // Get all the task text from the list
        document.querySelectorAll('.task-text').forEach(taskElement => {
            tasks.push({
                text: taskElement.textContent,
                completed: taskElement.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from browser storage
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
        toggleEmptyState();
    }

    // Create a new task element and add it to the list
    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
            <span class="task-text ${isCompleted ? 'completed' : ''}">${taskText}</span>
            <div class="task-actions">
                <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        taskList.appendChild(li);

        // Set up event listeners for this task
        const checkbox = li.querySelector('.checkbox');
        const taskTextElement = li.querySelector('.task-text');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            taskTextElement.classList.toggle('completed', checkbox.checked);
            saveTasks(); // Save after any change
        });

        deleteBtn.addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            saveTasks(); // Save after deletion
        });

        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit task:', taskTextElement.textContent);
            if (newText !== null && newText.trim() !== '') {
                taskTextElement.textContent = newText.trim();
                saveTasks(); // Save after editing
            }
        });

        taskTextElement.addEventListener('dblclick', () => {
            const newText = prompt('Edit task:', taskTextElement.textContent);
            if (newText !== null && newText.trim() !== '') {
                taskTextElement.textContent = newText.trim();
                saveTasks(); // Save after editing
            }
        });
    }

    // This runs when you add a new task
    function addTask(event) {
        event.preventDefault(); // Stop the form from refreshing the page
        const taskText = taskInput.value.trim(); // Get what you typed and clean it up
        
        // Don't add empty tasks!
        if (!taskText) {
            return;
        }

        createTaskElement(taskText);
        taskInput.value = ''; // Clear the input box
        toggleEmptyState();
        saveTasks(); // Save the new task
    }

    // Make the "+" button add tasks when clicked
    addTaskBtn.addEventListener('click', addTask);
    
    // Also add tasks when you press Enter in the input box
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        }
    });
});