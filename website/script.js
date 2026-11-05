const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const replayButton = document.querySelector('.replay-button');
const demoCircle = document.querySelector('.demo-circle');
const wave = document.querySelector('.art-wave svg');
const wavePath = document.querySelector('.wave-path');
const waveDot = document.querySelector('.wave-dot');
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

if (wave && wavePath && waveDot) {
  const pathLength = wavePath.getTotalLength();
  wavePath.style.strokeDasharray = `${pathLength}`;
  const moveWavePoint = (value) => {
    const x = Math.max(8, Math.min(312, value));
    const y = 70 - Math.sin((x / 60) * Math.PI) * 50;
    waveDot.setAttribute('cx', String(x));
    waveDot.setAttribute('cy', String(y));
    waveDot.setAttribute('aria-valuenow', String(Math.round((x / 320) * 100)));
    wavePath.style.strokeDashoffset = String(pathLength * (1 - x / 340));
  };
  const pointFromEvent = (event) => {
    const point = wave.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(wave.getScreenCTM().inverse()).x;
  };
  waveDot.addEventListener('pointerdown', (event) => {
    waveDot.setPointerCapture(event.pointerId);
    moveWavePoint(pointFromEvent(event));
  });
  waveDot.addEventListener('pointermove', (event) => {
    if (waveDot.hasPointerCapture(event.pointerId)) moveWavePoint(pointFromEvent(event));
  });
  waveDot.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 20 : 6;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      moveWavePoint(Number(waveDot.getAttribute('cx')) + direction * step);
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      moveWavePoint(event.key === 'Home' ? 8 : 312);
    }
  });
  moveWavePoint(180);
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
