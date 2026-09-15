let lifeScoreChart, financeChart, mentalChart;

document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    // Prevent Chart.js default colors from overriding our theme
    Chart.defaults.color = 'rgba(255, 255, 255, 0.5)';
    Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';
    
    renderCharts('30d');
});

window.renderCharts = (period) => {
    const days = period === '7d' ? 7 : 30;
    
    // Update button styles
    const btn7 = document.getElementById('btn-7d');
    const btn30 = document.getElementById('btn-30d');
    if (btn7 && btn30) {
        if (period === '7d') {
            btn7.style.background = 'var(--accent)';
            btn7.style.border = 'none';
            btn7.style.boxShadow = '0 0 15px rgba(var(--accent-rgb), 0.4)';
            btn30.style.background = 'var(--panel-bg)';
            btn30.style.border = '1px solid rgba(255,255,255,0.1)';
            btn30.style.boxShadow = 'none';
        } else {
            btn30.style.background = 'var(--accent)';
            btn30.style.border = 'none';
            btn30.style.boxShadow = '0 0 15px rgba(var(--accent-rgb), 0.4)';
            btn7.style.background = 'var(--panel-bg)';
            btn7.style.border = '1px solid rgba(255,255,255,0.1)';
            btn7.style.boxShadow = 'none';
        }
    }
    
    // Generate last N dates
    const dates = [];
    for(let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    
    const displayLabels = dates.map(d => {
        const dateObj = new Date(d);
        return dateObj.getDate() + ' ' + dateObj.toLocaleString('en-US', { month: 'short' });
    });

    // 1. Life Score Data
    const scoresData = window.safeParse('qp_daily_score', {});
    const lifeScores = dates.map(d => scoresData[d] || 0);

    if (lifeScoreChart) lifeScoreChart.destroy();
    const ctxLife = document.getElementById('lifeScoreChart').getContext('2d');
    
    // Create gradient
    const gradientLife = ctxLife.createLinearGradient(0, 0, 0, 400);
    gradientLife.addColorStop(0, 'rgba(0, 242, 254, 0.5)');
    gradientLife.addColorStop(1, 'rgba(0, 242, 254, 0.0)');
    
    lifeScoreChart = new Chart(ctxLife, {
        type: 'line',
        data: {
            labels: displayLabels,
            datasets: [{
                label: 'Life Score',
                data: lifeScores,
                borderColor: '#00f2fe',
                backgroundColor: gradientLife,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00f2fe',
                pointBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, suggestedMax: 100 } }
        }
    });

    // 2. Finance Data
    const txData = window.safeParse('qp_finance', []);
    let incomeSum = 0;
    let expenseSum = 0;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    txData.forEach(tx => {
        if(new Date(tx.date) >= cutoffDate) {
            if(tx.type === 'income') incomeSum += tx.amount;
            else expenseSum += tx.amount;
        }
    });

    if (financeChart) financeChart.destroy();
    const ctxFin = document.getElementById('financeChart').getContext('2d');
    financeChart = new Chart(ctxFin, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [incomeSum, expenseSum],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
            }
        }
    });

    // 3. Mental State Data
    const mentalData = window.safeParse('qp_mental', {});
    const moods = [];
    const prods = [];
    
    dates.forEach(d => {
        if(mentalData[d]) {
            moods.push(mentalData[d].mood || 0);
            prods.push(mentalData[d].productivity || 0);
        } else {
            moods.push(null);
            prods.push(null);
        }
    });

    if (mentalChart) mentalChart.destroy();
    const ctxMental = document.getElementById('mentalChart').getContext('2d');
    mentalChart = new Chart(ctxMental, {
        type: 'line',
        data: {
            labels: displayLabels,
            datasets: [
                {
                    label: 'Mood (1-10)',
                    data: moods,
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.4,
                    spanGaps: true
                },
                {
                    label: 'Productivity (1-10)',
                    data: prods,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { min: 0, max: 10 } }
        }
    });
};
