// Search Engine Deterministico per Consultazione Orari Pullman
// Sostituisce il chatbot conversazionale con filtri guidati

class SearchEngine {
    constructor() {
        this.currentData = this.loadData();
        this.init();
    }

    // Load data from localStorage or default
    loadData() {
        const stored = localStorage.getItem('schedulesData');
        if (stored) {
            return JSON.parse(stored);
        }
        return SCHEDULES_DATA;
    }

    init() {
        // Setup form event listeners
        const form = document.getElementById('search-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Setup swap button
        const swapBtn = document.getElementById('swap-stops-btn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapStops());
        }

        // Setup destination change handler for fallback line selection
        const destSelect = document.getElementById('destinazione-select');
        if (destSelect) {
            destSelect.addEventListener('change', () => this.toggleLineSelection());
        }

        // Populate initial stops
        this.populateStopSelects();

        // Ensure correct initial state for line selection
        this.toggleLineSelection();
    }

    // Toggle visibility of line selection based on destination value
    toggleLineSelection() {
        const destSelect = document.getElementById('destinazione-select');
        const lineContainer = document.getElementById('line-selection-container');

        if (!destSelect || !lineContainer) return;

        if (destSelect.value === '') {
            lineContainer.classList.remove('hidden');
        } else {
            lineContainer.classList.add('hidden');
        }
    }

    // Swap partenza e destinazione
    swapStops() {
        const departureSelect = document.getElementById('partenza-select');
        const arrivalSelect = document.getElementById('destinazione-select');

        if (!departureSelect || !arrivalSelect) return;

        // Scambia i valori
        const tempDeparture = departureSelect.value;
        departureSelect.value = arrivalSelect.value;
        arrivalSelect.value = tempDeparture;

        // Aggiorna visibilità selezione linea
        this.toggleLineSelection();
    }

    // AUTO-DETECT direzione basata sull'ordine delle fermate
    detectDirection(departure, arrival) {
        // Se manca partenza o arrivo, non possiamo determinare
        if (!departure || !arrival) {
            return null;
        }

        // Trova gli indici nelle fermate andata
        const andataStops = this.currentData.andata_verso_castellammare.fermate_ordine;
        const ritornoStops = this.currentData.ritorno_verso_lettere.fermate_ordine;

        // Cerca in andata
        let depIndexAndata = andataStops.indexOf(departure);
        let arrIndexAndata = andataStops.indexOf(arrival);

        // Se entrambe le fermate esistono nella linea andata
        if (depIndexAndata !== -1 && arrIndexAndata !== -1) {
            if (depIndexAndata < arrIndexAndata) {
                return 'andata'; // Lettere → Castellammare
            } else if (depIndexAndata > arrIndexAndata) {
                return 'ritorno'; // Castellammare → Lettere (percorso inverso)
            } else {
                // Stesso indice = stessa fermata
                return 'same';
            }
        }

        // Altrimenti usa le fermate ritorno
        let depIndexRitorno = ritornoStops.indexOf(departure);
        let arrIndexRitorno = ritornoStops.indexOf(arrival);

        if (depIndexRitorno !== -1 && arrIndexRitorno !== -1) {
            if (depIndexRitorno < arrIndexRitorno) {
                return 'ritorno'; // Castellammare → Lettere
            } else if (depIndexRitorno > arrIndexRitorno) {
                return 'andata'; // Lettere → Castellammare (percorso inverso)
            } else {
                return 'same';
            }
        }

        // Se non trovate, prova a determinare da una sola fermata
        if (depIndexAndata !== -1 || arrIndexAndata !== -1) {
            return 'andata';
        }
        if (depIndexRitorno !== -1 || arrIndexRitorno !== -1) {
            return 'ritorno';
        }

        return null; // Non trovato
    }

    // Populate stop select dropdowns
    populateStopSelects() {
        const departureSelect = document.getElementById('partenza-select');
        const arrivalSelect = document.getElementById('destinazione-select');

        if (!departureSelect || !arrivalSelect) return;

        // Get all unique stops from both directions
        const allStops = new Set();
        this.currentData.andata_verso_castellammare.fermate_ordine.forEach(stop => allStops.add(stop));
        this.currentData.ritorno_verso_lettere.fermate_ordine.forEach(stop => allStops.add(stop));

        // Get custom and favorite stops from settings if available
        const customStops = typeof settingsManager !== 'undefined' ? settingsManager.getCustomStops() : {};
        const favoriteStops = typeof settingsManager !== 'undefined' ? settingsManager.getFavoriteStops() : [];

        // Build prioritized lists
        const priorityStops = [];
        const regularStops = [];

        // Add custom stops first (if set)
        if (customStops.home) {
            priorityStops.push({ label: `🏠 Casa - ${customStops.home}`, value: customStops.home, type: 'custom' });
        }
        if (customStops.work) {
            priorityStops.push({ label: `💼 Lavoro - ${customStops.work}`, value: customStops.work, type: 'custom' });
        }
        if (customStops.school) {
            priorityStops.push({ label: `🎓 Scuola - ${customStops.school}`, value: customStops.school, type: 'custom' });
        }

        // Add favorite stops
        favoriteStops.forEach(stop => {
            // Don't add if already in custom stops
            const customValues = [customStops.home, customStops.work, customStops.school];
            if (!customValues.includes(stop)) {
                priorityStops.push({ label: `⭐ ${stop}`, value: stop, type: 'favorite' });
            }
        });

        // Add regular stops (excluding custom and favorites to avoid duplicates)
        const usedStops = [...Object.values(customStops), ...favoriteStops];
        allStops.forEach(stop => {
            if (!usedStops.includes(stop)) {
                regularStops.push({ label: stop, value: stop, type: 'regular' });
            }
        });

        // Sort regular stops alphabetically
        regularStops.sort((a, b) => a.label.localeCompare(b.label));

        // Clear and populate
        const selects = [departureSelect, arrivalSelect];
        selects.forEach(select => {
            select.innerHTML = '<option value="">-- Seleziona Fermata --</option>';

            // Add priority stops with separator
            if (priorityStops.length > 0) {
                select.innerHTML += '<optgroup label="━━━ Fermate Rapide ━━━">';
                priorityStops.forEach(stop => {
                    select.innerHTML += `<option value="${stop.value}">${stop.label}</option>`;
                });
                select.innerHTML += '</optgroup>';
            }

            // Add regular stops
            if (regularStops.length > 0) {
                select.innerHTML += '<optgroup label="━━━ Tutte le Fermate ━━━">';
                regularStops.forEach(stop => {
                    select.innerHTML += `<option value="${stop.value}">${stop.label}</option>`;
                });
                select.innerHTML += '</optgroup>';
            }
        });
    }

    // RULES ENGINE - Pre-processing logic
    applyPreprocessingRules(formData) {
        let { departure, arrival, dayTypes, timeStart, timeEnd, fallbackDirection } = formData;

        // REGOLA: Gragnano (Via C.mare) → Castellammare di Stabia
        if (departure === 'Gragnano (Via C.mare)') {
            departure = 'Castellammare di Stabia';
            this.showInfo('🔍 Ricerca con "Castellammare di Stabia" (equivalente a Gragnano Via C.mare)');
        }
        if (arrival === 'Gragnano (Via C.mare)') {
            arrival = 'Castellammare di Stabia';
        }

        // Validazione: partenza obbligatoria
        if (!departure) {
            this.showError('Devi specificare la fermata di partenza');
            return null;
        }

        // Validazione: almeno un tipo giorno selezionato
        if (!dayTypes || dayTypes.length === 0) {
            this.showError('Devi selezionare almeno un tipo di giorno');
            return null;
        }

        // REGOLA: Auto-swap orari se inizio > fine
        if (timeStart && timeEnd) {
            const startMinutes = this.timeToMinutes(timeStart);
            const endMinutes = this.timeToMinutes(timeEnd);

            if (startMinutes > endMinutes) {
                // Swap times
                const temp = timeStart;
                timeStart = timeEnd;
                timeEnd = temp;
                this.showInfo(`🔄 Orari invertiti: cerco dalle ${timeStart} alle ${timeEnd}`);
            }
        }

        let direction;

        // SE ARRIVO VUOTO: Usa fallback direction (Selezione Linea)
        if (!arrival) {
            direction = fallbackDirection;
            this.showInfo(`Mostro tutte le fermate verso ${direction === 'andata' ? 'Castellammare' : 'Lettere'}`);
        } else {
            // SE ARRIVO PRESENTE: Auto-detect direzione
            direction = this.detectDirection(departure, arrival);

            if (direction === 'same') {
                this.showError('❌ Partenza e destinazione sono la stessa fermata!');
                return null;
            }

            if (!direction) {
                this.showError('❌ Impossibile determinare la direzione per queste fermate');
                return null;
            }

            const directionLabel = direction === 'andata' ? 'Lettere → Castellammare' : 'Castellammare → Lettere';
            this.showInfo(`🚌 Direzione rilevata: ${directionLabel}`);
        }

        return {
            direction,
            departure,
            arrival, // Può essere vuoto
            timeStart,
            timeEnd,
            dayTypes
        };
    }

    // Get form data
    getFormData() {
        const departure = document.getElementById('partenza-select').value;
        const arrival = document.getElementById('destinazione-select').value;
        const timeStart = document.getElementById('ora-inizio').value;
        const timeEnd = document.getElementById('ora-fine').value;

        // Leggi checkbox multipli per tipo giorno
        const dayTypeCheckboxes = document.querySelectorAll('input[name="dayType"]:checked');
        const dayTypes = Array.from(dayTypeCheckboxes).map(cb => cb.value);

        // Leggi fallback direction (radio buttons)
        const fallbackDirectionInput = document.querySelector('input[name="fallback-direction"]:checked');
        const fallbackDirection = fallbackDirectionInput ? fallbackDirectionInput.value : 'andata';

        return {
            departure,
            arrival,
            timeStart,
            timeEnd,
            dayTypes,
            fallbackDirection
        };
    }

    // Main search handler
    handleSearch() {
        // Clear previous results
        this.clearResults();

        // Get form data
        const rawFormData = this.getFormData();
        if (!rawFormData) return;

        // Apply preprocessing rules
        const processedData = this.applyPreprocessingRules(rawFormData);
        if (!processedData) return; // Validation failed

        // Execute search
        const results = this.searchSchedules(processedData);
        // Display results
        this.displayResults(results, processedData);
    }

    //Search schedules based on filters
    searchSchedules(params) {
        const { direction, departure, arrival, dayTypes, timeStart, timeEnd } = params;

        // Get appropriate dataset
        const dataset = direction === 'andata'
            ? this.currentData.andata_verso_castellammare
            : this.currentData.ritorno_verso_lettere;

        // Filter schedules
        const filtered = dataset.corse.filter(corsa => {
            // Filter by day type (multipli) - la corsa deve matchare ALMENO UNO dei tipi selezionati
            if (!dayTypes.some(dayType => this.matchesDayType(corsa.tipo, dayType))) {
                return false;
            }

            // Must stop at departure
            if (!corsa.orari[departure]) return false;

            // If arrival specified, must stop there
            if (arrival && !corsa.orari[arrival]) return false;

            // Check if route goes from departure to arrival in correct order
            if (departure && arrival) {
                const departureIndex = dataset.fermate_ordine.indexOf(departure);
                const arrivalIndex = dataset.fermate_ordine.indexOf(arrival);

                if (departureIndex === -1 || arrivalIndex === -1) return false;
                if (departureIndex >= arrivalIndex) return false;
            }

            // Filter by time range
            if (timeStart || timeEnd) {
                const departureTime = departure ? corsa.orari[departure] : null;
                if (!departureTime) return false;

                const departureMinutes = this.timeToMinutes(departureTime);

                if (timeStart) {
                    const startMinutes = this.timeToMinutes(timeStart);
                    if (departureMinutes < startMinutes) return false;
                }

                if (timeEnd) {
                    const endMinutes = this.timeToMinutes(timeEnd);
                    if (departureMinutes > endMinutes) return false;
                }
            }

            return true;
        });

        return {
            schedules: filtered,
            fermate_ordine: dataset.fermate_ordine
        };
    }

    // Check if schedule type matches selected day type
    matchesDayType(scheduleType, selectedDayType) {
        const mappings = {
            'feriale': ['F', 'G', 'L', 'LS'],
            'festivo': ['H', 'G'],
            'sabato': ['F', 'G', '6', '6S'],
            'scolastico': ['S', 'LS', '6S', 'L']
        };

        return mappings[selectedDayType]?.includes(scheduleType) || false;
    }

    // Convert time string to minutes
    timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(num => parseInt(num));
        return hours * 60 + minutes;
    }

    // Display results in table
    displayResults(results, searchParams) {
        const container = document.getElementById('results-container');
        if (!container) return;

        if (results.schedules.length === 0) {
            container.innerHTML = `
        <div class="alert error">
          <strong>Nessuna corsa trovata</strong><br>
          Prova a modificare i criteri di ricerca (fascia oraria, tipo giorno, fermate).
        </div>
      `;
            return;
        }

        const { departure, arrival } = searchParams;

        let html = `
      <div class="results-header">
        <h3>Risultati Ricerca</h3>
        <p>Trovate <strong>${results.schedules.length}</strong> ${results.schedules.length === 1 ? 'corsa' : 'corse'}</p>
      </div>
      <div class="table-container">
        <table class="results-table">
          <thead>
            <tr>
              <th>Corsa</th>
              <th>Tipo</th>
              <th>Partenza</th>
              <th>Ora Partenza</th>
              ${arrival ? '<th>Destinazione</th><th>Ora Arrivo</th>' : ''}
              <th>Tutte le Fermate</th>
            </tr>
          </thead>
          <tbody>
    `;

        results.schedules.forEach((corsa, index) => {
            const departureTime = departure ? corsa.orari[departure] : '--:--';
            const arrivalTime = arrival ? corsa.orari[arrival] : '--:--';
            const tipoLabel = SCHEDULE_TYPES[corsa.tipo] || corsa.tipo;

            // Build all stops string
            const allStops = results.fermate_ordine
                .filter(fermata => corsa.orari[fermata])
                .map(fermata => `${fermata} (${corsa.orari[fermata]})`)
                .join(' → ');

            html += `
        <tr>
          <td><strong>#${index + 1}</strong></td>
          <td><span class="badge badge-${corsa.tipo}">${tipoLabel}</span></td>
          <td><strong>${departure || 'N/A'}</strong></td>
          <td class="time-highlight"><strong>${departureTime}</strong></td>
          ${arrival ? `<td><strong>${arrival}</strong></td><td class="time-highlight"><strong>${arrivalTime}</strong></td>` : ''}
          <td class="route-info">${allStops}</td>
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

    // Clear results
    clearResults() {
        const container = document.getElementById('results-container');
        if (container) {
            container.innerHTML = '';
        }
        this.clearAlerts();
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('alerts-container-search');
        if (!container) return;

        const alert = document.createElement('div');
        alert.className = 'alert error';
        alert.innerHTML = `<strong>Errore:</strong> ${message}`;
        container.appendChild(alert);

        setTimeout(() => alert.remove(), 5000);
    }

    // Show info message
    showInfo(message) {
        const container = document.getElementById('alerts-container-search');
        if (!container) return;

        const alert = document.createElement('div');
        alert.className = 'alert success';
        alert.innerHTML = `<strong>Info:</strong> ${message}`;
        container.appendChild(alert);

        setTimeout(() => alert.remove(), 4000);
    }

    // Clear all alerts
    clearAlerts() {
        const container = document.getElementById('alerts-container-search');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Initialize search engine when DOM is ready
let searchEngine;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('search-form')) {
        searchEngine = new SearchEngine();
    }
});
