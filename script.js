const body = document.body;
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navWrap = document.querySelector('.nav-links-wrap');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const revealElements = document.querySelectorAll('.reveal');
const scrollProgress = document.querySelector('.scroll-progress');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const magnetButtons = document.querySelectorAll('.magnet');
const tiltCards = document.querySelectorAll('.tilt-card');
const toast = document.querySelector('.toast');
const darkModeToggle = document.querySelector('.dark-toggle');

if (!darkModeToggle) {
  const toggle = document.createElement('button');
  toggle.className = 'btn btn-ghost dark-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Toggle light and dark mode');
  toggle.textContent = '☀';

  const navCta = document.querySelector('.nav-cta');
  navCta.insertAdjacentElement('afterend', toggle);
}

const themeToggle = document.querySelector('.dark-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  themeToggle.textContent = '☾';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '☾' : '☀';
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  });
}

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;

  header.classList.toggle('scrolled', scrollTop > 25);
};

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

const setActiveNav = () => {
  let currentId = 'home';
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 200) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
};

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navWrap.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navWrap.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const pointerMoveHandler = (event) => {
  if (window.innerWidth <= 640) return;

  const x = event.clientX;
  const y = event.clientY;
  cursorDot.style.transform = `translate(${x}px, ${y}px)`;
  cursorRing.style.transform = `translate(${x}px, ${y}px)`;
  cursorRing.style.left = '0px';
  cursorRing.style.top = '0px';
};

window.addEventListener('pointermove', pointerMoveHandler, { passive: true });
window.addEventListener('pointerenter', () => {
  cursorDot.classList.add('visible');
  cursorRing.classList.add('visible');
});
window.addEventListener('pointerleave', () => {
  cursorDot.classList.remove('visible');
  cursorRing.classList.remove('visible');
});

if (window.innerWidth > 640) {
  cursorDot.classList.add('visible');
  cursorRing.classList.add('visible');
}

magnetButtons.forEach((button) => {
  button.addEventListener('pointermove', (event) => {
    if (window.innerWidth <= 640) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = (x / rect.width - 0.5) * 12;
    const dy = (y / rect.height - 0.5) * 12;

    button.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  button.addEventListener('pointerleave', () => {
    button.style.transform = '';
  });
});

tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.innerWidth <= 980) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = (0.5 - (y / rect.height)) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

const showToast = () => {
  toast.classList.add('visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 1900);
};

const easterEgg = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let inputHistory = [];

document.addEventListener('keydown', (event) => {
  inputHistory.push(event.key);
  if (inputHistory.length > easterEgg.length) inputHistory.shift();

  if (inputHistory.join(',') === easterEgg.join(',')) {
    showToast();
    inputHistory = [];
  }
});

const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.textContent = 'Message Ready';
  submitButton.disabled = true;
  setTimeout(() => {
    submitButton.textContent = 'Send Message';
    submitButton.disabled = false;
    contactForm.reset();
  }, 1600);
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.cursor').forEach((node) => node.remove());
}
