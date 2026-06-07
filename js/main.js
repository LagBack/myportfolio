/* ========================================
   CYBERPUNK PORTFOLIO — MAIN SCRIPT
   Particles · Glitch · Scroll Reveal
   ======================================== */

(function () {
  'use strict';


  // ---------- GLOBALS ----------
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- UTILITY ----------
  function $ (sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$ (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }


  // ==================================================
  // 1. PARTICLE SYSTEM — floating cyber-dots on canvas
  // ==================================================
  function initParticles () {
    if (prefersReducedMotion) return;

    const canvas = $('#particles');
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = prefersReducedMotion ? 0 : 60;
    const CONNECTION_DIST = 120;
    const COLORS = ['rgba(0,240,255,', 'rgba(255,0,170,', 'rgba(180,74,255,'];

    function resize () {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        colorIndex: Math.floor(Math.random() * COLORS.length),
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    function draw () {
      ctx.clearRect(0, 0, w, h);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.colorIndex] + p.alpha + ')';
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.colorIndex] + (p.alpha * 0.15) + ')';
        ctx.fill();
      }

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }



  // ==================================================
  // 3. GLITCH TEXT — random flicker on name
  // ==================================================
  function initGlitchText () {
    const glitchEl = $('.glitch');
    if (!glitchEl) return;

    const originalText = glitchEl.textContent.trim();
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▄▀';
    let glitchInterval;

    function triggerGlitch () {
      let count = 0;
      const maxFlickers = 8 + Math.floor(Math.random() * 5);

      glitchInterval = setInterval(function () {
        if (count >= maxFlickers) {
          clearInterval(glitchInterval);
          glitchEl.textContent = originalText;
          return;
        }

        // Replace random characters with glitch chars
        let result = '';
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() < 0.4) {
            result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            result += originalText[i];
          }
        }
        glitchEl.textContent = result;

        // Random color shift during glitch
        const hue = Math.random() > 0.5 ? 'var(--cyan)' : 'var(--magenta)';
        glitchEl.style.filter = `drop-shadow(3px 0 ${hue}) drop-shadow(-3px 0 var(--magenta))`;

        count++;
      }, 60);
    }

    // Auto-glitch every few seconds
    triggerGlitch();
    setInterval(triggerGlitch, 4000 + Math.random() * 3000);

    // Glitch on hover (handled by CSS)
  }


  // ==================================================
  // 4. SCROLL REVEAL — elements fade in on scroll
  // ==================================================
  function initScrollReveal () {
    const reveals = $$('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }


  // ==================================================
  // 5. SKILL BARS — animate width on scroll into view
  // ==================================================
  function initSkillBars () {
    const fills = $$('.skill-fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Find the parent .skill-item and read its data-level
          const item = entry.target.closest('.skill-item');
          const level = item ? item.dataset.level || 50 : 50;
          entry.target.style.width = level + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    fills.forEach(function (fill) { observer.observe(fill); });
  }


  // ==================================================
  // 6. TYPING EFFECT — hero typing animation
  // ==================================================
  function initTyping () {
    const tagLine = $('.tag-line');
    if (!tagLine) return;

    const phrases = [
      'building the future, one commit at a time_',
      'making stuff sometimes — js & python_',
      'cs student @ unitri — uberlandia mg_',
      'looking for internship or junior roles_'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseDuration = 2000;

    function type () {
      const currentPhrase = phrases[phraseIndex];

      if (!deleting) {
        tagLine.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          deleting = true;
          setTimeout(type, pauseDuration);
          return;
        }
        setTimeout(type, typeSpeed);
      } else {
        tagLine.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 300);
          return;
        }
        setTimeout(type, deleteSpeed);
      }
    }

    // Start after a short delay
    setTimeout(type, 1000);
  }


  // ==================================================
  // 7. NAV ACTIVE STATE — highlight current section
  // ==================================================
  function initNavHighlight () {
    const sections = $$('section[id]');
    const navLinks = $$('#nav [data-nav]');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + id) {
              link.style.color = 'var(--cyan)';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (section) { observer.observe(section); });
  }


  // ==================================================
  // 8. AMBIENT GLOW — follow mouse subtly
  // ==================================================
  function initAmbientGlow () {
    if (prefersReducedMotion) return;

    const glows = $$('.ambient-glow');
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let tx = mx, ty = my;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });

    function moveGlow () {
      mx += (tx - mx) * 0.02;
      my += (ty - my) * 0.02;

      glows.forEach(function (glow, i) {
        const factor = (i + 1) * 0.3;
        glow.style.transform = `translate(${mx * factor}px, ${my * factor}px) translate(-50%, -50%)`;
      });

      requestAnimationFrame(moveGlow);
    }
    moveGlow();
  }


  // ==================================================
  // 9. SMOOTH SCROLL — for nav links
  // ==================================================
  function initSmoothScroll () {
    $$('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  // ==================================================
  // 10. FOOTER YEAR — auto-update
  // ==================================================
  function initFooter () {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear() + ' — all rights reserved';
  }


  // No JS needed for project cards — CSS pointer-events handle overlay vs source button independently.


  // ==================================================
  // 12. CONTACT COPY — click email card to copy address
  // ==================================================
  function initContactCopy () {
    var cards = $$('.contact-copy');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var text = card.dataset.copy;
        if (!text) return;

        navigator.clipboard.writeText(text).then(function () {
          card.classList.add('copied');
          card.querySelector('.copy-feedback').textContent = 'copied!';

          setTimeout(function () {
            card.classList.remove('copied');
            card.querySelector('.copy-feedback').textContent = '';
          }, 2000);
        }).catch(function () {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);

          card.classList.add('copied');
          card.querySelector('.copy-feedback').textContent = 'copied!';
          setTimeout(function () {
            card.classList.remove('copied');
            card.querySelector('.copy-feedback').textContent = '';
          }, 2000);
        });
      });
    });
  }


  // ==================================================
  // INITIALIZE EVERYTHING ON DOM READY
  // ==================================================
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    // initCursorTrail(); // TODO: implement cursor trail effect
    initGlitchText();
    initScrollReveal();
    initSkillBars();
    initTyping();
    initNavHighlight();
    initAmbientGlow();
    initSmoothScroll();
    initFooter();
    initContactCopy();
  });

})();
