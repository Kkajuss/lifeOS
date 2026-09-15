document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    
    const sliders = ['stress', 'energy', 'focus', 'confidence', 'social'];
    
    // Update labels on input
    sliders.forEach(key => {
        const el = document.getElementById(`slide-${key}`);
        if(el) {
            el.addEventListener('input', (e) => {
                document.getElementById(`val-${key}`).innerText = `${e.target.value} / 10`;
            });
        }
    });
    
    // Load today's data
    const t = window.today;
    const todayStr = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    
    if (!window.state.mentalLogs) window.state.mentalLogs = {};
    
    if (window.state.mentalLogs[todayStr]) {
        const data = window.state.mentalLogs[todayStr];
        sliders.forEach(key => {
            if(data[key]) {
                const el = document.getElementById(`slide-${key}`);
                if(el) {
                    el.value = data[key];
                    document.getElementById(`val-${key}`).innerText = `${data[key]} / 10`;
                }
            }
        });
    }
    
    window.saveMentalState = () => {
        const data = {};
        sliders.forEach(key => {
            const el = document.getElementById(`slide-${key}`);
            if(el) data[key] = parseInt(el.value);
        });
        
        window.state.mentalLogs[todayStr] = data;
        localStorage.setItem('qp_mentalLogs', JSON.stringify(window.state.mentalLogs));
        
        if (window.playSound) window.playSound('done');
        if (window.showConfetti) window.showConfetti();
        
        runAIAnalysis();
    };
    
    const runAIAnalysis = () => {
        const resEl = document.getElementById('correlation-results');
        if(!resEl) return;
        
        // Mock AI Correlation Logic
        // In a real app, this would send window.state.mentalLogs and window.state.sleep to an AI or run statistical correlation (Pearson)
        
        let insights = [];
        
        // Check sleep correlation
        let recentSleep = (window.state.sleep || []).find(s => s.date === todayStr);
        let sleepHours = recentSleep ? parseFloat(recentSleep.hours) : null;
        
        let todayEnergy = window.state.mentalLogs[todayStr] ? window.state.mentalLogs[todayStr].energy : null;
        let todayStress = window.state.mentalLogs[todayStr] ? window.state.mentalLogs[todayStr].stress : null;
        
        if (sleepHours !== null && todayEnergy !== null) {
            if (sleepHours < 6 && todayEnergy < 6) {
                insights.push("📉 **AI Insight:** Your energy drops significantly on days with less than 6 hours of sleep. Try to prioritize rest tonight.");
            } else if (sleepHours > 7 && todayEnergy >= 7) {
                insights.push("📈 **AI Insight:** Great job! Good sleep is correlating strongly with your high energy levels today.");
            }
        }
        
        if (todayStress !== null && todayStress >= 8) {
            insights.push("⚠️ **AI Alert:** Your stress levels are unusually high today. Consider taking a 5-minute breathing break or a short walk.");
        }
        
        if (insights.length === 0) {
            insights.push("ℹ️ **AI Note:** Need more data over the next few days to establish strong psychological correlations.");
        }
        
        resEl.innerHTML = insights.join('<br><br>');
    };
    
    runAIAnalysis();

    // --- Render Mental Grid Table ---
    const renderMentalGrid = () => {
        const gridEl = document.getElementById('mental-grid');
        if (!gridEl) return;
        
        const now = window.today || new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
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

        let mentalTbody = '';
        const mentalKeys = [
            { key: 'stress', label: 'Stress Level' },
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
                    <div style="width:50px; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                        <div style="width:${avgPct}%; height:100%; background:var(--accent-light);"></div>
                    </div>
                    <span>${avg} / 10</span>
                </div>
            </td></tr>`;
            mentalTbody += mRow;
        });
        
        gridEl.innerHTML = `<thead>${theadHtml}${daysRowHtml}</thead><tbody>${mentalTbody}</tbody>`;
    };

    renderMentalGrid();

    // Monkey-patch save function to also re-render grid
    const oldSave = window.saveMentalState;
    window.saveMentalState = () => {
        oldSave();
        renderMentalGrid();
    };
});
