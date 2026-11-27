const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

test('dashboard charts initialize after components load and only once', () => {
    const handlers = {};
    const charts = [];
    const canvases = {
        failuresChart: { getContext: () => 'failures' },
        utilizationChart: { getContext: () => 'utilization' },
    };
    class Chart {
        static defaults = {};
        constructor(context, options) { charts.push({ context, options }); }
    }
    const context = vm.createContext({
        Chart,
        document: {
            addEventListener(event, handler) { handlers[event] = handler; },
            getElementById(id) { return canvases[id]; },
        },
    });
    for (const file of ['data.js', 'charts.js']) {
        vm.runInContext(readFileSync(join(__dirname, '../js', file), 'utf8'), context);
    }

    assert.equal(typeof handlers.componentsLoaded, 'function');
    handlers.componentsLoaded();
    handlers.componentsLoaded();
    assert.deepEqual(charts.map(chart => chart.context), ['failures', 'utilization']);
    assert.equal(charts[0].options.options.animation, false);
    assert.equal(charts[1].options.options.animation, false);
    assert.equal(charts[1].options.options.indexAxis, 'y');
    assert.equal(charts[1].options.options.scales.y.ticks.autoSkip, false);
});

test('dashboard provides both chart canvases', () => {
    const html = readFileSync(join(__dirname, '../components/sections/dashboard.html'), 'utf8');
    assert.match(html, /<canvas\b[^>]*\bid="failuresChart"/);
    assert.match(html, /<canvas\b[^>]*\bid="utilizationChart"/);
});
