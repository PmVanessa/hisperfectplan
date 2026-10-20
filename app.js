/**
 * ILEANWA & ENYOJO — #HisPerfectPlan
 * Editorial Monograph Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {


  // =========================================================================
  // 2. TIMECODE COUNTDOWN (SATURDAY, NOV 7, 2026, 12:00 NOON WAT)
  // =========================================================================
  // Target: 2026-11-07T12:00:00+01:00 (West Africa Time)
  const targetEpoch = new Date('2026-11-07T12:00:00+01:00').getTime();

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  function updateTicker() {
    const now = new Date().getTime();
    const distance = targetEpoch - now;

    if (distance <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTicker();
  setInterval(updateTicker, 1000);

  // =========================================================================
  // 2B. FLOATING DOCK SCROLL SPY & NAVIGATION (ALL SECTIONS)
  // =========================================================================
  const dockLinks = document.querySelectorAll('.dock-link[href^="#"]');
  const spySections = ['hero', 'gallery', 'proposal', 'asoebi', 'rsvp', 'accommodations', 'registry']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function updateDockActiveState() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = 'hero';

    if (window.scrollY > 150) {
      spySections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = section.id;
        }
      });
    }

    dockLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (currentId && href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateDockActiveState, { passive: true });
  updateDockActiveState();

  // =========================================================================
  // 3. TOAST & 1-TAP CLIPBOARD COPY
  // =========================================================================
  const toastBox = document.getElementById('toast-notification');
  let toastTimer;

  function showToast(message) {
    if (!toastBox) return;
    const msg = toastBox.querySelector('.toast-msg');
    if (msg) msg.textContent = message;
    toastBox.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastBox.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('.btn-ledger-copy').forEach(button => {
    button.addEventListener('click', async () => {
      const targetSelector = button.getAttribute('data-clipboard-target');
      const targetElem = document.querySelector(targetSelector);
      if (!targetElem) return;

      const text = targetElem.textContent.trim();
      const originalText = button.querySelector('span')?.textContent || 'Copy';

      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }

      if (button.querySelector('span')) {
        button.querySelector('span').textContent = 'Copied';
      }
      showToast(`Account number ${text} copied to clipboard`);

      setTimeout(() => {
        if (button.querySelector('span')) {
          button.querySelector('span').textContent = originalText;
        }
      }, 2000);
    });
  });

  // =========================================================================
  // 4. MULTI-VIDEO CINEMA REELS CONTROLLER
  // =========================================================================
  const filmCards = document.querySelectorAll('.film-screen-frame');
  const allFilmVideos = document.querySelectorAll('.film-video');

  function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  filmCards.forEach((card) => {
    const video = card.querySelector('.film-video');
    const overlay = card.querySelector('.film-play-trigger');
    const playToggleBtn = card.querySelector('.video-play-toggle');
    const playIcon = playToggleBtn?.querySelector('.p-play');
    const pauseIcon = playToggleBtn?.querySelector('.p-pause');
    const progressBar = card.querySelector('.film-scrubber-track');
    const progressFill = card.querySelector('.film-scrubber-fill');
    const curTimeElem = card.querySelector('.v-current-time');
    const durTimeElem = card.querySelector('.v-duration');
    const muteBtn = card.querySelector('.video-mute-toggle');
    const muteText = card.querySelector('.mute-icon-text');
    const fullscreenBtn = card.querySelector('.video-fullscreen-toggle');

    if (!video) return;

    function togglePlay() {
      if (video.paused || video.ended) {
        // Pause any other playing video so they don't overlap audio
        allFilmVideos.forEach(otherVideo => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
            const otherCard = otherVideo.closest('.film-screen-frame');
            const otherOverlay = otherCard?.querySelector('.film-play-trigger');
            const otherPlayBtn = otherCard?.querySelector('.video-play-toggle');
            if (otherOverlay) otherOverlay.classList.remove('hidden');
            if (otherPlayBtn) {
              const p = otherPlayBtn.querySelector('.p-play');
              const pa = otherPlayBtn.querySelector('.p-pause');
              if (p) p.style.display = 'inline';
              if (pa) pa.style.display = 'none';
            }
          }
        });

        video.play().then(() => {
          if (overlay) overlay.classList.add('hidden');
          if (playIcon) playIcon.style.display = 'none';
          if (pauseIcon) pauseIcon.style.display = 'inline';
        }).catch(e => console.warn(e));
      } else {
        video.pause();
        if (overlay) overlay.classList.remove('hidden');
        if (playIcon) playIcon.style.display = 'inline';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    }

    if (overlay) overlay.addEventListener('click', togglePlay);
    if (playToggleBtn) playToggleBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (curTimeElem) curTimeElem.textContent = formatTime(video.currentTime);
      }
    });

    video.addEventListener('loadedmetadata', () => {
      if (durTimeElem && video.duration) {
        durTimeElem.textContent = formatTime(video.duration);
      }
    });

    video.addEventListener('ended', () => {
      if (overlay) overlay.classList.remove('hidden');
      if (playIcon) playIcon.style.display = 'inline';
      if (pauseIcon) pauseIcon.style.display = 'none';
    });

    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (video.duration) {
          video.currentTime = pos * video.duration;
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (muteText) {
          muteText.textContent = video.muted ? 'MUTE' : 'SOUND';
        }
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      });
    }
  });

  // =========================================================================
  // 5. ICAL (.ICS) DOWNLOAD (CLIENT-SIDE BLOB GENERATOR)
  // =========================================================================
  function triggerIcsDownload() {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HisPerfectPlan//Ileanwa and Enyojo Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:ileanwa-enyojo-wedding-20261107@hisperfectplan',
      'DTSTAMP:20261019T180000Z',
      'DTSTART:20261107T110000Z',
      'DTEND:20261107T190000Z',
      'SUMMARY:Wedding of Ileanwa & Enyojo (#HisPerfectPlan)',
      'DESCRIPTION:Wedding Celebration of Ileanwa Momoh & Enyojo Atabo!\\nJoin us for the Holy Matrimony and Grand Reception at The Greenlife Event Center, Oregun, Ikeja, Lagos.\\nWe can\'t wait to celebrate together!\\nHashtag: #HisPerfectPlan',
      'LOCATION:The Greenlife Event Center, 72/82 Kudirat Abiola Way, Oregun, Ikeja, Lagos, Nigeria',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
    const dlLink = document.createElement('a');
    dlLink.href = window.URL.createObjectURL(blob);
    dlLink.setAttribute('download', 'Ileanwa-Enyojo-Wedding-Invitation.ics');
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
    showToast('Wedding calendar invite (.ics) downloaded');
  }

  const downloadIcsBtn = document.getElementById('download-ics-btn');
  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', triggerIcsDownload);
  }

  const dockCalBtn = document.getElementById('dock-cal-btn');
  if (dockCalBtn) {
    dockCalBtn.addEventListener('click', triggerIcsDownload);
  }

  // =========================================================================
  // 6. HOTEL DIRECTORY ALTERNATING BRICK FALLING ANIMATION (TRIGGERS ON EVERY SCROLL)
  // =========================================================================
  const hotelList = document.querySelector('.hotel-directory-list');
  const hotelBricks = document.querySelectorAll('.hotel-brick');

  if (hotelBricks.length > 0 && hotelList) {
    let fallTimers = [];
    let isFallen = false;

    function triggerFallingBricks() {
      if (isFallen) return;
      isFallen = true;

      // Clear any pending timers
      fallTimers.forEach(t => clearTimeout(t));
      fallTimers = [];

      hotelBricks.forEach((brick, index) => {
        const timer = setTimeout(() => {
          brick.classList.add('is-fallen');
        }, index * 180);
        fallTimers.push(timer);
      });
    }

    function resetFallingBricks() {
      if (!isFallen) return;
      isFallen = false;

      fallTimers.forEach(t => clearTimeout(t));
      fallTimers = [];

      hotelBricks.forEach((brick) => {
        brick.style.transition = 'none';
        brick.classList.remove('is-fallen');
        void brick.offsetWidth; // Force layout recalculation
        brick.style.transition = '';
      });
    }

    // 1. Primary: IntersectionObserver on the UNTRANSFORMED parent container
    if ('IntersectionObserver' in window) {
      const listObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerFallingBricks();
          } else {
            resetFallingBricks();
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      });

      listObserver.observe(hotelList);
    }

    // 2. Secondary Scroll Listener: Guaranteed fallback on every scroll
    function checkHotelsScroll() {
      const rect = hotelList.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > window.innerHeight * 0.05;
      if (inView) {
        triggerFallingBricks();
      } else {
        resetFallingBricks();
      }
    }

    window.addEventListener('scroll', checkHotelsScroll, { passive: true });
    // Check immediately on load in case the page is already at this position
    checkHotelsScroll();
  }

});
