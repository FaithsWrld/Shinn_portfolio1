'use strict';

var year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}

var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
var reducedMotion = motionPreference.matches;
var revealTargets = document.querySelectorAll('.hero-copy, .hero-art, .section-heading, .project-card, .about-copy, .value-row > div, .experience-list article, .learning-row, .contact-inner');

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach(function (element) {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}

var progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
progress.innerHTML = '<span></span>';
document.body.appendChild(progress);
var progressBar = progress.firstElementChild;
var progressFrame = 0;

function updateProgress() {
  progressFrame = 0;
  var scrollable = document.documentElement.scrollHeight - window.innerHeight;
  var amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, amount)) + ')';
}

window.addEventListener('scroll', function () {
  if (!progressFrame) {
    progressFrame = window.requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

var heroArt = document.querySelector('.hero-art');
var spinButton = document.querySelector('.art-spin');
var spinTimer;
if (heroArt && spinButton) {
  spinButton.addEventListener('click', function () {
    window.clearTimeout(spinTimer);
    heroArt.classList.remove('is-spinning');
    window.requestAnimationFrame(function () {
      heroArt.classList.add('is-spinning');
      spinTimer = window.setTimeout(function () {
        heroArt.classList.remove('is-spinning');
      }, 1100);
    });
  });
}

if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  if (heroArt) {
    heroArt.addEventListener('pointermove', function (event) {
      var bounds = heroArt.getBoundingClientRect();
      var offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      var offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroArt.style.setProperty('--art-x', (offsetX * 16).toFixed(1) + 'px');
      heroArt.style.setProperty('--art-y', (offsetY * 16).toFixed(1) + 'px');
    });
    heroArt.addEventListener('pointerleave', function () {
      heroArt.style.setProperty('--art-x', '0px');
      heroArt.style.setProperty('--art-y', '0px');
    });
  }

  document.querySelectorAll('.project-visual').forEach(function (visual) {
    visual.addEventListener('pointermove', function (event) {
      var bounds = visual.getBoundingClientRect();
      var x = ((event.clientX - bounds.left) / bounds.width) * 100;
      var y = ((event.clientY - bounds.top) / bounds.height) * 100;
      visual.style.setProperty('--pointer-x', x.toFixed(1) + '%');
      visual.style.setProperty('--pointer-y', y.toFixed(1) + '%');
      visual.classList.add('pointer-active');
    });
    visual.addEventListener('pointerleave', function () {
      visual.classList.remove('pointer-active');
    });
  });
}
