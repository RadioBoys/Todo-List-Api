// const Todo = require('../../connection/todo.js');
const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");
const search = document.querySelector(".search input");

// add new todo
const generateTemplate = (todo) => {
  const html = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${todo}</span>
        <i class="far fa-trash-alt delete"></i>
        </li>
        `;
  list.innerHTML += html;
};

// clear todo text box input and prevent inputs with unnecessary white space
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = addForm.add.value.trim();
  const searchParams = new URLSearchParams(window.location.search);
  const username = searchParams.get('username');
  if (todo.length) {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: todo,
        username: username,
      })
    })
    generateTemplate(todo);
    addForm.reset();
    window.location.reload();
  }
});

// delete todo
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();

    var spanElement = e.target.parentElement.querySelector('span.hidden-id');
    var idTodo = spanElement.textContent;
    console.log(idTodo);
    fetch('/api/delete', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: idTodo,
      })
    })
  }
});


const filterTodos = (term) => {
  const filteredItems = Array.from(list.children).filter((todo) =>
    todo.textContent.toLowerCase().includes(term)
  );

  Array.from(list.children).forEach((todo) => {
    if (filteredItems.includes(todo)) {
      todo.classList.remove("filtered");
    } else {
      todo.classList.add("filtered");
    }
  });

  return filteredItems.length > 0;
};

// keyup event
search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  const hasFilteredItems = filterTodos(term);

  const submitButton = document.querySelector('.btn-light');
  if (hasFilteredItems) {
    submitButton.style.display = 'none';

  } else {
    submitButton.style.display = 'block';
  }
});
