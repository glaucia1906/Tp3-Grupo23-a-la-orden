import { getFlowRoutes, makeFlow, scenarios } from './flow-model.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const runningAnimations = new Map();

// Relative module URLs work in Live Server and are bundled by Vite for production.
const flowIllustrations = {
  r3: new URL('./assets/pedido-hero-verde.jpg', import.meta.url).href,
  r4: new URL('./assets/flujos/elegir-pedido-verde.jpg', import.meta.url).href
};

export function animateContentChange(...elements) {
  elements.forEach(element => {
    runningAnimations.get(element)?.cancel();
    if (!element?.animate || reducedMotion.matches) return;
    const animation = element.animate([
      { opacity: 0.25, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    runningAnimations.set(element, animation);
    const cleanUp = () => {
      if (runningAnimations.get(element) === animation) runningAnimations.delete(element);
    };
    animation.onfinish = cleanUp;
    animation.oncancel = cleanUp;
  });
}

reducedMotion.addEventListener('change', event => {
  if (event.matches) {
    runningAnimations.forEach(animation => animation.cancel());
    runningAnimations.clear();
  }
});

const icons = {
  context: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 10h8M8 14h5"/>',
  start: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>',
  query: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
  decision: '<path d="m12 3 9 9-9 9-9-9 9-9Z"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 1.5-2.5 3M12 16h.01"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"/>',
  choose: '<path d="M8 12V5a2 2 0 0 1 4 0v6-2a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v5c0 4-3 6-6 6h-2c-2 0-3-1-4-2l-4-5a2 2 0 0 1 3-2l1 1"/>',
  validate: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  detail: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 12h8M8 16h6"/>',
  error: '<path d="m10.3 3.8-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  empty: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5M8 10.5h5"/>',
  handoff: '<path d="M4 7h15M14 2l5 5-5 5M20 17H5M10 12l-5 5 5 5"/>'
};

function stepIcon(id) {
  return `<svg class="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[id] || icons.query}</svg>`;
}

function animateFlowStep(element, direction) {
  runningAnimations.get(element)?.cancel();
  if (!direction || !element.animate || reducedMotion.matches) return;
  const animation = element.animate([
    { opacity: 0, transform: `translateX(${direction > 0 ? 28 : -28}px)` },
    { opacity: 1, transform: 'translateX(0)' }
  ], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  runningAnimations.set(element, animation);
  const cleanUp = () => {
    if (runningAnimations.get(element) === animation) runningAnimations.delete(element);
  };
  animation.onfinish = cleanUp;
  animation.oncancel = cleanUp;
}

const kindLabels = { person:'Persona', agent:'Agente', decision:'Decisión', result:'Resultado', exception:'Excepción' };
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
    let selected = '';
    let position = 0;
    let started = false;
    panel.classList.add('interactive-flow');
    panel.dataset.flow = rule;
    panel.innerHTML = `<div class="flow-heading"><p class="flow-label">${rule === 'r3' ? 'BÚSQUEDA DIRECTA' : 'ELECCIÓN GUIADA'}</p><span class="live-dot">Referencia ${rule.toUpperCase()} · Simulación</span></div>
      <section class="flow-setup" aria-labelledby="setup-title-${rule}"><h4 class="setup-title" id="setup-title-${rule}" tabindex="-1">Elegí el caso antes de comenzar</h4><p class="setup-intro" id="setup-intro-${rule}">Primero elegí qué situación querés explorar. Después recorrerás la consulta de Lucía, desde el inicio hasta el resultado.</p><form class="case-setup-form"><fieldset aria-describedby="setup-intro-${rule}"><legend>¿Qué querés probar?</legend>${Object.entries(scenarios).map(([value, label]) => `<label class="setup-case"><input type="radio" name="case-${rule}" value="${value}" required><span><strong>${label}</strong><small>${caseDescriptions[value]}</small></span></label>`).join('')}</fieldset><button type="submit" class="start-case" disabled>Comenzar recorrido</button></form><p class="setup-note">Ejemplo con datos ficticios. Todavía no se inició ningún paso.</p></section>
      <div class="flow-run" hidden>
      <div class="flow-tools" role="group" aria-label="Opciones del recorrido ${rule.toUpperCase()}"><button type="button" class="reset-flow">Reiniciar</button><button type="button" class="settings-trigger">Probar otro caso</button><button type="button" class="diagram-trigger" aria-haspopup="dialog">Ver diagrama</button></div>
      <p class="flow-case-label"></p>
      <div class="flow-progress"><p class="flow-progress-text"></p><div class="flow-progress-track" aria-hidden="true"><div class="flow-progress-fill"></div></div></div>
      <nav class="flow-stepper" aria-label="Etapas del recorrido ${rule.toUpperCase()}"><ol class="flow-step-list"></ol></nav>
      <div class="flow-deck"><article class="flow-slide" tabindex="0" aria-labelledby="slide-title-${rule}"></article></div>
      <div class="flow-controls"><button type="button" data-action="back" aria-label="Paso anterior de ${rule.toUpperCase()}">Anterior</button><span class="step-counter"></span><button type="button" data-action="next" aria-label="Paso siguiente de ${rule.toUpperCase()}">Siguiente</button><p class="flow-action-hint" hidden></p></div>
      <button type="button" class="diagram-trigger final-diagram-trigger" aria-haspopup="dialog" hidden>Ver diagrama completo generado</button>
      </div>
      <p class="flow-announcement sr-only" aria-live="polite" aria-atomic="true"></p>
      <dialog class="flow-dialog flow-diagram-dialog" aria-labelledby="diagram-title-${rule}"><div class="dialog-heading"><h4 id="diagram-title-${rule}">Diagrama del caso · ${rule.toUpperCase()}</h4><button type="button" class="dialog-close" aria-label="Cerrar diagrama de ${rule.toUpperCase()}">Cerrar ×</button></div><p class="generated-case"></p><p class="generated-status"></p><ol class="generated-flow" aria-label="Recorrido generado para el caso elegido"></ol><section class="generated-alternatives" aria-label="Alternativas de esta consulta"><h5>Caminos de la consulta</h5><ol class="route-options generated-route-options"></ol></section><details class="reference-diagram"><summary>Ver todas las ramas de la regla</summary><div class="complete-diagram-content">${completeDiagram}</div></details></dialog>`;
    const slide = panel.querySelector('.flow-slide');
    const list = panel.querySelector('.flow-step-list');
    const stepper = panel.querySelector('.flow-stepper');
    const diagram = panel.querySelector('.complete-diagram-content');
    const setup = panel.querySelector('.flow-setup');
    const setupForm = panel.querySelector('.case-setup-form');
    const startButton = panel.querySelector('.start-case');
    const run = panel.querySelector('.flow-run');
    const diagramDialog = panel.querySelector('.flow-diagram-dialog');
    const back = panel.querySelector('[data-action="back"]');
    const next = panel.querySelector('[data-action="next"]');

    const hasActiveCase = () => started && Object.hasOwn(scenarios, scenario);
    const chosenCase = () => setupForm.querySelector('input:checked')?.value;

    function setDiagramState(element, state) {
      element.classList.toggle('route-excluded', state === 'excluded');
      element.classList.toggle('route-active', state === 'active');
      element.dataset.state = state;
      const label = element.querySelector(':scope > .diagram-route-state');
      if (label) label.textContent = ({pending:'Por evaluar', active:'Recorrido activo', excluded:'No corresponde a esta consulta'})[state];
    }

    function render({ direction = 0, focusStep = false } = {}) {
      const ready = hasActiveCase();
      setup.hidden = ready;
      run.hidden = !ready;
      startButton.disabled = !Object.hasOwn(scenarios, chosenCase());
      if (!ready) {
        if (diagramDialog.open) diagramDialog.close();
        panel.querySelector('.final-diagram-trigger').hidden = true;
        panel.querySelector('.generated-flow').innerHTML = '';
        panel.querySelector('.generated-route-options').innerHTML = '';
        slide.innerHTML = '';
        list.innerHTML = '';
        panel.style.setProperty('--flow-progress', '0%');
        panel.querySelector('.flow-announcement').textContent = 'Elegí un caso y comenzá el recorrido.';
        return;
      }
      const model = makeFlow(rule, scenario, selected);
      const hasChoice = model.orders.some(order => order.id === selected);
      const pendingSelection = rule === 'r4' && model.orders.length > 0 && !hasChoice;
      const totalSteps = model.steps.length + (pendingSelection ? 2 : 0);
      position = Math.max(0, Math.min(position, model.steps.length - 1));
      const step = model.steps[position];
      const waitingForChoice = step.id === 'choose' && !hasChoice;
      const finished = position === model.steps.length - 1 && ['detail', 'handoff', 'empty', 'error'].includes(step.id);
      panel.querySelector('.final-diagram-trigger').hidden = !finished;
      panel.querySelector('.flow-case-label').textContent = `Caso: ${scenarios[scenario]}`;
      const previousScroll = slide.scrollTop;
      const markers = model.steps.map((item, index) => `<li class="step-marker ${index < position ? 'visited' : index === position ? 'current' : 'upcoming'}"><button type="button" class="step-marker-button" data-step="${index}" aria-label="Paso ${index + 1}: ${item.title}" title="${item.title}" ${index === position ? 'aria-current="step"' : ''}><span aria-hidden="true">${index < position ? '✓' : index + 1}</span></button></li>`);
      if (pendingSelection) ['Validar la selección', 'Abrir el detalle'].forEach((title, index) => {
        markers.push(`<li class="step-marker locked"><span class="step-marker-button" aria-hidden="true">${model.steps.length + index + 1}</span><span class="sr-only">${title}: pendiente de elegir un pedido.</span></li>`);
      });
      list.innerHTML = markers.join('');
      panel.style.setProperty('--flow-progress', `${((position + 1) / totalSteps) * 100}%`);
      panel.querySelector('.flow-progress-text').textContent = `Paso ${position + 1} de ${totalSteps} · ${step.title}`;
      panel.querySelector('.step-counter').textContent = `${position + 1} / ${totalSteps}`;
      back.disabled = position === 0;
      next.disabled = position === model.steps.length - 1;
      next.textContent = 'Siguiente';
      const actionHint = panel.querySelector('.flow-action-hint');
      actionHint.hidden = !waitingForChoice;
      actionHint.textContent = waitingForChoice ? 'Elegí un identificador para continuar.' : '';

      const resolved = model.steps.slice(0, position + 1).some(item => item.id === 'decision' || item.id === 'error');
      const routes = getFlowRoutes(rule, scenario, resolved);
      const activeRoute = routes.find(route => route.state === 'active')?.id;
      panel.querySelector('.generated-case').textContent = `Caso: ${scenarios[scenario]}${hasChoice ? ` · Identificador elegido: ${selected}` : ''}`;
      panel.querySelector('.generated-status').textContent = finished
        ? 'Recorrido finalizado. El diagrama muestra los pasos y resultados de este caso; las alternativas descartadas quedan en gris.'
        : waitingForChoice
          ? 'Esperando una elección por identificador. La validación y el detalle todavía no están disponibles.'
          : 'Vista del recorrido actual. Los pasos pendientes no muestran resultados antes de llegar a ellos.';
      const generatedSteps = [...model.steps];
      if (pendingSelection) generatedSteps.push(
        { id:'validate', title:'Comprobar la selección', kind:'decision' },
        { id:'detail', title:'Abrir el detalle elegido', kind:'result' }
      );
      panel.querySelector('.generated-flow').innerHTML = generatedSteps.map((item, index) => `<li class="generated-step" data-step-kind="${item.kind}" data-state="${index < position ? 'visited' : index === position ? 'current' : 'upcoming'}"><header class="generated-step-heading">${stepIcon(item.id)}<div><p class="slide-kicker">${kindLabels[item.kind]} · Paso ${index + 1}${index > position ? ' · Pendiente' : ''}</p><h5>${item.title}</h5></div></header><p class="generated-output">${index <= position ? item.output : 'Pendiente de recorrer.'}</p></li>`).join('');
      panel.querySelector('.generated-route-options').innerHTML = routes.map(route => `<li class="flow-route" data-state="${route.state}"><strong class="route-name">${route.title}</strong><span class="route-state">${({pending:'Por evaluar', active:'Recorrido activo', excluded:'No corresponde'})[route.state]}</span></li>`).join('');
      diagram.querySelectorAll('[data-route]').forEach(element => {
        setDiagramState(element, !resolved ? 'pending' : element.dataset.route.split(' ').includes(activeRoute) ? 'active' : 'excluded');
      });
      diagram.querySelectorAll('[data-requires-results]').forEach(element => {
        setDiagramState(element, resolved && activeRoute === 'error' ? 'excluded' : 'pending');
      });
      const validated = model.steps.slice(0, position + 1).some(item => item.id === 'validate');
      diagram.querySelectorAll('[data-validation]').forEach(element => {
        setDiagramState(element, resolved && activeRoute !== 'many' ? 'excluded' : validated ? element.dataset.validation === 'valid' ? 'active' : 'excluded' : 'pending');
      });

      const heading = `<header class="slide-heading">${stepIcon(step.id)}<div><p class="slide-kicker">${kindLabels[step.kind]} · Paso ${position + 1}</p><h4 class="slide-title" id="slide-title-${rule}">${step.title}</h4></div></header>`;
      let body;
      if (step.id === 'context') {
        body = `<blockquote class="context-message"><span>Lucía · Cliente de A la Orden</span><p>“Hola, soy Lucía Pérez. ¿En qué estado está mi pedido?”</p></blockquote><p class="slide-description">Quien la atiende necesita encontrar el pedido antes de responder. El futuro agente buscaría su nombre en el registro de A la Orden.</p><dl class="context-facts"><div><dt>Nombre de la consulta</dt><dd>Lucía Pérez</dd></div><div><dt>Objetivo</dt><dd>Consultar el detalle y el estado actual del pedido.</dd></div></dl><p class="context-note">Datos ficticios. Avanzá para ver cómo se identifica a la persona y se consulta el registro.</p>`;
      } else {
        const image = ['start', 'query', 'detail'].includes(step.id)
          ? `<div class="slide-illustration"><img src="${flowIllustrations[rule]}" width="768" height="512" alt="" decoding="async" loading="lazy"></div>` : '';
        const routeOptions = ['decision', 'error'].includes(step.id)
          ? `<section class="flow-routes" aria-label="Alternativas de la consulta"><h5>Caminos posibles</h5><ol class="route-options">${routes.map(route => `<li class="flow-route" data-state="${route.state}"><strong class="route-name">${route.title}</strong><span class="route-state">${route.state === 'active' ? 'Recorrido activo' : 'No corresponde'}</span></li>`).join('')}</ol></section>` : '';
        const choice = step.id === 'choose'
          ? `<div class="order-choice"><fieldset><legend>Elegí un pedido por su identificador</legend>${model.orders.map(order => `<label data-state="${order.id === selected ? 'selected' : hasChoice ? 'excluded' : 'available'}"><input type="radio" name="order-${rule}" value="${order.id}" ${order.id === selected ? 'checked' : ''}><span><strong>${order.id}</strong><small>Fecha auxiliar: ${order.date}</small><small class="order-state">${order.id === selected ? 'Pedido seleccionado' : hasChoice ? 'No seleccionado · Podés elegirlo' : 'Disponible para elegir'}</small></span></label>`).join('')}</fieldset></div>` : '';
        body = `${image}<p class="slide-description">${step.explanation}</p>${routeOptions}${choice}<div class="slide-output">${step.output}</div>`;
      }
      runningAnimations.get(slide)?.cancel();
      slide.dataset.stepKind = step.kind;
      slide.innerHTML = heading + body;
      slide.scrollTop = direction ? 0 : previousScroll;
      panel.querySelector('.flow-announcement').textContent = `Paso ${position + 1} de ${totalSteps}: ${step.title}.${waitingForChoice ? ' Elegí un identificador para continuar.' : step.id === 'choose' ? ' Selección registrada. Podés continuar.' : ''}`;
      if (focusStep) list.querySelector(`[data-step="${position}"]`)?.focus({ preventScroll: true });
      const current = list.querySelector('[aria-current="step"]');
      if (current) {
        const bounds = current.getBoundingClientRect();
        const viewport = stepper.getBoundingClientRect();
        stepper.scrollLeft += bounds.left - viewport.left - (stepper.clientWidth - bounds.width) / 2;
      }
      animateFlowStep(slide, direction);
    }

    panel.querySelector('.flow-controls').addEventListener('click', event => {
      if (!hasActiveCase()) return;
      const button = event.target.closest('button[data-action]');
      if (!button || button.disabled) return;
      const direction = button.dataset.action === 'next' ? 1 : -1;
      const lastStep = makeFlow(rule, scenario, selected).steps.length - 1;
      const nextPosition = Math.max(0, Math.min(lastStep, position + direction));
      if (nextPosition === position) return;
      position = nextPosition;
      render({ direction });
    });
    list.addEventListener('click', event => {
      if (!hasActiveCase()) return;
      const button = event.target.closest('[data-step]');
      if (!button || Number(button.dataset.step) === position) return;
      const nextPosition = Number(button.dataset.step);
      const direction = Math.sign(nextPosition - position);
      position = nextPosition;
      render({ direction, focusStep: true });
    });
    slide.addEventListener('change', event => {
      if (!hasActiveCase()) return;
      const input = event.target.closest('.order-choice input[type="radio"]');
      if (!input || !makeFlow(rule, scenario).orders.some(order => order.id === input.value)) return;
      selected = input.value;
      render();
      slide.querySelector('input:checked')?.focus({ preventScroll: true });
    });
    setupForm.addEventListener('change', () => {
      startButton.disabled = !Object.hasOwn(scenarios, chosenCase());
    });
    setupForm.addEventListener('submit', event => {
      event.preventDefault();
      const choice = chosenCase();
      if (!Object.hasOwn(scenarios, choice)) return;
      scenario = choice;
      selected = '';
      position = 0;
      started = true;
      render({ direction: 1 });
      slide.scrollTop = 0;
      slide.focus({ preventScroll: true });
      slide.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
    panel.querySelector('.settings-trigger').addEventListener('click', () => {
      if (!hasActiveCase()) return;
      started = false;
      selected = '';
      position = 0;
      render();
      const target = setupForm.querySelector('input:checked') || setup.querySelector('.setup-title');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
    panel.querySelector('.reset-flow').addEventListener('click', () => {
      if (!hasActiveCase()) return;
      selected = '';
      position = 0;
      if (diagramDialog.open) diagramDialog.close();
      render({ direction: -1 });
    });
    panel.querySelectorAll('.diagram-trigger').forEach(button => {
      button.addEventListener('click', () => {
        if (!hasActiveCase()) return;
        diagramDialog.showModal();
      });
    });
    diagramDialog.querySelector('.dialog-close').addEventListener('click', () => diagramDialog.close());
    render();
  });
}
