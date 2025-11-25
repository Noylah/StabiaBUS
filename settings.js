// Settings Manager - Gestione Fermate Personalizzate e Preferite

class SettingsManager {
    constructor() {
        this.customStops = this.loadCustomStops();
        this.favoriteStops = this.loadFavoriteStops();
        this.allStops = [];
        this.init();
    }

    init() {
        // Load all available stops
        this.loadAllStops();

        // Populate custom stops selects
        this.populateCustomStopsSelects();

        // Load saved custom stops
        this.loadSavedCustomStops();

        // Populate favorites select
        this.populateFavoriteSelect();

        // Display current favorites
        this.displayFavorites();

        // Setup event listeners
        this.setupEventListeners();

        // IMPORTANTE: Forza refresh delle select DOPO che tutto è caricato
        // Questo assicura che le fermate personalizzate appaiano subito
        setTimeout(() => {
            if (typeof searchEngine !== 'undefined' && searchEngine.populateStopSelects) {
                searchEngine.populateStopSelects();
            }
        }, 100);
    }

    loadAllStops() {
        const allStopsSet = new Set();

        // Load stops from schedule data
        if (typeof SCHEDULES_DATA !== 'undefined') {
            SCHEDULES_DATA.andata_verso_castellammare.fermate_ordine.forEach(stop => allStopsSet.add(stop));
            SCHEDULES_DATA.ritorno_verso_lettere.fermate_ordine.forEach(stop => allStopsSet.add(stop));
        }

        this.allStops = Array.from(allStopsSet).sort();
    }

    populateCustomStopsSelects() {
        const homeSelect = document.getElementById('home-stop');
        const workSelect = document.getElementById('work-stop');
        const schoolSelect = document.getElementById('school-stop');

        const selects = [homeSelect, workSelect, schoolSelect];

        selects.forEach(select => {
            if (!select) return;

            select.innerHTML = '<option value="">-- Non impostata --</option>';
            this.allStops.forEach(stop => {
                select.innerHTML += `<option value="${stop}">${stop}</option>`;
            });
        });
    }

    loadSavedCustomStops() {
        const homeSelect = document.getElementById('home-stop');
        const workSelect = document.getElementById('work-stop');
        const schoolSelect = document.getElementById('school-stop');

        if (homeSelect && this.customStops.home) homeSelect.value = this.customStops.home;
        if (workSelect && this.customStops.work) workSelect.value = this.customStops.work;
        if (schoolSelect && this.customStops.school) schoolSelect.value = this.customStops.school;
    }

    populateFavoriteSelect() {
        const select = document.getElementById('add-favorite-select');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleziona una fermata --</option>';
        this.allStops.forEach(stop => {
            // Don't show stops that are already favorites
            if (!this.favoriteStops.includes(stop)) {
                select.innerHTML += `<option value="${stop}">${stop}</option>`;
            }
        });
    }

    setupEventListeners() {
        // Save custom stops button
        const saveBtn = document.getElementById('save-custom-stops');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCustomStops());
        }

        // Add favorite button
        const addFavBtn = document.getElementById('add-favorite-btn');
        if (addFavBtn) {
            addFavBtn.addEventListener('click', () => this.addFavorite());
        }

        // Reset settings button
        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
    }

    saveCustomStops() {
        const homeSelect = document.getElementById('home-stop');
        const workSelect = document.getElementById('work-stop');
        const schoolSelect = document.getElementById('school-stop');

        this.customStops = {
            home: homeSelect?.value || '',
            work: workSelect?.value || '',
            school: schoolSelect?.value || ''
        };

        localStorage.setItem('customStops', JSON.stringify(this.customStops));
        this.showAlert('✅ Fermate personalizzate salvate!', 'success');

        // Trigger update in search engine if available
        if (typeof searchEngine !== 'undefined' && searchEngine.populateStopSelects) {
            searchEngine.populateStopSelects();
        }
    }

    addFavorite() {
        const select = document.getElementById('add-favorite-select');
        if (!select || !select.value) {
            this.showAlert('⚠️ Seleziona una fermata prima di aggiungerla ai preferiti', 'error');
            return;
        }

        const stop = select.value;

        if (this.favoriteStops.includes(stop)) {
            this.showAlert('⚠️ Questa fermata è già nei preferiti', 'error');
            return;
        }

        this.favoriteStops.push(stop);
        localStorage.setItem('favoriteStops', JSON.stringify(this.favoriteStops));

        this.displayFavorites();
        this.populateFavoriteSelect();
        select.value = '';

        this.showAlert('⭐ Fermata aggiunta ai preferiti!', 'success');

        // Trigger update in search engine
        if (typeof searchEngine !== 'undefined' && searchEngine.populateStopSelects) {
            searchEngine.populateStopSelects();
        }
    }

    removeFavorite(stop) {
        this.favoriteStops = this.favoriteStops.filter(s => s !== stop);
        localStorage.setItem('favoriteStops', JSON.stringify(this.favoriteStops));

        this.displayFavorites();
        this.populateFavoriteSelect();

        this.showAlert('🗑️ Fermata rimossa dai preferiti', 'success');

        // Trigger update in search engine
        if (typeof searchEngine !== 'undefined' && searchEngine.populateStopSelects) {
            searchEngine.populateStopSelects();
        }
    }

    displayFavorites() {
        const container = document.getElementById('favorites-list');
        if (!container) return;

        if (this.favoriteStops.length === 0) {
            container.innerHTML = '<p class="empty-state">Nessuna fermata preferita. Aggiungine una sopra!</p>';
            return;
        }

        let html = '';
        this.favoriteStops.forEach(stop => {
            html += `
                <div class="favorite-item">
                    <div class="favorite-content">
                        <span class="favorite-icon">⭐</span>
                        <span class="favorite-name">${stop}</span>
                    </div>
                    <button class="favorite-remove" onclick="settingsManager.removeFavorite('${stop}')">
                        🗑️ Rimuovi
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    resetSettings() {
        if (!confirm('Sei sicuro di voler cancellare tutte le impostazioni? Questa azione non può essere annullata.')) {
            return;
        }

        this.customStops = { home: '', work: '', school: '' };
        this.favoriteStops = [];

        localStorage.removeItem('customStops');
        localStorage.removeItem('favoriteStops');

        this.loadSavedCustomStops();
        this.displayFavorites();
        this.populateFavoriteSelect();

        this.showAlert('🔄 Impostazioni ripristinate ai valori predefiniti', 'success');

        // Trigger update in search engine
        if (typeof searchEngine !== 'undefined' && searchEngine.populateStopSelects) {
            searchEngine.populateStopSelects();
        }
    }

    loadCustomStops() {
        const stored = localStorage.getItem('customStops');
        if (stored) {
            return JSON.parse(stored);
        }
        return { home: '', work: '', school: '' };
    }

    loadFavoriteStops() {
        const stored = localStorage.getItem('favoriteStops');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    // Public method to get custom and favorite stops for search engine
    getCustomStops() {
        return this.customStops;
    }

    getFavoriteStops() {
        return this.favoriteStops;
    }

    showAlert(message, type = 'success') {
        const container = document.getElementById('settings-alerts');
        if (!container) return;

        const alert = document.createElement('div');
        alert.className = `alert ${type === 'success' ? 'success' : 'error'}`;
        alert.innerHTML = message;
        container.appendChild(alert);

        setTimeout(() => alert.remove(), 4000);
    }
}

// Initialize settings manager when DOM is ready
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});
