document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    
    // We will store volume as { "Chest": { "2026-08": 15, "2026-07": 10 } }
    // But let's build it from window.state.fitnessLogs if we can, or just mock it if fitnessLogs format is different.
    // Currently, window.state.fitnessLogs is just a list of items per day.
    
    // Let's migrate to a more detailed fitness log if needed.
    if (!window.state.muscleVolume) {
        window.state.muscleVolume = {};
    }
    
    const getCurrentMonthKey = () => {
        const d = new Date(window.today);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    };
    
    const getLastMonthKey = () => {
        const d = new Date(window.today);
        d.setMonth(d.getMonth() - 1);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    };
    
    const renderMuscleMap = () => {
        const currentMonth = getCurrentMonthKey();
        
        document.querySelectorAll('.muscle-group').forEach(el => {
            const muscle = el.getAttribute('data-muscle');
            const volumeObj = window.state.muscleVolume[muscle] || {};
            const vol = volumeObj[currentMonth] || 0;
            
            // Remove old classes
            el.classList.remove('vol-low', 'vol-med', 'vol-high');
            
            // Add new classes based on volume
            if (vol === 0) {
                // default
            } else if (vol < 10) {
                el.classList.add('vol-low');
            } else if (vol < 20) {
                el.classList.add('vol-med');
            } else {
                el.classList.add('vol-high');
            }
            
            // Hover events
            el.addEventListener('mouseenter', () => {
                showMuscleStats(muscle);
            });
            el.addEventListener('click', () => {
                showMuscleStats(muscle);
                document.getElementById('log-muscle').value = muscle;
                openModal('workout-modal');
            });
        });
        
        calculateOverallStats();
    };
    
    const showMuscleStats = (muscle) => {
        document.getElementById('selected-muscle-name').innerText = muscle;
        
        const currentMonth = getCurrentMonthKey();
        const lastMonth = getLastMonthKey();
        
        const volumeObj = window.state.muscleVolume[muscle] || {};
        const curVol = volumeObj[currentMonth] || 0;
        const lastVol = volumeObj[lastMonth] || 0;
        
        document.getElementById('muscle-this-month').innerText = `${curVol} sets`;
        document.getElementById('muscle-last-month').innerText = `${lastVol} sets`;
        
        const trendEl = document.getElementById('muscle-trend');
        if (lastVol === 0) {
            trendEl.innerText = curVol > 0 ? '+100%' : '0%';
            trendEl.style.color = curVol > 0 ? '#10b981' : 'var(--text-muted)';
        } else {
            const diff = ((curVol - lastVol) / lastVol) * 100;
            trendEl.innerText = (diff > 0 ? '+' : '') + Math.round(diff) + '%';
            trendEl.style.color = diff >= 0 ? '#10b981' : '#ef4444';
        }
    };
    
    const calculateOverallStats = () => {
        // Calculate weekly total
        // We can just sum all volumes for simplicity in this demo
        const currentMonth = getCurrentMonthKey();
        let totalSets = 0;
        let push = 0, pull = 0, legs = 0;
        
        for (let m in window.state.muscleVolume) {
            let v = window.state.muscleVolume[m][currentMonth] || 0;
            totalSets += v;
            
            if (['Chest', 'Shoulders', 'Arms'].includes(m)) push += v;
            else if (['Lats', 'Forearms'].includes(m)) pull += v;
            else if (['Legs', 'Calves', 'Core'].includes(m)) legs += v;
        }
        
        document.getElementById('weekly-total-sets').innerText = totalSets;
        
        // PPL Distribution
        const totalPPL = push + pull + legs;
        if (totalPPL > 0) {
            document.getElementById('ppl-push').style.width = `${(push/totalPPL)*100}%`;
            document.getElementById('ppl-pull').style.width = `${(pull/totalPPL)*100}%`;
            document.getElementById('ppl-legs').style.width = `${(legs/totalPPL)*100}%`;
        }
        
        // Mock Recovery Score
        // High volume without sleep = bad recovery
        // Just mock it randomly based on sets for now
        let recovery = 100 - (totalSets * 0.5);
        if (recovery < 0) recovery = 0;
        const recEl = document.getElementById('recovery-score');
        recEl.innerText = `${Math.round(recovery)}%`;
        recEl.style.color = recovery > 70 ? '#10b981' : (recovery > 40 ? '#f59e0b' : '#ef4444');
    };
    
    window.saveWorkout = (isAdding) => {
        const muscle = document.getElementById('log-muscle').value;
        let sets = parseInt(document.getElementById('log-sets').value) || 0;
        
        if (sets <= 0) return;
        
        // If removing, negate the sets
        if (!isAdding) sets = -sets;
        
        const currentMonth = getCurrentMonthKey();
        
        if (!window.state.muscleVolume[muscle]) {
            window.state.muscleVolume[muscle] = {};
        }
        if (!window.state.muscleVolume[muscle][currentMonth]) {
            window.state.muscleVolume[muscle][currentMonth] = 0;
        }
        
        window.state.muscleVolume[muscle][currentMonth] += sets;
        
        // Don't let it go below 0
        if (window.state.muscleVolume[muscle][currentMonth] < 0) {
            window.state.muscleVolume[muscle][currentMonth] = 0;
        }
        
        // Also log to fitnessLogs for the Life Score
        const t = window.today;
        const todayStr = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
        if (!window.state.fitnessLogs[todayStr]) window.state.fitnessLogs[todayStr] = [];
        
        // Push a log entry (negative sets means removed)
        window.state.fitnessLogs[todayStr].push({ muscle, sets });
        
        localStorage.setItem('qp_muscleVolume', JSON.stringify(window.state.muscleVolume));
        localStorage.setItem('qp_fitness', JSON.stringify(window.state.fitnessLogs));
        
        if (isAdding && window.playSound) window.playSound('done');
        if (isAdding && window.showConfetti) window.showConfetti();
        
        closeModal('workout-modal');
        renderMuscleMap();
        showMuscleStats(muscle);
    };
    
    // Init local state variable if not loaded
    if (!window.state.muscleVolume) {
        window.state.muscleVolume = safeParse('qp_muscleVolume', {});
    }
    
    // Load Daily Program
    const t = window.today;
    const todayStr = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    
    if (!window.state.fitnessLogs[todayStr]) {
        window.state.fitnessLogs[todayStr] = [];
    }
    
    const dailyProgInput = document.getElementById('daily-program-input');
    const dailyProgDone = document.getElementById('daily-program-done');
    
    const dailyData = window.state.fitnessLogs[todayStr].find(x => x.type === 'daily_program');
    if (dailyData) {
        if(dailyProgInput) dailyProgInput.value = dailyData.name || '';
        if(dailyProgDone) dailyProgDone.checked = dailyData.done || false;
    }
    
    window.saveDailyProgram = () => {
        const name = dailyProgInput ? dailyProgInput.value : '';
        const done = dailyProgDone ? dailyProgDone.checked : false;
        
        let logs = window.state.fitnessLogs[todayStr];
        let idx = logs.findIndex(x => x.type === 'daily_program');
        
        if (idx !== -1) {
            logs[idx].name = name;
            logs[idx].done = done;
        } else {
            logs.push({ type: 'daily_program', name: name, done: done });
        }
        
        localStorage.setItem('qp_fitness', JSON.stringify(window.state.fitnessLogs));
        
        if (done && window.playSound) window.playSound('done');
    };
    
    renderMuscleMap();
});

window.parseSmartWorkout = () => {
    const text = document.getElementById('smart-workout-input').value;
    if (!text) return;
    
    const lines = text.split('\n');
    let parsedSets = [];
    
    // Simple NLP / Regex heuristics
    const muscleMap = {
        'bench': 'Chest', 'chest': 'Chest', 'pushup': 'Chest', 'fly': 'Chest',
        'squat': 'Legs', 'leg': 'Legs', 'quad': 'Legs', 'hamstring': 'Legs',
        'deadlift': 'Core', 'abs': 'Core', 'core': 'Core', 'crunch': 'Core',
        'pull': 'Lats', 'row': 'Lats', 'back': 'Lats', 'lat': 'Lats',
        'shoulder': 'Shoulders', 'press': 'Shoulders', 'lateral': 'Shoulders',
        'bicep': 'Arms', 'tricep': 'Arms', 'curl': 'Arms', 'arm': 'Arms',
        'calf': 'Calves', 'calves': 'Calves',
        'forearm': 'Forearms', 'grip': 'Forearms',
        'neck': 'Neck'
    };
    
    lines.forEach(line => {
        const lower = line.toLowerCase();
        let matchedMuscle = null;
        for (const [key, val] of Object.entries(muscleMap)) {
            if (lower.includes(key)) { matchedMuscle = val; break; }
        }
        
        let sets = 3; // default
        const setMatch = lower.match(/(\d+)\s*(x|\*|sets of)\s*\d+/);
        if (setMatch) sets = parseInt(setMatch[1]);
        else if (lower.match(/(\d+)\s*sets/)) sets = parseInt(lower.match(/(\d+)\s*sets/)[1]);
        
        let weight = null;
        const weightMatch = lower.match(/(\d+)\s*(kg|lbs)/);
        if (weightMatch) weight = parseInt(weightMatch[1]);
        
        if (matchedMuscle) {
            parsedSets.push({ muscle: matchedMuscle, sets, weight, original: line });
        }
    });
    
    const resultsDiv = document.getElementById('smart-log-results');
    
    if (parsedSets.length === 0) {
        resultsDiv.innerHTML = '<div style="color:#ef4444; font-size:13px;">Could not parse any muscle groups. Try writing like: "Bench Press 4x10 100kg"</div>';
        return;
    }
    
    const todayStr = new Date().toISOString().split('T')[0];
    if (!window.state.fitnessLogs[todayStr]) window.state.fitnessLogs[todayStr] = [];
    
    parsedSets.forEach(s => {
        window.state.fitnessLogs[todayStr].push({
            muscle: s.muscle,
            sets: s.sets,
            weight: s.weight
        });
    });
    
    localStorage.setItem('qp_fitness', JSON.stringify(window.state.fitnessLogs));
    renderMuscleMap();
    
    let html = '<div style="color:#10b981; font-size:14px; margin-bottom:10px;">Successfully logged:</div>';
    parsedSets.forEach(s => {
        html += `<div style="font-size:13px; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:5px; margin-bottom:5px; border-radius:5px;">&check; ${s.muscle} - ${s.sets} sets ${s.weight ? '('+s.weight+'kg)' : ''}</div>`;
    });
    resultsDiv.innerHTML = html;
    document.getElementById('smart-workout-input').value = '';
    if (window.playSound) window.playSound('success');
};



// --- AGIRSAGLAM EXERCISE DATABASE ---
const exerciseDB = [
    {
        id: "bench_press",
        name: "Barbell Bench Press",
        primary: ["Chest"],
        secondary: ["Front Deltoids", "Triceps"],
        stabilizers: ["Core", "Lats"],
        desc: "A compound movement that targets the chest. Lie on a flat bench, grip the bar slightly wider than shoulder-width, lower it to your mid-chest, and press back up.",
        tips: ["Keep your feet planted firmly.", "Squeeze your shoulder blades together.", "Don't flare your elbows out too much (keep them at roughly a 45-degree angle)."]
    },
    {
        id: "squat",
        name: "Barbell Squat",
        primary: ["Quads", "Glutes"],
        secondary: ["Hamstrings", "Calves", "Lower Back"],
        stabilizers: ["Core"],
        desc: "The king of leg exercises. Rest the barbell on your upper back, keep your chest up, and squat down as if sitting in a chair until your thighs are parallel to the floor.",
        tips: ["Keep your chest up and core tight.", "Drive through your heels.", "Don't let your knees cave inwards."]
    },
    {
        id: "deadlift",
        name: "Conventional Deadlift",
        primary: ["Hamstrings", "Glutes", "Lower Back"],
        secondary: ["Quads", "Traps", "Forearms"],
        stabilizers: ["Core", "Lats"],
        desc: "A powerful full-body movement. Stand with mid-foot under the bar, bend over and grab it, bend knees until shins touch the bar, lift your chest, and pull.",
        tips: ["Keep your back neutral (don't round it).", "Keep the bar as close to your body as possible.", "Engage your lats before pulling."]
    },
    {
        id: "pullup",
        name: "Pull-ups",
        primary: ["Lats"],
        secondary: ["Biceps", "Rear Deltoids", "Forearms"],
        stabilizers: ["Core", "Lower Back"],
        desc: "A foundational upper-back exercise. Hang from a bar with an overhand grip, pull yourself up until your chin clears the bar, and lower yourself under control.",
        tips: ["Initiate the pull with your lats, not your biceps.", "Don't swing (minimize kipping).", "Squeeze your shoulder blades together at the top."]
    },
    {
        id: "ohp",
        name: "Overhead Press",
        primary: ["Front Deltoids"],
        secondary: ["Triceps", "Upper Chest"],
        stabilizers: ["Core", "Lower Back", "Glutes"],
        desc: "Press a barbell or dumbbells overhead from shoulder level until your arms are fully locked out.",
        tips: ["Squeeze your glutes and brace your core.", "Don't lean too far back.", "Push your head through the 'window' of your arms at the top."]
    }
];

window.selectExercise = function(id) {
    if(!id) {
        document.getElementById('exercise-details').style.display = 'none';
        resetAnatomyMap();
        return;
    }
    
    const ex = exerciseDB.find(e => e.id === id);
    if(!ex) return;
    
    // Update Details Panel
    document.getElementById('exercise-details').style.display = 'block';
    document.getElementById('ex-title').innerText = ex.name;
    document.getElementById('ex-desc').innerText = ex.desc;
    const tipsHtml = ex.tips.map(t => '<li>' + t + '</li>').join('');
    document.getElementById('ex-tips').innerHTML = tipsHtml;
    
    // Update SVG Map Colors
    applyExerciseColors(ex);
};

function resetAnatomyMap() {
    document.querySelectorAll('.muscle-group').forEach(el => {
        el.style.fill = 'rgba(255,255,255,0.05)';
        el.style.stroke = 'rgba(255,255,255,0.1)';
        el.style.filter = 'none';
    });
}

function applyExerciseColors(ex) {
    resetAnatomyMap();
    
    document.querySelectorAll('.muscle-group').forEach(el => {
        const muscle = el.getAttribute('data-muscle');
        if(!muscle) return;
        
        if (ex.primary.includes(muscle)) {
            // Target (Red)
            el.style.fill = '#dc2626';
            el.style.stroke = '#fff';
            el.style.filter = 'drop-shadow(0 0 5px rgba(220,38,38,0.8))';
        } else if (ex.secondary.includes(muscle)) {
            // Synergist (Orange)
            el.style.fill = '#f59e0b';
            el.style.stroke = 'rgba(255,255,255,0.5)';
        } else if (ex.stabilizers.includes(muscle)) {
            // Stabilizer (Blue)
            el.style.fill = '#3b82f6';
            el.style.stroke = 'rgba(255,255,255,0.3)';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Populate the dropdown
    const select = document.getElementById('exercise-select');
    if(select) {
        exerciseDB.forEach(ex => {
            const opt = document.createElement('option');
            opt.value = ex.id;
            opt.innerText = ex.name;
            select.appendChild(opt);
        });
    }
    
    // Initial map reset
    resetAnatomyMap();
});
