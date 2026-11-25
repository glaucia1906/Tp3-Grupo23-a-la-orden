import test from 'node:test';
import assert from 'node:assert/strict';
import { getFlowRoutes, makeFlow, scenarios } from './flow-model.js';

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

test('Las alternativas quedan pendientes hasta que se conoce el resultado de la consulta', () => {
  for (const rule of ['r3', 'r4']) {
    for (const scenario of ['one', 'many', 'same', 'none', 'error']) {
      const routes = getFlowRoutes(rule, scenario);
      assert.deepEqual(routes.map(route => route.id), ['one', 'many', 'none', 'error']);
      assert.ok(routes.every(route => route.state === 'pending'));
    }
  }
});

test('Cada resultado activa una sola alternativa y descarta las demás en ambos flujos', () => {
  for (const rule of ['r3', 'r4']) {
    for (const scenario of ['one', 'many', 'none', 'error']) {
      const routes = getFlowRoutes(rule, scenario, true);
      assert.deepEqual(routes.filter(route => route.state === 'active').map(route => route.id), [scenario]);
      assert.ok(routes.filter(route => route.id !== scenario).every(route => route.state === 'excluded'));
    }
    const sameDate = getFlowRoutes(rule, 'same', true);
    assert.deepEqual(sameDate, getFlowRoutes(rule, 'many', true));
  }
});

test('Las alternativas explican el recorrido de cada regla y separan ausencia de error', () => {
  const r3 = Object.fromEntries(getFlowRoutes('r3', 'one', true).map(route => [route.id, route]));
  const r4 = Object.fromEntries(getFlowRoutes('r4', 'many', true).map(route => [route.id, route]));
  assert.match(r3.one.description, /detalle y el estado/);
  assert.match(r3.many.description, /R4.*elegir un identificador/);
  assert.match(r4.one.description, /R3.*detalle y el estado/);
  assert.match(r4.many.description, /Listar.*selección.*validarla.*detalle elegido/);
  for (const routes of [r3, r4]) {
    assert.match(routes.none.description, /revisar el nombre.*No se inventa un pedido/);
    assert.match(routes.error.description, /revisión humana.*resultados es desconocida/);
  }
});

test('Cambiar el escenario o reiniciar no arrastra rutas descartadas ni mutaciones previas', () => {
  for (const rule of ['r3', 'r4']) {
    const initial = getFlowRoutes(rule, 'one', true);
    const changed = getFlowRoutes(rule, 'error', true);
    const reset = getFlowRoutes(rule, 'error', false);
    assert.equal(initial.find(route => route.id === 'one').state, 'active');
    assert.equal(changed.find(route => route.id === 'one').state, 'excluded');
    assert.equal(changed.find(route => route.id === 'error').state, 'active');
    assert.ok(reset.every(route => route.state === 'pending'));
    initial[0].title = 'Cambio ajeno al modelo';
    initial[1].state = 'active';
    assert.equal(getFlowRoutes(rule, 'one', true)[0].title, 'Un pedido');
    assert.equal(getFlowRoutes(rule, 'one', true)[1].state, 'excluded');
  }
});
