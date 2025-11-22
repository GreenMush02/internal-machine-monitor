/**
 * Machine Learning Predictor Module
 * Simulates a Random Forest / Gradient Boosting algorithm for failure prediction
 * Based on historical data and sensor readings
 */

class MachineFailurePredictor {
    constructor() {
        // Feature weights learned from "training" (simulated)
        this.featureWeights = {
            temperature: 0.25,
            vibration: 0.30,
            runningHours: 0.20,
            cyclesCompleted: 0.10,
            daysSinceMaintenance: 0.15
        };

        // Thresholds for normal operation
        this.normalThresholds = {
            temperature: { low: 20, high: 70 },
            vibration: { low: 0, high: 3.0 },
            runningHours: { critical: 3500 },
            daysSinceMaintenance: { warning: 30, critical: 60 }
        };
    }

    /**
     * Predict failure probability for a machine
     * Returns probability as percentage (0-100)
     */
    predictFailure(machine) {
        const features = this.extractFeatures(machine);
        const scores = this.calculateFeatureScores(features);
        const probability = this.aggregateScores(scores);

        return {
            probability: Math.round(probability),
            risk: this.classifyRisk(probability),
            contributingFactors: this.identifyContributingFactors(scores),
            recommendation: this.generateRecommendation(probability, features)
        };
    }

    /**
     * Extract relevant features from machine data
     */
    extractFeatures(machine) {
        const now = new Date();
        const lastMaintenance = new Date(machine.lastMaintenance);
        const daysSinceMaintenance = Math.floor((now - lastMaintenance) / (1000 * 60 * 60 * 24));

        return {
            temperature: machine.temperature,
            vibration: machine.vibration,
            runningHours: machine.runningHours,
            cyclesCompleted: machine.cyclesCompleted,
            daysSinceMaintenance: daysSinceMaintenance,
            status: machine.status
        };
    }

    /**
     * Calculate anomaly scores for each feature (0-1 scale)
     */
    calculateFeatureScores(features) {
        const scores = {};

        // Temperature score (normalized sigmoid)
        const tempNorm = (features.temperature - 20) / 80; // normalize to 0-1
        scores.temperature = this.sigmoid(tempNorm * 10 - 5);

        // Vibration score
        const vibNorm = features.vibration / 10; // normalize to 0-1
        scores.vibration = this.sigmoid(vibNorm * 10 - 3);

        // Running hours score (exponential decay after threshold)
        if (features.runningHours > this.normalThresholds.runningHours.critical) {
            scores.runningHours = 0.9;
        } else {
            scores.runningHours = features.runningHours / 5000;
        }

        // Cycles score (minor factor)
        scores.cyclesCompleted = Math.min(features.cyclesCompleted / 50000, 0.6);

        // Days since maintenance score
        if (features.daysSinceMaintenance > this.normalThresholds.daysSinceMaintenance.critical) {
            scores.daysSinceMaintenance = 0.95;
        } else if (features.daysSinceMaintenance > this.normalThresholds.daysSinceMaintenance.warning) {
            scores.daysSinceMaintenance = 0.6;
        } else {
            scores.daysSinceMaintenance = features.daysSinceMaintenance / 60;
        }

        // Status modifier
        if (features.status === 'critical') {
            scores.statusModifier = 1.5;
        } else if (features.status === 'warning') {
            scores.statusModifier = 1.2;
        } else {
            scores.statusModifier = 1.0;
        }

        return scores;
    }

    /**
     * Aggregate feature scores into final probability
     * Simulates ensemble method (Random Forest)
     */
    aggregateScores(scores) {
        let weightedSum = 0;

        // Weighted sum of normalized scores
        weightedSum += scores.temperature * this.featureWeights.temperature;
        weightedSum += scores.vibration * this.featureWeights.vibration;
        weightedSum += scores.runningHours * this.featureWeights.runningHours;
        weightedSum += scores.cyclesCompleted * this.featureWeights.cyclesCompleted;
        weightedSum += scores.daysSinceMaintenance * this.featureWeights.daysSinceMaintenance;

        // Apply status modifier
        weightedSum *= scores.statusModifier;

        // Convert to percentage (0-100)
        const probability = Math.min(100, weightedSum * 100);

        return probability;
    }

    /**
     * Sigmoid activation function
     */
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    /**
     * Classify risk level based on probability
     */
    classifyRisk(probability) {
        if (probability >= 60) return 'high';
        if (probability >= 30) return 'medium';
        return 'low';
    }

    /**
     * Identify which factors contribute most to failure risk
     */
    identifyContributingFactors(scores) {
        const factors = [];

        if (scores.temperature > 0.6) {
            factors.push({
                name: 'Temperatura',
                severity: scores.temperature,
                icon: 'fa-thermometer-half'
            });
        }

        if (scores.vibration > 0.6) {
            factors.push({
                name: 'Wibracje',
                severity: scores.vibration,
                icon: 'fa-wave-square'
            });
        }

        if (scores.runningHours > 0.6) {
            factors.push({
                name: 'Godziny pracy',
                severity: scores.runningHours,
                icon: 'fa-clock'
            });
        }

        if (scores.daysSinceMaintenance > 0.5) {
            factors.push({
                name: 'Konserwacja',
                severity: scores.daysSinceMaintenance,
                icon: 'fa-wrench'
            });
        }

        // Sort by severity
        factors.sort((a, b) => b.severity - a.severity);

        return factors;
    }

    /**
     * Generate maintenance recommendation
     */
    generateRecommendation(probability, features) {
        if (probability >= 80) {
            return {
                priority: 'KRYTYCZNY',
                action: 'Natychmiastowe zatrzymanie i konserwacja',
                timeframe: '0-24h',
                color: 'red'
            };
        } else if (probability >= 60) {
            return {
                priority: 'WYSOKI',
                action: 'Zaplanuj konserwację w najbliższym czasie',
                timeframe: '24-48h',
                color: 'orange'
            };
        } else if (probability >= 30) {
            return {
                priority: 'ŚREDNI',
                action: 'Monitoruj i zaplanuj konserwację',
                timeframe: '3-7 dni',
                color: 'yellow'
            };
        } else {
            return {
                priority: 'NISKI',
                action: 'Kontynuuj rutynową konserwację',
                timeframe: 'Zgodnie z harmonogramem',
                color: 'green'
            };
        }
    }

    /**
     * Predict optimal maintenance window
     */
    predictMaintenanceWindow(machine) {
        const prediction = this.predictFailure(machine);
        const features = this.extractFeatures(machine);

        // Calculate estimated days until failure
        let daysUntilFailure;

        if (prediction.probability >= 80) {
            daysUntilFailure = Math.random() * 2; // 0-2 days
        } else if (prediction.probability >= 60) {
            daysUntilFailure = 2 + Math.random() * 5; // 2-7 days
        } else if (prediction.probability >= 30) {
            daysUntilFailure = 7 + Math.random() * 14; // 7-21 days
        } else {
            daysUntilFailure = 21 + Math.random() * 60; // 21-81 days
        }

        return {
            estimatedDays: Math.floor(daysUntilFailure),
            confidence: this.calculateConfidence(features),
            suggestedDate: this.calculateMaintenanceDate(daysUntilFailure)
        };
    }

    /**
     * Calculate prediction confidence
     */
    calculateConfidence(features) {
        // Confidence based on data quality and recency
        let confidence = 0.85; // base confidence

        // Reduce confidence for very old maintenance records
        if (features.daysSinceMaintenance > 90) {
            confidence -= 0.15;
        }

        // Increase confidence for extreme values (clear signals)
        if (features.temperature > 80 || features.vibration > 5) {
            confidence += 0.1;
        }

        return Math.min(0.95, Math.max(0.60, confidence));
    }

    /**
     * Calculate suggested maintenance date
     */
    calculateMaintenanceDate(daysUntilFailure) {
        const date = new Date();
        // Schedule maintenance 20% before estimated failure
        const maintenanceDays = Math.floor(daysUntilFailure * 0.8);
        date.setDate(date.getDate() + maintenanceDays);
        return date.toLocaleDateString('pl-PL');
    }

    /**
     * Batch predict for all machines
     */
    predictAllMachines(machines) {
        return machines.map(machine => ({
            machineId: machine.id,
            machineName: machine.name,
            ...this.predictFailure(machine),
            maintenanceWindow: this.predictMaintenanceWindow(machine)
        }));
    }

    /**
     * Get feature importance (for visualization)
     */
    getFeatureImportance() {
        return Object.entries(this.featureWeights)
            .map(([feature, weight]) => ({
                feature,
                importance: weight,
                percentage: Math.round(weight * 100)
            }))
            .sort((a, b) => b.importance - a.importance);
    }
}

// Initialize predictor
const mlPredictor = new MachineFailurePredictor();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MachineFailurePredictor;
}
