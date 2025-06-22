let categories = {
  DSA: {
    name: "DSA",
    tasks: {
      monday: ["Leetcode questions -2",],
      tuesday: ["Leetcode questions -2"],
      wednesday: ["Leetcode questions -2"],
      thursday: ["Leetcode questions -2"],
      friday: ["Leetcode questions -2"],
      saturday: ["Leetcode questions -3"],
      sunday: ["Leetcode questions -3"]
    }
  },
  Full_Stack: {
    name: "Full-Stack",
    tasks: {
      monday: ["Weather App", "Capstone"],
      tuesday: ["Capstone"],
      wednesday: ["To-Do-List", "Capstone"],
      thursday: [],
      friday: ["Job-Board", "Capstone"],
      saturday: [],
      sunday: ["Revise", "Capstone"]
    }
  },
  Aptitude: {
    name: "Aptitude & Grammer",
    tasks: {
      monday: ["Profit Loss", "Soft-skills"],
      tuesday: ["Average"],
      wednesday: [],
      thursday: ["Errors"],
      friday: [],
      saturday: ["Soft Skills"],
      sunday: []
    }
  }
};

let selectedCategory = null;

function showMainApp() {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  renderCategories();
}

function addCategory() {
  const name = prompt("Enter category name:");
  if (!name) return;

  const id = name.toLowerCase().replace(/\s+/g, '-');
  if (categories[id]) {
    alert("Category already exists!");
    return;
  }

  categories[id] = {
    name: name,
    tasks: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  };

  renderCategories();
}

function deleteCategory(id) {
  if (confirm("Delete this category?")) {
    delete categories[id];
    selectedCategory = null;
    renderCategories();
    clearWeekGrid();
  }
}

function renderCategories() {
  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  for (const id in categories) {
    const category = categories[id];
    const card = document.createElement("div");
    card.className = "category-card";
    if (selectedCategory === id) card.classList.add("active");

    card.onclick = () => selectCategory(id);
    card.innerHTML = `
      <button class="delete-category" onclick="event.stopPropagation(); deleteCategory('${id}')">×</button>
      <div class="category-icon">📁</div>
      <div class="category-name">${category.name}</div>
      <div class="task-count">${countTotalTasks(category.tasks)} Task</div>
    `;

    container.appendChild(card);
  }
}

function countTotalTasks(weekTasks) {
  return Object.values(weekTasks).reduce((acc, arr) => acc + arr.length, 0);
}

function selectCategory(id) {
  selectedCategory = id;
  renderCategories();
  renderWeekPlanner(categories[id].tasks);
}

function clearWeekGrid() {
  document.getElementById("weekGrid").innerHTML = "";
}

function renderWeekPlanner(tasks) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const container = document.getElementById("weekGrid");
  container.innerHTML = "";

  days.forEach(day => {
    const card = document.createElement("div");
    card.className = "day-card";

    const capitalDay = day.charAt(0).toUpperCase() + day.slice(1);

    const listItems = tasks[day].map((task, i) => `
      <li>
        ${task}
        <span class="delete-task" onclick="deleteTask('${day}', ${i})">×</span>
      </li>
    `).join("");

    card.innerHTML = `
      <h4>${capitalDay}</h4>
      <ul id="${day}Tasks">${listItems}</ul>
      <input type="text" placeholder="Add task..." onkeypress="addDayTask(event, '${day}')">
    `;

    container.appendChild(card);
  });
}

function addDayTask(event, day) {
  if (event.key === "Enter") {
    const input = event.target;
    const value = input.value.trim();
    if (!value || !selectedCategory) return;

    categories[selectedCategory].tasks[day].push(value);
    renderWeekPlanner(categories[selectedCategory].tasks);
  }
}

function deleteTask(day, index) {
  if (!selectedCategory) return;
  categories[selectedCategory].tasks[day].splice(index, 1);
  renderWeekPlanner(categories[selectedCategory].tasks);
}