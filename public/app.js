const storageKey = "dailyops-state";
const defaultState = {
  tasks: [
    { id: crypto.randomUUID(), title: "Review top priority for the day", done: false },
    { id: crypto.randomUUID(), title: "Take a 10 minute walk", done: false },
    { id: crypto.randomUUID(), title: "Close one pending personal task", done: true }
  ],
  habits: [
    { id: "sleep", label: "7+ hours sleep", done: false },
    { id: "move", label: "Movement", done: false },
    { id: "learn", label: "Learn 30 minutes", done: false },
    { id: "reflect", label: "Evening reflection", done: false }
  ],
  water: 0,
  expenses: [
    { id: crypto.randomUUID(), name: "Tea", amount: 20 },
    { id: crypto.randomUUID(), name: "Commute", amount: 80 }
  ]
};

let state = loadState();
let timerSeconds = 25 * 60;
let timerId = null;

const els = {
  currentDate: document.getElementById("currentDate"),
  taskForm: document.getElementById("taskForm"),
  taskInput: document.getElementById("taskInput"),
  taskList: document.getElementById("taskList"),
  habitList: document.getElementById("habitList"),
  addWater: document.getElementById("addWater"),
  waterCups: document.getElementById("waterCups"),
  expenseForm: document.getElementById("expenseForm"),
  expenseName: document.getElementById("expenseName"),
  expenseAmount: document.getElementById("expenseAmount"),
  expenseList: document.getElementById("expenseList"),
  tasksDone: document.getElementById("tasksDone"),
  habitScore: document.getElementById("habitScore"),
  waterCount: document.getElementById("waterCount"),
  expenseTotal: document.getElementById("expenseTotal"),
  resetDay: document.getElementById("resetDay"),
  timer: document.getElementById("timer"),
  startTimer: document.getElementById("startTimer"),
  pauseTimer: document.getElementById("pauseTimer"),
  resetTimer: document.getElementById("resetTimer")
};

function loadState() {
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : defaultState;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function renderDate() {
  els.currentDate.textContent = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());
}

function renderSummary() {
  const doneTasks = state.tasks.filter((task) => task.done).length;
  const doneHabits = state.habits.filter((habit) => habit.done).length;
  const expenseTotal = state.expenses.reduce((sum, item) => sum + item.amount, 0);

  els.tasksDone.textContent = `${doneTasks}/${state.tasks.length}`;
  els.habitScore.textContent = `${Math.round((doneHabits / state.habits.length) * 100)}%`;
  els.waterCount.textContent = `${state.water}/8`;
  els.expenseTotal.textContent = formatCurrency(expenseTotal);
}

function renderTasks() {
  els.taskList.innerHTML = "";

  state.tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item ${task.done ? "done" : ""}`;
    item.innerHTML = `
      <span class="task-left">
        <button class="check" aria-label="Toggle task">✓</button>
        <span class="task-title"></span>
      </span>
      <button class="delete-button" aria-label="Delete task">×</button>
    `;

    item.querySelector(".task-title").textContent = task.title;
    item.querySelector(".check").addEventListener("click", () => {
      task.done = !task.done;
      commit();
    });
    item.querySelector(".delete-button").addEventListener("click", () => {
      state.tasks = state.tasks.filter((entry) => entry.id !== task.id);
      commit();
    });
    els.taskList.appendChild(item);
  });
}

function renderHabits() {
  els.habitList.innerHTML = "";

  state.habits.forEach((habit) => {
    const button = document.createElement("button");
    button.className = `habit-item ${habit.done ? "complete" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="habit-left">
        <span class="check">✓</span>
        <strong></strong>
      </span>
      <span>${habit.done ? "Done" : "Open"}</span>
    `;
    button.querySelector("strong").textContent = habit.label;
    button.addEventListener("click", () => {
      habit.done = !habit.done;
      commit();
    });
    els.habitList.appendChild(button);
  });
}

function renderWater() {
  els.waterCups.innerHTML = "";

  for (let index = 1; index <= 8; index += 1) {
    const cup = document.createElement("button");
    cup.className = `cup ${index <= state.water ? "filled" : ""}`;
    cup.type = "button";
    cup.ariaLabel = `Set water to ${index} cups`;
    cup.addEventListener("click", () => {
      state.water = index;
      commit();
    });
    els.waterCups.appendChild(cup);
  }
}

function renderExpenses() {
  els.expenseList.innerHTML = "";

  state.expenses.forEach((expense) => {
    const item = document.createElement("li");
    item.className = "expense-item";
    item.innerHTML = `
      <span></span>
      <strong>${formatCurrency(expense.amount)}</strong>
      <button class="delete-button" aria-label="Delete expense">×</button>
    `;
    item.querySelector("span").textContent = expense.name;
    item.querySelector(".delete-button").addEventListener("click", () => {
      state.expenses = state.expenses.filter((entry) => entry.id !== expense.id);
      commit();
    });
    els.expenseList.appendChild(item);
  });
}

function renderTimer() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const seconds = String(timerSeconds % 60).padStart(2, "0");
  els.timer.textContent = `${minutes}:${seconds}`;
}

function commit() {
  saveState();
  render();
}

function render() {
  renderDate();
  renderSummary();
  renderTasks();
  renderHabits();
  renderWater();
  renderExpenses();
  renderTimer();
}

els.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = els.taskInput.value.trim();
  if (!title) return;

  state.tasks.unshift({ id: crypto.randomUUID(), title, done: false });
  els.taskInput.value = "";
  commit();
});

els.expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = els.expenseName.value.trim();
  const amount = Number(els.expenseAmount.value);
  if (!name || !amount) return;

  state.expenses.unshift({ id: crypto.randomUUID(), name, amount });
  els.expenseName.value = "";
  els.expenseAmount.value = "";
  commit();
});

els.addWater.addEventListener("click", () => {
  state.water = Math.min(8, state.water + 1);
  commit();
});

els.resetDay.addEventListener("click", () => {
  state = {
    ...defaultState,
    tasks: defaultState.tasks.map((task) => ({ ...task, id: crypto.randomUUID(), done: false })),
    habits: defaultState.habits.map((habit) => ({ ...habit, done: false })),
    water: 0,
    expenses: []
  };
  commit();
});

els.startTimer.addEventListener("click", () => {
  if (timerId) return;
  timerId = window.setInterval(() => {
    timerSeconds = Math.max(0, timerSeconds - 1);
    renderTimer();
    if (timerSeconds === 0) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }, 1000);
});

els.pauseTimer.addEventListener("click", () => {
  window.clearInterval(timerId);
  timerId = null;
});

els.resetTimer.addEventListener("click", () => {
  window.clearInterval(timerId);
  timerId = null;
  timerSeconds = 25 * 60;
  renderTimer();
});

render();
