import test from 'node:test';
import assert from 'node:assert/strict';
import { makeFlow, scenarios } from './flow-model.js';

test('Ambos flujos reciben la consulta, identifican a la persona y consultan antes de resolver cualquier escenario', () => {
  for (const rule of ['r3', 'r4']) {
    for (const scenario of Object.keys(scenarios)) {
      for (const selection of ['', 'PED-1042']) {
        const flow = makeFlow(rule, scenario, selection);
        assert.deepEqual(flow.steps.slice(0, 3).map(step => step.id), ['context', 'start', 'query']);
        assert.equal(flow.steps[0].kind, 'person');
        assert.match(flow.steps[0].explanation, /Lucía Pérez.*A la Orden.*estado de su pedido/);
        assert.match(flow.steps[1].output, /nombre = Lucía Pérez/);
        assert.ok(flow.steps.slice(0, 3).every(step => !['decision', 'error', 'detail'].includes(step.id)));
        assert.ok(flow.steps.slice(3).every(step => !['context', 'start', 'query'].includes(step.id)));
        assert.equal(flow.steps[3].id, scenario === 'error' ? 'error' : 'decision');
      }
    }
  }
});

test('R3 solo muestra un pedido cuando hay exactamente una coincidencia', () => {
  assert.equal(makeFlow('r3', 'one').steps.at(-1).id, 'detail');
  assert.equal(makeFlow('r3', 'many').steps.at(-1).id, 'handoff');
  assert.equal(makeFlow('r3', 'none').steps.at(-1).id, 'empty');
});
test('R4 no permite abrir el detalle sin una selección válida', () => {
  for (const selection of ['', 'INVALIDO']) {
    const flow = makeFlow('r4', 'many', selection);
    assert.equal(flow.steps.at(-1).id, 'choose');
    assert.ok(!flow.steps.some(step => step.id === 'detail'));
  }
  for (const id of ['PED-1042', 'PED-1087']) {
    const flow = makeFlow('r4', 'many', id);
    assert.equal(flow.steps.at(-1).id, 'detail');
    assert.ok(flow.steps.at(-1).output.startsWith(id));
  }
});
test('La fecha coincidente no reemplaza al identificador único', () => {
  const flow = makeFlow('r4', 'same');
  assert.equal(flow.orders[0].date, flow.orders[1].date);
  assert.notEqual(flow.orders[0].id, flow.orders[1].id);
  assert.equal(flow.steps.at(-1).id, 'choose');
});
test('Un error no se confunde con cero resultados ni reutiliza una selección', () => {
  for (const rule of ['r3', 'r4']) {
    assert.equal(makeFlow(rule, 'error', 'PED-1042').steps.at(-1).id, 'error');
    assert.equal(makeFlow(rule, 'none', 'PED-1042').steps.at(-1).id, 'empty');
    assert.ok(!makeFlow(rule, 'error').steps.some(step => step.id === 'decision'));
  }
});
