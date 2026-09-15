document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    window.currentDate = new Date();
    // Preload cross-module data to show in calendar
    window.habitLogs = window.safeParse('qp_habit_logs', {});
    window.habits = window.safeParse('qp_habits', []);
    window.lifeScores = window.safeParse('qp_daily_score', {});
    
    renderCalendar();
});

window.changeMonth = (delta) => {
    const grid = document.getElementById('calendar-grid');
    grid.style.transform = delta > 0 ? 'translateX(-20px)' : 'translateX(20px)';
    grid.style.opacity = '0';
    grid.style.transition = '0.2s';
    
    setTimeout(() => {
        window.currentDate.setMonth(window.currentDate.getMonth() + delta);
        renderCalendar();
        grid.style.transform = delta > 0 ? 'translateX(20px)' : 'translateX(-20px)';
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                grid.style.transform = 'translateX(0)';
                grid.style.opacity = '1';
            });
        });
    }, 200);
};

function renderCalendar() {
    const year = window.currentDate.getFullYear();
    const month = window.currentDate.getMonth();
    
    document.getElementById('current-month-year').innerText = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Empty slots before first day
    for(let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div style="padding:15px; border-radius:12px; background:rgba(255,255,255,0.01);"></div>`;
    }
    
    const today = new Date();
    
    for(let day = 1; day <= daysInMonth; day++) {
        const dStr = new Date(year, month, day).toISOString().split('T')[0];
        
        // Calculate heat (0 to 1) based on completed habits
        const completedCount = window.habitLogs[dStr] ? window.habitLogs[dStr].length : 0;
        const totalHabits = window.habits.length || 1; // avoid /0
        let heat = completedCount / totalHabits;
        if(heat > 1) heat = 1;
        
        // Color intensity based on heat (using accent color #00f2fe base)
        const alpha = 0.05 + (heat * 0.7); 
        const bg = `rgba(0, 242, 254, ${alpha})`;
        const borderColor = heat > 0 ? `rgba(0, 242, 254, ${alpha + 0.2})` : `rgba(255,255,255,0.05)`;
        
        const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
        const outline = isToday ? 'border: 2px solid #fff;' : `border: 1px solid ${borderColor};`;
        
        grid.innerHTML += `
            <div class="calendar-day" onclick="showDayDetails('${dStr}')" style="padding:15px 10px; border-radius:12px; background:${bg}; ${outline} color:#fff; text-align:center; font-weight:600; cursor:pointer; transition:0.2s; animation-delay:${day * 15}ms;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                ${day}
                <div style="width:4px; height:4px; border-radius:50%; background:#fff; margin: 4px auto 0 auto; opacity: ${heat > 0 ? 1 : 0};"></div>
            </div>
        `;
    }
}

window.showDayDetails = (dateStr) => {
    const detailsPanel = document.getElementById('day-details');
    detailsPanel.style.display = 'block';
    
    // Reset and trigger animation
    detailsPanel.style.animation = 'none';
    detailsPanel.offsetHeight; /* trigger reflow to restart animation */
    detailsPanel.style.animation = 'fadeInSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    
    const displayDate = new Date(dateStr).toLocaleDateString(window.lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('selected-date-title').innerText = displayDate;
    
    const habitsCompletedIds = window.habitLogs[dateStr] || [];
    const list = document.getElementById('day-habits-list');
    
    if (habitsCompletedIds.length === 0) {
        list.innerHTML = '<li style="color:var(--text-muted);">No habits completed on this day.</li>';
    } else {
        const names = habitsCompletedIds.map(id => {
            const h = window.habits.find(hx => hx.id === id);
            return h ? h.name : 'Unknown Habit';
        });
        list.innerHTML = names.map(n => `<li>${n}</li>`).join('');
    }
    
    const score = window.lifeScores[dateStr] || 0;
    document.getElementById('day-life-score').innerText = score;
};
