// Main Application Controller

class App {
    constructor() {
        this.currentTab = 'chatbot';
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupThemeToggle();
        this.loadThemePreference();
        this.showTab('chatbot');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Add a small pulse animation to the button
        const button = document.getElementById('theme-toggle');
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = '';
        }, 10);
    }

    setupTabNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.showTab(tabName);
            });
        });
    }

    showTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        this.currentTab = tabName;
    }
}

// Utility Functions
const utils = {
    formatTime(date) {
        return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    },

    formatDate(date) {
        return date.toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    parseTimeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(num => parseInt(num));
        return hours * 60 + minutes;
    },

    getCurrentDayType() {
        const now = new Date();
        const dayOfWeek = now.getDay();

        if (dayOfWeek === 0) return 'festivo';
        if (dayOfWeek === 6) return 'sabato';
        return 'feriale';
    }
};

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();

    // Display current date/time info
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
});

function updateDateTime() {
    const now = new Date();
    const dateTimeEl = document.getElementById('current-datetime');
    if (dateTimeEl) {
        const dayType = utils.getCurrentDayType();
        const dayTypeLabel = dayType === 'festivo' ? 'Festivo' : dayType === 'sabato' ? 'Sabato' : 'Feriale';
        dateTimeEl.textContent = `${utils.formatDate(now)} - Tipo giorno: ${dayTypeLabel}`;
    }
}
