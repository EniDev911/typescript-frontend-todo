import "./style.css";
import { v4 } from "uuid";
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";

const taskForm = document.querySelector<HTMLFormElement>("#taskform");
const tasksList = document.querySelector<HTMLDivElement>("#taskslist");

interface Task {
  id: string;
  title: string;
  description: string;
}

let tasks: Task[] = [];

function showMessage(str: string) {
  Toastify({
    text: `Tasks ${str} added`,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  tasksList!.innerHTML = "";
  const title = taskForm["title"] as unknown as HTMLInputElement;
  const description = taskForm["description"] as unknown as HTMLTextAreaElement;
  if (title.value && description.value) {
    tasks.push({
      id: v4(),
      title: title.value,
      description: description.value,
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showMessage(title.value);
    taskForm.reset();
    title.focus();
  } else {
    alert("All fields are required");
  }
  renderTasks(tasks);
});

const renderTasks = (tasks: Task[]) => {
  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className =
      "bg-zinc-700 mb-1 rounded-lg hover:bg-zinc-600 hover:cursor-pointer p-3 shadow-md";
    const header = document.createElement("header");
    header.className = "flex justify-between";
    const title = document.createElement("span");
    title.innerText = task.title;

    const btnDelete = document.createElement("button");
    btnDelete.innerText = "delete";
    btnDelete.className = "bg-red-500 px-2 py-1 rounded-md";
    // listener btn delete
    btnDelete.onclick = () => {
      const index = tasks.findIndex((t) => t.id === task.id);
      tasks.splice(index, 1);
      localStorage.setItem(`tasks`, JSON.stringify(tasks));
      tasksList!.innerHTML = "";
      renderTasks(tasks);
    };

    header.append(title);
    header.append(btnDelete);
    const description = document.createElement("p");
    description.innerText = task.description;
    taskElement.append(header);
    taskElement.append(description);
    tasksList?.append(taskElement);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const tasksStorage = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks = tasksStorage;
  renderTasks(tasksStorage);
});
