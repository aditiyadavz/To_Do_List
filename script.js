let tasks = {
            design: ['Sketching', 'Wireframing', 'Visual Design', 'Prototyping'],
            sport: ['Morning Run', 'Gym Workout', 'Basketball'],
            meeting: ['Team Standup']
        };

        let currentCategory = 'design';

        function showMainApp() {
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('mainApp').classList.add('active');
        }

        function selectCategory(category, element) {
            // Remove active class from all categories
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
            });
            
            // Add active class to selected category
            element.classList.add('active');
            
            currentCategory = category;
            updateTaskList();
        }

        function updateTaskList() {
            // This would update the task list based on selected category
            // For demo purposes, we'll keep the existing tasks
        }

        function showTaskDetail(taskName) {
            document.getElementById('mainApp').style.display = 'none';
            document.getElementById('taskDetail').classList.add('active');
            document.getElementById('taskDetailTitle').textContent = taskName.charAt(0).toUpperCase() + taskName.slice(1);
        }

        function hideTaskDetail() {
            document.getElementById('taskDetail').classList.remove('active');
            document.getElementById('mainApp').style.display = 'block';
        }

        function toggleTask(checkbox) {
            checkbox.classList.toggle('checked');
            const taskItem = checkbox.closest('.task-item');
            taskItem.classList.toggle('completed');
        }

        function showAddTaskForm() {
            const input = document.getElementById('newTaskInput');
            const btn = document.getElementById('addTaskBtn');
            
            if (input.style.display === 'none' || input.style.display === '') {
                input.style.display = 'block';
                input.focus();
                btn.textContent = 'Save Task';
            } else {
                addNewTask();
            }
        }

        function addNewTask() {
            const input = document.getElementById('newTaskInput');
            const taskText = input.value.trim();
            
            if (taskText) {
                const taskList = document.querySelector('.task-list');
                const newTask = document.createElement('div');
                newTask.className = 'task-item';
                newTask.innerHTML = `
                    <div class="task-checkbox" onclick="toggleTask(this)"></div>
                    <div class="task-content">
                        <div class="task-name">${taskText}</div>
                    </div>
                `;
                taskList.appendChild(newTask);
                
                input.value = '';
                input.style.display = 'none';
                document.getElementById('addTaskBtn').textContent = '+ Add Subtask';
            }
        }

        // Search functionality
        document.getElementById('searchBar').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const taskItems = document.querySelectorAll('.task-item');
            
            taskItems.forEach(item => {
                const taskName = item.querySelector('.task-name').textContent.toLowerCase();
                if (taskName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Add enter key support for new task input
        document.getElementById('newTaskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addNewTask();
            }
        });