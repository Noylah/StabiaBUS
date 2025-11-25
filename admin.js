// Admin Panel - CRUD Operations for Schedule Management

class AdminPanel {
    constructor() {
        this.data = this.loadData();
        this.editingRow = null;
        this.init();
    }

    // Load data from localStorage or use default
    loadData() {
        const stored = localStorage.getItem('schedulesData');
        if (stored) {
            return JSON.parse(stored);
        }
        return JSON.parse(JSON.stringify(SCHEDULES_DATA)); // Deep clone
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('schedulesData', JSON.stringify(this.data));
        this.showAlert('Modifiche salvate con successo!', 'success');
    }

    init() {
        this.renderTables();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('save-data-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveData());
        }

        // Add new schedule buttons
        const addAndataBtn = document.getElementById('add-andata-btn');
        const addRitornoBtn = document.getElementById('add-ritorno-btn');

        if (addAndataBtn) {
            addAndataBtn.addEventListener('click', () => this.openAddModal('andata'));
        }
        if (addRitornoBtn) {
            addRitornoBtn.addEventListener('click', () => this.openAddModal('ritorno'));
        }
    }

    // Render both tables
    renderTables() {
        this.renderTable('andata_verso_castellammare', 'andata-table', 'Andata - Verso Castellammare');
        this.renderTable('ritorno_verso_lettere', 'ritorno-table', 'Ritorno - Verso Lettere');
    }

    // Render a single table
    renderTable(dataKey, tableId, title) {
        const container = document.getElementById(tableId);
        if (!container) return;

        const scheduleData = this.data[dataKey];
        const fermate = scheduleData.fermate_ordine;

        let html = `
      <h3>${title}</h3>
      <div class="table-container">
        <table class="schedule-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              ${fermate.map(f => `<th>${f}</th>`).join('')}
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
    `;

        scheduleData.corse.forEach(corsa => {
            html += `
        <tr data-id="${corsa.id}" data-direction="${dataKey}">
          <td>${corsa.id}</td>
          <td>
            <select class="tipo-select" data-field="tipo">
              ${Object.keys(SCHEDULE_TYPES).map(tipo =>
                `<option value="${tipo}" ${corsa.tipo === tipo ? 'selected' : ''}>${tipo}</option>`
            ).join('')}
            </select>
          </td>
      `;

            fermate.forEach(fermata => {
                html += `
          <td>
            <input 
              type="text" 
              value="${corsa.orari[fermata] || ''}" 
              data-stop="${fermata}"
              placeholder="--:--"
              pattern="[0-9]{2}:[0-9]{2}"
            />
          </td>
        `;
            });

            html += `
          <td class="action-buttons">
            <button class="action-button edit" onclick="adminPanel.saveRow(this)">💾 Salva</button>
            <button class="action-button delete" onclick="adminPanel.deleteRow(${corsa.id}, '${dataKey}')">🗑️ Elimina</button>
          </td>
        </tr>
      `;
        });

        html += `
          </tbody>
        </table>
      </div>
    `;

        container.innerHTML = html;
    }

    // Save edited row
    saveRow(button) {
        const row = button.closest('tr');
        const id = parseInt(row.dataset.id);
        const direction = row.dataset.direction;

        const tipoSelect = row.querySelector('.tipo-select');
        const newTipo = tipoSelect.value;

        const inputs = row.querySelectorAll('input[data-stop]');
        const newOrari = {};

        inputs.forEach(input => {
            const stop = input.dataset.stop;
            const value = input.value.trim();
            if (value && value.match(/^\d{2}:\d{2}$/)) {
                newOrari[stop] = value;
            }
        });

        // Update data
        const corsa = this.data[direction].corse.find(c => c.id === id);
        if (corsa) {
            corsa.tipo = newTipo;
            corsa.orari = newOrari;
            this.showAlert('Riga aggiornata! Ricorda di salvare le modifiche.', 'success');
        }
    }

    // Delete row
    deleteRow(id, direction) {
        if (!confirm('Sei sicuro di voler eliminare questa corsa?')) {
            return;
        }

        const index = this.data[direction].corse.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data[direction].corse.splice(index, 1);
            this.renderTables();
            this.showAlert('Corsa eliminata! Ricorda di salvare le modifiche.', 'success');
        }
    }

    // Open modal to add new schedule
    openAddModal(direction) {
        const modal = document.getElementById('add-modal');
        const form = document.getElementById('add-schedule-form');

        // Set direction in form
        form.dataset.direction = direction === 'andata' ? 'andata_verso_castellammare' : 'ritorno_verso_lettere';

        // Update modal title
        document.getElementById('modal-title').textContent =
            direction === 'andata' ? 'Aggiungi Corsa - Verso Castellammare' : 'Aggiungi Corsa - Verso Lettere';

        // Populate stops
        const stopsContainer = document.getElementById('stops-container');
        const fermate = this.data[form.dataset.direction].fermate_ordine;

        let stopsHtml = '';
        fermate.forEach(fermata => {
            stopsHtml += `
        <div class="form-group">
          <label>${fermata}</label>
          <input type="text" name="stop-${fermata}" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}">
        </div>
      `;
        });
        stopsContainer.innerHTML = stopsHtml;

        modal.classList.add('active');
    }

    closeAddModal() {
        document.getElementById('add-modal').classList.remove('active');
        document.getElementById('add-schedule-form').reset();
    }

    addNewSchedule() {
        const form = document.getElementById('add-schedule-form');
        const direction = form.dataset.direction;
        const formData = new FormData(form);

        // Get next ID
        const currentIds = this.data[direction].corse.map(c => c.id);
        const newId = Math.max(...currentIds, 0) + 1;

        const tipo = formData.get('tipo');
        const orari = {};

        // Collect stop times
        this.data[direction].fermate_ordine.forEach(fermata => {
            const value = formData.get(`stop-${fermata}`);
            if (value && value.trim()) {
                orari[fermata] = value.trim();
            }
        });

        // Validate
        if (Object.keys(orari).length === 0) {
            this.showAlert('Inserisci almeno un orario per le fermate!', 'error');
            return;
        }

        // Add new schedule
        this.data[direction].corse.push({
            id: newId,
            tipo,
            orari
        });

        // Sort by first stop time
        this.data[direction].corse.sort((a, b) => {
            const firstStop = this.data[direction].fermate_ordine[0];
            const timeA = a.orari[firstStop] || '99:99';
            const timeB = b.orari[firstStop] || '99:99';
            return timeA.localeCompare(timeB);
        });

        this.renderTables();
        this.closeAddModal();
        this.showAlert('Nuova corsa aggiunta! Ricorda di salvare le modifiche.', 'success');
    }

    // Show alert message
    showAlert(message, type) {
        const alertsContainer = document.getElementById('alerts-container');
        if (!alertsContainer) return;

        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;

        alertsContainer.appendChild(alert);

        setTimeout(() => {
            alert.style.animation = 'fadeOut var(--transition-medium)';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }

    // Reset data to default
    resetData() {
        if (!confirm('Sei sicuro di voler ripristinare i dati originali? Tutte le modifiche andranno perse!')) {
            return;
        }

        localStorage.removeItem('schedulesData');
        this.data = JSON.parse(JSON.stringify(SCHEDULES_DATA));
        this.renderTables();
        this.showAlert('Dati ripristinati ai valori originali!', 'success');
    }

    // Export data as JSON
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `schedules-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
        this.showAlert('File JSON esportato!', 'success');
    }
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('andata-table')) {
        adminPanel = new AdminPanel();
    }
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(style);
