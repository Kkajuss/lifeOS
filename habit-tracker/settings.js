document.addEventListener('DOMContentLoaded', () => {
    // Set initial language in select
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = window.lang || 'tr';
        langSelect.addEventListener('change', (e) => {
            window.changeLanguage(e.target.value);
        });
    }

    // Import file handler
    const importFile = document.getElementById('import-file');
    if (importFile) {
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data && typeof data === 'object') {
                        // Validate basic structure (optional but good)
                        for (let key in data) {
                            localStorage.setItem(key, data[key]);
                        }
                        alert(window.t('import_success') || 'Data imported successfully!');
                        location.reload();
                    }
                } catch (err) {
                    alert('Invalid file format!');
                }
            };
            reader.readAsText(file);
        });
    }
    
    // Theme Handlers
    const themeBtns = document.querySelectorAll('.theme-preset-btn');
    if (themeBtns.length > 0) {
        // Highlight active theme on load
        const currentBg = localStorage.getItem('qp_theme_bg') || '#050714';
        themeBtns.forEach(btn => {
            if (btn.dataset.bg === currentBg) {
                btn.style.borderColor = btn.dataset.accent;
                btn.style.transform = 'scale(1.1)';
            }
            
            btn.addEventListener('click', (e) => {
                // Remove active states
                themeBtns.forEach(b => {
                    b.style.borderColor = 'transparent';
                    b.style.transform = 'scale(1)';
                });
                
                // Set new active state
                const targetBtn = e.currentTarget;
                targetBtn.style.borderColor = targetBtn.dataset.accent;
                targetBtn.style.transform = 'scale(1.1)';
                
                // Apply
                localStorage.setItem('qp_theme_bg', targetBtn.dataset.bg);
                localStorage.setItem('qp_theme_accent', targetBtn.dataset.accent);
                if(window.applyTheme) window.applyTheme();
            });
        });
    }

    // Initialize Theme Mode toggle
    const currentMode = localStorage.getItem('qp_theme_mode') || 'dark';
    const btnDark = document.getElementById('btn-theme-dark');
    const btnLight = document.getElementById('btn-theme-light');
    if (btnDark && btnLight) {
        if (currentMode === 'light') {
            btnLight.style.background = 'rgba(255,255,255,0.2)';
        } else {
            btnDark.style.background = 'rgba(255,255,255,0.2)';
        }
    }
});

window.setThemeMode = (mode) => {
    localStorage.setItem('qp_theme_mode', mode);
    const btnDark = document.getElementById('btn-theme-dark');
    const btnLight = document.getElementById('btn-theme-light');
    if (btnDark && btnLight) {
        btnDark.style.background = mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'transparent';
        btnLight.style.background = mode === 'light' ? 'rgba(255,255,255,0.2)' : 'transparent';
    }
    if (window.applyTheme) window.applyTheme();
};

window.exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

window.clearAllData = () => {
    if (confirm(window.t('clear_data_desc') || "Tüm verilerinizi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
        localStorage.clear();
        alert("Tüm veriler silindi. Uygulama yeniden başlatılıyor...");
        window.location.reload();
    }
};
