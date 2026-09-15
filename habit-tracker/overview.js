let currentOverviewMonth = new Date().getMonth();
let currentOverviewYear = new Date().getFullYear();

// Emojis for picker
const EMOJIS = ['⭐', '🔥', '💧', '📚', '💪', '🧘', '🧠', '🏃', '💰', '🥦', '🛌', '📝', '🎯', '🚀', '🎨', '🎵'];

document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    renderOverview();
    
    // Emoji Picker Logic
    const picker = document.getElementById('emoji-picker-index');
    if(picker) {
        picker.innerHTML = EMOJIS.map(e => `<div class="emoji-opt" data-e="${e}" style="cursor:pointer; padding:5px; border-radius:4px; font-size:20px; transition:0.2s;">${e}</div>`).join('');
        picker.addEventListener('click', (e) => {
            const opt = e.target.closest('.emoji-opt');
            if(!opt) return;
            document.querySelectorAll('.emoji-opt').forEach(el => {
                el.style.background = 'transparent';
                el.style.transform = 'scale(1)';
            });
            document.getElementById('habit-emoji').value = opt.dataset.e;
            opt.style.background = 'rgba(255,255,255,0.2)';
            opt.style.transform = 'scale(1.1)';
        });
    }

    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
        habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const categoryVal = document.getElementById('habit-category') ? document.getElementById('habit-category').value : 'other';
            const emojiVal = document.getElementById('habit-emoji') ? document.getElementById('habit-emoji').value : '⭐';
            const editId = document.getElementById('edit-habit-id') ? document.getElementById('edit-habit-id').value : '';
            
            if (editId) {
                const habit = window.state.habits.find(h => h.id === editId);
                if (habit) {
                    habit.name = document.getElementById('habit-name').value;
                    habit.category = categoryVal;
                    habit.emoji = emojiVal;
                }
            } else {
                window.state.habits.push({ 
                    id: Date.now().toString(), 
                    name: document.getElementById('habit-name').value,
                    category: categoryVal,
                    emoji: emojiVal
                });
            }
            
            localStorage.setItem('qp_habits', JSON.stringify(window.state.habits));
            
            renderOverview();
            
            if (typeof updateTopBar === 'function') updateTopBar();
            
            document.getElementById('habit-modal').classList.remove('active');
            habitForm.reset();
            if (document.getElementById('edit-habit-id')) document.getElementById('edit-habit-id').value = '';
            document.querySelectorAll('.emoji-opt').forEach(el => { el.style.background = 'transparent'; el.style.transform = 'scale(1)'; });
        });
    }
});

window.renderOverview = () => {
    const t = new Date(currentOverviewYear, currentOverviewMonth, 1);
    const year = t.getFullYear();
    const month = t.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Set Month Title
    const monthName = t.toLocaleDateString(window.lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' });
    if(document.getElementById('month-title')) document.getElementById('month-title').innerText = monthName;
    
    // Generate Week Headers
    let theadHtml = `<tr><th rowspan="2" class="habit-name-col" style="background:var(--bg-color);">${window.t('habits_days')}</th>`;
    let daysRowHtml = `<tr>`;
    
    let weekCols = [0, 0, 0, 0, 0];
    for(let i=1; i<=daysInMonth; i++) {
        let w = Math.floor((i-1)/7);
        if(w > 4) w = 4;
        weekCols[w]++;
    }
    
    for(let w=0; w<5; w++) {
        if (weekCols[w] > 0) {
            theadHtml += `<th colspan="${weekCols[w]}" class="week-${w+1}">${window.t('week')} ${w+1}</th>`;
        }
    }
    theadHtml += `<th rowspan="2" class="analysis-col" style="background:var(--bg-color);">${window.t('analysis')}</th></tr>`;
    
    for(let i=1; i<=daysInMonth; i++) {
        let w = Math.floor((i-1)/7);
        if(w > 4) w = 4;
        daysRowHtml += `<th class="day-col week-${w+1}">${i}</th>`;
    }
    daysRowHtml += `</tr>`;
    
    let tbodyHtml = '';
    
    // Stats accumulators
    let totalHabitsPossible = 0;
    let totalHabitsCompleted = 0;
    
    let dailyDone = new Array(daysInMonth).fill(0);
    let dailyNotDone = new Array(daysInMonth).fill(0);
    
    // Render Habits
    const habits = window.state.habits || [];
    habits.forEach(habit => {
        let habitCompletedCount = 0;
        let emoji = habit.emoji || '⭐';
        
        let actionsHtml = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <b>${emoji} ${habit.name}</b><br>
                    <span style="color:var(--text-muted); font-size:9px;">${habit.category ? window.t('cat_' + habit.category.substring(0,4)) || window.t('cat_' + habit.category) || window.t('cat_other') : window.t('cat_other')}</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <svg onclick="editOverviewHabit('${habit.id}')" style="cursor:pointer; opacity:0.5;" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <svg onclick="deleteOverviewHabit('${habit.id}')" style="cursor:pointer; opacity:0.5; color:#ef4444;" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
            </div>
        `;
        
        let rowHtml = `<tr><td class="habit-name-col">${actionsHtml}</td>`;
        
        for(let i=1; i<=daysInMonth; i++) {
            let dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            let isDone = false;
            if (window.state.habitLogs && window.state.habitLogs[dateStr] && window.state.habitLogs[dateStr].includes(habit.id)) {
                isDone = true;
                habitCompletedCount++;
                dailyDone[i-1]++;
                totalHabitsCompleted++;
            } else {
                dailyNotDone[i-1]++;
            }
            totalHabitsPossible++;
            
            rowHtml += `<td class="day-col" onclick="toggleOverviewLog('${habit.id}', '${dateStr}')" style="cursor:pointer;"><div class="overview-cb ${isDone ? 'checked' : ''}"></div></td>`;
        }
        
        let pct = Math.round((habitCompletedCount / daysInMonth) * 100);
        rowHtml += `<td class="analysis-col">
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <div class="analysis-bar-container"><div class="analysis-bar-fill" style="width:${pct}%"></div></div>
                <span>${pct}%</span>
            </div>
        </td></tr>`;
        tbodyHtml += rowHtml;
    });
    
    // Progress Rows
    tbodyHtml += `<tr class="stat-row" style="border-top:1px solid rgba(255,255,255,0.1);"><td style="text-align:right;">${window.t('progress_pct')}</td>`;
    for(let i=1; i<=daysInMonth; i++) {
        let total = dailyDone[i-1] + dailyNotDone[i-1];
        let pct = total > 0 ? Math.round((dailyDone[i-1] / total) * 100) : 0;
        tbodyHtml += `<td>${pct}%</td>`;
    }
    tbodyHtml += `<td></td></tr>`;
    
    tbodyHtml += `<tr class="stat-row"><td style="text-align:right;">${window.t('done')}</td>`;
    for(let i=1; i<=daysInMonth; i++) tbodyHtml += `<td>${dailyDone[i-1]}</td>`;
    tbodyHtml += `<td></td></tr>`;
    
    tbodyHtml += `<tr class="stat-row"><td style="text-align:right;">${window.t('not_done')}</td>`;
    for(let i=1; i<=daysInMonth; i++) tbodyHtml += `<td>${dailyNotDone[i-1]}</td>`;
    tbodyHtml += `<td></td></tr>`;
    
    if(document.getElementById('habits-grid')) {
        document.getElementById('habits-grid').innerHTML = `<thead>${theadHtml}${daysRowHtml}</thead><tbody>${tbodyHtml}</tbody>`;
    }
    
    // Top Stats Update
    if(document.getElementById('stat-total-habits')) document.getElementById('stat-total-habits').innerText = habits.length;
    if(document.getElementById('stat-completed-habits')) document.getElementById('stat-completed-habits').innerText = totalHabitsCompleted;
    
    let overallPct = totalHabitsPossible > 0 ? Math.round((totalHabitsCompleted / totalHabitsPossible) * 100) : 0;
    if(document.getElementById('stat-progress-pct')) document.getElementById('stat-progress-pct').innerText = `${overallPct}%`;
    if(document.getElementById('stat-progress-bar')) document.getElementById('stat-progress-bar').style.width = `${overallPct}%`;
    
    // -----------------------------------------
    // Render Mental Grid
    // -----------------------------------------
    let mentalTbody = '';
    const mentalKeys = [
        { key: 'energy', label: window.t('energy') || 'Energy' },
        { key: 'focus', label: window.t('focus') || 'Focus' },
        { key: 'confidence', label: window.t('confidence') || 'Confidence' },
        { key: 'social', label: window.t('social_battery') || 'Social Battery' }
    ];
    
    mentalKeys.forEach(mk => {
        let totalScore = 0;
        let daysRecorded = 0;
        let mRow = `<tr><td class="habit-name-col"><b>${mk.label}</b></td>`;
        
        for(let i=1; i<=daysInMonth; i++) {
            let dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            let val = '-';
            if (window.state.mentalLogs && window.state.mentalLogs[dateStr] && window.state.mentalLogs[dateStr][mk.key]) {
                val = window.state.mentalLogs[dateStr][mk.key];
                totalScore += val;
                daysRecorded++;
            }
            mRow += `<td class="day-col">${val}</td>`;
        }
        
        let avg = daysRecorded > 0 ? (totalScore / daysRecorded).toFixed(1) : 0;
        let avgPct = Math.round((avg / 10) * 100);
        
        mRow += `<td class="analysis-col">
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <div class="analysis-bar-container"><div class="analysis-bar-fill" style="width:${avgPct}%"></div></div>
                <span>${avg} / 10</span>
            </div>
        </td></tr>`;
        mentalTbody += mRow;
    });
    
    if(document.getElementById('mental-grid')) {
        document.getElementById('mental-grid').innerHTML = `<thead>${theadHtml}${daysRowHtml}</thead><tbody>${mentalTbody}</tbody>`;
    }
};

window.toggleOverviewLog = (habitId, dateStr) => {
    if (!window.state.habitLogs) window.state.habitLogs = {};
    if (!window.state.habitLogs[dateStr]) window.state.habitLogs[dateStr] = [];
    
    const logs = window.state.habitLogs[dateStr];
    const idx = logs.indexOf(habitId);
    
    if (idx > -1) {
        logs.splice(idx, 1);
    } else {
        logs.push(habitId);
        if (window.playSuccessSound) window.playSuccessSound();
    }
    
    localStorage.setItem('qp_habitLogs', JSON.stringify(window.state.habitLogs));
    renderOverview();
};

window.deleteOverviewHabit = (id) => {
    if(confirm(window.t ? window.t('delete_habit_confirm') : "Are you sure you want to delete this habit?")) {
        window.state.habits = window.state.habits.filter(h => h.id !== id);
        localStorage.setItem('qp_habits', JSON.stringify(window.state.habits));
        renderOverview();
    }
};

window.editOverviewHabit = (id) => {
    const habit = window.state.habits.find(h => h.id === id);
    if (!habit) return;
    
    document.getElementById('edit-habit-id').value = habit.id;
    document.getElementById('habit-name').value = habit.name;
    
    const catEl = document.getElementById('habit-category');
    if (catEl) catEl.value = habit.category || 'other';
    
    const emojiEl = document.getElementById('habit-emoji');
    if (emojiEl) emojiEl.value = habit.emoji || '⭐';
    
    // Update emoji picker selection visually
    document.querySelectorAll('.emoji-opt').forEach(el => {
        if (el.dataset.e === (habit.emoji || '⭐')) {
            el.style.background = 'rgba(255,255,255,0.2)';
            el.style.transform = 'scale(1.1)';
        } else {
            el.style.background = 'transparent';
            el.style.transform = 'scale(1)';
        }
    });
    
    document.getElementById('habit-modal').classList.add('active');
};
