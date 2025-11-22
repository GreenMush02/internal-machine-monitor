// Main Application Logic
let selectedMachine = null;
const machinesMap = new Map(machinesData.map(obj => [obj.id, obj]));

// Initialize application - czeka na załadowanie komponentów
function initializeApp() {
    console.log('Inicjalizacja aplikacji...');

    // Initialize auth and navigation
    updateUserDisplay();
    navManager.init();
    setupUserMenu();

    // Time
    updateClock();
    setInterval(updateClock, 1000);

    // Initial render
    renderMachines();
    renderProcesses();
    renderFailures();
    updateKPIs();

    // Real-time updates
    setInterval(() => {
        updateMachineProgress();
        updateKPIs();
    }, 5000);

    // Check for critical machines
    checkCriticalMachines();

    console.log('✓ Aplikacja zainicjalizowana');
}

// Czekaj na załadowanie komponentów przed inicjalizacją
document.addEventListener('componentsLoaded', () => {
    initializeApp();
});

// User menu toggle
function setupUserMenu() {
    const btn = document.getElementById('userMenuBtn');
    const menu = document.getElementById('userMenu');

    if (btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });

        // Close on click outside
        document.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    }
}

// Switch role (demo function)
function switchRole(role) {
    authManager.login(role);
}

// Update user display
function updateUserDisplay() {
    const user = authManager.getCurrentUser();
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');

    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = authManager.getRoleName();
}

// Update clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
}

// Update KPIs
function updateKPIs() {
    const operational = [...machinesMap.values()].filter(m => m.status === 'operational').length;
    const total = [...machinesMap.values()].length;
    const highRisk = [...machinesMap.values()].filter(m => m.failureRisk === 'high').length;
    const critical = [...machinesMap.values()].filter(m => m.status === 'critical').length;

    document.getElementById('operationalCount').textContent = `${operational} / ${total}`;
    document.getElementById('riskCount').textContent = highRisk;
    document.getElementById('failureCount').textContent = critical;
}

// Render active processes grid
function renderProcesses() {
    const grid = document.getElementById('processesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    currentProcesses.forEach(currentProcess => {
        const processDetails = processes.find(p => p.id === currentProcess.processId);
        if (!processDetails) return;

        const card = createProcessCard(currentProcess, processDetails);
        grid.appendChild(card);
    });
}

// Create process card
function createProcessCard(currentProcess, processDetails) {
    const card = document.createElement('div');

    const statusClasses = {
        active: 'border-green-500',
        pending: 'border-yellow-500',
        completed: 'border-blue-500'
    };

    const statusIcons = {
        active: 'fa-play-circle',
        pending: 'fa-clock',
        completed: 'fa-check-circle'
    };

    const statusLabels = {
        active: 'Aktywny',
        pending: 'Oczekujący',
        completed: 'Zakończony'
    };

    const assignedMachine = machinesMap.get(currentProcess.assignedMachine);
    const assignedAt = new Date(currentProcess.assignedAt);
    const timeElapsed = Math.floor((new Date() - assignedAt) / (1000 * 60 * 60)); // hours

    card.className = `bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 ${statusClasses[currentProcess.status]}`;

    card.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-bold text-xl">${processDetails.name}</div>
            <div class="w-10 h-10 rounded-full ${currentProcess.status === 'active' ? 'bg-green-500' : currentProcess.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'} flex items-center justify-center text-white">
                <i class="fas ${statusIcons[currentProcess.status]}"></i>
            </div>
        </div>

        <div class="space-y-2 mb-4 text-sm">
            <div class="flex justify-between">
                <span class="text-slate-400">Status:</span>
                <span class="text-white font-semibold">${statusLabels[currentProcess.status]}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Kategoria:</span>
                <span class="text-white font-semibold">${processDetails.category}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Przypisana maszyna:</span>
                <span class="text-white font-semibold">${assignedMachine ? assignedMachine.name : 'N/A'}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Czas trwania:</span>
                <span class="text-white font-semibold">~${processDetails.averageDuration}h</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Rozpoczęty:</span>
                <span class="text-white font-semibold">${assignedAt.toLocaleDateString('pl-PL')} ${assignedAt.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
        </div>

        ${currentProcess.status === 'active' ? `
            <div class="p-3 bg-dark-hover rounded-lg text-sm">
                <div class="flex justify-between items-center">
                    <span class="text-slate-400">Czas pracy:</span>
                    <span class="font-bold text-green-500">${timeElapsed}h / ${processDetails.averageDuration}h</span>
                </div>
            </div>
        ` : ''}

        ${currentProcess.status === 'pending' ? `
            <div class="p-3 bg-dark-hover rounded-lg text-sm">
                <div class="flex items-center gap-2 text-yellow-500">
                    <i class="fas fa-info-circle"></i>
                    <span>Oczekuje na rozpoczęcie</span>
                </div>
            </div>
        ` : ''}
    `;

    return card;
}

// Render machines grid
function renderMachines() {
    const grid = document.getElementById('machinesGrid');
    grid.innerHTML = '';

    [...machinesMap.values()].forEach(machine => {
        const card = createMachineCard(machine);
        grid.appendChild(card);
    });
}

// Create machine card
function createMachineCard(machine) {
    const card = document.createElement('div');

    // Pobierz aktywny proces dla tej maszyny
    const activeProcess = currentProcesses.find(cp =>
        cp.assignedMachine === machine.id && cp.status === 'active'
    );

    let currentJobText = 'Bezczynna';
    let currentJobColor = 'text-slate-500';

    if (activeProcess) {
        const processDetails = processes.find(p => p.id === activeProcess.processId);
        if (processDetails) {
            currentJobText = processDetails.name;
            currentJobColor = 'text-green-400';
        }
    } else {
        // Sprawdź czy są procesy oczekujące
        const pendingProcess = currentProcesses.find(cp =>
            cp.assignedMachine === machine.id && cp.status === 'pending'
        );
        if (pendingProcess) {
            currentJobText = 'Oczekuje';
            currentJobColor = 'text-yellow-400';
        }
    }

    // Status classes
    const statusClasses = {
        operational: 'border-green-500',
        warning: 'border-yellow-500 animate-pulse-warning',
        critical: 'border-red-500 animate-pulse-critical',
        offline: 'border-slate-600 opacity-70'
    };

    const iconClasses = {
        operational: 'bg-green-500',
        warning: 'bg-yellow-500',
        critical: 'bg-red-500',
        offline: 'bg-slate-600'
    };

    const iconSymbols = {
        operational: 'fa-check-circle',
        warning: 'fa-exclamation-circle',
        critical: 'fa-times-circle',
        offline: 'fa-power-off'
    };

    const riskBadges = {
        low: 'bg-green-500/20 text-green-500',
        medium: 'bg-yellow-500/20 text-yellow-500',
        high: 'bg-red-500/20 text-red-500'
    };

    card.className = `bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 ${statusClasses[machine.status]} cursor-pointer`;

    card.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-bold text-xl">${machine.name}</div>
            <div class="w-10 h-10 rounded-full ${iconClasses[machine.status]} flex items-center justify-center text-white">
                <i class="fas ${iconSymbols[machine.status]}"></i>
            </div>
        </div>

        <div class="space-y-2 mb-4 text-sm">
            <div class="flex justify-between">
                <span class="text-slate-400">Typ:</span>
                <span class="text-white font-semibold">${machine.type}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Zlecenie:</span>
                <span class="${currentJobColor} font-semibold">${currentJobText}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Temperatura:</span>
                <span class="text-white font-semibold">${machine.temperature}°C</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-400">Wibracje:</span>
                <span class="text-white font-semibold">${machine.vibration} mm/s</span>
            </div>
        </div>

        ${activeProcess ? `
            <div class="mb-4">
                <div class="text-xs text-slate-400 mb-2">Postęp: ${machine.progress}%</div>
                <div class="w-full h-2 bg-dark-hover rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500" style="width: ${machine.progress}%"></div>
                </div>
            </div>
        ` : ''}

        <div class="flex items-center justify-between gap-2 p-3 bg-dark-hover rounded-lg text-sm">
            <span class="text-slate-400">Ryzyko awarii:</span>
            <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${riskBadges[machine.failureRisk]}">
                    ${machine.failureRisk === 'low' ? 'Niskie' : machine.failureRisk === 'medium' ? 'Średnie' : 'Wysokie'}
                </span>
                <span class="font-bold">${machine.failureProbability}%</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => showMachineDetails(machine));

    return card;
}

// Show machine details in modal
function showMachineDetails(machine) {
    selectedMachine = machine;
    const modal = document.getElementById('machineModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Pobierz aktywny proces
    const activeProcess = currentProcesses.find(cp =>
        cp.assignedMachine === machine.id && cp.status === 'active'
    );
    let activeProcessDetails = null;
    if (activeProcess) {
        activeProcessDetails = processes.find(p => p.id === activeProcess.processId);
    }

    modalTitle.textContent = `${machine.name} - Szczegóły`;

    modalBody.innerHTML = `
        <div class="space-y-6">
            <!-- Current Process -->
            ${activeProcessDetails ? `
                <div class="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
                    <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                        <i class="fas fa-play-circle text-green-400"></i>
                        Aktualny Proces
                    </h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-slate-300">Nazwa procesu:</span>
                            <span class="font-bold text-green-400">${activeProcessDetails.name}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-300">Kategoria:</span>
                            <span class="text-white">${activeProcessDetails.category}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-300">Szacowany czas:</span>
                            <span class="text-white">~${activeProcessDetails.averageDuration}h</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-300">Rozpoczęty:</span>
                            <span class="text-white">${new Date(activeProcess.assignedAt).toLocaleDateString('pl-PL')} ${new Date(activeProcess.assignedAt).toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <div class="text-center text-slate-400 py-3">
                        <i class="fas fa-pause-circle text-3xl mb-2"></i>
                        <div class="font-semibold">Brak aktywnego procesu</div>
                        <div class="text-sm mt-1">Maszyna jest bezczynna</div>
                    </div>
                </div>
            `}

            <!-- Status Overview -->
            <div class="bg-dark-hover rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <i class="fas fa-info-circle text-primary"></i>
                    Status maszyny
                </h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <div class="text-xs text-slate-400 mb-1">Status</div>
                        <div class="font-semibold">${getStatusLabel(machine.status)}</div>
                    </div>
                    <div>
                        <div class="text-xs text-slate-400 mb-1">Postęp</div>
                        <div class="font-semibold">${machine.progress}%</div>
                    </div>
                    <div>
                        <div class="text-xs text-slate-400 mb-1">Godziny pracy</div>
                        <div class="font-semibold">${machine.runningHours}h</div>
                    </div>
                    <div>
                        <div class="text-xs text-slate-400 mb-1">Cykle</div>
                        <div class="font-semibold">${machine.cyclesCompleted.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <!-- Sensors Data -->
            <div class="bg-dark-hover rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <i class="fas fa-thermometer-half text-primary"></i>
                    Dane z czujników
                </h3>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-slate-400">Temperatura</span>
                            <span class="font-semibold ${machine.temperature > 80 ? 'text-red-500' : machine.temperature > 70 ? 'text-yellow-500' : 'text-green-500'}">
                                ${machine.temperature}°C
                            </span>
                        </div>
                        <div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full ${machine.temperature > 80 ? 'bg-red-500' : machine.temperature > 70 ? 'bg-yellow-500' : 'bg-green-500'}" style="width: ${(machine.temperature / 100) * 100}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm text-slate-400">Wibracje</span>
                            <span class="font-semibold ${machine.vibration > 5 ? 'text-red-500' : machine.vibration > 3 ? 'text-yellow-500' : 'text-green-500'}">
                                ${machine.vibration} mm/s
                            </span>
                        </div>
                        <div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full ${machine.vibration > 5 ? 'bg-red-500' : machine.vibration > 3 ? 'bg-yellow-500' : 'bg-green-500'}" style="width: ${(machine.vibration / 10) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Maintenance -->
            <div class="bg-dark-hover rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <i class="fas fa-wrench text-primary"></i>
                    Konserwacja
                </h3>
                <div class="text-sm">
                    <div class="flex justify-between mb-2">
                        <span class="text-slate-400">Ostatnia konserwacja:</span>
                        <span class="font-semibold">${new Date(machine.lastMaintenance).toLocaleDateString('pl-PL')}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Dni od konserwacji:</span>
                        <span class="font-semibold">${Math.floor((new Date() - new Date(machine.lastMaintenance)) / (1000 * 60 * 60 * 24))} dni</span>
                    </div>
                </div>
            </div>

            <!-- AI Prediction -->
            <div class="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <i class="fas fa-brain text-purple-400"></i>
                    Predykcja AI
                </h3>
                <div class="text-sm space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-slate-300">Prawdopodobieństwo awarii:</span>
                        <span class="text-2xl font-bold ${machine.failureProbability > 70 ? 'text-red-500' : machine.failureProbability > 40 ? 'text-yellow-500' : 'text-green-500'}">
                            ${machine.failureProbability}%
                        </span>
                    </div>
                    <div class="text-slate-400 text-xs mt-3">
                        ${getPredictionMessage(machine)}
                    </div>
                </div>
            </div>

            <!-- Process Assignments -->
            <div class="bg-dark-hover rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <i class="fas fa-tasks text-primary"></i>
                    Przypisane Procesy
                </h3>
                <div id="assignedProcessesList" class="space-y-2 mb-4">
                    ${renderAssignedProcesses(machine)}
                </div>

                <!-- Add Process Form -->
                <div class="pt-4 border-t border-slate-600">
                    <label class="block text-sm text-slate-400 mb-2">Przypisz nowy proces:</label>
                    <div class="flex gap-2">
                        <select id="processSelect" class="flex-1 bg-dark-bg border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none">
                            <option value="">-- Wybierz proces --</option>
                            ${processes.map(p => `
                                <option value="${p.id}">${p.name} (${p.category})</option>
                            `).join('')}
                        </select>
                        <button onclick="assignProcessToCurrentMachine()" class="px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg font-semibold transition-all text-sm">
                            <i class="fas fa-plus mr-1"></i>
                            Dodaj
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('machineModal');
    modal.classList.add('hidden');
    selectedMachine = null;
}

// Report failure
function reportFailure() {
    if (!selectedMachine) return;

    // Utwórz awarię na podstawie danych maszyny
    const title = `Awaria maszyny ${selectedMachine.name}`;
    let description = `Status: ${getStatusLabel(selectedMachine.status)}`;
    let severity = 'medium';

    // Określ poziom wagi na podstawie parametrów maszyny
    if (selectedMachine.temperature > 80 || selectedMachine.vibration > 5 || selectedMachine.failureProbability > 70) {
        severity = 'critical';
        description += ` | Temperatura: ${selectedMachine.temperature}°C, Wibracje: ${selectedMachine.vibration} mm/s`;
    } else if (selectedMachine.temperature > 70 || selectedMachine.vibration > 3 || selectedMachine.failureProbability > 40) {
        severity = 'high';
        description += ` | Ryzyko awarii: ${selectedMachine.failureProbability}%`;
    }

    const newFailure = createFailureReport(selectedMachine.machineId || selectedMachine.id, title, description, severity);

    showAlert(`Awaria zgłoszona dla maszyny ${selectedMachine.name}`);
    closeModal();

    // Zmień status maszyny na critical jeśli awaria jest krytyczna
    if (severity === 'critical') {
        selectedMachine.status = 'critical';
    } else if (severity === 'high') {
        selectedMachine.status = 'warning';
    }

    renderMachines();
    renderFailures();
    updateKPIs();
}

// Show alert
function showAlert(message) {
    const banner = document.getElementById('alertBanner');
    const messageEl = document.getElementById('alertMessage');

    messageEl.textContent = message;
    banner.classList.remove('hidden');
}

// Close alert
function closeAlert() {
    const banner = document.getElementById('alertBanner');
    banner.classList.add('hidden');
}

// Create prediction item
function createPredictionItem(machine) {
    const div = document.createElement('div');

    const borderColors = {
        high: 'border-red-500',
        medium: 'border-yellow-500',
        low: 'border-green-500'
    };

    div.className = `bg-dark-hover p-5 rounded-lg border-l-4 ${borderColors[machine.failureRisk]} hover:translate-x-2 transition-transform`;

    const factors = [];
    if (machine.temperature > 70) factors.push('Wysoka temperatura');
    if (machine.vibration > 3) factors.push('Zwiększone wibracje');
    if (machine.runningHours > 3000) factors.push('Duża liczba godzin pracy');
    const daysSinceMaintenance = Math.floor((new Date() - new Date(machine.lastMaintenance)) / (1000 * 60 * 60 * 24));
    if (daysSinceMaintenance > 30) factors.push('Zaległa konserwacja');

    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <div class="font-bold text-lg">${machine.name}</div>
            <div class="text-3xl font-bold ${machine.failureProbability > 70 ? 'text-red-500' : 'text-yellow-500'}">
                ${machine.failureProbability}%
            </div>
        </div>
        <div class="text-sm text-slate-400 mb-3">
            ${getPredictionTimeframe(machine.failureProbability)}
        </div>
        <div class="flex flex-wrap gap-2">
            ${factors.map(factor => `
                <span class="px-3 py-1 bg-dark-bg rounded-full text-xs text-slate-300">
                    ${factor}
                </span>
            `).join('')}
        </div>
    `;

    return div;
}

// Update machine progress (simulation)
function updateMachineProgress() {
    [...machinesMap.values()].forEach(machine => {
        if (machine.status === 'operational' && machine.progress < 100) {
            machine.progress = Math.min(100, machine.progress + Math.random() * 3);
        }
    });
    renderMachines();
}

// Check for critical machines
function checkCriticalMachines() {
    const criticalMachines = [...machinesMap.values()].filter(m => m.status === 'critical');
    if (criticalMachines.length > 0) {
        showAlert(`UWAGA: ${criticalMachines.length} maszyna(y) wymaga natychmiastowej uwagi!`);
    }
}

// Helper functions
function getStatusLabel(status) {
    const labels = {
        operational: 'Operacyjna',
        warning: 'Ostrzeżenie',
        critical: 'Krytyczna',
        offline: 'Wyłączona'
    };
    return labels[status] || status;
}

function getPredictionMessage(machine) {
    if (machine.failureProbability > 70) {
        return 'Zalecana natychmiastowa konserwacja. Wysokie ryzyko awarii w ciągu najbliższych 24-48 godzin.';
    } else if (machine.failureProbability > 40) {
        return 'Zaplanuj konserwację w ciągu najbliższych 7 dni. Monitoruj parametry pracy.';
    } else {
        return 'Maszyna w dobrym stanie. Kontynuuj rutynową konserwację zgodnie z harmonogramem.';
    }
}

function getPredictionTimeframe(probability) {
    if (probability > 70) {
        return 'Przewidywana awaria w ciągu 24-48h';
    } else if (probability > 40) {
        return 'Przewidywana awaria w ciągu 3-7 dni';
    } else {
        return 'Niskie ryzyko awarii w najbliższym czasie';
    }
}

// Process Assignment Functions

/**
 * Renderuje listę przypisanych procesów dla danej maszyny
 */
function renderAssignedProcesses(machine) {
    // Pobierz aktywne procesy dla tej maszyny z currentProcesses
    const machineProcesses = currentProcesses.filter(cp => cp.assignedMachine === machine.id);

    if (machineProcesses.length === 0) {
        return `
            <div class="text-center text-slate-400 py-4 text-sm">
                <i class="fas fa-inbox text-2xl mb-2"></i>
                <div>Brak przypisanych procesów</div>
            </div>
        `;
    }

    return machineProcesses.map(currentProc => {
        const processDetails = processes.find(p => p.id === currentProc.processId);
        if (!processDetails) return '';

        const statusBadges = {
            active: 'bg-green-500/20 text-green-500',
            pending: 'bg-yellow-500/20 text-yellow-500',
            completed: 'bg-blue-500/20 text-blue-500'
        };

        const statusLabels = {
            active: 'Aktywny',
            pending: 'Oczekujący',
            completed: 'Zakończony'
        };

        return `
            <div class="bg-dark-bg rounded-lg p-3 flex items-center justify-between">
                <div class="flex-1">
                    <div class="font-semibold text-sm">${processDetails.name}</div>
                    <div class="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>${processDetails.category} • ${processDetails.averageDuration}h</span>
                        <span class="px-2 py-0.5 rounded-full text-xs ${statusBadges[currentProc.status]}">
                            ${statusLabels[currentProc.status]}
                        </span>
                    </div>
                </div>
                <button
                    onclick="removeAssignment(${currentProc.id})"
                    class="ml-3 text-red-500 hover:text-red-400 transition-colors"
                    title="Usuń przypisanie"
                >
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Przypisuje wybrany proces do aktualnie otwartej maszyny
 */
function assignProcessToCurrentMachine() {
    if (!selectedMachine) {
        showAlert('Błąd: nie wybrano maszyny');
        return;
    }

    const select = document.getElementById('processSelect');
    const processId = select.value;

    if (!processId) {
        showAlert('Proszę wybrać proces z listy');
        return;
    }

    const result = assignProcessToMachine(selectedMachine, processId);

    if (result) {
        showAlert(`Proces został przypisany do ${selectedMachine.name}`);
        // Odśwież widoki
        renderProcesses();
        showMachineDetails(selectedMachine);
    } else {
        showAlert('Nie udało się przypisać procesu');
    }
}

/**
 * Usuwa przypisanie procesu
 */
function removeAssignment(assignmentId) {
    if (confirm('Czy na pewno chcesz usunąć to przypisanie?')) {
        const success = removeProcessAssignment(assignmentId);

        if (success && selectedMachine) {
            showAlert('Przypisanie zostało usunięte');
            // Odśwież modal
            showMachineDetails(selectedMachine);
        } else {
            showAlert('Nie udało się usunąć przypisania');
        }
    }
}
