// Extended analytics data for management insights

// Machine failure history (last 6 months)
const failureHistory = [
    // CNC-01
    { machineId: 'CNC-01', date: '2025-01-20', process: 'Frezowanie felg', type: 'Mechanical', downtime: 180, cost: 15000, description: 'Pęknięte narzędzie T12' },
    { machineId: 'CNC-01', date: '2024-12-10', process: 'Frezowanie korpusów', type: 'Electrical', downtime: 240, cost: 18000, description: 'Awaria sterownika' },
    { machineId: 'CNC-01', date: '2024-11-05', process: 'Frezowanie felg', type: 'Mechanical', downtime: 120, cost: 12000, description: 'Zużycie łożyska' },

    // CNC-02
    { machineId: 'CNC-02', date: '2025-01-15', process: 'Frezowanie korpusów', type: 'Software', downtime: 60, cost: 5000, description: 'Błąd programu NC' },
    { machineId: 'CNC-02', date: '2024-12-28', process: 'Frezowanie felg', type: 'Mechanical', downtime: 300, cost: 22000, description: 'Awaria wrzeciona' },

    // CNC-03
    { machineId: 'CNC-03', date: '2025-01-18', process: 'Toczenie wałków', type: 'Mechanical', downtime: 420, cost: 28000, description: 'Awaria przekładni' },
    { machineId: 'CNC-03', date: '2025-01-05', process: 'Toczenie wałków', type: 'Mechanical', downtime: 180, cost: 16000, description: 'Pęknięty nóż' },
    { machineId: 'CNC-03', date: '2024-12-15', process: 'Toczenie osi', type: 'Hydraulic', downtime: 240, cost: 20000, description: 'Wyciek oleju hydraulicznego' },
    { machineId: 'CNC-03', date: '2024-11-20', process: 'Toczenie wałków', type: 'Mechanical', downtime: 360, cost: 25000, description: 'Uszkodzenie suportu' },
    { machineId: 'CNC-03', date: '2024-10-12', process: 'Toczenie wałków', type: 'Electrical', downtime: 200, cost: 17000, description: 'Przepalony silnik' },

    // Press-A
    { machineId: 'Press-A', date: '2024-11-30', process: 'Tłoczenie osłon', type: 'Hydraulic', downtime: 150, cost: 13000, description: 'Nieszczelność pompy' },

    // Press-B
    { machineId: 'Press-B', date: '2024-12-20', process: 'Tłoczenie paneli', type: 'Hydraulic', downtime: 480, cost: 35000, description: 'Awaria siłownika głównego' },
    { machineId: 'Press-B', date: '2024-10-05', process: 'Tłoczenie wsporników', type: 'Mechanical', downtime: 180, cost: 15000, description: 'Zużycie matrycy' },

    // Weld-01
    { machineId: 'Weld-01', date: '2025-01-21', process: 'Spawanie ram', type: 'Electrical', downtime: 540, cost: 38000, description: 'Awaria inwertera' },
    { machineId: 'Weld-01', date: '2024-12-08', process: 'Spawanie korpusów', type: 'Mechanical', downtime: 240, cost: 19000, description: 'Uszkodzenie uchwytu' },
    { machineId: 'Weld-01', date: '2024-11-12', process: 'Spawanie ram', type: 'Electrical', downtime: 360, cost: 26000, description: 'Przepalenie transformatora' },
    { machineId: 'Weld-01', date: '2024-10-18', process: 'Spawanie ram', type: 'Software', downtime: 120, cost: 10000, description: 'Błąd programu robotycznego' },

    // Weld-02
    { machineId: 'Weld-02', date: '2024-12-30', process: 'Spawanie konstrukcji', type: 'Mechanical', downtime: 180, cost: 15000, description: 'Zużycie palnika' },

    // Grinder-01
    { machineId: 'Grinder-01', date: '2025-01-10', process: 'Szlifowanie płyt', type: 'Mechanical', downtime: 300, cost: 21000, description: 'Awaria tarczy szlifierskiej' },
    { machineId: 'Grinder-01', date: '2024-12-05', process: 'Szlifowanie powierzchni', type: 'Hydraulic', downtime: 240, cost: 18000, description: 'Problem z dociskiem' },
    { machineId: 'Grinder-01', date: '2024-11-08', process: 'Szlifowanie płyt', type: 'Mechanical', downtime: 210, cost: 16000, description: 'Nierównomierne zużycie' },

    // Drill-01
    { machineId: 'Drill-01', date: '2024-10-25', process: 'Wiercenie otworów', type: 'Mechanical', downtime: 90, cost: 8000, description: 'Złamany wiertło' }
];

// Process definitions with risk factors
const processes = [
    { id: 'frezowanie_felg', name: 'Frezowanie felg', category: 'CNC', avgDuration: 65, complexity: 'high', riskFactor: 0.75 },
    { id: 'frezowanie_korpusow', name: 'Frezowanie korpusów', category: 'CNC', avgDuration: 85, complexity: 'high', riskFactor: 0.68 },
    { id: 'toczenie_walkow', name: 'Toczenie wałków', category: 'CNC', avgDuration: 45, complexity: 'medium', riskFactor: 0.82 },
    { id: 'toczenie_osi', name: 'Toczenie osi', category: 'CNC', avgDuration: 55, complexity: 'medium', riskFactor: 0.60 },
    { id: 'tloczenie_oslon', name: 'Tłoczenie osłon', category: 'Press', avgDuration: 25, complexity: 'low', riskFactor: 0.35 },
    { id: 'tloczenie_paneli', name: 'Tłoczenie paneli', category: 'Press', avgDuration: 30, complexity: 'low', riskFactor: 0.40 },
    { id: 'tloczenie_wspornikow', name: 'Tłoczenie wsporników', category: 'Press', avgDuration: 28, complexity: 'low', riskFactor: 0.38 },
    { id: 'spawanie_ram', name: 'Spawanie ram', category: 'Welding', avgDuration: 90, complexity: 'high', riskFactor: 0.85 },
    { id: 'spawanie_korpusow', name: 'Spawanie korpusów', category: 'Welding', avgDuration: 75, complexity: 'high', riskFactor: 0.78 },
    { id: 'spawanie_konstrukcji', name: 'Spawanie konstrukcji', category: 'Welding', avgDuration: 110, complexity: 'high', riskFactor: 0.72 },
    { id: 'szlifowanie_plyt', name: 'Szlifowanie płyt', category: 'Grinding', avgDuration: 50, complexity: 'medium', riskFactor: 0.65 },
    { id: 'szlifowanie_powierzchni', name: 'Szlifowanie powierzchni', category: 'Grinding', avgDuration: 60, complexity: 'medium', riskFactor: 0.58 },
    { id: 'wiercenie_otworow', name: 'Wiercenie otworów', category: 'Drilling', avgDuration: 20, complexity: 'low', riskFactor: 0.30 }
];

// Machine specifications and costs
const machineSpecs = {
    'CNC-01': {
        purchaseDate: '2020-03-15',
        purchasePrice: 450000,
        expectedLifetime: 10,
        maintenanceCostPerYear: 45000,
        replacementCost: 520000,
        utilizationTarget: 85
    },
    'CNC-02': {
        purchaseDate: '2019-11-20',
        purchasePrice: 480000,
        expectedLifetime: 10,
        maintenanceCostPerYear: 48000,
        replacementCost: 540000,
        utilizationTarget: 85
    },
    'CNC-03': {
        purchaseDate: '2017-06-10',
        purchasePrice: 420000,
        expectedLifetime: 10,
        maintenanceCostPerYear: 52000,
        replacementCost: 500000,
        utilizationTarget: 85
    },
    'Press-A': {
        purchaseDate: '2021-08-05',
        purchasePrice: 280000,
        expectedLifetime: 15,
        maintenanceCostPerYear: 25000,
        replacementCost: 310000,
        utilizationTarget: 75
    },
    'Press-B': {
        purchaseDate: '2016-04-12',
        purchasePrice: 320000,
        expectedLifetime: 15,
        maintenanceCostPerYear: 38000,
        replacementCost: 350000,
        utilizationTarget: 75
    },
    'Laser-01': {
        purchaseDate: '2020-10-20',
        purchasePrice: 680000,
        expectedLifetime: 8,
        maintenanceCostPerYear: 72000,
        replacementCost: 750000,
        utilizationTarget: 80
    },
    'Weld-01': {
        purchaseDate: '2015-02-08',
        purchasePrice: 550000,
        expectedLifetime: 12,
        maintenanceCostPerYear: 68000,
        replacementCost: 620000,
        utilizationTarget: 80
    },
    'Weld-02': {
        purchaseDate: '2019-07-15',
        purchasePrice: 580000,
        expectedLifetime: 12,
        maintenanceCostPerYear: 58000,
        replacementCost: 640000,
        utilizationTarget: 80
    },
    'Drill-01': {
        purchaseDate: '2020-01-25',
        purchasePrice: 180000,
        expectedLifetime: 12,
        maintenanceCostPerYear: 18000,
        replacementCost: 200000,
        utilizationTarget: 70
    },
    'Grinder-01': {
        purchaseDate: '2018-09-18',
        purchasePrice: 320000,
        expectedLifetime: 10,
        maintenanceCostPerYear: 38000,
        replacementCost: 360000,
        utilizationTarget: 75
    },
    'Paint-01': {
        purchaseDate: '2021-03-10',
        purchasePrice: 220000,
        expectedLifetime: 15,
        maintenanceCostPerYear: 22000,
        replacementCost: 250000,
        utilizationTarget: 65
    },
    'Assembly-01': {
        purchaseDate: '2022-05-20',
        purchasePrice: 150000,
        expectedLifetime: 15,
        maintenanceCostPerYear: 12000,
        replacementCost: 170000,
        utilizationTarget: 70
    }
};

// Production data for last 30 days
const productionData = generateProductionData();

function generateProductionData() {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Generate data for each machine
        machinesData.forEach(machine => {
            const baseUtilization = machine.status === 'offline' ? 0 :
                                   machine.status === 'critical' ? 20 :
                                   machine.status === 'warning' ? 65 : 85;

            const utilization = baseUtilization + (Math.random() * 20 - 10);
            const cyclesRun = Math.floor((utilization / 100) * 200);
            const defects = Math.floor(Math.random() * cyclesRun * 0.02); // 2% defect rate

            data.push({
                date: dateStr,
                machineId: machine.id,
                utilization: Math.max(0, Math.min(100, utilization)),
                cyclesRun: cyclesRun,
                defects: defects,
                downtime: Math.random() > 0.9 ? Math.floor(Math.random() * 120) : 0
            });
        });
    }

    return data;
}

// Analytics helper functions
const analyticsHelpers = {

    /**
     * Calculate MTBF (Mean Time Between Failures) in hours
     */
    calculateMTBF(machineId, timeframeDays = 180) {
        const failures = failureHistory.filter(f => f.machineId === machineId);
        if (failures.length < 2) return Infinity;

        const machine = machinesData.find(m => m.id === machineId);
        const totalHours = (timeframeDays * 24) - failures.reduce((sum, f) => sum + (f.downtime / 60), 0);

        return totalHours / failures.length;
    },

    /**
     * Calculate MTTR (Mean Time To Repair) in minutes
     */
    calculateMTTR(machineId, timeframeDays = 180) {
        const failures = failureHistory.filter(f => f.machineId === machineId);
        if (failures.length === 0) return 0;

        const totalDowntime = failures.reduce((sum, f) => sum + f.downtime, 0);
        return totalDowntime / failures.length;
    },

    /**
     * Calculate failure frequency (failures per month)
     */
    calculateFailureFrequency(machineId, timeframeDays = 180) {
        const failures = failureHistory.filter(f => f.machineId === machineId);
        return (failures.length / timeframeDays) * 30;
    },

    /**
     * Calculate total cost of failures
     */
    calculateTotalFailureCost(machineId, timeframeDays = 180) {
        const failures = failureHistory.filter(f => f.machineId === machineId);
        return failures.reduce((sum, f) => sum + f.cost, 0);
    },

    /**
     * Get most problematic processes (causing most failures)
     */
    getMostProblematicProcesses() {
        const processFailures = {};

        failureHistory.forEach(failure => {
            if (!processFailures[failure.process]) {
                processFailures[failure.process] = {
                    process: failure.process,
                    count: 0,
                    totalDowntime: 0,
                    totalCost: 0,
                    affectedMachines: new Set()
                };
            }

            processFailures[failure.process].count++;
            processFailures[failure.process].totalDowntime += failure.downtime;
            processFailures[failure.process].totalCost += failure.cost;
            processFailures[failure.process].affectedMachines.add(failure.machineId);
        });

        return Object.values(processFailures)
            .map(p => ({...p, affectedMachines: p.affectedMachines.size}))
            .sort((a, b) => b.count - a.count);
    },

    /**
     * Analyze correlation between machine type and failure type
     */
    analyzeTypeCorrelation() {
        const correlations = {};

        failureHistory.forEach(failure => {
            const machine = machinesData.find(m => m.id === failure.machineId);
            const key = `${machine.type}_${failure.type}`;

            if (!correlations[key]) {
                correlations[key] = {
                    machineType: machine.type,
                    failureType: failure.type,
                    count: 0,
                    avgDowntime: 0,
                    totalCost: 0
                };
            }

            correlations[key].count++;
            correlations[key].avgDowntime =
                (correlations[key].avgDowntime * (correlations[key].count - 1) + failure.downtime) /
                correlations[key].count;
            correlations[key].totalCost += failure.cost;
        });

        return Object.values(correlations).sort((a, b) => b.count - a.count);
    },

    /**
     * Calculate machine replacement ROI score
     */
    calculateReplacementScore(machineId) {
        const machine = machinesData.find(m => m.id === machineId);
        const specs = machineSpecs[machineId];
        if (!specs) return 0;

        const age = (new Date() - new Date(specs.purchaseDate)) / (365.25 * 24 * 60 * 60 * 1000);
        const failureFreq = this.calculateFailureFrequency(machineId);
        const failureCost = this.calculateTotalFailureCost(machineId);
        const mtbf = this.calculateMTBF(machineId);

        // Score components (0-100 each)
        const ageScore = (age / specs.expectedLifetime) * 100;
        const failureScore = Math.min(100, failureFreq * 20); // 5 failures/month = 100
        const costScore = Math.min(100, (failureCost / specs.replacementCost) * 100);
        const reliabilityScore = mtbf < 720 ? 100 : Math.max(0, 100 - (mtbf / 720) * 100); // 30 days = 720h

        // Weighted average
        const totalScore = (ageScore * 0.25 + failureScore * 0.35 + costScore * 0.25 + reliabilityScore * 0.15);

        return {
            score: Math.round(totalScore),
            ageScore: Math.round(ageScore),
            failureScore: Math.round(failureScore),
            costScore: Math.round(costScore),
            reliabilityScore: Math.round(reliabilityScore),
            recommendation: totalScore > 70 ? 'Zalecana wymiana' :
                           totalScore > 50 ? 'Rozważ wymianę' :
                           totalScore > 30 ? 'Monitoruj stan' : 'W dobrym stanie'
        };
    },

    /**
     * Get production efficiency metrics
     */
    getProductionMetrics(machineId, days = 30) {
        const machineData = productionData.filter(p => p.machineId === machineId &&
            new Date(p.date) >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        );

        if (machineData.length === 0) return null;

        const avgUtilization = machineData.reduce((sum, d) => sum + d.utilization, 0) / machineData.length;
        const totalCycles = machineData.reduce((sum, d) => sum + d.cyclesRun, 0);
        const totalDefects = machineData.reduce((sum, d) => sum + d.defects, 0);
        const totalDowntime = machineData.reduce((sum, d) => sum + d.downtime, 0);

        return {
            avgUtilization: avgUtilization.toFixed(1),
            totalCycles,
            defectRate: ((totalDefects / totalCycles) * 100).toFixed(2),
            totalDowntime,
            oee: ((avgUtilization / 100) * (1 - totalDefects / totalCycles) *
                  (1 - totalDowntime / (days * 24 * 60))).toFixed(3)
        };
    }
};
