// Analytics Module - Filters, Management Metrics, and Insights

let currentFilters = {
    timeRange: 30,
    machineType: 'all',
    status: 'all',
    viewMode: 'operator'
};

let correlationChart = null;

// Initialize analytics on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeViewMode();
});

/**
 * Initialize filter event listeners
 */
function initializeFilters() {
    const timeRangeFilter = document.getElementById('timeRangeFilter');
    const machineTypeFilter = document.getElementById('machineTypeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const viewMode = document.getElementById('viewMode');

    if (timeRangeFilter) {
        timeRangeFilter.addEventListener('change', (e) => {
            currentFilters.timeRange = parseInt(e.target.value);
            applyFilters();
        });
    }

    if (machineTypeFilter) {
        machineTypeFilter.addEventListener('change', (e) => {
            currentFilters.machineType = e.target.value;
            applyFilters();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            applyFilters();
        });
    }

    if (viewMode) {
        viewMode.addEventListener('change', (e) => {
            currentFilters.viewMode = e.target.value;
            switchViewMode(e.target.value);
        });
    }
}

/**
 * Apply current filters to machine grid
 */
function applyFilters() {
    let filteredMachines = machinesData.filter(machine => {
        // Machine type filter
        if (currentFilters.machineType !== 'all' && machine.type !== currentFilters.machineType) {
            return false;
        }

        // Status filter
        if (currentFilters.status !== 'all' && machine.status !== currentFilters.status) {
            return false;
        }

        return true;
    });

    // Re-render machines with filtered data
    renderFilteredMachines(filteredMachines);

    // Update charts with time range
    updateChartsWithTimeRange(currentFilters.timeRange);

    // Update executive dashboard if visible
    if (currentFilters.viewMode === 'executive') {
        updateExecutiveDashboard();
    }
}

/**
 * Render filtered machines
 */
function renderFilteredMachines(machines) {
    const grid = document.getElementById('machinesGrid');
    grid.innerHTML = '';

    if (machines.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-slate-400">
                <i class="fas fa-search text-4xl mb-3"></i>
                <div>Brak maszyn spełniających kryteria filtrowania</div>
            </div>
        `;
        return;
    }

    machines.forEach(machine => {
        const card = createMachineCard(machine);
        grid.appendChild(card);
    });
}

/**
 * Switch view mode (Operator / Manager / Executive)
 */
function switchViewMode(mode) {
    const executiveDashboard = document.getElementById('executiveDashboard');
    const predictionsSection = document.querySelector('.predictions-section');

    if (mode === 'executive') {
        executiveDashboard.classList.remove('hidden');
        updateExecutiveDashboard();
    } else {
        executiveDashboard.classList.add('hidden');
    }

    // Manager view could have additional features in future
    if (mode === 'manager') {
        // Show manager-specific features
    }
}

/**
 * Initialize and populate view mode
 */
function initializeViewMode() {
    // Default operator view - executive dashboard hidden
}

/**
 * Update Executive Dashboard with management metrics
 */
function updateExecutiveDashboard() {
    updateManagementKPIs();
    updateReplacementRecommendations();
    updateProblematicProcesses();
    updateCorrelationChart();
}

/**
 * Update Management KPIs (MTBF, MTTR, etc.)
 */
function updateManagementKPIs() {
    const timeRange = currentFilters.timeRange;

    // Calculate total losses
    const totalLosses = failureHistory
        .filter(f => isWithinTimeRange(f.date, timeRange))
        .reduce((sum, f) => sum + f.cost, 0);

    // Calculate average MTBF
    let totalMTBF = 0;
    let mtbfCount = 0;
    machinesData.forEach(machine => {
        const mtbf = analyticsHelpers.calculateMTBF(machine.id, timeRange);
        if (mtbf !== Infinity) {
            totalMTBF += mtbf;
            mtbfCount++;
        }
    });
    const avgMTBF = mtbfCount > 0 ? Math.round(totalMTBF / mtbfCount) : 0;

    // Calculate average MTTR
    let totalMTTR = 0;
    let mttrCount = 0;
    machinesData.forEach(machine => {
        const mttr = analyticsHelpers.calculateMTTR(machine.id, timeRange);
        if (mttr > 0) {
            totalMTTR += mttr;
            mttrCount++;
        }
    });
    const avgMTTR = mttrCount > 0 ? Math.round(totalMTTR / mttrCount) : 0;

    // Calculate replacement costs
    const replacements = getReplacementRecommendations().filter(r => r.priority === 'high');
    const replacementCost = replacements.reduce((sum, r) => sum + machineSpecs[r.machineId].replacementCost, 0);

    // Update UI
    document.getElementById('totalLosses').textContent = formatCurrency(totalLosses);
    document.getElementById('avgMTBF').textContent = avgMTBF + ' h';
    document.getElementById('avgMTTR').textContent = avgMTTR + ' min';
    document.getElementById('replacementCost').textContent = formatCurrency(replacementCost);
}

/**
 * Get replacement recommendations for all machines
 */
function getReplacementRecommendations() {
    const recommendations = [];

    machinesData.forEach(machine => {
        const score = analyticsHelpers.calculateReplacementScore(machine.id);
        const specs = machineSpecs[machine.id];

        if (!specs) return;

        const priority = score.score > 70 ? 'high' :
                        score.score > 50 ? 'medium' :
                        score.score > 30 ? 'low' : 'none';

        if (priority !== 'none') {
            recommendations.push({
                machineId: machine.id,
                machineName: machine.name,
                machineType: machine.type,
                score: score.score,
                priority: priority,
                recommendation: score.recommendation,
                replacementCost: specs.replacementCost,
                details: score
            });
        }
    });

    return recommendations.sort((a, b) => b.score - a.score);
}

/**
 * Update Replacement Recommendations section
 */
function updateReplacementRecommendations() {
    const list = document.getElementById('replacementList');
    const recommendations = getReplacementRecommendations();

    if (recommendations.length === 0) {
        list.innerHTML = `
            <div class="text-center text-slate-400 py-4">
                <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                <div>Wszystkie maszyny w dobrym stanie technicznym</div>
            </div>
        `;
        return;
    }

    list.innerHTML = '';

    recommendations.forEach(rec => {
        const priorityColors = {
            high: 'bg-red-500/20 border-red-500 text-red-500',
            medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-500',
            low: 'bg-blue-500/20 border-blue-500 text-blue-500'
        };

        const div = document.createElement('div');
        div.className = `bg-dark-hover p-4 rounded-lg border-l-4 ${priorityColors[rec.priority]}`;
        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div>
                    <div class="font-bold text-lg">${rec.machineName}</div>
                    <div class="text-sm text-slate-400">${rec.machineType}</div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold">${rec.score}/100</div>
                    <div class="text-xs text-slate-400">Wskaźnik wymiany</div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                    <span class="text-slate-400">Wiek:</span>
                    <span class="font-semibold ml-1">${rec.details.ageScore}/100</span>
                </div>
                <div>
                    <span class="text-slate-400">Awarie:</span>
                    <span class="font-semibold ml-1">${rec.details.failureScore}/100</span>
                </div>
                <div>
                    <span class="text-slate-400">Koszty:</span>
                    <span class="font-semibold ml-1">${rec.details.costScore}/100</span>
                </div>
                <div>
                    <span class="text-slate-400">Niezawodność:</span>
                    <span class="font-semibold ml-1">${rec.details.reliabilityScore}/100</span>
                </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-slate-700">
                <div>
                    <div class="text-xs text-slate-400">Koszt wymiany</div>
                    <div class="font-bold text-lg">${formatCurrency(rec.replacementCost)}</div>
                </div>
                <div class="px-4 py-2 rounded-lg font-semibold text-sm ${
                    rec.priority === 'high' ? 'bg-red-500' :
                    rec.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                }">
                    ${rec.recommendation}
                </div>
            </div>
        `;

        list.appendChild(div);
    });
}

/**
 * Update Problematic Processes section
 */
function updateProblematicProcesses() {
    const container = document.getElementById('problematicProcesses');
    const problematicProcesses = analyticsHelpers.getMostProblematicProcesses();

    if (problematicProcesses.length === 0) {
        container.innerHTML = `
            <div class="text-center text-slate-400 py-4">
                Brak danych o problematycznych procesach
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    // Show top 5 problematic processes
    problematicProcesses.slice(0, 5).forEach((proc, index) => {
        const div = document.createElement('div');
        div.className = 'bg-dark-hover p-4 rounded-lg';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">
                        ${index + 1}
                    </div>
                    <div>
                        <div class="font-bold">${proc.process}</div>
                        <div class="text-xs text-slate-400">${proc.affectedMachines} maszyn(y) dotkniętych</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xl font-bold text-red-500">${proc.count}</div>
                    <div class="text-xs text-slate-400">awarii</div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-sm pt-3 border-t border-slate-700">
                <div>
                    <span class="text-slate-400">Przestój:</span>
                    <span class="font-semibold ml-1">${Math.round(proc.totalDowntime / 60)} h</span>
                </div>
                <div>
                    <span class="text-slate-400">Koszt:</span>
                    <span class="font-semibold ml-1">${formatCurrency(proc.totalCost)}</span>
                </div>
            </div>
        `;

        container.appendChild(div);
    });
}

/**
 * Update Correlation Chart (Machine Type vs Failure Type)
 */
function updateCorrelationChart() {
    const correlations = analyticsHelpers.analyzeTypeCorrelation();

    if (!correlations || correlations.length === 0) {
        return;
    }

    const ctx = document.getElementById('correlationChart');
    if (!ctx) return;

    // Destroy existing chart
    if (correlationChart) {
        correlationChart.destroy();
    }

    // Prepare data for chart
    const labels = correlations.slice(0, 8).map(c => `${c.machineType}\n${c.failureType}`);
    const data = correlations.slice(0, 8).map(c => c.count);
    const colors = correlations.slice(0, 8).map(c => {
        if (c.failureType === 'Mechanical') return 'rgba(239, 68, 68, 0.8)';
        if (c.failureType === 'Electrical') return 'rgba(245, 158, 11, 0.8)';
        if (c.failureType === 'Hydraulic') return 'rgba(59, 130, 246, 0.8)';
        return 'rgba(100, 116, 139, 0.8)';
    });

    correlationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Liczba awarii',
                data: data,
                backgroundColor: colors,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const correlation = correlations[context.dataIndex];
                            return [
                                `Awarie: ${correlation.count}`,
                                `Śr. przestój: ${Math.round(correlation.avgDowntime)} min`,
                                `Koszt: ${formatCurrency(correlation.totalCost)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

/**
 * Update charts based on time range
 */
function updateChartsWithTimeRange(days) {
    // This would update the failure chart with selected time range
    // For now, we'll keep the default 7-day chart
    console.log(`Filtering data for last ${days} days`);
}

/**
 * Helper: Check if date is within time range
 */
function isWithinTimeRange(dateStr, days) {
    const date = new Date(dateStr);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return date >= cutoff;
}

/**
 * Helper: Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
