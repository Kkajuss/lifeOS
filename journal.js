document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    window.journalState = {
        entries: window.safeParse('qp_journal', []),
        currentTags: []
    };
    renderEntries();
});

window.addTag = (tag) => {
    if (!window.journalState.currentTags.includes(tag)) {
        window.journalState.currentTags.push(tag);
        renderActiveTags();
    }
};

function renderActiveTags() {
    const container = document.getElementById('active-tags');
    if(!container) return;
    container.innerHTML = window.journalState.currentTags.map(t => `#${t}`).join(' ');
}

window.saveEntry = () => {
    const title = document.getElementById('entry-title').value.trim();
    const content = document.getElementById('entry-content').value.trim();
    
    if (!content) {
        alert(window.t('empty_content_alert') || "Content cannot be empty.");
        return;
    }
    
    const entry = {
        id: Date.now(),
        title: title || window.t('untitled_note') || 'Untitled Note',
        content: content,
        tags: [...window.journalState.currentTags],
        date: new Date().toISOString()
    };
    
    window.journalState.entries.unshift(entry);
    localStorage.setItem('qp_journal', JSON.stringify(window.journalState.entries));
    
    // Reset modal
    document.getElementById('entry-title').value = '';
    document.getElementById('entry-content').value = '';
    window.journalState.currentTags = [];
    renderActiveTags();
    
    closeModal('new-entry-modal');
    renderEntries();
};

window.deleteEntry = (id) => {
    if(confirm(window.t('delete_entry_confirm') || "Delete this entry?")) {
        window.journalState.entries = window.journalState.entries.filter(e => e.id !== id);
        localStorage.setItem('qp_journal', JSON.stringify(window.journalState.entries));
        renderEntries();
    }
};

window.viewEntry = (id) => {
    const entry = window.journalState.entries.find(e => e.id === id);
    if (!entry) return;
    
    document.getElementById('view-entry-title').innerText = entry.title;
    document.getElementById('view-entry-date').innerText = new Date(entry.date).toLocaleDateString(window.lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    document.getElementById('view-entry-content').innerHTML = entry.content.replace(/\n/g, '<br>');
    
    document.getElementById('view-entry-tags').innerHTML = entry.tags.map(t => `<span style="background:rgba(var(--accent-rgb), 0.1); color:var(--accent); padding:4px 8px; border-radius:4px; font-size:12px;">#${t}</span>`).join('');
    
    const delBtn = document.getElementById('view-entry-delete-btn');
    if (delBtn) {
        delBtn.onclick = () => {
            closeModal('view-entry-modal');
            deleteEntry(id);
        };
    }
    
    openModal('view-entry-modal');
};

function renderEntries() {
    const list = document.getElementById('journal-list');
    if(!list) return;
    
    list.innerHTML = '';
    
    if (window.journalState.entries.length === 0) {
        list.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:40px;">${window.t('no_entries_yet') || "No journal entries yet. Tap + New Entry to start writing."}</div>`;
        return;
    }
    
    window.journalState.entries.forEach(entry => {
        const dateStr = new Date(entry.date).toLocaleDateString(window.lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
        const tagsHtml = entry.tags.map(t => `<span style="background:rgba(var(--accent-rgb), 0.1); color:var(--accent); padding:2px 6px; border-radius:4px; font-size:11px;">#${t}</span>`).join('');
        
        // Convert newlines to br for rendering
        const displayContent = entry.content.replace(/\n/g, '<br>');
        
        list.innerHTML += `
            <div class="glass-panel hover-card" onclick="viewEntry(${entry.id})" style="padding:20px; display:flex; flex-direction:column; position:relative; transition:0.3s; cursor:pointer;">
                <button onclick="event.stopPropagation(); deleteEntry(${entry.id})" style="position:absolute; top:15px; right:15px; background:rgba(239, 68, 68, 0.1); color:#ef4444; border:none; width:28px; height:28px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0; transition:0.2s;" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0" class="hover-show-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
                <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">${dateStr}</div>
                <h3 style="margin:0 0 10px 0; color:#fff; font-size:18px; word-break: break-word;">${entry.title}</h3>
                <div style="font-size:14px; color:#d1d5db; line-height:1.6; flex:1; margin-bottom:15px; word-break: break-word; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${displayContent}</div>
                <div style="display:flex; gap:5px; flex-wrap:wrap;">
                    ${tagsHtml}
                </div>
            </div>
        `;
    });
    
    // Add simple hover effect script dynamically to show delete btn
    document.querySelectorAll('.glass-panel').forEach(p => {
        const btn = p.querySelector('.hover-show-btn');
        if(btn) {
            p.addEventListener('mouseenter', () => btn.style.opacity = '1');
            p.addEventListener('mouseleave', () => btn.style.opacity = '0');
        }
    });
}
