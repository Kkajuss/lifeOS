document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    document.getElementById('sleep-date').value = today.toISOString().split('T')[0];

    let sleepChart = null;

    const renderChart = () => {
        const ctx = document.getElementById('sleepChart');
        if(!ctx) return;
        
        if(sleepChart) sleepChart.destroy();
        
        // Sort data
        const sortedData = [...state.sleep].sort((a,b) => new Date(a.date) - new Date(b.date));
        
        const labels = sortedData.map(d => d.date);
        const data = sortedData.map(d => d.hours);
        
        sleepChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Hours Slept',
                    data: data,
                    borderColor: window.getTheme().accent,
                    pointBackgroundColor: window.getTheme().accent,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: `rgba(${window.getTheme().accentRgb}, 0.15)`
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 24, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    };

    const renderSleep = () => {
        const tBody = document.getElementById('sleep-table-body');
        tBody.innerHTML = '';
        
        let totalHours = 0;
        
        // Sort descending for list
        const sortedDesc = [...state.sleep].sort((a,b) => new Date(b.date) - new Date(a.date));

        sortedDesc.forEach(s => {
            totalHours += parseFloat(s.hours);
            tBody.innerHTML += `
                <tr>
                    <td style="text-align:left; padding-left:16px; color:#fff;">${s.date}</td>
                    <td style="color:var(--accent-light); font-weight:600;">${s.hours} h</td>
                    <td>
                        <button class="sleep-delete" data-id="${s.date}" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:16px;">✕</button>
                    </td>
                </tr>
            `;
        });
        
        // Update avg
        const avg = state.sleep.length > 0 ? (totalHours / state.sleep.length).toFixed(1) : 0;
        if(document.getElementById('avg-sleep')) {
            document.getElementById('avg-sleep').innerText = avg;
        }

        document.querySelectorAll('.sleep-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const date = e.currentTarget.getAttribute('data-id');
                state.sleep = state.sleep.filter(x => x.date !== date);
                saveState(); renderSleep();
            });
        });

        renderChart();
    };

    window.addEventListener('themeChanged', () => {
        if(sleepChart) sleepChart.destroy();
        sleepChart = null;
        renderChart();
    });

    renderSleep();

    document.getElementById('sleep-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('sleep-date').value;
        const hours = parseFloat(document.getElementById('sleep-hours').value);
        
        // Overwrite if exists
        state.sleep = state.sleep.filter(s => s.date !== date);
        
        state.sleep.push({ date, hours });
        
        saveState(); 
        renderSleep();
        closeModal('sleep-modal');
        document.getElementById('sleep-form').reset();
        document.getElementById('sleep-date').value = today.toISOString().split('T')[0];
    });
});
