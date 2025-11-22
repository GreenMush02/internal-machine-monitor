// Charts Module - Visualization with Chart.js

// Chart.js default configuration for dark theme
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#334155';

let failuresChart = null;
let utilizationChart = null;

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeFailuresChart();
    initializeUtilizationChart();
});

/**
 * Initialize Failures Chart (Bar Chart)
 */
function initializeFailuresChart() {
    const ctx = document.getElementById('failuresChart').getContext('2d');

    failuresChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: failuresData.labels,
            datasets: [{
                label: 'Liczba awarii',
                data: failuresData.datasets[0].data,
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
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
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Awarie: ${context.parsed.y}`;
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
                        color: '#94a3b8'
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
 * Initialize Utilization Chart (Horizontal Bar Chart)
 */
function initializeUtilizationChart() {
    const ctx = document.getElementById('utilizationChart').getContext('2d');

    utilizationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: utilizationData.labels,
            datasets: [{
                label: 'Wykorzystanie (%)',
                data: utilizationData.datasets[0].data,
                backgroundColor: utilizationData.datasets[0].backgroundColor,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
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
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Wykorzystanie: ${context.parsed.x}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: '#94a3b8'
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
 * Update failures chart with new data
 */
function updateFailuresChart(newData) {
    if (!failuresChart) return;

    failuresChart.data.labels = newData.labels;
    failuresChart.data.datasets[0].data = newData.datasets[0].data;
    failuresChart.update('none');
}

/**
 * Update utilization chart with new data
 */
function updateUtilizationChart(newData) {
    if (!utilizationChart) return;

    utilizationChart.data.labels = newData.labels;
    utilizationChart.data.datasets[0].data = newData.datasets[0].data;
    utilizationChart.data.datasets[0].backgroundColor = newData.datasets[0].backgroundColor;
    utilizationChart.update('none');
}

/**
 * Create temperature trend chart (for modal)
 */
function createTemperatureTrendChart(canvasId, machineData) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Simulate historical temperature data
    const hours = 24;
    const labels = [];
    const data = [];

    for (let i = hours; i >= 0; i--) {
        labels.push(`-${i}h`);
        // Simulate temperature variation
        const baseTemp = machineData.temperature;
        const variation = (Math.random() - 0.5) * 10;
        data.push(Math.max(20, baseTemp + variation));
    }

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: data,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
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
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        },
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 8,
                        color: '#94a3b8'
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
 * Create vibration trend chart (for modal)
 */
function createVibrationTrendChart(canvasId, machineData) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Simulate historical vibration data
    const hours = 24;
    const labels = [];
    const data = [];

    for (let i = hours; i >= 0; i--) {
        labels.push(`-${i}h`);
        // Simulate vibration variation
        const baseVib = machineData.vibration;
        const variation = (Math.random() - 0.5) * 2;
        data.push(Math.max(0, baseVib + variation));
    }

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wibracje (mm/s)',
                data: data,
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
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
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' mm/s';
                        },
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 8,
                        color: '#94a3b8'
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
 * Create prediction confidence chart (doughnut)
 */
function createPredictionConfidenceChart(canvasId, probability) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const remaining = 100 - probability;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ryzyko awarii', 'Bezpieczne'],
            datasets: [{
                data: [probability, remaining],
                backgroundColor: [
                    probability > 70 ? 'rgba(239, 68, 68, 0.8)' :
                    probability > 40 ? 'rgba(245, 158, 11, 0.8)' :
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(100, 116, 139, 0.3)'
                ],
                borderColor: [
                    probability > 70 ? 'rgba(239, 68, 68, 1)' :
                    probability > 40 ? 'rgba(245, 158, 11, 1)' :
                    'rgba(16, 185, 129, 1)',
                    'rgba(100, 116, 139, 0.5)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}
