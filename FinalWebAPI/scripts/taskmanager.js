const tasksUrl = (userId) => `https://656db53ebcc5618d3c23cb54.mockapi.io/todo/something/user/${userId}/tasks`;
const todoInput = document.getElementById('addTxt');
const btn = document.getElementById('addBtn');
const notes = document.getElementById('notes');
const exit = document.getElementById('exit');
const nameTodo = document.getElementById('addTitle')

exit.addEventListener('click', () => {
    console.log('Exit clicked');
    window.location.href = '/signIn.html';
});

const userId = localStorage.getItem('user_id')

const asyncTodo = async () => {
    try {
        const response = await fetch(tasksUrl(userId), {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
            body: JSON.stringify({ title: todoInput.value, done: false, NameTasks: nameTodo.value })
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
};

function deleteTask(taskId) {
    const deleteRequest = new XMLHttpRequest();
    deleteRequest.open('DELETE', `${(tasksUrl(userId))}/${taskId}`);
    deleteRequest.setRequestHeader('Content-type', 'application/json');
    deleteRequest.send();

    deleteRequest.addEventListener('load', () => {
        const deletedCard = document.getElementById(`card-${taskId}`);
        if (deletedCard) {
            deletedCard.remove();
        }
    });
}

function updateTask(taskId) {
    const updatedText = prompt('Enter updated task:');
    if (updatedText !== null) {
        fetch(`${tasksUrl(userId)}/${taskId}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
            body: JSON.stringify({ title: updatedText })
        });

        const updatedCard = document.getElementById(`card-${taskId}`);
        if (updatedCard) {
            updatedCard.querySelector('h4').innerText = updatedText;
        }
    }
}

function markAsDone(taskId) {
    const doneCard = document.getElementById(`card-${taskId}`);
    if (doneCard) {
        const taskText = doneCard.querySelector('h5');
        taskText.style.textDecoration = taskText.style.textDecoration === 'line-through' ? 'none' : 'line-through';

        fetch(`${tasksUrl(userId)}/${taskId}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
            body: JSON.stringify({ done: taskText.style.textDecoration === 'line-through' })
        });
    }
}

btn.addEventListener('click', async (event) => {
    event.preventDefault();
    if (!todoInput.value.trim() || !nameTodo.value.trim()) {
        if (!todoInput.value.trim()) {
            todoInput.style.border = '3px solid red';
        }
        if (!nameTodo.value.trim()) {
            nameTodo.style.border = '3px solid red';
        }
        return;
    }
    todoInput.style.border = '2px solid #ced4da';
    nameTodo.style.border = '2px solid #ced4da';
    const data = await asyncTodo();
    alert('Успешно');
    todoInput.value = '';
    nameTodo.value = '';
    createCard(data);
});

document.addEventListener('DOMContentLoaded', async () => {
    const request = new XMLHttpRequest();
    request.open('GET', tasksUrl(userId));
    request.setRequestHeader('Content-type', 'application/json');
    request.send();

    request.addEventListener('load', () => {
        const data = JSON.parse(request.response);
        data.forEach(createCard);
    });
});

function createCard(dataTitle) {
    const card = document.createElement('div');
    card.className = 'card-info';
    card.id = `card-${dataTitle.id}`;
    card.innerHTML = `
        <h5 style="text-decoration: ${dataTitle.done ? 'line-through' : 'none'}">${dataTitle.title}</h5>
        <p>${dataTitle.NameTasks}</p>
        <button class="delete Button">Delete</button>
        <button class="change Button">Update</button>
        <button class="wins Button">Done</button>
    `;
    notes.append(card);
}

notes.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete')) {
        const taskId = event.target.parentElement.id.split('-')[1];
        deleteTask(taskId);
    } else if (event.target.classList.contains('change')) {
        const taskId = event.target.parentElement.id.split('-')[1];
        updateTask(taskId);
    } else if (event.target.classList.contains('wins')) {
        const taskId = event.target.parentElement.id.split('-')[1];
        markAsDone(taskId);
    }
});

const filterSelect = document.getElementById('filter');

filterSelect.addEventListener('change', () => {
    const filterValue = filterSelect.value.toLowerCase();
    const cards = document.querySelectorAll('.card-info');

    cards.forEach((card) => {
        const isCompleted = card.querySelector('h5').style.textDecoration === 'line-through';

        if (
            (filterValue === 'all') ||
            (filterValue === 'completed' && isCompleted) ||
            (filterValue === 'incomplete' && !isCompleted)
        ) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
