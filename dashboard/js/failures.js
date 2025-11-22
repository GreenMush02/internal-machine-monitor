// Failures Management System
let selectedFailure = null;

/**
 * Renderuje listę aktywnych awarii na dashboardzie
 */
function renderFailures() {
    const grid = document.getElementById('failuresGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (machineFailures.length === 0) {
        grid.innerHTML = `
            <div class="bg-dark-card rounded-xl p-8 text-center border border-green-500/30">
                <i class="fas fa-check-circle text-green-500 text-4xl mb-3"></i>
                <div class="text-lg font-semibold text-green-400">Brak aktywnych awarii</div>
                <div class="text-sm text-slate-400 mt-2">Wszystkie maszyny działają prawidłowo</div>
            </div>
        `;
        return;
    }

    machineFailures.forEach(failure => {
        const card = createFailureCard(failure);
        grid.appendChild(card);
    });
}

/**
 * Tworzy kartę awarii
 */
function createFailureCard(failure) {
    const card = document.createElement('div');

    const machine = machinesMap.get(failure.machineId);
    const machineName = machine ? machine.name : failure.machineId;

    const severityConfig = {
        critical: {
            color: 'border-red-500 bg-red-500/10',
            icon: 'fa-times-circle',
            iconColor: 'text-red-500',
            label: 'Krytyczna',
            badge: 'bg-red-500/20 text-red-500'
        },
        high: {
            color: 'border-orange-500 bg-orange-500/10',
            icon: 'fa-exclamation-circle',
            iconColor: 'text-orange-500',
            label: 'Wysoka',
            badge: 'bg-orange-500/20 text-orange-500'
        },
        medium: {
            color: 'border-yellow-500 bg-yellow-500/10',
            icon: 'fa-exclamation-triangle',
            iconColor: 'text-yellow-500',
            label: 'Średnia',
            badge: 'bg-yellow-500/20 text-yellow-500'
        },
        low: {
            color: 'border-blue-500 bg-blue-500/10',
            icon: 'fa-info-circle',
            iconColor: 'text-blue-500',
            label: 'Niska',
            badge: 'bg-blue-500/20 text-blue-500'
        }
    };

    const statusConfig = {
        open: { label: 'Otwarte', color: 'bg-red-500/20 text-red-400', icon: 'fa-folder-open' },
        in_progress: { label: 'W realizacji', color: 'bg-yellow-500/20 text-yellow-400', icon: 'fa-hourglass-half' },
        resolved: { label: 'Rozwiązane', color: 'bg-green-500/20 text-green-400', icon: 'fa-check-circle' }
    };

    const severity = severityConfig[failure.severity];
    const status = statusConfig[failure.status];
    const reportedDate = new Date(failure.reportedAt);

    card.className = `bg-dark-card rounded-xl p-6 border-l-4 ${severity.color} hover:shadow-xl transition-all cursor-pointer`;

    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-full ${severity.badge} flex items-center justify-center flex-shrink-0">
                    <i class="fas ${severity.icon} ${severity.iconColor} text-xl"></i>
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-bold">${failure.title}</h3>
                        <span class="px-3 py-1 rounded-full text-xs font-bold ${severity.badge}">
                            ${severity.label}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${status.color}">
                            <i class="fas ${status.icon} mr-1"></i>
                            ${status.label}
                        </span>
                    </div>
                    <p class="text-slate-400 text-sm mb-3">${failure.description}</p>

                    <div class="flex flex-wrap gap-4 text-xs text-slate-500">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-cog"></i>
                            <span>Maszyna: <strong class="text-slate-300">${machineName}</strong></span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-user"></i>
                            <span>Zgłaszający: <strong class="text-slate-300">${failure.reportedBy}</strong></span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-clock"></i>
                            <span>${reportedDate.toLocaleDateString('pl-PL')} ${reportedDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                        ${failure.assignedTo ? `
                            <div class="flex items-center gap-2">
                                <i class="fas fa-user-check"></i>
                                <span>Przypisane: <strong class="text-slate-300">${failure.assignedTo}</strong></span>
                            </div>
                        ` : ''}
                        <div class="flex items-center gap-2">
                            <i class="fas fa-comments"></i>
                            <span><strong class="text-slate-300">${failure.comments.length}</strong> komentarzy</span>
                        </div>
                    </div>
                </div>
            </div>
            <button class="ml-4 px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg text-sm font-semibold transition-all">
                Szczegóły
            </button>
        </div>
    `;

    card.addEventListener('click', () => showFailureDetails(failure));

    return card;
}

/**
 * Wyświetla szczegóły awarii w modalu
 */
function showFailureDetails(failure) {
    selectedFailure = failure;
    const modal = document.getElementById('failureModal');
    const modalTitleText = document.getElementById('failureModalTitleText');
    const modalIcon = document.getElementById('failureModalIcon');
    const modalBody = document.getElementById('failureModalBody');
    const resolveBtn = document.getElementById('resolveFailureBtn');

    const machine = machinesMap.get(failure.machineId);
    const machineName = machine ? machine.name : failure.machineId;

    const severityConfig = {
        critical: { iconColor: 'text-red-500', icon: 'fa-times-circle' },
        high: { iconColor: 'text-orange-500', icon: 'fa-exclamation-circle' },
        medium: { iconColor: 'text-yellow-500', icon: 'fa-exclamation-triangle' },
        low: { iconColor: 'text-blue-500', icon: 'fa-info-circle' }
    };

    const severity = severityConfig[failure.severity];

    modalTitleText.textContent = failure.title;
    modalIcon.className = `fas ${severity.icon} ${severity.iconColor}`;

    // Ukryj przycisk "Rozwiąż" jeśli awaria już rozwiązana
    if (failure.status === 'resolved') {
        resolveBtn.classList.add('hidden');
    } else {
        resolveBtn.classList.remove('hidden');
    }

    modalBody.innerHTML = `
        <div class="space-y-6">
            <!-- Failure Info -->
            <div class="bg-dark-hover rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <i class="fas fa-info-circle text-primary"></i>
                    Informacje o awarii
                </h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div class="text-slate-400 mb-1">Maszyna</div>
                        <div class="font-semibold">${machineName}</div>
                    </div>
                    <div>
                        <div class="text-slate-400 mb-1">Status</div>
                        <div class="font-semibold">${failure.status === 'open' ? 'Otwarte' : failure.status === 'in_progress' ? 'W realizacji' : 'Rozwiązane'}</div>
                    </div>
                    <div>
                        <div class="text-slate-400 mb-1">Zgłoszono przez</div>
                        <div class="font-semibold">${failure.reportedBy}</div>
                    </div>
                    <div>
                        <div class="text-slate-400 mb-1">Data zgłoszenia</div>
                        <div class="font-semibold">${new Date(failure.reportedAt).toLocaleDateString('pl-PL')} ${new Date(failure.reportedAt).toLocaleTimeString('pl-PL')}</div>
                    </div>
                    ${failure.assignedTo ? `
                        <div>
                            <div class="text-slate-400 mb-1">Przypisane do</div>
                            <div class="font-semibold">${failure.assignedTo}</div>
                        </div>
                    ` : ''}
                    ${failure.resolvedAt ? `
                        <div>
                            <div class="text-slate-400 mb-1">Data rozwiązania</div>
                            <div class="font-semibold">${new Date(failure.resolvedAt).toLocaleDateString('pl-PL')} ${new Date(failure.resolvedAt).toLocaleTimeString('pl-PL')}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="mt-4">
                    <div class="text-slate-400 mb-2">Opis</div>
                    <div class="text-slate-200">${failure.description}</div>
                </div>
            </div>

            <!-- Comments Section -->
            <div class="bg-dark-hover rounded-lg p-4">
                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <i class="fas fa-comments text-primary"></i>
                    Komentarze (${failure.comments.length})
                </h3>
                <div class="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    ${failure.comments.map(comment => `
                        <div class="bg-dark-bg rounded-lg p-3 border-l-2 border-primary">
                            <div class="flex justify-between items-start mb-2">
                                <div class="font-semibold text-sm">${comment.author}</div>
                                <div class="text-xs text-slate-500">${new Date(comment.timestamp).toLocaleDateString('pl-PL')} ${new Date(comment.timestamp).toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}</div>
                            </div>
                            <div class="text-sm text-slate-300">${comment.text}</div>
                        </div>
                    `).join('')}
                </div>

                ${failure.status !== 'resolved' ? `
                    <div class="pt-4 border-t border-slate-600">
                        <label class="block text-sm text-slate-400 mb-2">Dodaj komentarz:</label>
                        <div class="flex gap-2">
                            <input
                                type="text"
                                id="newComment"
                                placeholder="Wpisz komentarz..."
                                class="flex-1 bg-dark-bg border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                            <button
                                onclick="addComment()"
                                class="px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg font-semibold transition-all text-sm">
                                <i class="fas fa-paper-plane mr-1"></i>
                                Wyślij
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

/**
 * Zamyka modal awarii
 */
function closeFailureModal() {
    const modal = document.getElementById('failureModal');
    modal.classList.add('hidden');
    selectedFailure = null;
}

/**
 * Dodaje komentarz do awarii
 */
function addComment() {
    if (!selectedFailure) return;

    const input = document.getElementById('newComment');
    const commentText = input.value.trim();

    if (!commentText) {
        showAlert('Komentarz nie może być pusty');
        return;
    }

    const user = authManager.getCurrentUser();
    const newComment = {
        id: selectedFailure.comments.length + 1,
        author: user.name,
        text: commentText,
        timestamp: new Date().toISOString()
    };

    selectedFailure.comments.push(newComment);

    // Odśwież modal
    showFailureDetails(selectedFailure);
    renderFailures();

    showAlert('Komentarz został dodany');
}

/**
 * Oznacza awarię jako rozwiązaną
 */
function resolveCurrentFailure() {
    if (!selectedFailure) return;

    if (!confirm('Czy na pewno chcesz oznaczyć tę awarię jako rozwiązaną?')) {
        return;
    }

    const user = authManager.getCurrentUser();

    // Dodaj komentarz o rozwiązaniu
    const resolveComment = {
        id: selectedFailure.comments.length + 1,
        author: user.name,
        text: 'Awaria została rozwiązana.',
        timestamp: new Date().toISOString()
    };

    selectedFailure.comments.push(resolveComment);
    selectedFailure.status = 'resolved';
    selectedFailure.resolvedAt = new Date().toISOString();

    // Przenieś do archiwum
    resolvedFailures.push(selectedFailure);
    const index = machineFailures.findIndex(f => f.id === selectedFailure.id);
    if (index !== -1) {
        machineFailures.splice(index, 1);
    }

    closeFailureModal();
    renderFailures();
    updateKPIs();

    showAlert('Awaria została oznaczona jako rozwiązana');
}

/**
 * Tworzy nową awarię (wywoływane z modalu maszyny)
 */
function createFailureReport(machineId, title, description, severity = 'high') {
    const user = authManager.getCurrentUser();

    const newFailure = {
        id: machineFailures.length > 0 ? Math.max(...machineFailures.map(f => f.id)) + 1 : 1,
        machineId: machineId,
        title: title,
        description: description,
        severity: severity,
        status: 'open',
        reportedAt: new Date().toISOString(),
        reportedBy: user.name,
        assignedTo: null,
        resolvedAt: null,
        comments: [
            {
                id: 1,
                author: user.name,
                text: `Zgłoszono awarię: ${description}`,
                timestamp: new Date().toISOString()
            }
        ]
    };

    machineFailures.push(newFailure);
    renderFailures();
    updateKPIs();

    return newFailure;
}
