// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSJrvppC8xLi3aFqHB1tq8FC_wjtybGlg",
    authDomain: "lifeos-764ca.firebaseapp.com",
    databaseURL: "https://lifeos-764ca-default-rtdb.firebaseio.com",
    projectId: "lifeos-764ca",
    storageBucket: "lifeos-764ca.firebasestorage.app",
    messagingSenderId: "702759323020",
    appId: "1:702759323020:web:8639a83c3183e85b4102a9",
    measurementId: "G-MB1J7BYQZE"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Track if we are currently saving from cloud to prevent infinite loops
let isSyncingFromCloud = false;

// Safely hook into localStorage.setItem to push changes to cloud
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.call(localStorage, key, value);
    
    // Only push to cloud if it's our app data (starts with qp_) and not currently syncing from cloud
    if (key.startsWith('qp_') && !isSyncingFromCloud) {
        db.ref('lifeos_data/' + key).set(value).catch(err => {
            console.error("Firebase Sync Error:", err);
        });
    }
};

// Add a cool toast notification for cross-device sync
function showSyncToast() {
    let toast = document.getElementById('sync-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'sync-toast';
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#10b981; color:#fff; padding:12px 24px; border-radius:8px; font-weight:600; box-shadow:0 4px 15px rgba(16, 185, 129, 0.4); z-index:9999; transform:translateY(100px); opacity:0; transition:0.3s; cursor:pointer;";
        toast.innerHTML = '☁️ Cloud data updated! Click to refresh.';
        toast.onclick = () => window.location.reload();
        document.body.appendChild(toast);
    }
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 100);
}

// Fetch from cloud on load and listen for remote changes
let isFirstLoad = true;
db.ref('lifeos_data').on('value', (snapshot) => {
    const data = snapshot.val();
    
    isSyncingFromCloud = true; // Lock local writing
    
    if (data) {
        let hasChanges = false;
        
        for (const key in data) {
            const localVal = localStorage.getItem(key);
            if (localVal !== data[key]) {
                originalSetItem.call(localStorage, key, data[key]);
                hasChanges = true;
            }
        }
        
        if (isFirstLoad) {
            // First load: push any local keys that cloud doesn't have yet
            let updates = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('qp_') && !data.hasOwnProperty(key)) {
                    updates[key] = localStorage.getItem(key);
                }
            }
            if (Object.keys(updates).length > 0) {
                db.ref('lifeos_data').update(updates);
            }
        }
        
        if (hasChanges) {
            showSyncToast();
        }
    } else {
        // Cloud is completely empty. Push all our local data to cloud at once.
        if (isFirstLoad) {
            let updates = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('qp_')) {
                    updates[key] = localStorage.getItem(key);
                }
            }
            if (Object.keys(updates).length > 0) {
                db.ref('lifeos_data').set(updates);
            }
        }
    }
    
    isSyncingFromCloud = false; // Unlock local writing
    isFirstLoad = false;
});
