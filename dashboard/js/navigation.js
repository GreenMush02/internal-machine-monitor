// Navigation & Section Management

class NavigationManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.sections = ['dashboard', 'analytics', 'management'];
    }

    init() {
        this.renderNavigation();
        this.attachEventListeners();
        this.showSection('dashboard');
    }

    renderNavigation() {
        const navContainer = document.getElementById('mainNavigation');
        if (!navContainer) return;

        const availableSections = authManager.getAvailableSections();

        navContainer.innerHTML = availableSections.map(section => `
            <button
                data-section="${section.id}"
                class="nav-tab px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
                       ${section.id === 'dashboard' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-dark-hover'}"
            >
                <i class="fas ${section.icon}"></i>
                <span class="hidden sm:inline">${section.name}</span>
            </button>
        `).join('');
    }

    attachEventListeners() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });
    }

    showSection(sectionId) {
        // Check permissions
        if (!authManager.canAccessSection(sectionId)) {
            this.showAccessDenied();
            return;
        }

        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            if (tab.dataset.section === sectionId) {
                tab.className = 'nav-tab px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 bg-primary text-white';
            } else {
                tab.className = 'nav-tab px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 text-slate-400 hover:text-white hover:bg-dark-hover';
            }
        });

        // Hide all sections
        this.sections.forEach(id => {
            const section = document.getElementById(`section-${id}`);
            if (section) {
                section.classList.add('hidden');
            }
        });

        // Show selected section
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionId;

            // Initialize section-specific logic
            this.initializeSection(sectionId);
        }
    }

    initializeSection(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                this.initDashboard();
                break;
            case 'analytics':
                this.initAnalytics();
                break;
            case 'management':
                this.initManagement();
                break;
        }
    }

    initDashboard() {
        // Render machines grid
        if (typeof renderMachines === 'function') {
            renderMachines();
        }
        updateKPIs();
    }

    initAnalytics() {
        // Initialize charts if not already done
        if (!window.chartsInitialized) {
            if (typeof initializeFailuresChart === 'function') {
                initializeFailuresChart();
            }
            if (typeof initializeUtilizationChart === 'function') {
                initializeUtilizationChart();
            }
            window.chartsInitialized = true;
        }
    }

    initManagement() {
        // Update executive dashboard
        if (typeof updateExecutiveDashboard === 'function') {
            updateExecutiveDashboard();
        }
    }

    showAccessDenied() {
        showAlert('Brak dostępu do tej sekcji. Wymagane uprawnienia: ' + authManager.getRoleName());
    }

    getCurrentSection() {
        return this.currentSection;
    }
}

// Global instance
const navManager = new NavigationManager();
