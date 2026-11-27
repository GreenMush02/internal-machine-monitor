const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '../js/auth.js'), 'utf8');

function createSession(saved, { denyRead = false, denyWrite = false } = {}) {
    let stored = saved;
    let reloads = 0;
    const localStorage = {
        getItem() {
            if (denyRead) throw new DOMException('Unavailable', 'SecurityError');
            return stored;
        },
        setItem(_key, value) {
            if (denyWrite) throw new DOMException('Unavailable', 'SecurityError');
            stored = value;
        },
        removeItem() { stored = null; },
    };
    const context = vm.createContext({
        localStorage,
        DOMException,
        window: { location: { reload() { reloads++; } } },
    });
    vm.runInContext(source, context);
    return {
        role: () => vm.runInContext('authManager.getCurrentRole()', context),
        login: (role) => vm.runInContext(`authManager.login(${JSON.stringify(role)})`, context),
        stored: () => stored,
        reloads: () => reloads,
    };
}

test('restores a valid saved demo profile', () => {
    const saved = JSON.stringify({ id: 2, name: 'Demo', role: 'manager' });
    assert.equal(createSession(saved).role(), 'manager');
});

test('invalid or unavailable stored profiles use operator without changing data', () => {
    for (const saved of ['{', 'null', '[]', '{"name":"Demo","role":"admin"}', '{"name":3,"role":"owner"}']) {
        const session = createSession(saved);
        assert.equal(session.role(), 'operator');
        assert.equal(session.stored(), saved);
    }
    assert.equal(createSession(null, { denyRead: true }).role(), 'operator');
});

test('a failed save cannot change the current profile', () => {
    const session = createSession(null, { denyWrite: true });
    session.login('owner');
    assert.equal(session.role(), 'operator');
    assert.equal(session.reloads(), 0);
    assert.equal(session.stored(), null);
});

test('a valid role change saves before reloading', () => {
    const session = createSession(null);
    session.login('manager');
    assert.equal(session.role(), 'manager');
    assert.equal(JSON.parse(session.stored()).role, 'manager');
    assert.equal(session.reloads(), 1);
});

test('unrecognized choices do not change the role or reload', () => {
    for (const role of ['unknown', 'constructor', 'toString', '__proto__']) {
        const session = createSession(null);
        session.login(role);
        assert.equal(session.role(), 'operator');
        assert.equal(session.reloads(), 0);
        assert.equal(session.stored(), null);
    }
});
