import { makeFlow, scenarios } from './flow-model.js';

const caseDescriptions = {
  one:'El registro devuelve una única coincidencia.',
  many:'Hay varios pedidos para el mismo nombre.',
  same:'Los pedidos comparten nombre y fecha.',
  none:'La búsqueda no encuentra coincidencias.',
  error:'El registro no responde a la consulta.'
};

export function initFlows() {
  document.querySelectorAll('.solution').forEach(section => {
    const rule = section.id === 'solucion-r3' ? 'r3' : 'r4';
    const panel = section.querySelector('.flow-panel');
    const completeDiagram = panel.innerHTML;
    let scenario = '';
    let started = false;
    let selected = '';
    let position = 0;
    panel.classList.add('interactive-flow');
    panel.innerHTML = `<div class="flow-heading"><p class="flow-label">EXPLORÁ EL FLUJO / ${rule.toUpperCase()}</p><span class="live-dot">Simulación</span></div>
      <section class="flow-setup" aria-labelledby="setup-title-${rule}"><h4 class="setup-title" id="setup-title-${rule}" tabindex="-1">Elegí el caso antes de comenzar</h4><p class="setup-intro" id="setup-intro-${rule}">Primero elegí qué situación querés explorar. Después recorrerás la consulta de Lucía, desde el inicio hasta el resultado.</p><form class="case-setup-form"><fieldset aria-describedby="setup-intro-${rule}"><legend>¿Qué querés probar?</legend>${Object.entries(scenarios).map(([value, label]) => `<label class="setup-case"><input type="radio" name="case-${rule}" value="${value}" required><span><strong>${label}</strong><small>${caseDescriptions[value]}</small></span></label>`).join('')}</fieldset><button type="submit" class="start-case" disabled>Comenzar recorrido</button></form><p class="setup-note">Ejemplo con datos ficticios. Todavía no se inició ningún paso.</p></section>
      <div class="flow-run" hidden>
      <p class="flow-hint">Avanzá paso a paso o tocá un nodo para entenderlo. Datos ficticios.</p>
      <ol class="live-flow" aria-label="Pasos del flujo ${rule.toUpperCase()}"></ol>
      <p class="route-alternative"></p>
      <div class="step-information" role="status" aria-live="polite" aria-atomic="true"></div>
      <div class="order-choice" hidden></div>
      <div class="flow-controls"><button type="button" data-action="back" aria-label="Paso anterior de ${rule.toUpperCase()}">← Anterior</button><span class="step-counter"></span><button type="button" data-action="next" aria-label="Paso siguiente de ${rule.toUpperCase()}">Siguiente →</button></div>
      <button type="button" class="reset-flow">↺ Reiniciar recorrido</button>
      <details class="complete-diagram"><summary>Ver diagrama completo · ${rule.toUpperCase()}</summary><div class="complete-diagram-content" role="region" aria-label="Diagrama completo de ${rule.toUpperCase()}">${completeDiagram}</div></details>
      <button type="button" class="settings-trigger">Probar otro caso</button></div>`;
    const list = panel.querySelector('.live-flow');
    const choice = panel.querySelector('.order-choice');
    const setup = panel.querySelector('.flow-setup');
    const setupForm = panel.querySelector('.case-setup-form');
    const startButton = panel.querySelector('.start-case');
    const run = panel.querySelector('.flow-run');

    function render(focusStep = false) {
      setup.hidden = started;
      run.hidden = !started;
      if (!started) return;
      const model = makeFlow(rule, scenario, selected);
      position = Math.min(position, model.steps.length - 1);
      list.innerHTML = model.steps.map((step, index) => `<li class="live-step ${index < position ? 'visited' : ''} ${index === position ? 'current' : ''}">${step.id === 'decision' ? '' : index && model.steps[index - 1].id === 'decision' ? `<span class="edge-label">${model.branch}</span>` : ''}<button type="button" class="step-node kind-${step.kind}" data-step="${index}" ${index === position ? 'aria-current="step"' : ''}><span class="step-index">${index < position ? '✓' : String(index + 1).padStart(2, '0')}</span><span>${step.title}</span><span class="node-kind">${({person:'Persona',agent:'Agente',decision:'Decisión',result:'Resultado',exception:'Excepción'})[step.kind]}</span></button></li>`).join('');
      const step = model.steps[position];
      panel.querySelector('.step-information').innerHTML = `<p class="eyebrow">PASO ${position + 1} · ${rule.toUpperCase()}</p><h4>${step.title}</h4><p>${step.explanation}</p><div class="step-output">${step.output}</div>`;
      panel.querySelector('.route-alternative').textContent = model.alternative;
      panel.querySelector('.step-counter').textContent = `${position + 1} / ${model.steps.length}${model.orders.length && !selected && rule === 'r4' ? ' + elección' : ''}`;
      panel.querySelector('[data-action="back"]').disabled = position === 0;
      panel.querySelector('[data-action="next"]').disabled = position === model.steps.length - 1;
      choice.hidden = step.id !== 'choose';
      choice.innerHTML = step.id === 'choose' ? `<fieldset><legend>Elegí un pedido por su identificador</legend>${model.orders.map(order => `<label><input type="radio" name="order-${rule}" value="${order.id}" ${order.id === selected ? 'checked' : ''}><span><strong>${order.id}</strong><small>Fecha auxiliar: ${order.date}</small></span></label>`).join('')}</fieldset><p>El detalle se abre al llegar al último paso.</p>` : '';
      if (focusStep) list.querySelector(`[data-step="${position}"]`).focus({preventScroll:true});
    }
    const chosenCase = () => setupForm.querySelector('input:checked')?.value;
    setupForm.addEventListener('change', () => { startButton.disabled = !Object.hasOwn(scenarios, chosenCase()); });
    setupForm.addEventListener('submit', event => {
      event.preventDefault();
      const value = chosenCase();
      if (!Object.hasOwn(scenarios, value)) return;
      scenario = value; selected = ''; position = 0; started = true; render(true);
    });
    panel.querySelector('.settings-trigger').addEventListener('click', () => {
      started = false; selected = ''; position = 0; render();
      setupForm.querySelector('input:checked')?.focus({ preventScroll: true });
    });
    list.addEventListener('click', event => {if (!started) return; const button = event.target.closest('[data-step]'); if (button) {position = Number(button.dataset.step); render(true);}});
    panel.querySelector('[data-action="back"]').addEventListener('click', () => {if (!started) return; position--; render();});
    panel.querySelector('[data-action="next"]').addEventListener('click', () => {if (!started) return; position++; render();});
    panel.querySelector('.reset-flow').addEventListener('click', () => {if (!started) return; selected = ''; position = 0; render();});
    choice.addEventListener('change', event => {if (!started) return; selected = event.target.value; render(); choice.querySelector('input:checked')?.focus({preventScroll:true});});
    render();
  });
}
