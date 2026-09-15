document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    
    // Set Dashboard Date
    const dateDisplay = document.getElementById('dashboard-date');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.innerText = window.today.toLocaleDateString(window.lang === 'tr' ? 'tr-TR' : 'en-US', options);
    }
    
    // Aggregate Life Score
    const calculateLifeScore = () => {
        const t = window.today;
        const todayStr = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
        
        let score = 0;
        let breakdown = [];
        
        // 1. Habits (Max 20 pts)
        let habitPts = 0;
        const todayHabits = window.state.habitLogs[todayStr] || [];
        if (window.state.habits && window.state.habits.length > 0) {
            habitPts = Math.min(20, Math.round((todayHabits.length / window.state.habits.length) * 20));
        }
        score += habitPts;
        breakdown.push({ label: 'Habits', val: habitPts, icon: '📋' });
        
        // 2. Study (Max 20 pts)
        let studyPts = 0;
        const todayStudies = (window.state.studies || []).filter(s => s.date === todayStr);
        if (todayStudies.length > 0) {
            studyPts = Math.min(20, todayStudies.length * 5); // 5 pts per study session
        }
        score += studyPts;
        breakdown.push({ label: 'Study', val: studyPts, icon: '📚' });
        
        // 3. Fitness (Max 20 pts)
        let fitnessPts = 0;
        const todayFitness = window.state.fitnessLogs[todayStr] || [];
        if (todayFitness.length > 0) {
            fitnessPts = Math.min(20, todayFitness.length * 5); // 5 pts per set logged
        }
        score += fitnessPts;
        breakdown.push({ label: 'Fitness', val: fitnessPts, icon: '🏋' });
        
        // 4. Nutrition (Max 20 pts)
        let nutPts = 0;
        const todayNut = window.state.nutritionLogs[todayStr] || [];
        if (todayNut.length > 0) {
            nutPts = Math.min(20, todayNut.length * 5); // 5 pts per meal logged
        }
        score += nutPts;
        breakdown.push({ label: 'Nutrition', val: nutPts, icon: '🥗' });
        
        // 5. Sleep (Max 20 pts)
        let sleepPts = 0;
        let yesterday = new Date(t);
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.getFullYear() + '-' + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday.getDate()).padStart(2, '0');
        const recentSleep = (window.state.sleep || []).find(s => s.date === todayStr || s.date === yStr);
        if (recentSleep) {
            const h = parseFloat(recentSleep.hours) || 0;
            if (h >= 7) sleepPts = 20;
            else if (h >= 5) sleepPts = 10;
            else sleepPts = 5;
        }
        score += sleepPts;
        breakdown.push({ label: 'Sleep', val: sleepPts, icon: '😴' });
        
        return { score, breakdown };
    };
    
    const renderDashboard = () => {
        const ls = calculateLifeScore();
        
        const scoreEl = document.getElementById('life-score-display');
        if (scoreEl) {
            scoreEl.innerHTML = `${ls.score}<span style="font-size: 32px; color: rgba(255,255,255,0.4); font-weight: 600;">/100</span>`;
            // Color coding
            if (ls.score >= 80) scoreEl.style.color = '#10b981'; // Green
            else if (ls.score >= 50) scoreEl.style.color = '#f59e0b'; // Yellow
            else scoreEl.style.color = '#ef4444'; // Red
        }
        
        const bdEl = document.getElementById('life-score-breakdown');
        if (bdEl) {
            bdEl.innerHTML = '';
            ls.breakdown.forEach(b => {
                let color = b.val > 0 ? '#10b981' : 'var(--text-muted)';
                bdEl.innerHTML += `
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                        ${b.icon} ${window.t(b.label.toLowerCase()) || b.label} <span style="color:${color}; margin-left: 5px;">+${b.val}</span>
                    </div>
                `;
            });
        }
        
        renderHeatmap();
    };
    
    const renderHeatmap = () => {
        const container = document.getElementById('heatmap-container');
        if (!container) return;
        
        // Generate last 84 days (12 weeks)
        const t = new Date(window.today);
        const days = [];
        for(let i=83; i>=0; i--) {
            let d = new Date(t);
            d.setDate(d.getDate() - i);
            days.push(d);
        }
        
        container.innerHTML = '';
        let currentStreak = 0;
        
        days.forEach(d => {
            const dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            
            // Calculate activity for the day
            let activity = 0;
            if (window.state.habitLogs[dateStr] && window.state.habitLogs[dateStr].length > 0) activity += 1;
            if (window.state.fitnessLogs[dateStr] && window.state.fitnessLogs[dateStr].length > 0) activity += 1;
            if (window.state.nutritionLogs[dateStr] && window.state.nutritionLogs[dateStr].length > 0) activity += 1;
            if (window.state.studies && window.state.studies.some(s => s.date === dateStr)) activity += 1;
            
            let color = 'rgba(255,255,255,0.05)';
            if (activity === 1) color = 'rgba(var(--accent-rgb), 0.3)';
            else if (activity === 2) color = 'rgba(var(--accent-rgb), 0.6)';
            else if (activity >= 3) color = 'rgba(var(--accent-rgb), 1)';
            
            if (activity > 0) {
                currentStreak++;
            } else {
                currentStreak = 0;
            }
            
            container.innerHTML += `<div style="width: 12px; height: 12px; border-radius: 3px; background: ${color};" title="${dateStr} - ${activity} activities"></div>`;
        });
        
        const streakEl = document.getElementById('heatmap-streak');
        if (streakEl) {
            streakEl.innerText = `${currentStreak} Day Streak`;
            if (currentStreak > 0) streakEl.style.color = '#f59e0b';
        }
    };
    
    const renderHabits = () => {
        const listEl = document.getElementById('dashboard-habits-list');
        if (!listEl) return;
        
        listEl.innerHTML = '';
        const todayStr = window.today.getFullYear() + '-' + String(window.today.getMonth() + 1).padStart(2, '0') + '-' + String(window.today.getDate()).padStart(2, '0');
        const todayLogs = window.state.habitLogs[todayStr] || [];
        
        if (!window.state.habits || window.state.habits.length === 0) {
            listEl.innerHTML = '<div style="color:var(--text-muted); font-size:14px;">No habits created yet. Go to Goals to add some!</div>';
            return;
        }
        
        window.state.habits.forEach(habit => {
            const isDone = todayLogs.includes(habit.id);
            listEl.innerHTML += `
                <label style="display:flex; align-items:center; gap:12px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
                    <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleDashboardHabit('${habit.id}', this.checked)" style="width:20px; height:20px; accent-color:var(--accent); cursor:pointer;">
                    <span style="font-size:15px; color:#fff; ${isDone ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${habit.name}</span>
                </label>
            `;
        });
    };
    
    window.toggleDashboardHabit = (id, isDone) => {
        const todayStr = window.today.getFullYear() + '-' + String(window.today.getMonth() + 1).padStart(2, '0') + '-' + String(window.today.getDate()).padStart(2, '0');
        if (!window.state.habitLogs[todayStr]) window.state.habitLogs[todayStr] = [];
        
        if (isDone) {
            if (!window.state.habitLogs[todayStr].includes(id)) {
                window.state.habitLogs[todayStr].push(id);
                if (window.playSound) window.playSound('done');
                if (window.showConfetti) window.showConfetti();
            }
        } else {
            window.state.habitLogs[todayStr] = window.state.habitLogs[todayStr].filter(x => x !== id);
        }
        
        localStorage.setItem('qp_habitLogs', JSON.stringify(window.state.habitLogs));
        renderDashboard(); // Re-render to update Life Score immediately
        renderHabits(); // Update list UI (strikethrough)
    };
    
    renderDashboard();
    renderHabits();
});
