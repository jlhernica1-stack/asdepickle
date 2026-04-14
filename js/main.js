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

  var slides = track.querySelectorAll('.carousel-slide');
  var dotsContainer = document.getElementById('carouselDots');
  var current = 0;
  var total = slides.length;
  var autoInterval = 4500; // 4.5 s por foto: suficiente para verla, sin esperar
  var timer;
  var isTransitioning = false;

  // Crear dots
  slides.forEach(function(_, i) {
    var btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Foto ' + (i + 1));
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', function() { goTo(i); });
    dotsContainer.appendChild(btn);
  });

  function goTo(index) {
    if (isTransitioning || index === current) return;
    isTransitioning = true;
    var prev = current;
    current = (index + total) % total;

    // Crossfade: el slide saliente se desvanece, el entrante aparece
    slides[prev].style.transition = 'opacity .5s ease';
    slides[current].style.transition = 'opacity .5s ease';
    slides[prev].style.opacity = '0';
    slides[current].style.opacity = '1';
    slides[current].style.zIndex = '2';
    slides[prev].style.zIndex = '1';

    // Dots
    dotsContainer.querySelectorAll('button').forEach(function(b, i) {
      b.classList.toggle('active', i === current);
    });

    setTimeout(function() {
      slides[prev].style.zIndex = '1';
      isTransitioning = false;
    }, 550);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // Posicionamiento inicial con CSS stack (todos apilados, el activo arriba)
  slides.forEach(function(s, i) {
    s.style.position = 'absolute';
    s.style.top = '0'; s.style.left = '0';
    s.style.width = '100%'; s.style.height = '100%';
    s.style.opacity = i === 0 ? '1' : '0';
    s.style.zIndex = i === 0 ? '2' : '1';
  });
  track.style.position = 'relative';
  track.style.height = '100%';

  document.getElementById('carouselPrev').addEventListener('click', function() {
    resetTimer(); prev();
  });
  document.getElementById('carouselNext').addEventListener('click', function() {
    resetTimer(); next();
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
    if (Math.abs(diff) > 40) { resetTimer(); diff > 0 ? next() : prev(); }
  }, {passive: true});

  function startTimer() { timer = setInterval(next, autoInterval); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  startTimer();
}());
