// Mock data for machines
const machinesData = [
    {
        id: 'CNC-01',
        name: 'CNC-01',
        type: 'CNC Milling',
        status: 'operational',
        progress: 45,
        temperature: 68,
        vibration: 2.3,
        runningHours: 1240,
        cyclesCompleted: 8450,
        lastMaintenance: '2025-01-15',
        failureRisk: 'low',
        failureProbability: 12,
        assignedProcesses: []
    },
    {
        id: 'CNC-02',
        name: 'CNC-02',
        type: 'CNC Milling',
        status: 'operational',
        progress: 78,
        temperature: 72,
        vibration: 2.8,
        runningHours: 2180,
        cyclesCompleted: 12340,
        lastMaintenance: '2025-01-10',
        failureRisk: 'medium',
        failureProbability: 45,
        assignedProcesses: [1]
    },
    {
        id: 'CNC-03',
        name: 'CNC-03',
        type: 'CNC Lathe',
        status: 'warning',
        progress: 34,
        temperature: 85,
        vibration: 4.2,
        runningHours: 3450,
        cyclesCompleted: 18920,
        lastMaintenance: '2024-12-20',
        failureRisk: 'high',
        failureProbability: 78,
        assignedProcesses: [2]
    },
    {
        id: 'Press-A',
        name: 'Press-A',
        type: 'Hydraulic Press',
        status: 'operational',
        progress: 12,
        temperature: 45,
        vibration: 1.8,
        runningHours: 890,
        cyclesCompleted: 5670,
        lastMaintenance: '2025-01-18',
        failureRisk: 'low',
        failureProbability: 8,
        assignedProcesses: []
    },
    {
        id: 'Press-B',
        name: 'Press-B',
        type: 'Hydraulic Press',
        status: 'offline',
        progress: 0,
        temperature: 22,
        vibration: 0,
        runningHours: 4520,
        cyclesCompleted: 28900,
        lastMaintenance: '2025-01-22',
        failureRisk: 'low',
        failureProbability: 5,
        assignedProcesses: []
    },
    {
        id: 'Laser-01',
        name: 'Laser-01',
        type: 'Laser Cutter',
        status: 'operational',
        progress: 56,
        temperature: 52,
        vibration: 0.9,
        runningHours: 1560,
        cyclesCompleted: 9870,
        lastMaintenance: '2025-01-12',
        failureRisk: 'low',
        failureProbability: 15,
        assignedProcesses: []
    },
    {
        id: 'Weld-01',
        name: 'Weld-01',
        type: 'Robotic Welder',
        status: 'critical',
        progress: 0,
        temperature: 95,
        vibration: 6.8,
        runningHours: 5230,
        cyclesCompleted: 32100,
        lastMaintenance: '2024-11-15',
        failureRisk: 'high',
        failureProbability: 92,
        assignedProcesses: []
    },
    {
        id: 'Weld-02',
        name: 'Weld-02',
        type: 'Robotic Welder',
        status: 'operational',
        progress: 89,
        temperature: 65,
        vibration: 2.1,
        runningHours: 2340,
        cyclesCompleted: 14560,
        lastMaintenance: '2025-01-08',
        failureRisk: 'low',
        failureProbability: 18,
        assignedProcesses: []
    },
    {
        id: 'Drill-01',
        name: 'Drill-01',
        type: 'Drill Press',
        status: 'operational',
        progress: 23,
        temperature: 58,
        vibration: 3.2,
        runningHours: 1890,
        cyclesCompleted: 11230,
        lastMaintenance: '2025-01-14',
        failureRisk: 'medium',
        failureProbability: 38,
        assignedProcesses: []
    },
    {
        id: 'Grinder-01',
        name: 'Grinder-01',
        type: 'Surface Grinder',
        status: 'warning',
        progress: 67,
        temperature: 78,
        vibration: 4.5,
        runningHours: 2980,
        cyclesCompleted: 16780,
        lastMaintenance: '2024-12-28',
        failureRisk: 'high',
        failureProbability: 65,
        assignedProcesses: []
    },
    {
        id: 'Paint-01',
        name: 'Paint-01',
        type: 'Paint Booth',
        status: 'operational',
        progress: 41,
        temperature: 32,
        vibration: 0.5,
        runningHours: 1120,
        cyclesCompleted: 6780,
        lastMaintenance: '2025-01-16',
        failureRisk: 'low',
        failureProbability: 10,
        assignedProcesses: []
    },
    {
        id: 'Assembly-01',
        name: 'Assembly-01',
        type: 'Assembly Station',
        status: 'operational',
        progress: 92,
        temperature: 28,
        vibration: 0.3,
        runningHours: 780,
        cyclesCompleted: 4560,
        lastMaintenance: '2025-01-20',
        failureRisk: 'low',
        failureProbability: 6,
        assignedProcesses: []
    }
];


const processes = [
    {
        id: 1,
        name: "Amortyzator C1",
        averageDuration: 6,
        category: "Automotive"
    },
    {
        id: 2,
        name: "Amortyzator C2",
        averageDuration: 6,
        category: "Automotive"
    }
]


const currentProcesses = [
    {
        id: 1,
        processId: 1,
        assignedMachine: "CNC-02",
        assignedAt: '2025-01-15T08:00:00',
        status: 'active',
    },
    {
        id: 2,
        processId: 2,
        assignedMachine: "CNC-03",
        assignedAt: '2025-01-15T08:00:00',
        status: 'pending',
    }
]

// Failures and Incidents Management
const machineFailures = [
    {
        id: 1,
        machineId: 'Weld-01',
        title: 'Krytyczny wzrost temperatury',
        description: 'Temperatura przekroczyła 90°C, wibracje powyżej normy',
        severity: 'critical', // critical, high, medium, low
        status: 'open', // open, in_progress, resolved
        reportedAt: '2025-01-22T14:30:00',
        reportedBy: 'System AI',
        assignedTo: null,
        resolvedAt: null,
        comments: [
            {
                id: 1,
                author: 'System AI',
                text: 'Wykryto anomalie w czujnikach temperatury i wibracji. Zalecana natychmiastowa kontrola.',
                timestamp: '2025-01-22T14:30:00'
            }
        ]
    },
    {
        id: 2,
        machineId: 'CNC-03',
        title: 'Zaległa konserwacja',
        description: 'Ostatnia konserwacja ponad 30 dni temu, ryzyko awarii 78%',
        severity: 'high',
        status: 'open',
        reportedAt: '2025-01-22T10:15:00',
        reportedBy: 'System AI',
        assignedTo: null,
        resolvedAt: null,
        comments: [
            {
                id: 1,
                author: 'System AI',
                text: 'Predykcja wskazuje wysokie ryzyko awarii. Zaplanuj konserwację w ciągu 7 dni.',
                timestamp: '2025-01-22T10:15:00'
            }
        ]
    },
    {
        id: 3,
        machineId: 'Grinder-01',
        title: 'Zwiększone wibracje',
        description: 'Wibracje osiągnęły 4.5 mm/s',
        severity: 'medium',
        status: 'in_progress',
        reportedAt: '2025-01-21T16:45:00',
        reportedBy: 'Jan Kowalski',
        assignedTo: 'Serwis Techniczny',
        resolvedAt: null,
        comments: [
            {
                id: 1,
                author: 'Jan Kowalski',
                text: 'Zauważyłem nietypowe drgania podczas pracy.',
                timestamp: '2025-01-21T16:45:00'
            },
            {
                id: 2,
                author: 'Serwis Techniczny',
                text: 'Przyjęto zgłoszenie. Ekipa wyjedzie jutro o 9:00.',
                timestamp: '2025-01-21T17:20:00'
            }
        ]
    }
]

// Resolved failures (archive)
const resolvedFailures = [
    {
        id: 100,
        machineId: 'Press-B',
        title: 'Planowana konserwacja',
        description: 'Wymiana oleju hydraulicznego',
        severity: 'low',
        status: 'resolved',
        reportedAt: '2025-01-20T08:00:00',
        reportedBy: 'System',
        assignedTo: 'Serwis Techniczny',
        resolvedAt: '2025-01-22T15:00:00',
        comments: [
            {
                id: 1,
                author: 'Serwis Techniczny',
                text: 'Konserwacja zakończona pomyślnie. Wymieniono olej i filtry.',
                timestamp: '2025-01-22T15:00:00'
            }
        ]
    }
]

// Historical failures data
const failuresData = {
    labels: ['16.01', '17.01', '18.01', '19.01', '20.01', '21.01', '22.01'],
    datasets: [{
        label: 'Awarie',
        data: [2, 1, 3, 0, 1, 2, 1],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2
    }]
};

// Machine utilization data
const utilizationData = {
    labels: machinesData.filter(m => m.status !== 'offline').slice(0, 8).map(m => m.name),
    datasets: [{
        label: 'Wykorzystanie (%)',
        data: [87, 92, 78, 85, 0, 88, 65, 94],
        backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(100, 116, 139, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(16, 185, 129, 0.8)'
        ],
        borderWidth: 0
    }]
};
