// ===================================
// FAILSAFE AI - DEMO PAGE JS
// Real-time production monitoring
// ===================================

// Initialize AOS
AOS.init({
	duration: 800,
	easing: 'ease-out-cubic',
	once: true
});

// State
let state = {
	machines: [],
	tasks: [],
	isProcessing: false,
	sessionStart: Date.now(),
	timerInterval: null
};

// Session Timer
function startSessionTimer() {
	state.timerInterval = setInterval(() => {
		const elapsed = Date.now() - state.sessionStart;
		const hours = Math.floor(elapsed / 3600000);
		const minutes = Math.floor((elapsed % 3600000) / 60000);
		const seconds = Math.floor((elapsed % 60000) / 1000);
		const ms = elapsed % 1000;

		const timerEl = document.getElementById('session-timer');
		if (timerEl) {
			timerEl.textContent =
				`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
		}
	}, 10);
}

// Load Production Data
async function loadData() {
	try {
		const response = await fetch('/api/production');
		const data = await response.json();
		state.machines = data.machines;
		state.tasks = data.tasks;
		updateKPI(data.kpi, data.company_metrics);
		renderMachines();
	} catch (error) {
		console.error('Error loading data:', error);
	}
}

// Update KPI
function updateKPI(kpi, metrics) {
	if (!kpi || !metrics) return;

	const updates = {
		'kpi-machines': `${metrics.active_machines}/${metrics.total_machines}`,
		'kpi-parts': kpi.total_parts_today.toLocaleString(),
		'kpi-cycle': kpi.average_cycle_time_seconds.toFixed(1) + 's',
		'kpi-oee': metrics.current_oee.toFixed(1) + '%'
	};

	Object.entries(updates).forEach(([id, value]) => {
		const el = document.getElementById(id);
		if (el) el.textContent = value;
	});
}

// Render Machines
function renderMachines() {
	const container = document.getElementById('machines-grid');
	if (!container) return;

	container.innerHTML = '';

	state.machines.forEach(machine => {
		const task = state.tasks.find(t =>
			t.assigned_machine === machine.id && t.status === 'in_progress'
		);

		const card = document.createElement('div');
		card.className = `machine-card ${machine.status}`;
		card.innerHTML = `
            <div class="machine-header">
                <div class="machine-name">${machine.name}</div>
                <div class="machine-status ${machine.status}">
                    ${machine.status === 'working' ? '✓ Działa' : '✗ Awaria'}
                </div>
            </div>
            <div class="machine-task">
                ${task ? `📦 ${task.name}` : '⏳ Gotowa'}
            </div>
            <div class="machine-metrics">
                <div class="metric-item">
                    <div class="metric-label">RPM</div>
                    <div class="metric-value">${machine.current_speed_rpm || 0}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Części/h</div>
                    <div class="metric-value">${machine.parts_per_hour || 0}</div>
                </div>
            </div>
        `;
		container.appendChild(card);
	});
}

// Trigger Failure Simulation
async function triggerFailure() {
	if (state.isProcessing) return;

	state.isProcessing = true;
	const btn = document.getElementById('btn-failure');
	if (btn) btn.disabled = true;

	// Show loading
	const loadingEl = document.getElementById('loading-overlay');
	if (loadingEl) loadingEl.classList.add('show');

	// Pick random working machine
	const workingMachines = state.machines.filter(m =>
		m.status === 'working' &&
		state.tasks.some(t => t.assigned_machine === m.id && t.status === 'in_progress')
	);

	if (workingMachines.length === 0) {
		alert('Brak aktywnych maszyn z zadaniami');
		state.isProcessing = false;
		if (btn) btn.disabled = false;
		if (loadingEl) loadingEl.classList.remove('show');
		return;
	}

	const failedMachine = workingMachines[Math.floor(Math.random() * workingMachines.length)];

	// Show timeline
	const timelineSection = document.getElementById('timeline-section');
	if (timelineSection) {
		timelineSection.classList.add('active');
		timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const timeline = document.getElementById('timeline');
	if (timeline) timeline.innerHTML = '';

	// Hide loading
	setTimeout(() => {
		if (loadingEl) loadingEl.classList.remove('show');
	}, 1000);

	// Timeline steps
	await addTimelineStep(timeline, 500,
		'🚨 Detekcja Awarii',
		`Maszyna ${failedMachine.name} przestała odpowiadać. Czujniki wykryły problem z narzędziem.`
	);

	const affectedTasks = state.tasks.filter(t => t.assigned_machine === failedMachine.id);
	await addTimelineStep(timeline, 500,
		'📊 Analiza Wpływu',
		`Zidentyfikowano ${affectedTasks.length} zadanie(a) zablokowane. Priorytet: ${affectedTasks[0]?.priority}/5.`
	);

	await addTimelineStep(timeline, 500,
		'🤖 Aktywacja AI Scheduler',
		'Algorytm genetyczny uruchomiony. Testowanie 500+ wariantów przelożenia zadań.'
	);

	await addTimelineStep(timeline, 500,
		'⚡ Optymalizacja w Toku',
		'Wywołanie API /api/reschedule. Analiza kompatybilności maszyn i deadline\'ów.'
	);

	try {
		const response = await fetch('/api/reschedule', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ broken_machine_id: failedMachine.id })
		});

		const result = await response.json();

		await addTimelineStep(timeline, 500,
			'✅ Rozwiązanie Znalezione',
			`Optymalny harmonogram wygenerowany w 3 sekundach. ${Object.keys(result.new_schedule).length} maszyn zaangażowanych.`,
			result.new_schedule
		);

		await addTimelineStep(timeline, 500,
			'🔄 Przenoszenie Zadań',
			'Zadania automatycznie przypisane do dostępnych maszyn. Zachowano priorytety.'
		);

		await addTimelineStep(timeline, 500,
			'📱 Powiadomienia Wysłane',
			'Operatorzy powiadomieni. Zespół naprawczy wezwany. Manager: raport gotowy.'
		);

		await addTimelineStep(timeline, 500,
			'💰 Oszczędności',
			'Koszt przestoju: $2,400 (vs $36,000 bez AI). Oszczędność: $33,600 (93% redukcja).',
			null,
			true
		);

		// Reload data
		await loadData();

	} catch (error) {
		console.error('API Error:', error);
		await addTimelineStep(timeline, 500,
			'❌ Błąd',
			'Nie udało się połączyć z API. Sprawdź czy serwer działa.'
		);
	}

	state.isProcessing = false;
	if (btn) btn.disabled = false;
}

// Add Timeline Step
function addTimelineStep(container, delay, title, description, data = null, isSavings = false) {
	return new Promise(resolve => {
		setTimeout(() => {
			if (!container) {
				resolve();
				return;
			}

			const step = document.createElement('div');
			step.className = 'timeline-step';

			const elapsed = Date.now() - state.sessionStart;
			const timeStr = `+${(elapsed / 1000).toFixed(3)}s`;

			let html = `
                <div class="step-time">${timeStr}</div>
                <div class="step-title">${title}</div>
                <div class="step-description">${description}</div>
            `;

			if (data) {
				html += '<div class="step-data">';
				for (const [machineId, tasks] of Object.entries(data)) {
					if (tasks.length > 0) {
						tasks.forEach(task => {
							html += `
                                <div class="task-move">
                                    <span class="task-name">${task.name}</span>
                                    <span class="arrow">→</span>
                                    <span class="task-name">${machineId}</span>
                                </div>
                            `;
						});
					}
				}
				html += '</div>';
			}

			if (isSavings) {
				html += '<div class="savings">⚡ $33,600 OSZCZĘDZONE W TEJ AWARII ⚡</div>';
			}

			step.innerHTML = html;
			container.appendChild(step);

			setTimeout(() => {
				step.classList.add('active');
				resolve();
			}, 50);
		}, delay);
	});
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
	startSessionTimer();
	await loadData();
	console.log('✅ FailSafe Demo initialized');
});

// Make triggerFailure global
window.triggerFailure = triggerFailure;
