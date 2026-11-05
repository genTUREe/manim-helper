const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const replayButton = document.querySelector('.replay-button');
const demoCircle = document.querySelector('.demo-circle');
const wave = document.querySelector('.art-wave svg');
const wavePath = document.querySelector('.wave-path');
const waveDot = document.querySelector('.wave-dot');
const waveTouchTarget = document.querySelector('.wave-touch-target');
const waveRadius = document.querySelector('.circle-radius');
const waveConnector = document.querySelector('.wave-connector');
const squareGrid = document.querySelector('.square-grid');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.documentElement.classList.add('reveal-ready');
const revealItems = document.querySelectorAll(
  '.feature-item, .example-card, .section-heading, .start-card, .feature-strip, .site-footer',
);
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-playing', entry.isIntersecting);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.example-card').forEach((card) => animationObserver.observe(card));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
  document.querySelectorAll('.example-card').forEach((card) => card.classList.add('is-playing'));
}

const progressBar = document.querySelector('.scroll-progress span');
let progressFrame = 0;
const updateScrollProgress = () => {
  if (progressFrame) return;
  progressFrame = requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    progressFrame = 0;
  });
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

if (wave && wavePath && waveDot && waveTouchTarget && waveRadius && waveConnector) {
  const wavePoints = Array.from({ length: 101 }, (_, index) => {
    const phase = (index / 100) * Math.PI * 2;
    const x = 112 + index * 2;
    const y = 70 - Math.sin(phase) * 38;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  wavePath.setAttribute('d', wavePoints.join(' '));
  const pathLength = wavePath.getTotalLength();
  const fullTurn = Math.PI * 2;
  wavePath.style.strokeDasharray = `${pathLength}`;
  const setWaveAngle = (angle) => {
    const normalizedAngle = ((angle % fullTurn) + fullTurn) % fullTurn;
    const progress = normalizedAngle / fullTurn;
    const circleX = 48 + Math.cos(normalizedAngle) * 28;
    const circleY = 70 - Math.sin(normalizedAngle) * 28;
    const waveX = 112 + progress * 200;
    const waveY = 70 - Math.sin(normalizedAngle) * 38;
    waveDot.setAttribute('cx', String(circleX));
    waveDot.setAttribute('cy', String(circleY));
    waveTouchTarget.setAttribute('cx', String(circleX));
    waveTouchTarget.setAttribute('cy', String(circleY));
    waveTouchTarget.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    waveTouchTarget.setAttribute('aria-valuetext', `${Math.round(progress * 360)} degrees, height ${Math.sin(normalizedAngle).toFixed(2)}`);
    waveRadius.setAttribute('d', `M48 70 L${circleX} ${circleY}`);
    waveConnector.setAttribute('d', `M48 ${waveY} H${waveX}`);
    wavePath.style.strokeDashoffset = String(pathLength * (1 - progress));
  };
  const angleFromEvent = (event) => {
    const point = wave.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const localPoint = point.matrixTransform(wave.getScreenCTM().inverse());
    return Math.atan2(70 - localPoint.y, localPoint.x - 48);
  };
  waveTouchTarget.addEventListener('pointerdown', (event) => {
    waveTouchTarget.setPointerCapture(event.pointerId);
    setWaveAngle(angleFromEvent(event));
  });
  waveTouchTarget.addEventListener('pointermove', (event) => {
    if (waveTouchTarget.hasPointerCapture(event.pointerId)) setWaveAngle(angleFromEvent(event));
  });
  waveTouchTarget.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? Math.PI / 6 : Math.PI / 36;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : -1;
      const current = Number(waveTouchTarget.getAttribute('aria-valuenow')) / 100 * fullTurn;
      setWaveAngle(current + direction * step);
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setWaveAngle(event.key === 'Home' ? 0 : fullTurn - 0.001);
    }
  });
  setWaveAngle(0);
}

if (squareGrid) {
  const advanceLayer = () => {
    const layer = Number(squareGrid.dataset.layer) % 3 + 1;
    squareGrid.dataset.layer = String(layer);
    squareGrid.setAttribute('aria-label', `Show ${layer === 1 ? 'one' : layer === 2 ? 'two' : 'three'} odd-number layers`);
    squareGrid.closest('.example-art').querySelector('.art-caption').textContent =
      layer === 1 ? '1 = 1²' : layer === 2 ? '1 + 3 = 2²' : '1 + 3 + 5 = 3²';
  };
  squareGrid.addEventListener('click', advanceLayer);
  squareGrid.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advanceLayer();
    }
  });
}

const heroVisual = document.querySelector('.hero-visual');
const editorCard = document.querySelector('.editor-card');
if (heroVisual && editorCard && !reducedMotion.matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    editorCard.style.transform = `perspective(1100px) rotateY(${-5 + x * 7}deg) rotateX(${2 - y * 6}deg)`;
  });
  heroVisual.addEventListener('pointerleave', () => {
    editorCard.style.transform = '';
  });
}

menuButton.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isExpanded));
  navigation.classList.toggle('is-open', !isExpanded);
});

navigation.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    menuButton.focus();
  }
});

replayButton.addEventListener('click', () => {
  demoCircle.style.animation = 'none';
  void demoCircle.getBoundingClientRect();
  demoCircle.style.animation = '';
});
