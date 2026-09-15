document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    document.getElementById('study-date').value = today.toISOString().split('T')[0];

    let studyChart = null;

    const renderChart = (totalC, totalW) => {
        const ctx = document.getElementById('studyChart');
        if(!ctx) return;
        
        if(studyChart) studyChart.destroy();
        
        studyChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Correct', 'Wrong'],
                datasets: [{
                    data: [totalC, totalW],
                    backgroundColor: [window.getTheme().accent, window.getTheme().textMuted],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8' } }
                }
            }
        });
    };

    const renderStudy = () => {
        const tBody = document.getElementById('study-table-body');
        tBody.innerHTML = '';
        
        let totalC = 0;
        let totalW = 0;
        
        // Sort descending for list
        const sortedDesc = [...state.studies].sort((a,b) => new Date(b.date) - new Date(a.date));

        sortedDesc.forEach(s => {
            totalC += parseInt(s.correct);
            totalW += parseInt(s.wrong);
            
            const total = parseInt(s.correct) + parseInt(s.wrong);
            const percent = total === 0 ? 0 : Math.round((parseInt(s.correct) / total) * 100);
            
            tBody.innerHTML += `
                <tr>
                    <td style="text-align:left; padding-left:16px; color:#fff;">
                        <div style="font-weight:600;">${s.subject}</div>
                        <div style="font-size:11px; color:var(--text-muted);">${s.date}</div>
                    </td>
                    <td style="color:#38bdf8; font-weight:600;">${s.correct}</td>
                    <td style="color:#ef4444;">${s.wrong}</td>
                    <td>
                        <div class="progress-bar-container" style="width:60px; margin:0 auto;">
                            <div class="progress-bar-fill" style="width:${percent}%;"></div>
                        </div>
                        <div style="font-size:11px; margin-top:4px;">${percent}%</div>
                    </td>
                    <td>
                        <button class="study-delete" data-id="${s.id}" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:16px;">✕</button>
                    </td>
                </tr>
            `;
        });
        
        // Update avg
        const overallTotal = totalC + totalW;
        const overallPercent = overallTotal === 0 ? 0 : Math.round((totalC / overallTotal) * 100);
        
        if(document.getElementById('avg-success')) {
            document.getElementById('avg-success').innerText = overallPercent + '%';
        }

        document.querySelectorAll('.study-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                state.studies = state.studies.filter(x => x.id !== id);
                saveState(); renderStudy();
            });
        });

        renderChart(totalC, totalW);
    };

    renderStudy();

    document.getElementById('study-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        state.studies.push({
            id: Date.now().toString(),
            date: document.getElementById('study-date').value,
            subject: document.getElementById('study-subject').value,
            correct: document.getElementById('study-correct').value,
            wrong: document.getElementById('study-wrong').value
        });
        
        saveState(); 
        renderStudy();
        closeModal('study-modal');
        document.getElementById('study-form').reset();
        document.getElementById('study-date').value = today.toISOString().split('T')[0];
    });

    // Pomodoro Logic
    let pomodoroTimer = null;
    let focusDuration = parseInt(localStorage.getItem('qp_pomodoro_duration')) || 25;
    let breakDuration = parseInt(localStorage.getItem('qp_pomodoro_break')) || 5;
    
    const focusInput = document.getElementById('pomodoro-focus-input');
    const breakInput = document.getElementById('pomodoro-break-input');
    
    if (focusInput) focusInput.value = focusDuration;
    if (breakInput) breakInput.value = breakDuration;

    let timeRemaining = focusDuration * 60;
    let isRunning = false;
    let isFocus = true;

    const timeDisplay = document.getElementById('pomodoro-time');
    const btnStart = document.getElementById('pomodoro-start');
    const btnPause = document.getElementById('pomodoro-pause');
    const btnReset = document.getElementById('pomodoro-reset');
    const modeRadios = document.querySelectorAll('input[name="pomodoro-mode"]');
    
    // Init display
    if(timeDisplay) timeDisplay.innerText = `${focusDuration.toString().padStart(2, '0')}:00`;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const updateDurationsFromInputs = () => {
        if (focusInput) {
            focusDuration = parseInt(focusInput.value) || 25;
            localStorage.setItem('qp_pomodoro_duration', focusDuration);
        }
        if (breakInput) {
            breakDuration = parseInt(breakInput.value) || 5;
            localStorage.setItem('qp_pomodoro_break', breakDuration);
        }
    };

    if (focusInput) {
        focusInput.addEventListener('change', () => {
            updateDurationsFromInputs();
            if (isFocus && !isRunning) {
                timeRemaining = focusDuration * 60;
                timeDisplay.innerText = formatTime(timeRemaining);
            }
        });
    }

    if (breakInput) {
        breakInput.addEventListener('change', () => {
            updateDurationsFromInputs();
            if (!isFocus && !isRunning) {
                timeRemaining = breakDuration * 60;
                timeDisplay.innerText = formatTime(timeRemaining);
            }
        });
    }

    const updateDisplay = () => {
        if(timeDisplay) timeDisplay.innerText = formatTime(timeRemaining);
    };

    const setMode = () => {
        updateDurationsFromInputs();
        let val = 'focus';
        modeRadios.forEach(r => { if(r.checked) val = r.value; });
        isFocus = (val === 'focus');
        timeRemaining = (isFocus ? focusDuration : breakDuration) * 60;
        timeDisplay.innerText = formatTime(timeRemaining);
        timeDisplay.style.color = isFocus ? '#fff' : '#38bdf8';
        if(isRunning) {
            clearInterval(pomodoroTimer);
            isRunning = false;
            btnStart.disabled = false;
            btnPause.disabled = true;
        }
    };

    modeRadios.forEach(radio => radio.addEventListener('change', setMode));

    const startTimer = () => {
        if(isRunning) return;
        isRunning = true;
        btnStart.disabled = true;
        btnPause.disabled = false;
        
        pomodoroTimer = setInterval(() => {
            timeRemaining--;
            updateDisplay();
            
            if (timeRemaining <= 0) {
                pauseTimer();
                if(window.playSuccessSound) window.playSuccessSound();
                if (isFocus) {
                    if(window.addXp) window.addXp(25); // Award 25 XP for a focus block
                    if(window.confetti) window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
                    // Switch to break
                    document.querySelector('input[name="pomodoro-mode"][value="5"]').checked = true;
                } else {
                    // Switch to focus
                    document.querySelector('input[name="pomodoro-mode"][value="25"]').checked = true;
                }
                setMode();
            }
        }, 1000);
    };

    const pauseTimer = () => {
        isRunning = false;
        clearInterval(pomodoroTimer);
        btnStart.disabled = false;
        btnPause.disabled = true;
    };

    const resetTimer = () => {
        pauseTimer();
        setMode();
    };

    if(btnStart) btnStart.addEventListener('click', startTimer);
    if(btnPause) btnPause.addEventListener('click', pauseTimer);
    if(btnReset) btnReset.addEventListener('click', resetTimer);

    updateDisplay();
});
