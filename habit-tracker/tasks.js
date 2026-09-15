document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    document.getElementById('task-date').value = today.toISOString().split('T')[0];

    const renderTasks = () => {
        const grid = document.getElementById('task-grid');
        grid.innerHTML = '';
        
        const currDate = new Date();
        const day = currDate.getDay();
        const diff = currDate.getDate() - day + (day == 0 ? -6:1); 
        const monday = new Date(currDate.setDate(diff));
        
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        weekDays.forEach((dayName, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            
            const dayTasks = state.tasks.filter(t => t.date === dateStr);
            const doneTasks = dayTasks.filter(t => t.done).length;
            const percent = dayTasks.length === 0 ? 0 : Math.round((doneTasks / dayTasks.length) * 100);
            
            const card = document.createElement('div');
            card.className = 'task-day-card';
            
            let tasksHTML = '<div class="task-list">';
            dayTasks.forEach(t => {
                tasksHTML += `
                    <div class="task-item ${t.done ? 'done' : ''}">
                        <div class="task-cb" data-id="${t.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span>${t.name}</span>
                        <button class="btn-icon task-delete" data-id="${t.id}" style="margin-left:auto; font-size:10px; color:#64748b; background:none; border:none; cursor:pointer;">✕</button>
                    </div>
                `;
            });
            tasksHTML += '</div>';

            if(dayTasks.length === 0) tasksHTML = '<div style="font-size:12px; color:var(--text-muted); text-align:center;">No tasks</div>';

            card.innerHTML = `
                <div class="task-day-title">${dayName}</div>
                <div class="task-day-date">${dateStr}</div>
                <div class="radial-progress" style="--progress: ${percent}%">
                    <div class="radial-inner">${percent}%</div>
                </div>
                ${tasksHTML}
            `;
            
            card.querySelectorAll('.task-cb').forEach(cb => {
                cb.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const task = state.tasks.find(t => t.id === id);
                    if(task) { 
                        task.done = !task.done; 
                        if (task.done && window.playPopSound) window.playPopSound();
                        saveState(); 
                        renderTasks(); 
                    }
                });
            });
            
            card.querySelectorAll('.task-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    state.tasks = state.tasks.filter(t => t.id !== id);
                    saveState(); renderTasks();
                });
            });

            grid.appendChild(card);
        });
    };

    renderTasks();

    document.getElementById('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.tasks.push({
            id: Date.now().toString(),
            name: document.getElementById('task-name').value,
            date: document.getElementById('task-date').value,
            done: false
        });
        saveState(); 
        renderTasks();
        closeModal('task-modal');
        document.getElementById('task-form').reset();
        document.getElementById('task-date').value = today.toISOString().split('T')[0];
    });
});
