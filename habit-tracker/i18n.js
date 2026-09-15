const lang = localStorage.getItem('qp_lang') || 'tr';
window.lang = lang;

const translations = {
    "en": {
        // General & Sidebar
        "app_name": "LifeOS",
        "dashboard": "Dashboard",
        "overview": "Overview",
        "journal": "Journal",
        "fitness": "Fitness",
        "nutrition": "Nutrition",
        "mental": "Mental",
        "goals": "Goals",
        "calendar": "Calendar",
        "analytics": "Analytics",
        "finance": "Finance",
        "study_tracker": "Study",
        "sleep_tracker": "Sleep",
        "habit_tracker": "Habits",
        "daily_tasks": "Tasks",
        "settings": "Settings",
        
        // Month names
        "january": "January", "february": "February", "march": "March", "april": "April",
        "may": "May", "june": "June", "july": "July", "august": "August",
        "september": "September", "october": "October", "november": "November", "december": "December",
        "month": "Month",
        "all": "All",
        
        "cat_health": "Health",
        "cat_prod": "Productivity",
        "cat_mind": "Mindfulness",
        "cat_edu": "Education",
        "achievements": "Achievements",
        "cat_other": "Other",
        
        // Dashboard
        "dashboard_overview": "Dashboard Overview",
        "number_of_habits": "Number of habits",
        "completed_habits": "Completed habits",
        "progress": "Progress",
        "top_tasks_today": "Top Tasks Today",
        "no_tasks": "No tasks yet. Create one!",
        "add_task": "Add Task",
        
        // Habits
        "my_habits": "My Habits",
        "mental_state": "Mental State",
        "mood": "Mood",
        "motivation": "Motivation",
        "score": "Score",
        "top_10_habits": "Top 10 Habits",
        "done": "Done",
        "not_done": "Not Done",
        "daily_completion_trend": "Daily Completion Trend",
        "daily_completion_desc": "Visualizes your overall habit success rate day by day throughout the month.",
        "mental_state_analysis": "Mental State Analysis",
        "mental_state_desc": "Compare your mood and motivation levels to find patterns in your productivity.",
        "analysis": "Analysis",
        "add_new_habit": "Add New Habit",
        "habit_name_placeholder": "Habit name (e.g., Read 10 pages)",
        "add_to_tracker": "Add to Tracker",
        "cancel": "Cancel",
        "action_day": "Day Action",
        "check_all": "Check All",
        "uncheck_all": "Clear Selected",
        "delete_habit": "Delete Habit",
        "delete_habit_confirm": "Are you sure you want to delete this habit?",
        
        // Nutrition
        "nutrition_tracker": "Nutrition Tracker",
        "search_food_placeholder": "Search food (min. 2 chars)...",
        "added_today": "Added Today",
        "calories": "Calories",
        "protein": "Protein",
        "carbs": "Carbs",
        "fat": "Fat",
        "goal_vs_consumed": "Goal vs Consumed",
        "custom_food": "My Custom Foods",
        "add_custom_food": "Add Custom Food",
        "food_name": "Food Name",
        "save_food": "Save Food",
        "close": "Close",
        
        // Fitness
        "weight": "Weight",
        "workouts": "Workouts",
        "add_custom_workout": "Add Custom Workout",
        "muscle_groups": "Muscle Groups",
        "add_workout_log": "Add Workout Log",
        
        // Sleep
        "sleep_hours_vs_goal": "Sleep Hours vs Goal",
        "add_sleep_log": "Add Sleep Log",
        "hours_slept": "Hours Slept",
        "sleep_quality": "Sleep Quality",
        "save": "Save",
        
        // Study
        "total_hours": "Total Hours",
        "subject_breakdown": "Subject Breakdown",
        "add_study_session": "Add Study Session",
        "subject": "Subject",
        "duration_hours": "Duration (Hours)",
        
        // Settings
        "language": "Language",
        "clear_data": "Clear All Data",
        "clear_data_confirm": "Are you sure you want to delete ALL your data? This action cannot be undone.",
        "save_settings": "Save Settings",
        "settings_saved": "Settings saved!",
        "data_management": "Data Management",
        "export_data": "Export Data",
        "import_data": "Import Data",
        "danger_zone": "Danger Zone",
        "clear_data_desc": "This action cannot be undone. This will permanently delete all your tracking data.",
        "import_success": "Data imported successfully!",
        "toggle_day": "Toggle all habits for this day",
        "toggle_habit": "Toggle all days for this habit",
        "check_all_days_confirm": "Are you sure you want to mark all days as completed?",
        "uncheck_all_days_confirm": "Are you sure you want to uncheck all days?",
        "settings_desc": "Manage your app preferences, language, and data backups.",
        "back": "Back",
        "appearance": "Appearance",
        "appearance_desc": "Customize the app's colors to your liking.",
        "bg_color": "Background Color",
        "accent_color": "Accent Color",
        "reset_theme": "Reset to Default",
        "theme_saved": "Theme saved!",
        "daily_tasks": "Daily Tasks",
        "new_task": "+ New Task",
        "add_new_task": "Add New Task",
        "task_name_placeholder": "Task name (e.g., Email John)",
        "add_task": "Add Task",
        "motivation_mental_state": "Motivation & Mental State",
        "study_analysis": "Study & Lessons Analysis",
        "log_test": "Log Test",
        "pomodoro": "Pomodoro",
        "pomodoro_duration": "Pomodoro Duration (min)",
        
        // Overview
        "overview_title": "- Habit Tracker Overview -",
        "progress_pct": "Progress in %",
        "habits_days": "Habits / Days",
        "week": "Week",
        "save_habit": "Save Habit",
        "energy": "Energy",
        "focus": "Focus",
        "confidence": "Confidence",
        "social_battery": "Social Battery",
        
        // Journal
        "journal_desc": "Reflect on your day, thoughts, and ideas.",
        "new_entry": "+ New Entry",
        "new_journal_entry": "New Journal Entry",
        "entry_title_placeholder": "Title (e.g., A productive day)",
        "entry_content_placeholder": "Write your thoughts here...",
        "tag_idea": "Idea",
        "tag_gratitude": "Gratitude",
        "tag_vent": "Vent",
        "save_entry": "Save Entry",
        "empty_content_alert": "Content cannot be empty.",
        "untitled_note": "Untitled Note",
        "delete_entry_confirm": "Delete this entry?",
        "no_entries_yet": "No journal entries yet. Tap + New Entry to start writing."
    },
    "tr": {
        // General & Sidebar
        "app_name": "LifeOS",
        "dashboard": "Ana Ekran",
        "journal": "Günlük",
        "fitness": "Spor",
        "nutrition": "Beslenme",
        "mental": "Mental",
        "goals": "Hedefler",
        "overview": "Tablo Özeti",
        "calendar": "Takvim",
        "analytics": "Analizler",
        "finance": "Finans",
        "study_tracker": "Çalışma",
        "sleep_tracker": "Uyku",
        "habit_tracker": "Alışkanlıklar",
        "daily_tasks": "Görevler",
        "settings": "Ayarlar",
        
        // Month names
        "january": "Ocak", "february": "Şubat", "march": "Mart", "april": "Nisan",
        "may": "Mayıs", "june": "Haziran", "july": "Temmuz", "august": "Ağustos",
        "september": "Eylül", "october": "Ekim", "november": "Kasım", "december": "Aralık",
        "month": "Ay",
        "all": "Tümü",
        
        "cat_health": "Sağlık",
        "cat_prod": "Üretkenlik",
        "cat_mind": "Kişisel Gelişim",
        "cat_edu": "Eğitim",
        "achievements": "Başarımlar",
        "cat_other": "Diğer",
        
        // Dashboard
        "dashboard_overview": "Genel Bakış",
        "number_of_habits": "Toplam Alışkanlık",
        "completed_habits": "Tamamlanan",
        "progress": "İlerleme",
        "top_tasks_today": "Günün Görevleri",
        "no_tasks": "Henüz görev yok. Bir tane ekle!",
        "add_task": "Görev Ekle",
        
        // Habits
        "my_habits": "Alışkanlıklarım",
        "mental_state": "Ruh Hali",
        "mood": "Mod",
        "motivation": "Motivasyon",
        "score": "Skor",
        "top_10_habits": "En İyi 10",
        "done": "Yapıldı",
        "not_done": "Yapılmadı",
        "daily_completion_trend": "Günlük Tamamlama Trendi",
        "daily_completion_desc": "Ay boyunca alışkanlıklarındaki genel başarı oranının gidişatı.",
        "mental_state_analysis": "Ruh Hali Analizi",
        "mental_state_desc": "Mod ve motivasyon seviyelerini karşılaştırarak verimlilik düzenini keşfet.",
        "analysis": "Analiz",
        "add_new_habit": "Yeni Alışkanlık Ekle",
        "habit_name_placeholder": "Alışkanlık adı (Örn: 10 sayfa kitap)",
        "add_to_tracker": "Ekle",
        "cancel": "İptal",
        "action_day": "Gün İşlemi",
        "check_all": "Tümünü Seç",
        "uncheck_all": "Seçilileri Kaldır",
        "delete_habit": "Alışkanlığı Sil",
        "delete_habit_confirm": "Bu alışkanlığı silmek istediğinize emin misiniz?",
        
        // Nutrition
        "nutrition_tracker": "Beslenme Takibi",
        "search_food_placeholder": "Yemek ara (en az 2 harf)...",
        "added_today": "Bugün Eklenenler",
        "calories": "Kalori",
        "protein": "Protein",
        "carbs": "Karb",
        "fat": "Yağ",
        "goal_vs_consumed": "Hedef vs Tüketilen",
        "custom_food": "Özel Yemeklerim",
        "add_custom_food": "Özel Yemek Ekle",
        "food_name": "Yemek Adı",
        "save_food": "Kaydet",
        "close": "Kapat",
        
        // Fitness
        "weight": "Kilo",
        "workouts": "Antrenmanlar",
        "add_custom_workout": "Özel Antrenman Ekle",
        "muscle_groups": "Kas Grupları",
        "add_workout_log": "Antrenman Ekle",
        
        // Sleep
        "sleep_hours_vs_goal": "Uyku Süresi vs Hedef",
        "add_sleep_log": "Uyku Kaydı Ekle",
        "hours_slept": "Uyunan Saat",
        "sleep_quality": "Uyku Kalitesi",
        "save": "Kaydet",
        
        // Study
        "total_hours": "Toplam Saat",
        "subject_breakdown": "Konu Dağılımı",
        "add_study_session": "Çalışma Kaydı Ekle",
        "subject": "Konu",
        "duration_hours": "Süre (Saat)",
        
        // Settings
        "language": "Dil / Language",
        "clear_data": "Tüm Verileri Sıfırla",
        "clear_data_confirm": "Tüm verilerini silmek istediğine emin misin? Bu işlem geri alınamaz.",
        "save_settings": "Ayarları Kaydet",
        "settings_saved": "Ayarlar kaydedildi!",
        "data_management": "Veri Yönetimi",
        "export_data": "Verileri Dışa Aktar",
        "import_data": "Verileri İçe Aktar",
        "danger_zone": "Tehlikeli Bölge",
        "clear_data_desc": "Bu işlem geri alınamaz. Tüm takip verileriniz kalıcı olarak silinecektir.",
        "import_success": "Veriler başarıyla içe aktarıldı!",
        "toggle_day": "Bu günkü tüm alışkanlıkları işaretle/kaldır",
        "toggle_habit": "Bu alışkanlığın tüm günlerini işaretle/kaldır",
        "check_all_days_confirm": "Bu alışkanlığın tüm günlerini tamamlandı olarak işaretlemek istediğinize emin misiniz?",
        "uncheck_all_days_confirm": "Bu alışkanlığın tüm günlerini silmek istediğinize emin misiniz?",
        "settings_desc": "Uygulama tercihlerinizi, dili ve veri yedeklemelerinizi yönetin.",
        "back": "Geri Dön",
        "appearance": "Görünüm",
        "appearance_desc": "Uygulama renklerini kendi zevkinize göre özelleştirin.",
        "bg_color": "Arka Plan Rengi",
        "accent_color": "Vurgu Rengi",
        "reset_theme": "Varsayılana Sıfırla",
        "theme_saved": "Tema kaydedildi!",
        "daily_tasks": "Günlük Görevler",
        "new_task": "+ Yeni Görev",
        "add_new_task": "Yeni Görev Ekle",
        "task_name_placeholder": "Görev adı (örn., Ali'ye Mail At)",
        "add_task": "Görev Ekle",
        "motivation_mental_state": "Motivasyon ve Ruh Hali",
        "study_analysis": "Ders Çalışma Analizi",
        "log_test": "Deneme/Test Kaydet",
        "pomodoro": "Pomodoro",
        "pomodoro_duration": "Pomodoro Süresi (dk)",
        
        // Overview
        "overview_title": "- Alışkanlık Takip Özeti -",
        "progress_pct": "İlerleme (%)",
        "habits_days": "Alışkanlık / Gün",
        "week": "Hafta",
        "save_habit": "Kaydet",
        "energy": "Enerji",
        "focus": "Odak",
        "confidence": "Özgüven",
        "social_battery": "Sosyal Enerji",
        
        // Journal
        "journal_desc": "Gününüzü, düşüncelerinizi ve fikirlerinizi yansıtın.",
        "new_entry": "+ Yeni Günlük",
        "new_journal_entry": "Yeni Günlük Kaydı",
        "entry_title_placeholder": "Başlık (Örn: Verimli bir gün)",
        "entry_content_placeholder": "Düşüncelerinizi buraya yazın...",
        "tag_idea": "Fikir",
        "tag_gratitude": "Şükran",
        "tag_vent": "İç Dökme",
        "save_entry": "Günlüğü Kaydet",
        "empty_content_alert": "İçerik boş olamaz.",
        "untitled_note": "İsimsiz Not",
        "delete_entry_confirm": "Bu günlüğü silmek istediğinize emin misiniz?",
        "no_entries_yet": "Henüz günlük kaydı yok. Başlamak için + Yeni Günlük'e dokunun."
    },
    "es": {
        "nutrition": "Nutrición", "mental": "Mental", "goals": "Metas", "overview": "Resumen",
        "calendar": "Calendario", "analytics": "Análisis", "finance": "Finanzas",
        "study_tracker": "Estudio", "sleep_tracker": "Sueño", "habit_tracker": "Hábitos",
        "daily_tasks": "Tareas", "settings": "Ajustes", "january": "Enero", "february": "Febrero",
        "march": "Marzo", "april": "Abril", "may": "Mayo", "june": "Junio", "july": "Julio",
        "august": "Agosto", "september": "Septiembre", "october": "Octubre", "november": "Noviembre",
        "december": "Diciembre", "month": "Mes", "all": "Todo", "cat_health": "Salud",
        "cat_prod": "Productividad", "cat_mind": "Bienestar", "cat_edu": "Educación",
        "achievements": "Logros", "cat_other": "Otro", "dashboard_overview": "Resumen del Panel",
        "number_of_habits": "Total de Hábitos", "completed_habits": "Hábitos Completados",
        "progress": "Progreso", "top_tasks_today": "Tareas de Hoy", "no_tasks": "¡Añade una!",
        "add_task": "Añadir Tarea", "my_habits": "Mis Hábitos", "mental_state": "Estado Mental",
        "mood": "Estado de Ánimo", "motivation": "Motivación", "score": "Puntuación",
        "top_10_habits": "Top 10 Hábitos", "done": "Hecho", "not_done": "No Hecho",
        "daily_completion_trend": "Tendencia", "daily_completion_desc": "Patrón de éxito.",
        "mental_state_analysis": "Análisis Mental", "mental_state_desc": "Descubre patrones.",
        "analysis": "Análisis", "add_new_habit": "Añadir Hábito", "habit_name_placeholder": "Nombre",
        "add_to_tracker": "Añadir", "cancel": "Cancelar", "action_day": "Día de Acción",
        "check_all": "Marcar Todo", "uncheck_all": "Desmarcar Todo", "delete_habit": "Eliminar",
        "delete_habit_confirm": "¿Estás seguro?", "nutrition_tracker": "Nutrición",
        "search_food_placeholder": "Buscar...", "added_today": "Añadido Hoy", "calories": "Calorías",
        "protein": "Proteína", "carbs": "Carbs", "fat": "Grasa", "goal_vs_consumed": "Meta vs Consumo",
        "custom_food": "Comida Personalizada", "add_custom_food": "Añadir Comida", "food_name": "Nombre",
        "save_food": "Guardar", "close": "Cerrar", "weight": "Peso", "workouts": "Entrenamientos",
        "add_custom_workout": "Añadir Entrenamiento", "muscle_groups": "Grupos",
        "add_workout_log": "Añadir Registro", "sleep_hours_vs_goal": "Horas vs Meta",
        "add_sleep_log": "Añadir Registro", "hours_slept": "Horas", "sleep_quality": "Calidad",
        "save": "Guardar", "total_hours": "Total", "subject_breakdown": "Materia",
        "add_study_session": "Añadir Sesión", "subject": "Materia", "duration_hours": "Duración",
        "language": "Idioma / Language", "clear_data": "Borrar Datos", "clear_data_confirm": "¿Seguro?",
        "save_settings": "Guardar Ajustes", "settings_saved": "¡Guardado!",
        "data_management": "Datos", "export_data": "Exportar", "import_data": "Importar",
        "danger_zone": "Peligro", "clear_data_desc": "Irreversible.", "import_success": "¡Importado!",
        "toggle_day": "Alternar hoy", "toggle_habit": "Alternar hábito",
        "check_all_days_confirm": "¿Marcar todo?", "uncheck_all_days_confirm": "¿Desmarcar todo?",
        "settings_desc": "Preferencias e idioma.", "back": "Atrás", "appearance": "Apariencia",
        "appearance_desc": "Colores.", "bg_color": "Fondo", "accent_color": "Acento",
        "reset_theme": "Restablecer", "theme_saved": "¡Tema guardado!", "new_task": "+ Nueva",
        "add_new_task": "Añadir Nueva Tarea", "task_name_placeholder": "Nombre",
        "motivation_mental_state": "Estado", "study_analysis": "Estudio", "log_test": "Registro",
        "pomodoro": "Pomodoro", "pomodoro_duration": "Duración (min)", "overview_title": "- Resumen -",
        "progress_pct": "Progreso %", "habits_days": "Hábitos / Días", "week": "Semana",
        "save_habit": "Guardar", "energy": "Energía", "focus": "Concentración",
        "confidence": "Confianza", "social_battery": "Batería Social", "journal_desc": "Reflexiona.",
        "new_entry": "+ Entrada", "new_journal_entry": "Nueva", "entry_title_placeholder": "Título",
        "entry_content_placeholder": "Escribe...", "tag_idea": "Idea", "tag_gratitude": "Gratitud",
        "tag_vent": "Desahogo", "save_entry": "Guardar", "empty_content_alert": "Vacío.",
        "untitled_note": "Sin Título", "delete_entry_confirm": "¿Eliminar?",
        "no_entries_yet": "No hay entradas."
    },
    "de": {
        "nutrition": "Ernährung", "mental": "Mental", "goals": "Ziele", "overview": "Übersicht",
        "calendar": "Kalender", "analytics": "Analysen", "finance": "Finanzen",
        "study_tracker": "Lernen", "sleep_tracker": "Schlaf", "habit_tracker": "Gewohnheiten",
        "daily_tasks": "Aufgaben", "settings": "Einstellungen", "january": "Januar", "february": "Februar",
        "march": "März", "april": "April", "may": "Mai", "june": "Juni", "july": "Juli",
        "august": "August", "september": "September", "october": "Oktober", "november": "November",
        "december": "Dezember", "month": "Monat", "all": "Alle", "cat_health": "Gesundheit",
        "cat_prod": "Produktivität", "cat_mind": "Achtsamkeit", "cat_edu": "Bildung",
        "achievements": "Erfolge", "cat_other": "Sonstiges", "dashboard_overview": "Dashboard",
        "number_of_habits": "Anzahl", "completed_habits": "Abgeschlossen",
        "progress": "Fortschritt", "top_tasks_today": "Heutige Aufgaben", "no_tasks": "Füge eine hinzu!",
        "add_task": "Aufgabe", "my_habits": "Meine Gewohnheiten", "mental_state": "Zustand",
        "mood": "Stimmung", "motivation": "Motivation", "score": "Punktzahl",
        "top_10_habits": "Top 10", "done": "Erledigt", "not_done": "Nicht erledigt",
        "daily_completion_trend": "Trend", "daily_completion_desc": "Muster.",
        "mental_state_analysis": "Analyse", "mental_state_desc": "Entdecke Muster.",
        "analysis": "Analyse", "add_new_habit": "Neue Gewohnheit", "habit_name_placeholder": "Name",
        "add_to_tracker": "Hinzufügen", "cancel": "Abbrechen", "action_day": "Aktionstag",
        "check_all": "Alle auswählen", "uncheck_all": "Auswahl aufheben", "delete_habit": "Löschen",
        "delete_habit_confirm": "Bist du sicher?", "nutrition_tracker": "Ernährung",
        "search_food_placeholder": "Suchen...", "added_today": "Heute hinzugefügt", "calories": "Kalorien",
        "protein": "Protein", "carbs": "Kohlenhydrate", "fat": "Fett", "goal_vs_consumed": "Ziel vs Konsum",
        "custom_food": "Eigene Lebensmittel", "add_custom_food": "Hinzufügen", "food_name": "Name",
        "save_food": "Speichern", "close": "Schließen", "weight": "Gewicht", "workouts": "Workouts",
        "add_custom_workout": "Hinzufügen", "muscle_groups": "Muskelgruppen",
        "add_workout_log": "Protokollieren", "sleep_hours_vs_goal": "Schlaf vs Ziel",
        "add_sleep_log": "Protokollieren", "hours_slept": "Stunden", "sleep_quality": "Qualität",
        "save": "Speichern", "total_hours": "Gesamtstunden", "subject_breakdown": "Fächer",
        "add_study_session": "Lerneinheit hinzufügen", "subject": "Fach", "duration_hours": "Dauer",
        "language": "Sprache / Language", "clear_data": "Daten löschen", "clear_data_confirm": "Sicher?",
        "save_settings": "Speichern", "settings_saved": "Gespeichert!",
        "data_management": "Datenverwaltung", "export_data": "Exportieren", "import_data": "Importieren",
        "danger_zone": "Gefahrenzone", "clear_data_desc": "Unwiderruflich.", "import_success": "Importiert!",
        "toggle_day": "Heute umschalten", "toggle_habit": "Gewohnheit umschalten",
        "check_all_days_confirm": "Alle markieren?", "uncheck_all_days_confirm": "Alle löschen?",
        "settings_desc": "Einstellungen, Sprache und Backups verwalten.", "back": "Zurück", "appearance": "Design",
        "appearance_desc": "Farben.", "bg_color": "Hintergrund", "accent_color": "Akzent",
        "reset_theme": "Standard", "theme_saved": "Gespeichert!", "new_task": "+ Aufgabe",
        "add_new_task": "Hinzufügen", "task_name_placeholder": "Name",
        "motivation_mental_state": "Zustand", "study_analysis": "Analyse", "log_test": "Test",
        "pomodoro": "Pomodoro", "pomodoro_duration": "Dauer (min)", "overview_title": "- Übersicht -",
        "progress_pct": "Fortschritt %", "habits_days": "Gewohnheit / Tage", "week": "Woche",
        "save_habit": "Speichern", "energy": "Energie", "focus": "Fokus",
        "confidence": "Selbstvertrauen", "social_battery": "Soziale Batterie", "journal_desc": "Reflektiere.",
        "new_entry": "+ Neuer Eintrag", "new_journal_entry": "Neu", "entry_title_placeholder": "Titel",
        "entry_content_placeholder": "Schreibe...", "tag_idea": "Idee", "tag_gratitude": "Dankbarkeit",
        "tag_vent": "Frust ablassen", "save_entry": "Speichern", "empty_content_alert": "Leer.",
        "untitled_note": "Unbenannt", "delete_entry_confirm": "Löschen?",
        "no_entries_yet": "Keine Einträge."
    }
};

window.t = function(key) {
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    if (translations['en'] && translations['en'][key]) {
        return translations['en'][key];
    }
    return key; 
};

window.translateDOM = function() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.setAttribute('placeholder', window.t(key));
        } else {
            if (el.children.length === 0) {
                el.textContent = window.t(key);
            } else {
                // To preserve inner HTML tags if necessary, we can just replace innerHTML. 
                // We should be careful to only place data-i18n on leaf nodes or span wrappers.
                el.innerHTML = window.t(key);
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.translateDOM();
});

window.changeLanguage = function(newLang) {
    localStorage.setItem('qp_lang', newLang);
    window.lang = newLang;
    window.location.reload();
};
