const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

test('chart tables show the same data after initial render and updates', () => {
    const handlers = {};
    const bodies = {};
    const element = () => ({
        textContent: '',
        children: [],
        append(...children) { this.children.push(...children); },
        replaceChildren(...children) { this.children = children; },
    });
    bodies.failuresChartValues = element();
    bodies.utilizationChartValues = element();
    class Chart {
        static defaults = {};
        constructor(ctx, options) {
            this.canvas = ctx.canvas;
            this.data = options.data;
            this.plugins = options.plugins || [];
            this.update();
        }
        update() { this.plugins.forEach(plugin => plugin.afterUpdate(this)); }
    }
    const context = vm.createContext({
        Chart,
        document: {
            addEventListener(event, handler) { handlers[event] = handler; },
            createElement() { return element(); },
            getElementById(id) {
                if (id.endsWith('Values')) return bodies[id];
                return { getContext: () => ({ canvas: { id } }) };
            },
        },
    });
    for (const file of ['data.js', 'charts.js']) {
        vm.runInContext(readFileSync(join(__dirname, '../js', file), 'utf8'), context);
    }
    handlers.componentsLoaded();
    assert.equal(bodies.failuresChartValues.children.length, 7);
    assert.equal(bodies.failuresChartValues.children[0].children[0].textContent, '16.01');
    assert.equal(bodies.failuresChartValues.children[0].children[1].textContent, '2');
    assert.equal(bodies.utilizationChartValues.children.length, 8);
    assert.equal(bodies.utilizationChartValues.children[0].children[1].textContent, '87%');

    vm.runInContext("updateFailuresChart({labels: ['A'], datasets: [{data: [3]}]})", context);
    vm.runInContext("updateUtilizationChart({labels: ['B', 'C'], datasets: [{data: [0, null], backgroundColor: []}]})", context);
    assert.equal(bodies.failuresChartValues.children.length, 1);
    assert.equal(bodies.failuresChartValues.children[0].children[1].textContent, '3');
    assert.equal(bodies.utilizationChartValues.children.length, 2);
    assert.equal(bodies.utilizationChartValues.children[0].children[1].textContent, '0%');
    assert.equal(bodies.utilizationChartValues.children[1].children[1].textContent, 'brak danych');
});
