let disposeDepthEffects;

/** Add a gentle perspective response when a precise, hovering pointer is available. */
export function initDepthEffects() {
  disposeDepthEffects?.();

  const scenes = [...document.querySelectorAll('[data-depth-scene]')].map(element => ({
    element,
    surface: element.closest('.hero-art') ?? element,
    frame: 0,
    pointerX: 0,
    pointerY: 0,
  }));
  const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let enabled = false;

  function resetScene(scene) {
    cancelAnimationFrame(scene.frame);
    scene.frame = 0;
    for (const property of ['--tilt-x', '--tilt-y', '--glow-x', '--glow-y']) {
      scene.element.style.removeProperty(property);
    }
  }

  const handlers = scenes.map(scene => {
    const reset = () => resetScene(scene);
    const move = event => {
      if (event.pointerType === 'touch') return;
      scene.pointerX = event.clientX;
      scene.pointerY = event.clientY;
      if (scene.frame) return;

      scene.frame = requestAnimationFrame(() => {
        scene.frame = 0;
        // The wrapper stays still while its visual rotates, so the tilt cannot feed back into itself.
        const bounds = scene.surface.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const x = Math.max(0, Math.min(1, (scene.pointerX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (scene.pointerY - bounds.top) / bounds.height));
        scene.element.style.setProperty('--tilt-x', `${((0.5 - y) * 8).toFixed(2)}deg`);
        scene.element.style.setProperty('--tilt-y', `${((x - 0.5) * 8).toFixed(2)}deg`);
        scene.element.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`);
        scene.element.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`);
      });
    };
    return { scene, move, reset };
  });

  const resetAll = () => scenes.forEach(resetScene);

  function detach() {
    handlers.forEach(({ scene, move, reset }) => {
      scene.surface.removeEventListener('pointermove', move);
      scene.surface.removeEventListener('pointerleave', reset);
      scene.surface.removeEventListener('pointercancel', reset);
    });
    window.removeEventListener('blur', resetAll);
    resetAll();
    enabled = false;
  }

  function syncMotion() {
    if (enabled) detach();
    if (!motion.matches || !scenes.length) return;
    handlers.forEach(({ scene, move, reset }) => {
      scene.surface.addEventListener('pointermove', move, { passive: true });
      scene.surface.addEventListener('pointerleave', reset);
      scene.surface.addEventListener('pointercancel', reset);
    });
    window.addEventListener('blur', resetAll);
    enabled = true;
  }

  motion.addEventListener('change', syncMotion);
  syncMotion();

  disposeDepthEffects = () => {
    detach();
    motion.removeEventListener('change', syncMotion);
    disposeDepthEffects = undefined;
  };
  return disposeDepthEffects;
}
