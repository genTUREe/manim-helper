const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const replayButton = document.querySelector('.replay-button');
const demoCircle = document.querySelector('.demo-circle');

menuButton.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isExpanded));
  navigation.classList.toggle('is-open', !isExpanded);
});

navigation.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});

replayButton.addEventListener('click', () => {
  demoCircle.style.animation = 'none';
  void demoCircle.getBoundingClientRect();
  demoCircle.style.animation = '';
});
