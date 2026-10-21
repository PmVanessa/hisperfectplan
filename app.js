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

    function resetPlayOverlayState(cardOverlay) {
      if (!cardOverlay) return;
      cardOverlay.classList.remove('is-loading');
      const textElem = cardOverlay.querySelector('.play-text');
      const orig = textElem?.getAttribute('data-orig-text');
      if (textElem && orig) {
        textElem.textContent = orig;
      }
    }

    function togglePlay() {
      if (video.paused || video.ended) {
        // Pause any other playing video so they don't overlap audio
        allFilmVideos.forEach(otherVideo => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
            const otherCard = otherVideo.closest('.film-screen-frame');
            const otherOverlay = otherCard?.querySelector('.film-play-trigger');
            const otherPlayBtn = otherCard?.querySelector('.video-play-toggle');
            if (otherOverlay) {
              otherOverlay.classList.remove('hidden');
              resetPlayOverlayState(otherOverlay);
            }
            if (otherPlayBtn) {
              const p = otherPlayBtn.querySelector('.p-play');
              const pa = otherPlayBtn.querySelector('.p-pause');
              if (p) p.style.display = 'inline';
              if (pa) pa.style.display = 'none';
            }
          }
        });

        // Instant tactile feedback: display loading state immediately on tap
        if (overlay) {
          overlay.classList.add('is-loading');
          const textElem = overlay.querySelector('.play-text');
          if (textElem && !textElem.hasAttribute('data-orig-text')) {
            textElem.setAttribute('data-orig-text', textElem.textContent.trim());
          }
          if (textElem) {
            textElem.textContent = 'STARTING...';
          }
        }

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.warn('Playback error or aborted:', e);
            resetPlayOverlayState(overlay);
          });
        }
      } else {
        video.pause();
        if (overlay) {
          overlay.classList.remove('hidden');
          resetPlayOverlayState(overlay);
        }
        if (playIcon) playIcon.style.display = 'inline';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    }

    if (overlay) overlay.addEventListener('click', togglePlay);
    if (playToggleBtn) playToggleBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Dismiss overlay and loading state the instant frames begin rendering
    video.addEventListener('playing', () => {
      if (overlay) {
        overlay.classList.add('hidden');
        resetPlayOverlayState(overlay);
      }
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'inline';
    });

    video.addEventListener('waiting', () => {
      if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('is-loading');
      }
    });

    video.addEventListener('canplay', () => {
      if (!video.paused && overlay) {
        overlay.classList.add('hidden');
        resetPlayOverlayState(overlay);
      }
    });

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
      if (overlay) {
        overlay.classList.remove('hidden');
        resetPlayOverlayState(overlay);
      }
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
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      });
    }
  });

  // Media Viewport Observer: pause videos that scroll out of view to save mobile battery/CPU
  if ('IntersectionObserver' in window) {
    const videoViewportObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const vid = entry.target;
        if (!entry.isIntersecting && !vid.paused) {
          vid.pause();
          const frame = vid.closest('.film-screen-frame');
          const overlay = frame?.querySelector('.film-play-trigger');
          const playBtn = frame?.querySelector('.video-play-toggle');
          if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.remove('is-loading');
          }
          if (playBtn) {
            const p = playBtn.querySelector('.p-play');
            const pa = playBtn.querySelector('.p-pause');
            if (p) p.style.display = 'inline';
            if (pa) pa.style.display = 'none';
          }
        }
      });
    }, { threshold: 0.15 });

    allFilmVideos.forEach((v) => videoViewportObserver.observe(v));
  }

  // =========================================================================
  // PROACTIVE HIGH-SPEED GALLERY PRELOADER (< 0.5s INSTANT DISPLAY)
  // =========================================================================
  // Prefetches gallery photos in the background directly into browser memory cache.
  // By the time the user scrolls to each sheet, images are already cached and paint in < 50ms.
  function prefetchImagesForSheet(sheetId) {
    const sheet = document.getElementById(sheetId);
    if (!sheet) return;
    const imgs = sheet.querySelectorAll('img');
    imgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        const memImg = new Image();
        memImg.src = src;
      }
    });
  }

  // Pre-buffer Sheet 01 immediately after hero paint
  if (document.readyState === 'complete') {
    setTimeout(() => prefetchImagesForSheet('pinstack-sheet-1'), 120);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => prefetchImagesForSheet('pinstack-sheet-1'), 120);
    });
  }

  // Pre-buffer Sheet 02 & Sheet 03 as user approaches the gallery section
  const gallerySection = document.getElementById('gallery');
  if ('IntersectionObserver' in window && gallerySection) {
    const galleryPreloadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          prefetchImagesForSheet('pinstack-sheet-2');
          setTimeout(() => prefetchImagesForSheet('pinstack-sheet-3'), 300);
          observer.disconnect();
        }
      });
    }, { rootMargin: '600px 0px' });

    galleryPreloadObserver.observe(gallerySection);
  }

  // Proximity Video Background Preloader:
  // Pre-buffers video stream in the background ONLY when user scrolls near the film section,
  // ensuring 100% of network bandwidth is dedicated to fast photo rendering during initial browsing.
  const filmSection = document.getElementById('proposal');
  if ('IntersectionObserver' in window && filmSection) {
    const videoPreloadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          allFilmVideos.forEach((vid) => {
            vid.preload = 'auto';
            try {
              vid.load();
            } catch (e) {}
          });
          observer.disconnect();
        }
      });
    }, { rootMargin: '450px 0px' });

    videoPreloadObserver.observe(filmSection);
  }

  // Lazy Load Observer & Fade-In Enhancement
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach((img) => {
    function markLoaded() {
      img.classList.add('is-loaded');
    }
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
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
      'DESCRIPTION:Wedding Celebration of Ileanwa & Enyojo!\\nJoin us for the Holy Matrimony and Grand Reception at The Greenlife Event Center, Oregun, Ikeja, Lagos.\\nWe can\'t wait to celebrate together!\\nHashtag: #HisPerfectPlan',
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
  // 6. HOTEL DIRECTORY DIRECTION-AWARE & REVERSIBLE BRICK FALLING ANIMATION
  // =========================================================================
  const hotelList = document.querySelector('.hotel-directory-list');
  const hotelBricks = Array.from(document.querySelectorAll('.hotel-brick'));

  if (hotelBricks.length > 0 && hotelList) {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDirection = 'down';
    let isTicking = false;
    const queuedTimers = new Map(); // brick -> timer ID
    let lastScheduledDropTime = 0;
    function getStaggerInterval() {
      return (window.innerWidth <= 768) ? 140 : 250;
    }

    function updateScrollDirection() {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const diff = currentScrollY - lastScrollY;
      if (diff > 1) {
        scrollDirection = 'down';
        lastScrollY = currentScrollY;
      } else if (diff < -1) {
        scrollDirection = 'up';
        lastScrollY = currentScrollY;
      }
    }

    function checkHotelBricks() {
      updateScrollDirection();

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isMobile = window.innerWidth <= 768;
      const listRect = hotelList.getBoundingClientRect();
      // Responsive trigger threshold: triggers comfortably as each brick's landing slot enters view
      const enterThresholdBottom = isMobile ? (viewportHeight - 70) : (viewportHeight - 50);
      const enterThresholdTop = 30;

      const newlyVisibleBricks = [];

      hotelBricks.forEach((brick, idx) => {
        // Calculate true landing slot position in viewport (unaffected by CSS transform offsets)
        const slotTop = listRect.top + brick.offsetTop;
        const slotBottom = slotTop + brick.offsetHeight;

        // Check if brick's landing slot is currently within visible trigger window
        const isInTriggerZone = slotTop < enterThresholdBottom && slotBottom > enterThresholdTop;

        if (isInTriggerZone) {
          if (!brick.classList.contains('is-fallen') && !queuedTimers.has(brick)) {
            newlyVisibleBricks.push({ brick, idx });
          }
        } else {
          // Reset ONLY when brick's landing slot has fully moved well outside the screen
          const isFarAbove = slotBottom < -120;
          const isFarBelow = slotTop > viewportHeight + 120;

          if (isFarAbove || isFarBelow) {
            if (queuedTimers.has(brick)) {
              clearTimeout(queuedTimers.get(brick));
              queuedTimers.delete(brick);
            }
            if (brick.classList.contains('is-fallen')) {
              brick.style.transition = 'none';
              brick.classList.remove('is-fallen');
              void brick.offsetHeight; // Flush style
              brick.style.transition = '';
            }
          }
        }
      });

      // Animate newly visible bricks one-by-one in the direction of active scroll
      if (newlyVisibleBricks.length > 0) {
        // When scrolling UP from bottom: reverse order (bottom brick triggers first)
        // When scrolling DOWN from top: normal order (top brick triggers first)
        if (scrollDirection === 'up') {
          newlyVisibleBricks.sort((a, b) => b.idx - a.idx);
        } else {
          newlyVisibleBricks.sort((a, b) => a.idx - b.idx);
        }

        const now = performance.now();
        // If previous queue has finished or is in the past, anchor from now
        if (lastScheduledDropTime < now) {
          lastScheduledDropTime = now;
        }

        const STAGGER_INTERVAL = getStaggerInterval();

        newlyVisibleBricks.forEach((item, i) => {
          // First brick in a fresh queue drops immediately; subsequent ones wait STAGGER_INTERVAL each
          const targetTime = (i === 0 && lastScheduledDropTime === now)
            ? now
            : lastScheduledDropTime + STAGGER_INTERVAL;

          lastScheduledDropTime = targetTime;
          const delay = Math.max(0, targetTime - now);

          const timer = setTimeout(() => {
            item.brick.classList.add('is-fallen');
            queuedTimers.delete(item.brick);
            if (queuedTimers.size === 0) {
              lastScheduledDropTime = 0;
            }
          }, delay);

          queuedTimers.set(item.brick, timer);
        });
      }
    }

    function onScrollOrResize() {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          checkHotelBricks();
          isTicking = false;
        });
        isTicking = true;
      }
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial check on load
    checkHotelBricks();
    setTimeout(checkHotelBricks, 250);
    setTimeout(checkHotelBricks, 700);
  }

});
