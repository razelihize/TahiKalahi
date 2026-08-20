/**
 * Tahi Kalahi - Main Application Logic
 * PWA with Offline Capability - Optimized for Low-Bandwidth (56 kbps)
 */

let appData = {};
let deferredPrompt;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    history.replaceState({ view: 'home' }, '', '#home');
    
    fetchData();
    registerSW();
    setupInstallButton();
    initHeroSlideshow(); 
    showView('home');
});

// Hero Slideshow Logic - Auto-change every 2 seconds
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    setInterval(showNextSlide, 2000);
}

// Page Navigation Function
function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active-view'));
    
    const targetView = document.getElementById(viewId + '-view');
    if (targetView) targetView.classList.add('active-view');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'home') {
        history.replaceState({ view: 'home' }, '', '#home');
    } else {
        history.pushState({ view: viewId }, '', '#' + viewId);
    }
}

window.addEventListener('popstate', (event) => {
    showView('home');
});

// Load Data from JSON
async function fetchData() {
    try {
        const response = await fetch('data.json?' + new Date().getTime()); // Added timestamp to prevent caching
        appData = await response.json();
        renderGallery();
        renderDamage(); 
        setTimeout(() => initializeSliders(), 100);
    } catch (error) {
        console.error('Error loading data', error);
    }
}

// Render 5 Stitches
function renderGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    container.innerHTML = appData.stitches.map(s => `
        <div class="slider-card" onclick="viewGuide('${s.id}')">
            <div class="placeholder-box">
                ${s.galleryImage ? `<img src="${s.galleryImage}" alt="${s.name} Illustration">` : `${s.name} Illustration`}
            </div>
            <strong>${s.name}</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">${s.type}</p>
        </div>
    `).join('');
}

// Render 5 Damages
function renderDamage() {
    const container = document.getElementById('damage-grid');
    if (!container) return;
    container.innerHTML = appData.damages.map(d => `
        <div class="slider-card" onclick="getRecommendation('${d.id}')">
            <div class="placeholder-box">
                ${d.galleryImage ? `<img src="${d.galleryImage}" alt="${d.name} Illustration">` : `${d.name} Illustration`}
            </div>
            <strong>${d.name}</strong>
        </div>
    `).join('');
}

// Scroll Slider Function
function scrollSlider(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
}

// Slider Functionality - Optimized for Smooth Scrolling
function initializeSliders() {
    const sliders = document.querySelectorAll('.horizontal-slider');
    sliders.forEach(slider => {
        slider.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                slider.scrollLeft += e.deltaY;
            }
        }, { passive: false });
        
        let isMouseDown = false, startX, scrollLeft, hasDragged = false;
        
        slider.addEventListener('mousedown', (e) => {
            isMouseDown = true; hasDragged = false;
            slider.classList.add('dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => { isMouseDown = false; slider.classList.remove('dragging'); });
        slider.addEventListener('mouseup', () => { isMouseDown = false; slider.classList.remove('dragging'); });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(x - startX) > 5) hasDragged = true;
            slider.scrollLeft = scrollLeft - walk;
        });
        
        slider.addEventListener('click', (e) => { 
            if (hasDragged) { e.preventDefault(); e.stopPropagation(); } 
        }, true);
    });
}

// Get Stitch Recommendation
function getRecommendation(damageId) {
    const damage = appData.damages.find(d => d.id === damageId);
    const stitch = appData.stitches.find(s => s.id === damage.recommendedStitchId);
    
    document.getElementById('modal-title').innerText = `Damage: ${damage.name}`;
    document.getElementById('modal-body').innerHTML = `
        <p><strong>Recommended Stitch:</strong> ${stitch.name}</p>
        <p><strong>Difficulty:</strong> ${stitch.difficulty}</p>
        <p><strong>Description:</strong> ${stitch.description}</p>
        <button class="btn-primary" onclick="viewDamageGuide('${damageId}')">View Step-by-Step Guide</button>
    `;
    document.getElementById('recommendation-modal').style.display = 'flex';
}

// View General Stitch Guide (From Gallery)
function viewGuide(stitchId) {
    closeModal();
    const stitch = appData.stitches.find(s => s.id === stitchId);
    
    document.getElementById('guide-title').innerText = stitch.name;
    document.getElementById('guide-steps').innerHTML = stitch.steps.map((step, index) => {
        const imageHTML = step.image ? `<img src="${step.image}" alt="Step ${index + 1}">` : `<span style="color: #666; font-size: 0.9rem;"> Step ${index + 1} Infographic</span>`;
        return `
            <div class="step-panel">
                <div class="step-image">${imageHTML}</div>
                <div class="step-instruction">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-text">
                        <h3>${step.title || `Step ${index + 1}`}</h3>
                        <p>${step.text || ''}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('guide-modal').style.display = 'flex';
}

// View Damage-Specific Guide (FIXED: Now shows the correct number of steps)
function viewDamageGuide(damageId) {
    closeModal();
    const damage = appData.damages.find(d => d.id === damageId);
    const stitch = appData.stitches.find(s => s.id === damage.recommendedStitchId);
    
    // Use damage steps if they exist, otherwise fallback to generic stitch steps
    const stepsToUse = damage.steps || stitch.steps;

    document.getElementById('guide-title').innerText = `${stitch.name} for ${damage.name}`;
    document.getElementById('guide-steps').innerHTML = stepsToUse.map((step, index) => {
        const imageHTML = step.image ? `<img src="${step.image}" alt="Step ${index + 1}">` : `<span style="color: #666; font-size: 0.9rem;"> Step ${index + 1} Infographic</span>`;
        return `
            <div class="step-panel">
                <div class="step-image">${imageHTML}</div>
                <div class="step-instruction">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-text">
                        <h3>${step.title || `Step ${index + 1}`}</h3>
                        <p>${step.text || ''}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('guide-modal').style.display = 'flex';
}

// Close Modals
function closeModal() { document.getElementById('recommendation-modal').style.display = 'none'; }
function closeGuideModal() { document.getElementById('guide-modal').style.display = 'none'; }

window.onclick = function(event) {
    if (event.target == document.getElementById('recommendation-modal')) closeModal();
    if (event.target == document.getElementById('guide-modal')) closeGuideModal();
    if (event.target == document.getElementById('install-modal')) closeInstallModal();
}

// Cross-Browser Install Logic
function detectBrowser() {
    const userAgent = navigator.userAgent;
    if (/Edg/i.test(userAgent)) return 'edge';
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent) && !/OPR/i.test(userAgent)) return 'chrome';
    if (/Firefox/i.test(userAgent)) return 'firefox';
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'safari';
    if (/OPR/i.test(userAgent) || /Opera/i.test(userAgent)) return 'opera';
    return 'other';
}

function getInstallInstructions(browser) {
    const instructions = {
        chrome: `<div class="install-instructions"><p><strong>Google Chrome</strong></p><ol><li>Click the <strong>⋮</strong> menu in the top-right corner.</li><li>Select <strong>"Install Tahi Kalahi..."</strong> or <strong>"Cast, save, and share" → "Install page as app"</strong>.</li><li>Click <strong>"Install"</strong>.</li></ol></div>`,
        edge: `<div class="install-instructions"><p><strong>Microsoft Edge</strong></p><ol><li>Click the <strong>...</strong> menu in the top-right corner.</li><li>Select <strong>"Apps" → "Install this site as an app"</strong>.</li><li>Click <strong>"Install"</strong>.</li></ol></div>`,
        firefox: `<div class="install-instructions"><p><strong>Mozilla Firefox</strong></p><ol><li>Click the <strong>≡</strong> menu.</li><li>Select <strong>"More tools" → "Install Tahi Kalahi..."</strong> (if available).</li></ol></div>`,
        safari: `<div class="install-instructions"><p><strong>Safari</strong></p><ol><li>Tap the <strong>Share</strong> button.</li><li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li><li>Tap <strong>"Add"</strong>.</li></ol></div>`,
        opera: `<div class="install-instructions"><p><strong>Opera</strong></p><ol><li>Click the <strong>O</strong> menu.</li><li>Select <strong>"Install page as app"</strong>.</li></ol></div>`,
        other: `<div class="install-instructions"><p><strong>Your Browser</strong></p><ol><li>Look for an install icon in the address bar.</li><li>Or open your browser's menu and look for <strong>"Install app"</strong>.</li></ol></div>`
    };
    return instructions[browser] || instructions.other;
}

function setupInstallButton() {
    const installBtn = document.getElementById('install-btn');
    const browser = detectBrowser();
    
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        installBtn.style.display = 'none';
        return;
    }
    
    if (browser === 'chrome' || browser === 'edge' || browser === 'opera') {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'inline-flex';
        });
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBtn.style.display = 'none';
            } else {
                showInstallInstructions(browser);
            }
        });
    } else {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', () => {
            showInstallInstructions(browser);
        });
    }
    
    window.addEventListener('appinstalled', () => {
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

function showInstallInstructions(browser) {
    document.getElementById('install-instructions').innerHTML = getInstallInstructions(browser);
    document.getElementById('install-modal').style.display = 'flex';
}

function closeInstallModal() {
    document.getElementById('install-modal').style.display = 'none';
}

function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => console.log('[PWA] Service Worker registered:', registration.scope))
            .catch((error) => console.error('[PWA] Service Worker registration failed:', error));
    }
}

// Expose functions to global window object
window.showView = showView;
window.scrollSlider = scrollSlider;
window.viewGuide = viewGuide;
window.viewDamageGuide = viewDamageGuide; // Exposed new function
window.getRecommendation = getRecommendation;
window.closeModal = closeModal;
window.closeGuideModal = closeGuideModal;
window.closeInstallModal = closeInstallModal;