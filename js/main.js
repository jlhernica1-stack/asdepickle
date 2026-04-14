document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Carrusel equipos
(function() {
  var track = document.getElementById('carouselTrack');
  if (!track) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
  var dotsContainer = document.getElementById('carouselDots');
  var current = 0;
  var total = slides.length;
  var timer;

  // Activar primer slide
  slides[0].classList.add('active');

  // Crear dots
  slides.forEach(function(_, i) {
    var btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Foto ' + (i + 1));
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', function() { goTo(i); resetTimer(); });
    dotsContainer.appendChild(btn);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsContainer.querySelectorAll('button')[current].classList.remove('active');
    current = (index + total) % total;
    slides[current].classList.add('active');
    dotsContainer.querySelectorAll('button')[current].classList.add('active');
  }

  document.getElementById('carouselPrev').addEventListener('click', function() {
    goTo(current - 1); resetTimer();
  });
  document.getElementById('carouselNext').addEventListener('click', function() {
    goTo(current + 1); resetTimer();
  });

  // Pausa al pasar el ratón
  var wrap = document.getElementById('teamCarousel');
  wrap.addEventListener('mouseenter', function() { clearInterval(timer); });
  wrap.addEventListener('mouseleave', function() { startTimer(); });

  // Swipe táctil
  var touchStartX = 0;
  wrap.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, {passive: true});
  wrap.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { resetTimer(); goTo(diff > 0 ? current + 1 : current - 1); }
  }, {passive: true});

  function startTimer() { timer = setInterval(function() { goTo(current + 1); }, 4500); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  startTimer();
}());
