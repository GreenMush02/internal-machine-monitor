const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

test('dashboard and analytics data load in the same page', () => {
    const context = vm.createContext({});
    for (const file of ['data.js', 'analytics-data.js']) {
        vm.runInContext(readFileSync(join(__dirname, '../js', file), 'utf8'), context);
    }

    assert.equal(vm.runInContext('processes.length', context), 2);
    assert.equal(vm.runInContext('processes[0].name', context), 'Amortyzator C1');
    assert.equal(vm.runInContext('failureHistory.length > 0', context), true);
    assert.equal(vm.runInContext('analyticsProcesses.length > 0', context), true);
});
