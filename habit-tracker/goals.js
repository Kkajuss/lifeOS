document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    window.goalsState = {
        goals: window.safeParse('qp_goals', [])
    };
    renderGoals();
});

window.saveGoal = () => {
    const name = document.getElementById('goal-name').value.trim();
    const target = parseFloat(document.getElementById('goal-target').value);
    const unit = document.getElementById('goal-unit').value.trim();
    
    if (!name || isNaN(target) || target <= 0) {
        alert("Please enter a valid goal name and target value.");
        return;
    }
    
    const goal = {
        id: Date.now(),
        name: name,
        target: target,
        current: 0,
        unit: unit
    };
    
    window.goalsState.goals.push(goal);
    localStorage.setItem('qp_goals', JSON.stringify(window.goalsState.goals));
    
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-target').value = '';
    document.getElementById('goal-unit').value = '';
    
    closeModal('new-goal-modal');
    renderGoals();
};

window.deleteGoal = (id) => {
    if(confirm("Are you sure you want to delete this goal?")) {
        window.goalsState.goals = window.goalsState.goals.filter(g => g.id !== id);
        localStorage.setItem('qp_goals', JSON.stringify(window.goalsState.goals));
        renderGoals();
    }
};

window.updateGoalProgress = (id, amount) => {
    const goal = window.goalsState.goals.find(g => g.id === id);
    if(goal) {
        goal.current += amount;
        if(goal.current < 0) goal.current = 0;
        if(goal.current > goal.target) goal.current = goal.target; // Cap at 100%
        localStorage.setItem('qp_goals', JSON.stringify(window.goalsState.goals));
        renderGoals();
    }
};

function renderGoals() {
    const list = document.getElementById('goals-list');
    if(!list) return;
    
    list.innerHTML = '';
    
    if (window.goalsState.goals.length === 0) {
        list.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:40px;">No goals set yet. Tap + New Goal to set your first milestone.</div>';
        return;
    }
    
    window.goalsState.goals.forEach(goal => {
        const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
        const isComplete = percent === 100;
        const color = isComplete ? '#10b981' : 'var(--accent)';
        
        list.innerHTML += `
            <div class="glass-panel" style="padding:24px; position:relative; overflow:hidden;">
                <button onclick="deleteGoal(${goal.id})" style="position:absolute; top:15px; right:15px; background:transparent; color:var(--text-muted); border:none; width:28px; height:28px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                    &times;
                </button>
                
                <div style="font-weight:700; color:#fff; font-size:18px; margin-bottom:5px; padding-right:20px;">${goal.name}</div>
                <div style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">
                    <span style="color:#fff; font-weight:600;">${goal.current}</span> / ${goal.target} ${goal.unit}
                </div>
                
                <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; margin-bottom:20px; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:0; left:0; height:100%; width:${percent}%; background:${color}; border-radius:4px; transition:0.5s ease-out;"></div>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:800; font-size:24px; color:${color};">${percent}%</div>
                    <div style="display:flex; gap:10px;">
                        <button onclick="updateGoalProgress(${goal.id}, -1)" style="background:rgba(255,255,255,0.05); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:8px; width:36px; height:36px; cursor:pointer; font-weight:700;">-1</button>
                        <button onclick="updateGoalProgress(${goal.id}, 1)" style="background:rgba(255,255,255,0.05); color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:8px; width:36px; height:36px; cursor:pointer; font-weight:700;">+1</button>
                    </div>
                </div>
                
                ${isComplete ? `<div style="position:absolute; top:-10px; right:-10px; background:${color}; color:#fff; font-size:10px; font-weight:800; padding:15px 30px; transform:rotate(45deg); box-shadow:0 0 10px rgba(0,0,0,0.5);">COMPLETED</div>` : ''}
            </div>
        `;
    });
}
