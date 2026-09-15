document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();

    let habitTrendChart = null;
    let mentalChart = null;

    const analysisColors = ['#f43f5e', '#eab308', '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'];

    const renderCharts = (isUpdate = false) => {
        // 1. Smooth Green Habit Trend Chart
        const ctxHabit = document.getElementById('habitTrendChart');
        if(ctxHabit) {
            const labels = [];
            const data = [];

            for(let d = 1; d <= numDays; d++) {
                const dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
                const doneCount = state.habits.filter(h => (state.habitLogs[dateStr] || []).includes(h.id)).length;
                const total = state.habits.length;
                const p = total === 0 ? 0 : Math.round((doneCount / total) * 100);
                
                labels.push(d); 
                data.push(p);
            }
            
            if(habitTrendChart) {
                habitTrendChart.data.labels = labels;
                habitTrendChart.data.datasets[0].data = data;
                habitTrendChart.update(isUpdate ? 'none' : undefined);
            } else {
                habitTrendChart = new Chart(ctxHabit, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: window.t('progress') + ' %',
                            data: data,
                            borderColor: window.getTheme().accent,
                            backgroundColor: `rgba(${window.getTheme().accentRgb}, 0.2)`,
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4, // Smooth curve
                            pointRadius: 0, // NO DOTS
                            pointHoverRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            duration: 2000,
                            easing: 'easeOutQuart'
                        },
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { 
                                beginAtZero: true, 
                                max: 100,
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: {
                                    stepSize: 25,
                                    callback: function(value) { return value + "%" }
                                }
                            },
                            x: { grid: { display: false }, ticks: { display:false } }
                        }
                    }
                });
            }
        }

        // 2. Double Line Mental State Chart
        const ctxMental = document.getElementById('mentalChart');
        if(ctxMental) {
            if(mentalChart) mentalChart.destroy();
            
            const labels = [];
            const moodData = [];
            const motData = [];

            for(let d = 1; d <= numDays; d++) {
                const dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
                const log = state.mentalLogs[dateStr] || { mood: 0, motivation: 0 };
                
                labels.push(d); 
                moodData.push(log.mood === '' ? null : (parseInt(log.mood)*10)); // Scale 1-10 to 10-100%
                motData.push(log.motivation === '' ? null : (parseInt(log.motivation)*10));
            }

            if(mentalChart) {
                mentalChart.data.labels = labels;
                mentalChart.data.datasets[0].data = moodData;
                mentalChart.data.datasets[1].data = motData;
                mentalChart.update(isUpdate ? 'none' : undefined);
            } else {
                mentalChart = new Chart(ctxMental, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: window.t('mood'),
                                data: moodData,
                                borderColor: window.getTheme().accent,
                                pointBackgroundColor: window.getTheme().accent,
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointRadius: 0
                            },
                            {
                                label: window.t('motivation'),
                                data: motData,
                                borderColor: window.getTheme().textMuted,
                                pointBackgroundColor: window.getTheme().textMuted,
                                borderWidth: 2,
                                fill: false,
                                tension: 0.4,
                                pointRadius: 0,
                                borderDash: [5, 5]
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            duration: 2500,
                            easing: 'easeOutExpo'
                        },
                        plugins: { 
                            legend: { 
                                display: true, 
                                position: 'top', 
                                align: 'start',
                                labels: { 
                                    color: '#e2e8f0', 
                                    boxWidth: 10, 
                                    boxHeight: 10,
                                    usePointStyle: true, 
                                    pointStyle: 'circle',
                                    font: { family: 'Inter', size: 13, weight: '600' },
                                    padding: 20
                                }
                            } 
                        },
                        scales: {
                            y: { 
                                beginAtZero: true, 
                                max: 100,
                                grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                                ticks: {
                                    stepSize: 20,
                                    color: '#94a3b8',
                                    callback: function(value) { return value + "%" }
                                }
                            },
                            x: { grid: { color: 'rgba(255,255,255,0.02)', drawBorder: false }, ticks: { display:false } }
                        }
                    }
                });
            }
        }
    };

    const renderSpreadsheet = () => {
        const grid = document.getElementById('habits-spreadsheet-grid');
        if (!grid) return;
        
        let filteredHabits = window.habits;
        if (currentCategory !== 'all') {
            filteredHabits = window.habits.filter(h => h.category === currentCategory);
        }

        if (filteredHabits.length === 0) {
            grid.innerHTML = '<div style="color:var(--text-muted); padding:20px;">No habits found.</div>';
            return;
        }

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
        const weekColors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#f472b6', '#10b981', '#f59e0b'];
        
        let html = '<table class="qp-grid-table">';
        
        // Header Row: Weeks
        html += '<tr><th><div style="font-size:14px; font-weight:700; color:#fff; text-align:left; padding-bottom:10px;">My Habits</div></th>';
        
        let currentWeek = 0;
        let daysInCurrentWeek = 0;
        
        for (let d = 1; d <= daysInMonth; d++) {
            daysInCurrentWeek++;
            if (daysInCurrentWeek === 7 || d === daysInMonth) {
                const bg = weekColors[currentWeek % weekColors.length];
                html += <th colspan=" + daysInCurrentWeek + " style="background: + bg + ;"><div class="qp-week-header">Week  + (currentWeek + 1) + </div></th>;
                currentWeek++;
                daysInCurrentWeek = 0;
            }
        }
        html += '</tr>';
        
        // Header Row: Days
        html += '<tr><th></th>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const dayName = dayNames[dateObj.getDay()];
            html += <th><div class="qp-day-header"> + dayName + <br> + d + </div></th>;
        }
        html += '</tr>';
        
        // Data Rows: Habits
        filteredHabits.forEach(habit => {
            html += <tr><td><div class="qp-habit-name"> + habit.name + </div></td>;
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = new Date(year, month, d).toISOString().split('T')[0];
                const isChecked = window.habitLogs[dateStr] && window.habitLogs[dateStr].includes(habit.id);
                const checkClass = isChecked ? 'checked' : '';
                html += <td><div class="qp-cell-cb  + checkClass + " onclick="window.toggleHabit(' + habit.id + ', ' + dateStr + ')"></div></td>;
            }
            html += '</tr>';
        });
        
        // Footer: Progress
        html += '<tr style="height:10px;"></tr>';
        html += '<tr class="qp-footer-row"><td class="qp-footer-label">Progress</td>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = new Date(year, month, d).toISOString().split('T')[0];
            const logs = window.habitLogs[dateStr] || [];
            const total = window.habits.length || 1;
            const progress = Math.round((logs.length / total) * 100);
            html += <td> + progress + %</td>;
        }
        html += '</tr>';
        
        // Footer: Done
        html += '<tr class="qp-footer-row"><td class="qp-footer-label">Done</td>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = new Date(year, month, d).toISOString().split('T')[0];
            const count = (window.habitLogs[dateStr] || []).length;
            html += <td> + count + </td>;
        }
        html += '</tr>';
        
        // Footer: Not Done
        html += '<tr class="qp-footer-row"><td class="qp-footer-label">Not Done</td>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = new Date(year, month, d).toISOString().split('T')[0];
            const count = (window.habitLogs[dateStr] || []).length;
            const notDone = window.habits.length - count;
            html += <td> + notDone + </td>;
        }
        html += '</tr>';
        
        html += '</table>';
        grid.innerHTML = html;
        
        updateStats(); // Make sure to call this to sync other charts
    };

    const startIdx = $content.IndexOf('    const renderSpreadsheet = () => {')
    const endIdx = $content.IndexOf('        const updateStats = () => {')

    if (startIdx -ge 0 -and endIdx -ge 0) {
         = $content.Substring(0, startIdx) +  + "
" + $content.Substring(endIdx)
        [System.IO.File]::WriteAllText(C:\Users\61fur\.gemini\antigravity-ide\scratch\habit-tracker\habits.js, )
        Write-Output "Successfully replaced renderSpreadsheet logic!"
    } else {
        Write-Output "Failed to find indices!"
    }
        const updateStats = () => {
            if (analysisList) analysisList.innerHTML = '';
            const topHabitsList = document.getElementById('top-habits-list');
            if (topHabitsList) topHabitsList.innerHTML = '';
            let topHabits = [];

            state.habits.forEach((habit, i) => {
                let habitCompletions = 0;
                for(let d = 1; d <= numDays; d++) {
                    const dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
                    if((state.habitLogs[dateStr] || []).some(id => String(id) === String(habit.id))) habitCompletions++;
                }
                const percent = Math.round((habitCompletions / numDays) * 100);
                const barColor = analysisColors[i % analysisColors.length];
                
                if (analysisList) {
                    analysisList.innerHTML += `
                        <div class="analysis-item">
                            <span style="width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--text-muted); font-size:11px;">${habit.name}</span>
                            <div class="analysis-bar-bg" style="background:transparent;">
                                <div class="analysis-bar-fill" style="width: ${percent}%; background:${barColor}; box-shadow:none;"></div>
                            </div>
                            <span style="width:40px; text-align:right; color:#fff; font-size:11px;">${percent}%</span>
                        </div>
                    `;
                }
                
                topHabits.push({ name: habit.name, score: habitCompletions, percent: percent });
            });
            
            if (topHabitsList) {
                topHabits.sort((a,b) => b.score - a.score);
                topHabits.slice(0, 10).forEach((th, idx) => {
                    topHabitsList.innerHTML += `
                        <tr>
                            <td style="border:none; border-bottom:1px solid rgba(255,255,255,0.05); font-size:12px; font-weight:700; color:var(--text-muted); width:20px; padding-left:10px;">${idx+1}</td>
                            <td style="border:none; border-bottom:1px solid rgba(255,255,255,0.05); font-size:12px; font-weight:600; color:#fff; text-align:left; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${th.name}</td>
                            <td style="border:none; border-bottom:1px solid rgba(255,255,255,0.05); font-size:12px; font-weight:800; color:var(--accent); width:40px; padding-right:10px;">${th.percent}%</td>
                        </tr>
                    `;
                });
            }

            let progressRow = '<tr><td class="habit-name-cell" style="font-size:11px; color:var(--text-muted);">' + window.t('progress') + '</td>';
            let doneRow = '<tr><td class="habit-name-cell" style="font-size:11px; color:var(--text-muted);">' + window.t('done') + '</td>';
            let notDoneRow = '<tr><td class="habit-name-cell" style="font-size:11px; color:var(--text-muted);">' + window.t('not_done') + '</td>';
            
            for(let d = 1; d <= numDays; d++) {
                const dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
                const doneCount = state.habits.filter(h => (state.habitLogs[dateStr] || []).some(id => String(id) === String(h.id))).length;
                const total = state.habits.length;
                const notDoneCount = total - doneCount;
                const p = total === 0 ? 0 : Math.round((doneCount / total) * 100);
                
                const wClass = weekClasses[d];
                progressRow += '<td class="qp-col-' + wClass + '" style="font-size:10px; color:var(--text-main); padding:10px 0;">' + p + '%</td>';
                doneRow += '<td class="qp-col-' + wClass + '" style="font-size:11px; color:var(--text-main); font-weight:600; padding:10px 0;">' + doneCount + '</td>';
                notDoneRow += '<td class="qp-col-' + wClass + '" style="font-size:11px; color:var(--text-muted); padding:10px 0;">' + notDoneCount + '</td>';
            }
            if (tFoot) tFoot.innerHTML = progressRow + '</tr>' + doneRow + '</tr>' + notDoneRow + '</tr>';
            
            // Update Top Stats for Today
            const today = new Date();
            const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            const todayTotal = state.habits.length;
            const todayDone = state.habits.filter(h => (state.habitLogs[todayStr] || []).some(id => String(id) === String(h.id))).length;
            const todayProgress = todayTotal === 0 ? 0 : Math.round((todayDone / todayTotal) * 100);
            
            const elTotal = document.getElementById('stat-total-habits');
            const elCompleted = document.getElementById('stat-completed-habits');
            const elProgText = document.getElementById('stat-progress-text');
            const elProgBar = document.getElementById('stat-progress-bar');
            
            if (elTotal) elTotal.innerText = todayTotal;
            if (elCompleted) elCompleted.innerText = todayDone;
            if (elProgText) elProgText.innerText = todayProgress + '%';
            if (elProgBar) elProgBar.style.width = todayProgress + '%';
        };

        // Initial call to populate stats
        updateStats();
        
        // MENTAL STATE GRID
        const mWeeksRow = document.getElementById('mental-table-weeks');
        const mDayNamesRow = document.getElementById('mental-table-day-names');
        const mDayNumsRow = document.getElementById('mental-table-day-nums');
        const mBody = document.getElementById('mental-table-body');
        const mFoot = document.getElementById('mental-table-foot');
        const mAnalysisList = document.getElementById('mental-analysis-list');

        mWeeksRow.innerHTML = '<th rowspan="3" class="habit-name-cell table-main-header" style="vertical-align:top; padding-top:20px;">' + window.t('mental_state') + '</th>' + weekColsHTML;
        mDayNamesRow.innerHTML = dayHeadersHTML;
        mDayNumsRow.innerHTML = dayNumsHTML;
        
        mBody.innerHTML = '';
        
        let moodTr = document.createElement('tr');
        let motTr = document.createElement('tr');
        
        moodTr.innerHTML = '<td class="habit-name-cell" style="font-size:12px; color:var(--text-muted);">' + window.t('mood') + '</td>';
        motTr.innerHTML = '<td class="habit-name-cell" style="font-size:12px; color:var(--text-muted);">' + window.t('motivation') + '</td>';
        
        let totalMood = 0; let countMood = 0;
        let totalMot = 0; let countMot = 0;

        for(let d = 1; d <= numDays; d++) {
            const wClass = weekClasses[d];
            const dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            const log = state.mentalLogs[dateStr] || {mood: '', motivation: ''};
            
            if(log.mood !== '') { totalMood += parseInt(log.mood); countMood++; }
            if(log.motivation !== '') { totalMot += parseInt(log.motivation); countMot++; }

            const moodVal = log.mood === '' ? '' : window.getEmojiForScore(log.mood);
            const mTd = document.createElement('td');
            mTd.className = 'qp-col-' + wClass;
            mTd.innerHTML = `<div class="mental-cell" data-type="mood" data-date="${dateStr}" style="cursor:pointer; font-size:16px; text-align:center; filter: grayscale(0%);">${moodVal}</div>`;
            moodTr.appendChild(mTd);
            
            const motVal = log.motivation === '' ? '' : window.getEmojiForScore(log.motivation);
            const motTd = document.createElement('td');
            motTd.className = 'qp-col-' + wClass;
            motTd.innerHTML = `<div class="mental-cell" data-type="motivation" data-date="${dateStr}" style="cursor:pointer; font-size:16px; text-align:center; filter: grayscale(0%);">${motVal}</div>`;
            motTr.appendChild(motTd);
        }
        
        mBody.appendChild(moodTr);
        mBody.appendChild(motTr);
        
        // Mental State Score Foot
        let mScoreTr = '<tr><td class="habit-name-cell" style="font-size:12px; color:var(--text-muted);">' + window.t('score') + '</td>';
        for(let d = 1; d <= numDays; d++) {
            const wClass = weekClasses[d];
            const dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            const log = state.mentalLogs[dateStr] || {mood: '', motivation: ''};
            
            let mScore = '';
            if(log.mood !== '' && log.motivation !== '') {
                mScore = Math.round(((parseInt(log.mood) + parseInt(log.motivation)) / 20) * 100) + '%';
            }
            mScoreTr += `<td class="qp-col-${wClass}" style="font-size:10px; color:var(--text-main); padding:10px 0;">${mScore}</td>`;
        }
        mFoot.innerHTML = mScoreTr + '</tr>';
        
        // Mental State Analysis Side panel
        mAnalysisList.innerHTML = '';
        
        let mNames = [window.t('mood'), window.t('motivation')];
        let mCounts = [countMood > 0 ? (totalMood/countMood)*10 : 0, countMot > 0 ? (totalMot/countMot)*10 : 0];
        let mColors = [window.getTheme().accent, window.getTheme().textMuted]; // Match chart colors

        for(let i=0; i<2; i++) {
            const percent = Math.round(mCounts[i]);
            mAnalysisList.innerHTML += `
                <div style="margin-bottom:15px; display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--accent-light);">
                        <span>${mNames[i]}</span>
                    </div>
                    <div class="analysis-item" style="margin-bottom:0;">
                        <span style="width:120px; color:var(--text-muted); font-size:11px;">Avg</span>
                        <div class="analysis-bar-bg" style="background:transparent;">
                            <div class="analysis-bar-fill" style="width: ${percent}%; background:${mColors[i]}; box-shadow:none;"></div>
                        </div>
                        <span style="width:40px; text-align:right; color:#fff; font-size:11px;">${percent}%</span>
                    </div>
                </div>
            `;
        }

        // AI Insight Box
        const avgMotivation = Math.round(mCounts[1]);
        let insightMsg = "Keep tracking your mental state to unlock insights.";
        if (countMot > 0) {
            if (avgMotivation >= 80) insightMsg = "Awesome! Your motivation is peaking. Keep riding this wave!";
            else if (avgMotivation >= 50) insightMsg = "You're doing okay, but there's room to boost your energy.";
            else insightMsg = "Take it easy. It's okay to have low days. Focus on small wins.";
        }
        
        mAnalysisList.innerHTML += `
            <div style="margin-top: 20px; padding: 15px; background: rgba(0,242,254,0.1); border-left: 3px solid #00f2fe; border-radius: 8px;">
                <div style="font-size: 11px; color: #00f2fe; font-weight: 700; text-transform: uppercase; margin-bottom: 5px; display:flex; align-items:center; gap:5px;">
                    <span>✨</span> AI Insight
                </div>
                <div style="font-size: 12px; color: #fff; line-height: 1.4;">
                    ${insightMsg}
                </div>
            </div>
        `;

        // Attach listeners for mental cells
        document.querySelectorAll('.mental-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const dateStr = e.currentTarget.getAttribute('data-date');
                const type = e.currentTarget.getAttribute('data-type');
                window.openMentalModal(dateStr, type);
            });
        });
        
        updateTopBar();
        renderCharts();
    };

    window.addEventListener('themeChanged', () => {
        if(habitTrendChart) habitTrendChart.destroy();
        if(mentalChart) mentalChart.destroy();
        habitTrendChart = null;
        mentalChart = null;
        renderCharts();
        
        // Also update heatmap colors
        const cells = document.querySelectorAll('.cb-cell.checked');
    });

    const catFilter = document.getElementById('habit-category-filter');
    if(catFilter) {
        catFilter.addEventListener('change', () => {
            renderSpreadsheet();
        });
    }

    renderSpreadsheet();

    // Emoji Picker Logic for new habit
    const emojis = ['🏆', '🏃', '💪', '🧘', '🛌', '💧', '🥗', '📚', '🧠', '💼', '🎨', '🎸', '💻', '💸', '🧹'];
    const emojiContainer = document.getElementById('emoji-picker-index');
    const emojiInput = document.getElementById('habit-emoji');
    
    if (emojiContainer && emojiInput) {
        emojiContainer.innerHTML = emojis.map(e => `
            <div class="emoji-option" style="font-size: 20px; cursor: pointer; padding: 4px; border-radius: 8px; transition: transform 0.2s, background 0.2s; ${e === emojiInput.value ? 'background: rgba(255,255,255,0.2); transform: scale(1.1);' : ''}" data-emoji="${e}">
                ${e}
            </div>
        `).join('');
        
        emojiContainer.addEventListener('click', (e) => {
            const el = e.target.closest('.emoji-option');
            if (!el) return;
            const em = el.getAttribute('data-emoji');
            emojiInput.value = em;
            
            // update selection UI
            emojiContainer.querySelectorAll('.emoji-option').forEach(opt => {
                opt.style.background = 'transparent';
                opt.style.transform = 'scale(1)';
            });
            el.style.background = 'rgba(255,255,255,0.2)';
            el.style.transform = 'scale(1.1)';
        });
    }

    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
        habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const categoryVal = document.getElementById('habit-category') ? document.getElementById('habit-category').value : 'other';
            const emojiVal = document.getElementById('habit-emoji') ? document.getElementById('habit-emoji').value : '📝';
            const editId = document.getElementById('edit-habit-id') ? document.getElementById('edit-habit-id').value : '';
            
            if (editId) {
                const habit = state.habits.find(h => h.id === editId);
                if (habit) {
                    habit.name = document.getElementById('habit-name').value;
                    habit.category = categoryVal;
                    habit.emoji = emojiVal;
                }
            } else {
                state.habits.push({ 
                    id: Date.now().toString(), 
                    name: document.getElementById('habit-name').value,
                    category: categoryVal,
                    emoji: emojiVal
                });
            }
            saveState();
            renderSpreadsheet();
            updateTopBar();
            closeModal('habit-modal');
            habitForm.reset();
            if (document.getElementById('edit-habit-id')) document.getElementById('edit-habit-id').value = '';
        });
    }

    let isEditMode = false;
    let habitsSortable = null;
    
    const toggleEditMode = () => {
        isEditMode = !isEditMode;
        const btn = document.getElementById('reorder-habits-btn');
        if (btn) {
            if (isEditMode) {
                btn.classList.remove('qp-btn-cancel');
                btn.classList.add('qp-btn');
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Bitti`;
            } else {
                btn.classList.add('qp-btn-cancel');
                btn.classList.remove('qp-btn');
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg> Düzenle`;
            }
        }
        
        const tableBody = document.getElementById('table-body');
        if (tableBody) {
            Array.from(tableBody.children).forEach(tr => {
                if (isEditMode) {
                    tr.style.cursor = 'grab';
                    tr.classList.add('edit-mode');
                } else {
                    tr.style.cursor = 'default';
                    tr.classList.remove('edit-mode');
                }
            });
            
            if (habitsSortable) {
                habitsSortable.option('disabled', !isEditMode);
            }
        }
    };

    const reorderBtn = document.getElementById('reorder-habits-btn');
    if (reorderBtn) {
        reorderBtn.addEventListener('click', toggleEditMode);
    }

    // SortableJS Logic for Habits Table
    const tableBody = document.getElementById('table-body');
    if (tableBody && window.Sortable) {
        habitsSortable = Sortable.create(tableBody, {
            animation: 150,
            delay: 100,
            delayOnTouchOnly: true,
            scroll: true,
            scrollSensitivity: 100,
            scrollSpeed: 20,
            disabled: !isEditMode, // only enable if in edit mode
            onEnd: function (evt) {
                const newIds = Array.from(tableBody.children).map(tr => tr.getAttribute('data-id')).filter(Boolean);
                
                // Map current view to state
                const habitMap = {};
                state.habits.forEach(h => habitMap[h.id] = h);
                
                let newHabits = [];
                newIds.forEach(nid => {
                    if (habitMap[nid]) {
                        newHabits.push(habitMap[nid]);
                        delete habitMap[nid];
                    }
                });
                
                // Add any remaining habits that weren't in the view (e.g. filtered)
                Object.values(habitMap).forEach(h => newHabits.push(h));
                
                state.habits = newHabits;
                saveState();
            }
        });
    }


});

window.getEmojiForScore = (v) => {
    v = parseInt(v);
    if(isNaN(v)) return '';
    if(v <= 2) return '😫';
    if(v <= 4) return '😕';
    if(v <= 6) return '😐';
    if(v <= 8) return '🙂';
    return '🤩';
};

let activeMentalDate = null;
let activeMentalType = null;

window.openMentalModal = (dateStr, type) => {
    activeMentalDate = dateStr;
    activeMentalType = type;
    const modal = document.getElementById('mental-modal');
    const title = document.getElementById('mental-modal-title');
    title.innerText = (type === 'mood' ? window.t('mood') : window.t('motivation')) + ' - ' + dateStr;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.style.opacity = '1', 10);
};

window.closeMentalModal = () => {
    const modal = document.getElementById('mental-modal');
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 200);
    activeMentalDate = null;
    activeMentalType = null;
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.m-emoji').forEach(em => {
        em.addEventListener('click', (e) => {
            if(!activeMentalDate || !activeMentalType) return;
            const val = e.currentTarget.getAttribute('data-val');
            
            if(!window.state.mentalLogs) window.state.mentalLogs = {};
            if(!window.state.mentalLogs[activeMentalDate]) window.state.mentalLogs[activeMentalDate] = { mood:'', motivation:'' };
            window.state.mentalLogs[activeMentalDate][activeMentalType] = val;
            
            if(window.saveState) window.saveState();
            window.location.reload(); // Quickest way to re-render properly since state is scoped
        });
    });
});

window.shareCard = () => {
    if (!window.html2canvas) {
        alert("Loading exporter, please try again in a second...");
        return;
    }
    
    // Briefly adjust styles for a better export (e.g. background to capture)
    const target = document.querySelector('.app-container');
    const oldBg = target.style.background;
    
    // Add a solid background if currently transparent
    const computedStyle = getComputedStyle(document.body);
    target.style.background = computedStyle.getPropertyValue('--bg-color');
    
    html2canvas(target, {
        scale: 2, // High resolution
        backgroundColor: computedStyle.getPropertyValue('--bg-color'),
        useCORS: true
    }).then(canvas => {
        // Restore styles
        target.style.background = oldBg;
        
        // Trigger download
        const link = document.createElement('a');
        link.download = 'habit-tracker-success.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error("Export failed: ", err);
        target.style.background = oldBg;
    });
};

    window.toggleHabit = (habitId, dateStr) => {
        if (!window.habitLogs[dateStr]) {
            window.habitLogs[dateStr] = [];
        }
        
        const index = window.habitLogs[dateStr].indexOf(habitId);
        if (index > -1) {
            window.habitLogs[dateStr].splice(index, 1);
        } else {
            window.habitLogs[dateStr].push(habitId);
        }
        
        if (window.saveState) window.saveState();
        renderSpreadsheet();
    };