// Function to generate the URL for tasks based on the user's ID
const tasksUrl = (userId) => `https://656db53ebcc5618d3c23cb54.mockapi.io/todo/something/user/${userId}/tasks`;

// Get references to HTML elements
const todoInput = document.getElementById('addTxt'); // Get the task input element
const btn = document.getElementById('addBtn'); // Get the add button element
const notes = document.getElementById('notes'); // Get the container for displaying tasks
const exit = document.getElementById('exit'); // Get the exit button element
const nameTodo = document.getElementById('addTitle'); // Get the task title input element

// Event listener for the exit button
exit.addEventListener('click', () => {
    console.log('Exit clicked');
    // Redirect to the sign-in page when the exit button is clicked
    window.location.href = '/signIn.html';
});

// Retrieve the user ID from local storage
const userId = localStorage.getItem('user_id');

// Function to asynchronously add a new task
const asyncTodo = async () => {
    try {
        // Make a POST request to the API with task data
        const response = await fetch(tasksUrl(userId), {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
            body: JSON.stringify({ title: todoInput.value, done: false, NameTasks: nameTodo.value })
        });
        return response.json(); // Return the JSON response from the API
    } catch (e) {
        console.log(e);
    }
};

// Function to delete a task
function deleteTask(taskId) {
    // Create a DELETE request to remove the task with the specified ID
    const deleteRequest = new XMLHttpRequest();
    deleteRequest.open('DELETE', `${(tasksUrl(userId))}/${taskId}`);
    deleteRequest.setRequestHeader('Content-type', 'application/json');
    deleteRequest.send();

    // Remove the corresponding card from the UI after the task is deleted
    deleteRequest.addEventListener('load', () => {
        const deletedCard = document.getElementById(`card-${taskId}`);
        if (deletedCard) {
            deletedCard.remove();
        }
    });
}

// Function to update a task
function updateTask(taskId) {
    // Prompt the user for the updated task text
    const updatedText = prompt('Enter updated task:');
    if (updatedText !== null) {
        // Make a PUT request to update the task text
        fetch(`${tasksUrl(userId)}/${taskId}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
            body: JSON.stringify({ title: updatedText })
        });

        // Update the task text in the corresponding card
        const updatedCard = document.getElementById(`card-${taskId}`);
        if (updatedCard) {
            updatedCard.querySelector('h4').innerText = updatedText;
        }
    }
}

// Function to mark a task as done
function markAsDone(taskId) {
    // Get the card corresponding to the task
    const doneCard = document.getElementById(`card-${taskId}`);
    if (doneCard) {
        const taskText = doneCard.querySelector('h5');
        // Toggle the text decoration between line-through and none
        taskText.style.textDecoration = taskText.style.textDecoration === 'line-through' ? 'none' : 'line-through';

        // Make a PUT request to update the 'done' status of the task
        fetch(`${tasksUrl(userId)}/${taskId}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
            body: JSON.stringify({ done: taskText.style.textDecoration === 'line-through' })
        });
    }
}

// Event listener for the 'Add' button
btn.addEventListener('click', async (event) => {
    event.preventDefault();
    // Validate task and title input values
    if (!todoInput.value.trim() || !nameTodo.value.trim()) {
        // Highlight input fields with red borders if they are empty
        if (!todoInput.value.trim()) {
            todoInput.style.border = '3px solid red';
        }
        if (!nameTodo.value.trim()) {
            nameTodo.style.border = '3px solid red';
        }
        return; // Stop further execution if any field is empty
    }
    // Reset borders to the default style
    todoInput.style.border = '2px solid #ced4da';
    nameTodo.style.border = '2px solid #ced4da';
    // Add the task asynchronously and display an alert on success
    const data = await asyncTodo();
    alert('Task added successfully!');
    todoInput.value = '';
    nameTodo.value = '';
    createCard(data); // Create a card for the added task
});

// Event listener for when the page is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Create a GET request to fetch tasks for the user
    const request = new XMLHttpRequest();
    request.open('GET', tasksUrl(userId));
    request.setRequestHeader('Content-type', 'application/json');
    request.send();

    // Add an event listener to handle the response when it's loaded
    request.addEventListener('load', () => {
        // Parse the JSON response from the API
        const data = JSON.parse(request.response);
        data.forEach(createCard); // Create a card for each task
    });
});

// Function to create a card for a task
function createCard(dataTitle) {
    // Create a new card element
    const card = document.createElement('div');
    card.className = 'card-info';
    card.id = `card-${dataTitle.id}`;
    // Set the inner HTML of the card with task information
    card.innerHTML = `
        <h5 style="text-decoration: ${dataTitle.done ? 'line-through' : 'none'}">${dataTitle.title}</h5>
        <p>${dataTitle.NameTasks}</p>
        <button class="delete Button">Delete</button>
        <button class="change Button">Update</button>
        <button class="wins Button">Done</button>
    `;
    notes.append(card); // Append the card to the container
}

// Event listener for clicks on the notes container
notes.addEventListener('click', (event) => {
    // Handle different button clicks based on the class of the clicked element
    if (event.target.classList.contains('delete')) {
        const taskId = event.target.parentElement.id.split('-')[1];
        deleteTask(taskId); // Delete the task when the 'Delete' button is clicked
    } else if (event.target.classList.contains('change')) {
        const taskId = event.target.parentElement.id.split('-')[1];
        updateTask(taskId); // Update the task when the 'Update' button is clicked
    } else if (event.target.classList.contains('wins')) {
        const taskId = event.target.parentElement.id.split('-')[1];
        markAsDone(taskId); // Mark the task as done when the 'Done' button is clicked
    }
});

// Get reference to the filter dropdown element
const filterSelect = document.getElementById('filter');

// Event listener for changes in the filter dropdown
filterSelect.addEventListener('change', () => {
    // Get the selected filter value
    const filterValue = filterSelect
