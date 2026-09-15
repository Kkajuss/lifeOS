// Core State variables (Mock Database)
window.state = {
    habits: safeParse('qp_habits', [
        { id: '1', name: 'Early start', category: 'productivity' },
        { id: '2', name: 'Gym or movement', category: 'health' },
        { id: '3', name: 'Learn something', category: 'education' },
        { id: '4', name: 'Deep work', category: 'productivity' }
    ]),
    habitLogs: safeParse('qp_habitLogs', {}),
    habitNotes: safeParse('qp_habitNotes', {}),
    mentalLogs: safeParse('qp_mentalLogs', {}),
    sleep: safeParse('qp_sleep', []),
    studies: safeParse('qp_studies', []),
    fitnessLogs: safeParse('qp_fitness', {}),
    muscleVolume: safeParse('qp_muscleVolume', {}),
    nutritionLogs: safeParse('qp_nutrition', {}),
    nutritionMeta: safeParse('qp_nutritionMeta', {}),
    macroGoals: safeParse('qp_macroGoals', { cal: 2500, pro: 150, fat: 80, carb: 250 }),
    tasks: safeParse('qp_tasks', [])
};

window.saveState = function() {
    localStorage.setItem('qp_habits', JSON.stringify(window.state.habits));
    localStorage.setItem('qp_habitLogs', JSON.stringify(window.state.habitLogs));
    localStorage.setItem('qp_habitNotes', JSON.stringify(window.state.habitNotes));
    localStorage.setItem('qp_mentalLogs', JSON.stringify(window.state.mentalLogs));
    localStorage.setItem('qp_sleep', JSON.stringify(window.state.sleep));
    localStorage.setItem('qp_studies', JSON.stringify(window.state.studies));
    localStorage.setItem('qp_fitness', JSON.stringify(window.state.fitnessLogs));
    localStorage.setItem('qp_nutrition', JSON.stringify(window.state.nutritionLogs));
    localStorage.setItem('qp_tasks', JSON.stringify(window.state.tasks));
};

// Map state globally for older scripts
window.state = window.state;

// Default Navigation items representing the V2 LifeOS Vision
const DEFAULT_NAV_ITEMS = [
    { id: 'dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>', file: 'dashboard.html' },
    { id: 'overview', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>', file: 'overview.html' },
    { id: 'journal', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', file: 'journal.html' },
    { id: 'fitness', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>', file: 'fitness.html' },
    { id: 'nutrition', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', file: 'nutrition.html' },
    { id: 'mental', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', file: 'mental.html' },
    { id: 'goals', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>', file: 'goals.html' },
    { id: 'calendar', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', file: 'calendar.html' },
    { id: 'analytics', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>', file: 'analytics.html' },
    { id: 'finance', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', file: 'finance.html' },
    { id: 'settings', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>', file: 'settings.html' },
];

function safeParse(key, defaultVal) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}

// Global configuration
window.lang = localStorage.getItem('qp_lang') || 'en';
window.today = new Date();
window.today.setHours(0,0,0,0);

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
}

function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

window.applyTheme = () => {
    const bg = localStorage.getItem('qp_theme_bg');
    const accent = localStorage.getItem('qp_theme_accent');
    if (bg) {
        document.documentElement.style.setProperty('--bg-color', bg);
        if (document.body) document.body.style.backgroundColor = bg;
    }
    if (accent) {
        document.documentElement.style.setProperty('--accent', accent);
        const rgb = hexToRgb(accent);
        if (rgb) {
            document.documentElement.style.setProperty('--accent-rgb', rgb);
        }
        document.documentElement.style.setProperty('--accent-light', adjustColor(accent, 40));
        document.documentElement.style.setProperty('--accent-dark', adjustColor(accent, -40));
    }
    
    const applyMode = () => {
        if (!document.body) return;
        const mode = localStorage.getItem('qp_theme_mode');
        if (mode === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMode);
    } else {
        applyMode();
    }
};
window.applyTheme();


// Rendering Sidebar Dynamically
window.renderSidebar = function() {
    const topBar = document.getElementById('top-bar');
    if (!topBar) return;
    
    // Add Brand
    let html = `
        <div class="brand">LifeOS</div>
        <div style="flex:1; display:flex; gap:8px; overflow-y:auto;" class="nav-container">
    `;
    
    // Figure out which page is active based on the URL
    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    DEFAULT_NAV_ITEMS.forEach(item => {
        const isActive = currentPath === item.file;
        const translatedName = window.t ? window.t(item.id) : item.id;
        
        html += `
            <a href="${item.file}?v=${Date.now()}" class="nav-link ${isActive ? 'active' : ''}" title="${translatedName}">
                ${item.icon}
                <span class="nav-label">${translatedName}</span>
            </a>
        `;
    });
    
    html += `</div>`;
    topBar.innerHTML = html;
}

// Ensure the sidebar updates when content loads
window.updateTopBar = () => {
    if (window.renderSidebar) {
        window.renderSidebar();
    }
    
    // Initialize Modal Backdrops to allow click-to-close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
};

// Modal helpers
window.openModal = (id) => {
    const el = document.getElementById(id);
    if(el) el.classList.add('active');
};

window.closeModal = (id) => {
    const el = document.getElementById(id);
    if(el) el.classList.remove('active');
};

// Format dates
window.formatDate = (dStr) => {
    const opts = { day: 'numeric', month: 'short' };
    return new Date(dStr).toLocaleDateString(window.lang === 'tr' ? 'tr-TR' : 'en-US', opts);
};
