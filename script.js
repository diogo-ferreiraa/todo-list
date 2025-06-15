const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const taskCounter = document.getElementById("task-counter");

let tasks = [];

// Carregar tarefas do localStorage
window.onload = function () {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
};

// Adicionar tarefa
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const newTask = { text: taskText, completed: false };
    tasks.push(newTask);
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

// Marcar ou remover tarefa
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  if (e.target.classList.contains("task-text")) {
    const index = e.target.dataset.index;
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }
});

// Salvar no localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Atualizar a lista na tela
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span class="task-text" data-index="${index}">${task.text}</span>
      <button class="delete-btn" data-index="${index}">Excluir</button>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

// Atualizar contador de tarefas pendentes
function updateCounter() {
  const pending = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${pending} tarefa(s) pendente(s)`;
}

const exportBtn = document.getElementById("export-btn");

exportBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("Nenhuma tarefa para exportar.");
    return;
  }

  // Preparar os dados
  const data = tasks.map((task, index) => ({
    "#": index + 1,
    Tarefa: task.text,
    Concluída: task.completed ? "Sim" : "Não"
  }));

  // Criar uma planilha
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tarefas");

  // Salvar o arquivo
  XLSX.writeFile(workbook, "minha_lista_de_tarefas.xlsx");
});