document.addEventListener('DOMContentLoaded', () => {
    updateTopBar();
    window.financeState = {
        transactions: window.safeParse('qp_finance', []),
        currentType: 'expense'
    };
    renderTransactions();
});

window.setTxType = (type) => {
    window.financeState.currentType = type;
    const btnExp = document.getElementById('btn-type-expense');
    const btnInc = document.getElementById('btn-type-income');
    
    if (type === 'expense') {
        btnExp.style.background = 'rgba(239, 68, 68, 0.2)';
        btnExp.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        btnExp.style.color = '#ef4444';
        
        btnInc.style.background = 'transparent';
        btnInc.style.borderColor = 'rgba(255,255,255,0.1)';
        btnInc.style.color = 'var(--text-muted)';
        
        // Update categories for expense
        document.getElementById('tx-category').innerHTML = `
            <option value="Food">Food & Dining</option>
            <option value="Transport">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills & Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health & Fitness</option>
            <option value="Other">Other</option>
        `;
    } else {
        btnInc.style.background = 'rgba(16, 185, 129, 0.2)';
        btnInc.style.borderColor = 'rgba(16, 185, 129, 0.5)';
        btnInc.style.color = '#10b981';
        
        btnExp.style.background = 'transparent';
        btnExp.style.borderColor = 'rgba(255,255,255,0.1)';
        btnExp.style.color = 'var(--text-muted)';
        
        // Update categories for income
        document.getElementById('tx-category').innerHTML = `
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Gift">Gift</option>
            <option value="Investment">Investment</option>
            <option value="Other">Other</option>
        `;
    }
};

window.addTransaction = () => {
    const amountInput = document.getElementById('tx-amount');
    const descInput = document.getElementById('tx-desc');
    const catInput = document.getElementById('tx-category');
    
    const amount = parseFloat(amountInput.value);
    const desc = descInput.value.trim();
    const cat = catInput.value;
    
    if (isNaN(amount) || amount <= 0 || !desc) {
        alert("Please enter a valid amount and description.");
        return;
    }
    
    const tx = {
        id: Date.now(),
        type: window.financeState.currentType,
        amount: amount,
        desc: desc,
        category: cat,
        date: new Date().toISOString()
    };
    
    window.financeState.transactions.unshift(tx);
    localStorage.setItem('qp_finance', JSON.stringify(window.financeState.transactions));
    
    amountInput.value = '';
    descInput.value = '';
    
    renderTransactions();
};

window.deleteTransaction = (id) => {
    window.financeState.transactions = window.financeState.transactions.filter(t => t.id !== id);
    localStorage.setItem('qp_finance', JSON.stringify(window.financeState.transactions));
    renderTransactions();
};

window.clearTransactions = () => {
    if(confirm("Are you sure you want to clear all finance records?")) {
        window.financeState.transactions = [];
        localStorage.setItem('qp_finance', JSON.stringify([]));
        renderTransactions();
    }
};

function renderTransactions() {
    const list = document.getElementById('tx-list');
    let balance = 0;
    
    list.innerHTML = '';
    
    if (window.financeState.transactions.length === 0) {
        list.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:20px; font-size:14px;">No transactions yet.</div>';
    } else {
        window.financeState.transactions.forEach(tx => {
            if(tx.type === 'income') balance += tx.amount;
            else balance -= tx.amount;
            
            const isInc = tx.type === 'income';
            const color = isInc ? '#10b981' : '#ef4444';
            const sign = isInc ? '+' : '-';
            const dateStr = new Date(tx.date).toLocaleDateString();
            
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:12px;">
                    <div>
                        <div style="font-weight:600; color:#fff; font-size:15px;">${tx.desc}</div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${tx.category} • ${dateStr}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span style="color:${color}; font-weight:700; font-size:16px;">${sign}$${tx.amount.toFixed(2)}</span>
                        <button onclick="deleteTransaction(${tx.id})" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:16px; padding:0;">×</button>
                    </div>
                </div>
            `;
        });
    }
    
    const balEl = document.getElementById('total-balance');
    balEl.innerText = `$${balance.toFixed(2)}`;
    balEl.style.color = balance >= 0 ? '#10b981' : '#ef4444';
}
