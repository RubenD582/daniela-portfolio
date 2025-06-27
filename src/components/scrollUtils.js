// scrollUtils.js
export function scrollToElement(id, duration = 800) {
  const element = document.getElementById(id);
  if (!element) return;

  const startY = window.scrollY;
  const targetY = element.getBoundingClientRect().top + startY;
  const distance = targetY - startY;
  let startTime = null;
  let rafId = null;
  let canceled = false;

  // Cancel the animation and clean up listeners
  function cancel() {
    canceled = true;
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('wheel', onUserScroll, { passive: true });
    window.removeEventListener('touchstart', onUserScroll, { passive: true });
    window.removeEventListener('keydown', onUserScroll, { passive: true });
  }

  // Any of these means “user took over” → cancel
  function onUserScroll(event) {
    // ignore modifier keys held with arrow keys
    if (event.type === 'keydown') {
      const allowed = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '];
      if (!allowed.includes(event.key)) return;
    }
    cancel();
  }

  // Attach listeners
  window.addEventListener('wheel', onUserScroll, { passive: true });
  window.addEventListener('touchstart', onUserScroll, { passive: true });
  window.addEventListener('keydown', onUserScroll, { passive: true });

  function step(timestamp) {
    if (canceled) return;

    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // quintic ease-out: fast start, slow finish
    const ease = 1 - Math.pow(1 - progress, 5);
    window.scrollTo(0, startY + distance * ease);

    if (elapsed < duration) {
      rafId = requestAnimationFrame(step);
    } else {
      // animation finished — clean up
      cancel();
    }
  }

  rafId = requestAnimationFrame(step);
}
