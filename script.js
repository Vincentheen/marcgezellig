/* Marc Gezellig — interactions */

document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            const open = mobileMenu.classList.toggle('hidden') === false;
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = open ? 'ri-close-line ri-lg' : 'ri-menu-line ri-lg';
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
                const icon = menuBtn.querySelector('i');
                if (icon) icon.className = 'ri-menu-line ri-lg';
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
        });
    });

    initJardinVocal();
    initDemoPlayer();
    initReveal();
});

function formatAudioTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + s.toString().padStart(2, '0');
}

function initDemoPlayer() {
    const audio = document.getElementById('demoAudio');
    const toggle = document.getElementById('demoToggle');
    const progress = document.getElementById('demoProgress');
    const track = document.getElementById('demoTrack');
    const timeEl = document.getElementById('demoTime');
    if (!audio || !toggle) return;

    function setIcon(playing) {
        const icon = toggle.querySelector('i');
        if (icon) icon.className = playing ? 'ri-pause-fill' : 'ri-play-fill';
    }

    toggle.addEventListener('click', async function () {
        if (audio.paused) {
            try {
                await audio.play();
                setIcon(true);
            } catch (err) {
                console.warn('Lecture démo impossible', err);
            }
        } else {
            audio.pause();
            setIcon(false);
        }
    });

    audio.addEventListener('timeupdate', function () {
        if (progress && audio.duration && isFinite(audio.duration)) {
            progress.style.width = (audio.currentTime / audio.duration) * 100 + '%';
        }
        if (timeEl) timeEl.textContent = formatAudioTime(audio.currentTime);
    });

    audio.addEventListener('ended', function () {
        setIcon(false);
        if (progress) progress.style.width = '0%';
        if (timeEl && audio.duration) timeEl.textContent = formatAudioTime(audio.duration);
    });

    if (track) {
        track.addEventListener('click', function (e) {
            if (!audio.duration || !isFinite(audio.duration)) return;
            const rect = track.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        });
    }
}

function initJardinVocal() {
    const flowers = document.querySelectorAll('.garden-flower');
    const player = document.getElementById('jardinPlayer');
    const audio = document.getElementById('jardinAudio');
    const titleEl = document.getElementById('jardinTitle');
    const descEl = document.getElementById('jardinDesc');
    const progress = document.getElementById('jardinProgress');
    const track = document.getElementById('jardinTrack');
    const timeEl = document.getElementById('jardinTime');
    const toggle = document.getElementById('jardinToggle');

    if (!flowers.length || !audio || !player) return;

    let activeFlower = null;

    function setPlayingUI(flower, playing) {
        flowers.forEach(function (f) { f.classList.remove('is-playing'); });
        if (flower && playing) flower.classList.add('is-playing');
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (icon) icon.className = playing ? 'ri-pause-fill' : 'ri-play-fill';
        }
    }

    async function playFlower(flower) {
        const src = flower.getAttribute('data-src');
        const label = flower.querySelector('.flower-label strong');
        const desc = flower.querySelector('.flower-label em');
        if (!src) return;

        if (activeFlower === flower && !audio.paused) {
            audio.pause();
            setPlayingUI(flower, false);
            return;
        }

        if (audio.getAttribute('src') !== src) {
            audio.src = src;
            audio.load();
        }

        titleEl.textContent = label ? label.textContent : 'Démo';
        descEl.textContent = desc ? desc.textContent : '';
        player.hidden = false;
        activeFlower = flower;

        try {
            await audio.play();
            setPlayingUI(flower, true);
        } catch (err) {
            console.warn('Lecture audio impossible — fichier manquant ou bloqué.', err);
            setPlayingUI(flower, false);
            titleEl.textContent = (label ? label.textContent : 'Démo') + ' (audio à venir)';
        }
    }

    flowers.forEach(function (flower) {
        flower.addEventListener('click', function () {
            playFlower(flower);
        });
    });

    if (toggle) {
        toggle.addEventListener('click', async function () {
            if (!audio.src) return;
            if (audio.paused) {
                try {
                    await audio.play();
                    setPlayingUI(activeFlower, true);
                } catch (err) {
                    console.warn(err);
                }
            } else {
                audio.pause();
                setPlayingUI(activeFlower, false);
            }
        });
    }

    audio.addEventListener('timeupdate', function () {
        if (progress && audio.duration && isFinite(audio.duration)) {
            progress.style.width = (audio.currentTime / audio.duration) * 100 + '%';
        }
        if (timeEl) timeEl.textContent = formatAudioTime(audio.currentTime);
    });

    audio.addEventListener('ended', function () {
        setPlayingUI(null, false);
        if (progress) progress.style.width = '0%';
        if (timeEl && audio.duration) timeEl.textContent = formatAudioTime(audio.duration);
    });

    if (track) {
        track.addEventListener('click', function (e) {
            if (!audio.duration || !isFinite(audio.duration)) return;
            const rect = track.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        });
    }
}

function initReveal() {
    const targets = document.querySelectorAll(
        '.univers-item, .about-grid, .contact-card, .section-head, .jardin-stage'
    );
    targets.forEach(function (el, i) {
        el.classList.add('reveal-on');
        el.style.transitionDelay = Math.min((i % 5) * 60, 240) + 'ms';
    });
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { observer.observe(el); });
}
