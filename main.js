import { animateContentChange, initFlows } from './interactive-flows.js';
import { initDepthEffects } from './depth-effects.js';

initFlows();
initDepthEffects();

const themeButton = document.querySelector('.theme-toggle');
function syncTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
  themeButton.innerHTML = `<span aria-hidden="true">${dark ? '☀' : '☾'}</span><span>${dark ? 'Modo claro' : 'Modo oscuro'}</span>`;
  document.querySelector('meta[name="theme-color"]').content = dark ? '#102f2c' : '#f4fff8';
}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('a-la-orden-theme', theme); } catch { /* La preferencia funciona en esta página aunque el almacenamiento no esté disponible. */ }
  syncTheme();
});
syncTheme();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealElements = [...document.querySelectorAll('.solution, .profile-card, .section-head, .brand-story')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  revealElements.forEach(element => {
    const siblings = [...element.parentElement.children].filter(item => item.matches('.profile-card'));
    element.style.setProperty('--reveal-delay', `${Math.max(0, siblings.indexOf(element)) * 70}ms`);
    element.classList.add('reveal');
    observer.observe(element);
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      revealElements.forEach(element => element.classList.add('revealed'));
      observer.disconnect();
    }
  });
}

const navItems = [...document.querySelectorAll('.header nav a[href^="#"]')]
  .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
  .filter(item => item.section);
const header = document.querySelector('.header');
let navFrame = 0;
function syncNavigation() {
  navFrame = 0;
  const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
  const readingPosition = Math.min(window.innerHeight - 1, Math.max(headerBottom + 24, window.innerHeight * 0.35));
  const active = navItems.find(({ section }) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= readingPosition && bounds.bottom > readingPosition;
  });
  navItems.forEach(item => {
    const isActive = item === active;
    item.link.classList.toggle('is-active', isActive);
    if (isActive) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  });
}
function scheduleNavigation() {
  if (!navFrame) navFrame = requestAnimationFrame(syncNavigation);
}
window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation);
window.addEventListener('load', scheduleNavigation);
if ('ResizeObserver' in window) new ResizeObserver(scheduleNavigation).observe(document.querySelector('main'));
syncNavigation();

const cases = {
  one: ['APLICA R3', 'Lucía tiene un único pedido registrado.', 'La búsqueda devuelve PED-1042. El agente mostraría su detalle y su estado actual, sin pedir elegir entre resultados.', 'La condición de R3 se cumple; la de R4 no.'],
  many: ['APLICA R4', 'Un nombre devuelve dos pedidos distintos.', 'La lista mostraría PED-1042 · 18/11/2026 y PED-1087 · 20/11/2026. La persona elegiría un identificador antes de abrir su detalle.', 'La condición de R3 no se cumple; la de R4 sí. Sin elección, no se abre ningún detalle.'],
  none: ['DECISIÓN DEL GRUPO', 'La búsqueda no encuentra coincidencias.', 'El agente informaría que no hay resultados y pediría revisar el nombre. No mostraría un pedido inventado ni cambiaría ningún registro.', 'No se cumple la condición de R3 ni la de R4. Esta alternativa es una propuesta del grupo.'],
  same: ['CASO LÍMITE · R4', 'Dos pedidos comparten nombre y fecha.', 'PED-1042 y PED-1087 corresponden a Lucía Pérez y tienen fecha 18/11/2026. La persona debe elegir por identificador único; la fecha es solamente un dato auxiliar.', 'El agente no selecciona automáticamente por fecha ni por posición en la lista.'],
  error: ['EXCEPCIÓN · REVISIÓN HUMANA', 'El registro de pedidos no responde.', 'El agente informaría que no pudo completar la consulta y pediría revisión a una persona responsable. Un error de consulta no equivale a cero resultados.', 'Decisión del grupo para ambos flujos: no inventar detalles, estados ni coincidencias.']
};
const fields = ['case-tag', 'case-title', 'case-description', 'case-rule'];
document.querySelectorAll('[data-case]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    document.querySelectorAll('[data-case]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cases[button.dataset.case].forEach((text, index) => { document.getElementById(fields[index]).textContent = text; });
    animateContentChange(document.querySelector('.case-result'));
  });
});
