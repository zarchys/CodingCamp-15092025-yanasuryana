document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const filterSelect = document.getElementById("filter-select");

  let todos = [];

  if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
    renderTodos(todos);
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = todoInput.value.trim();
    const date = dateInput.value;

    if (!task || !date) {
      alert("Please fill all fields!");
      return;
    }

    const todo = { task, date, id: Date.now() };
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos(todos);

    todoInput.value = "";
    dateInput.value = "";
  });

  function renderTodos(list) {
    todoList.innerHTML = "";
    list.forEach((todo) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${todo.task} - ${todo.date}</span>
        <button class="delete-btn" data-id="${todo.id}">Delete</button>
      `;
      todoList.appendChild(li);
    });
  }

  todoList.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const id = e.target.dataset.id;
    const li = e.target.closest("li");

    li.classList.add("throwing");

    li.addEventListener(
      "animationend",
      () => {
        todos = todos.filter((todo) => todo.id != id);
        localStorage.setItem("todos", JSON.stringify(todos));
        li.remove();
      },
      { once: true }
    );
  });

  filterSelect.addEventListener("change", () => {
    const filter = filterSelect.value;
    const today = new Date().toISOString().split("T")[0];

    if (filter === "all") renderTodos(todos);
    else if (filter === "today")
      renderTodos(todos.filter((todo) => todo.date === today));
    else if (filter === "future")
      renderTodos(todos.filter((todo) => todo.date > today));
  });
});