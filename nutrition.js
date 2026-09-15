document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    
    // Ensure state structures
    if (!state.nutritionLogs) state.nutritionLogs = {};
    if (!state.macroGoals) state.macroGoals = { cal: 2500, pro: 150, fat: 80, carb: 250 };
    if (!state.nutritionMeta) state.nutritionMeta = {}; // for water and weight
    
    const t = window.today;
    const todayStr = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    
    const renderMacros = () => {
        let currentCal = 0, currentPro = 0, currentCarb = 0, currentFat = 0;
        
        const todayMeals = state.nutritionLogs[todayStr] || [];
        todayMeals.forEach(m => {
            currentCal += parseFloat(m.cal) || 0;
            currentPro += parseFloat(m.pro) || 0;
            currentCarb += parseFloat(m.carb) || 0;
            currentFat += parseFloat(m.fat) || 0;
        });
        
        const goals = state.macroGoals;
        
        document.getElementById('macro-cal').innerText = `${Math.round(currentCal)} / ${goals.cal}`;
        document.getElementById('macro-pro').innerText = `${Math.round(currentPro)} / ${goals.pro}`;
        document.getElementById('macro-carb').innerText = `${Math.round(currentCarb)} / ${goals.carb}`;
        document.getElementById('macro-fat').innerText = `${Math.round(currentFat)} / ${goals.fat}`;
        
        document.getElementById('prog-cal').style.width = `${Math.min(100, (currentCal/goals.cal)*100)}%`;
        document.getElementById('prog-pro').style.width = `${Math.min(100, (currentPro/goals.pro)*100)}%`;
        document.getElementById('prog-carb').style.width = `${Math.min(100, (currentCarb/goals.carb)*100)}%`;
        document.getElementById('prog-fat').style.width = `${Math.min(100, (currentFat/goals.fat)*100)}%`;
        
        renderMeals();
        renderMeta();
    };
    
    const renderMeals = () => {
        const list = document.getElementById('meals-list');
        const todayMeals = state.nutritionLogs[todayStr] || [];
        
        if (todayMeals.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 14px;">No meals logged today yet.</div>`;
            return;
        }
        
        list.innerHTML = '';
        todayMeals.forEach((m, idx) => {
            list.innerHTML += `
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:600; color:#fff; font-size:15px;">${m.name}</div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${m.type} • ${m.cal} kcal</div>
                    </div>
                    <div style="display:flex; gap:10px; font-size:12px; font-weight:600; align-items:center;">
                        <span style="color:#ef4444;">${m.pro}p</span>
                        <span style="color:#3b82f6;">${m.carb}c</span>
                        <span style="color:#f59e0b;">${m.fat}f</span>
                        <button onclick="deleteMeal(${m.id})" style="background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.3); color:#ef4444; cursor:pointer; padding:4px 8px; border-radius:6px; margin-left: 10px; transition:all 0.2s;">Sil</button>
                    </div>
                </div>
            `;
        });
    };
    
    const renderMeta = () => {
        const meta = state.nutritionMeta[todayStr] || { water: 0, weight: null };
        document.getElementById('water-count').innerText = meta.water;
        
        // Find most recent weight
        let recentWeight = meta.weight;
        if (!recentWeight) {
            // scan backwards
            // for simplicity in demo, just show if exists
            // A real app would sort all keys and find the last entry
        }
        if (recentWeight) {
            document.getElementById('weight-display').innerText = `${recentWeight} kg`;
        }
    };
    
    window.saveMeal = () => {
        const type = document.getElementById('meal-type').value;
        const name = document.getElementById('meal-name').value || 'Meal';
        const cal = parseInt(document.getElementById('meal-cal').value) || 0;
        const pro = parseInt(document.getElementById('meal-pro').value) || 0;
        const carb = parseInt(document.getElementById('meal-carb').value) || 0;
        const fat = parseInt(document.getElementById('meal-fat').value) || 0;
        
        if (!state.nutritionLogs[todayStr]) state.nutritionLogs[todayStr] = [];
        
        state.nutritionLogs[todayStr].push({ id: Date.now(), type, name, cal, pro, carb, fat });
        localStorage.setItem('qp_nutrition', JSON.stringify(state.nutritionLogs));
        
        if (window.playSound) window.playSound('done');
        if (window.showConfetti) window.showConfetti();
        
        closeModal('meal-modal');
        // Reset form
        document.getElementById('meal-name').value = '';
        document.getElementById('meal-cal').value = '0';
        document.getElementById('meal-pro').value = '0';
        document.getElementById('meal-carb').value = '0';
        document.getElementById('meal-fat').value = '0';
        
        renderMacros();
    };
    
    window.addWater = (isAdding) => {
        if (!state.nutritionMeta[todayStr]) state.nutritionMeta[todayStr] = { water: 0, weight: null };
        
        if (isAdding) {
            state.nutritionMeta[todayStr].water = (state.nutritionMeta[todayStr].water || 0) + 1;
        } else {
            state.nutritionMeta[todayStr].water = Math.max(0, (state.nutritionMeta[todayStr].water || 0) - 1);
        }
        
        localStorage.setItem('qp_nutritionMeta', JSON.stringify(state.nutritionMeta));
        renderMeta();
    };
    
    window.deleteMeal = (id) => {
        if (!state.nutritionLogs[todayStr]) return;
        state.nutritionLogs[todayStr] = state.nutritionLogs[todayStr].filter(m => m.id !== id);
        localStorage.setItem('qp_nutrition', JSON.stringify(state.nutritionLogs));
        renderMacros();
    };
    
    window.saveWeight = () => {
        const w = parseFloat(document.getElementById('input-weight').value);
        if (w > 0) {
            if (!state.nutritionMeta[todayStr]) state.nutritionMeta[todayStr] = { water: 0, weight: null };
            state.nutritionMeta[todayStr].weight = w;
            localStorage.setItem('qp_nutritionMeta', JSON.stringify(state.nutritionMeta));
            document.getElementById('input-weight').value = '';
            renderMeta();
            if (window.playSound) window.playSound('done');
        }
    };
    
    // Init state parsing if needed
    if (!state.nutritionMeta) {
        state.nutritionMeta = safeParse('qp_nutritionMeta', {});
    }
    
    renderMacros();
});
