/**
 * NOCTURNE V4 - PREMIUM ENGINE
 * Clean, lightweight vanilla JS for a flawless UX.
 */

const DOM = {
    playBtn: document.getElementById('main-play-btn'),
    playIcon: document.getElementById('main-play-icon'),
    progressBar: document.getElementById('track-progress'),
    progressThumb: document.getElementById('track-thumb'),
    progressContainer: document.querySelector('.progress-bar-container'),
    timeCurrent: document.querySelector('.time.current'),
    
    playerTitle: document.getElementById('player-title'),
    playerArtist: document.getElementById('player-artist'),
    playerArt: document.getElementById('player-art'),
    
    sideTitle: document.getElementById('side-title'),
    sideArtist: document.getElementById('side-artist'),
    sideArt: document.getElementById('side-art'),
    
    ambientBg: document.getElementById('ambient-bg'),
    viewScroll: document.getElementById('view-scroll'),
    topbar: document.querySelector('.topbar'),
    
    speedBtn: document.getElementById('speed-btn'),
    speedDropdown: document.querySelector('.speed-dropdown'),
    
    trackCards: document.querySelectorAll('.recent-card, .album-card'),
    magneticBtns: document.querySelectorAll('.magnetic')
};

// --- Magnetic Buttons (GSAP) ---
DOM.magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// --- Dynamic Color Extraction ---
const colorThief = new ColorThief();

function updateThemeColor(imgEl) {
    if (imgEl.complete) {
        extractAndSetColor(imgEl);
    } else {
        imgEl.addEventListener('load', () => extractAndSetColor(imgEl));
    }
}

function extractAndSetColor(imgEl) {
    try {
        const color = colorThief.getColor(imgEl);
        const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        document.documentElement.style.setProperty('--dominant-color', rgb);
    } catch (e) {
        // Fallback for CORS issues
        document.documentElement.style.setProperty('--dominant-color', '#555555');
    }
}

// Initial extraction
updateThemeColor(DOM.playerArt);

// --- Topbar Scroll Effect ---
DOM.viewScroll.addEventListener('scroll', () => {
    const scrollY = DOM.viewScroll.scrollTop;
    const opacity = Math.min(scrollY / 100, 1);
    DOM.topbar.style.backgroundColor = `rgba(18, 18, 18, ${opacity})`;
});

// --- Playback Simulation ---
let isPlaying = false;
let progressInterval;
let currentProgress = 0; // 0 to 100

function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        DOM.playIcon.classList.replace('ph-play', 'ph-pause');
        progressInterval = setInterval(() => {
            currentProgress += 0.1;
            if (currentProgress > 100) {
                currentProgress = 0;
                togglePlay(); // Auto stop at end
            }
            updateProgressUI();
        }, 100);
    } else {
        DOM.playIcon.classList.replace('ph-pause', 'ph-play');
        clearInterval(progressInterval);
    }
}

function updateProgressUI() {
    DOM.progressBar.style.width = `${currentProgress}%`;
    DOM.progressThumb.style.left = `${currentProgress}%`;
    
    // Fake time calculation (assuming 3:42 total = 222 seconds)
    const totalSeconds = 222;
    const currentSeconds = Math.floor((currentProgress / 100) * totalSeconds);
    const m = Math.floor(currentSeconds / 60);
    const s = currentSeconds % 60;
    DOM.timeCurrent.innerText = `${m}:${s.toString().padStart(2, '0')}`;
}

DOM.playBtn.addEventListener('click', togglePlay);

// Seek functionality
DOM.progressContainer.addEventListener('click', (e) => {
    const rect = DOM.progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    currentProgress = (clickX / rect.width) * 100;
    updateProgressUI();
});

// --- Track Selection Logic ---
DOM.trackCards.forEach(card => {
    // Both full card click and specific play btn click inside card
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').innerText;
        const artist = card.querySelector('p') ? card.querySelector('p').innerText : 'Various Artists';
        const imgObj = card.querySelector('img');
        const imgSrc = imgObj.src;
        
        // Update Bottom Player
        DOM.playerTitle.innerText = title;
        DOM.playerArtist.innerText = artist;
        DOM.playerArt.src = imgSrc;
        DOM.playerArt.crossOrigin = "anonymous";
        
        // Update Right Sidebar
        DOM.sideTitle.innerText = title;
        DOM.sideArtist.innerText = artist;
        DOM.sideArt.src = imgSrc;
        DOM.sideArt.crossOrigin = "anonymous";
        
        // Change Theme Color
        updateThemeColor(imgObj);
        
        // Auto Play
        if (!isPlaying) togglePlay();
        currentProgress = 0;
        updateProgressUI();
    });
});

// --- Lane Speed Control ---
const speedOptions = DOM.speedDropdown.querySelectorAll('span');
speedOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
        // Remove active class from all
        speedOptions.forEach(o => o.classList.remove('active'));
        // Add to clicked
        e.target.classList.add('active');
        // Update button text
        DOM.speedBtn.innerText = e.target.innerText;
        
        // Logic for YT Player or Audio element would go here
        // ytPlayer.setPlaybackRate(parseFloat(e.target.dataset.speed));
    });
});
