// 1. INTRO SPLASH SCREEN ENGINE + AUDIO TRIGGER
const introTrigger = document.getElementById('intro-trigger');
const flash = document.getElementById('flash');
const loader = document.getElementById('loader');
const bgAudio = document.getElementById('bg-audio');

if (introTrigger) {
    introTrigger.addEventListener('click', () => {
        // Safe play background music on user action (Autoplay rule bypass)
        if (bgAudio) {
            bgAudio.play().catch(err => console.log("Audio play delayed or blocked: ", err));
        }

        flash.style.transition = 'none';
        flash.style.opacity = '1';
        
        burstConfetti(120);
        
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('no-scroll'); 
            
            flash.style.transition = 'opacity 0.8s ease-out';
            flash.style.opacity = '0';
            
            const scrollGuide = document.getElementById('scroll-guide');
            if(scrollGuide) scrollGuide.style.display = 'flex';
            
            reveal();
            startFailsafeScrollEngine();

        }, 300);
    });
}

// 2. FAILSAFE SCROLL ENGINE WITH RADAR BREAK AT THE GIFT BOX
let autoScrollSpeed = 3.5; 
let userIsInteracting = false;
let autoScrollTimer;
let hasPausedAtGift = false;
let giftPauseActive = false;

function startFailsafeScrollEngine() {
    function step() {
        if (!userIsInteracting && !giftPauseActive) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 8) {
                return; 
            }

            const secretBox = document.getElementById('secret-click-box');
            if (secretBox && !hasPausedAtGift) {
                const rect = secretBox.getBoundingClientRect();
                if (rect.top > 0 && rect.top < window.innerHeight * 0.45) {
                    giftPauseActive = true;
                    hasPausedAtGift = true;
                    
                    setTimeout(() => {
                        giftPauseActive = false;
                    }, 1800); 
                }
            }

            if (!giftPauseActive) {
                window.scrollBy(0, autoScrollSpeed);
            }
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const stopAutoScrollTemporarily = () => {
    userIsInteracting = true;
    giftPauseActive = false; 
    clearTimeout(autoScrollTimer);
    
    autoScrollTimer = setTimeout(() => {
        userIsInteracting = false;
    }, 1500);
};

window.addEventListener('touchstart', stopAutoScrollTemporarily, { passive: true });
window.addEventListener('touchmove', stopAutoScrollTemporarily, { passive: true });
window.addEventListener('wheel', stopAutoScrollTemporarily, { passive: true });

// 3. MESSAGE UNLOCKER + FIXED FLOWER RAIN EXTRAVAGANZA
const secretBox = document.getElementById('secret-click-box');
const hiddenLetter = document.getElementById('hidden-letter');

if (secretBox) {
    secretBox.addEventListener('click', () => {
        triggerFlowerRain(5000); 
        
        secretBox.style.transition = 'all 0.2s ease';
        secretBox.style.opacity = '0';
        
        setTimeout(() => {
            secretBox.style.display = 'none';
            hiddenLetter.style.display = 'block'; 
            setTimeout(reveal, 50); 
        }, 200);
    });
}

// 4. Scroll Reveal Engine
const reveal = () => {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
            el.classList.add('active');
        }
    });
};
window.addEventListener('scroll', reveal, { passive: true });

// 5. FINAL SURPRISE GRAND EXPLOSION
const magicBox = document.getElementById('magic-box');
const explosion = document.getElementById('explosion-effect');
const finalWish = document.getElementById('final-wish-hidden');

if (magicBox) {
    magicBox.addEventListener('click', () => {
        explosion.style.transition = 'none';
        explosion.style.opacity = '1'; 
        
        triggerFlowerRain(5000); 
        burstConfetti(150);
        
        setTimeout(() => {
            explosion.style.transition = 'opacity 0.8s ease-out';
            explosion.style.opacity = '0';
            
            magicBox.style.display = 'none';
            finalWish.style.display = 'block';
        }, 350);
    });
}

// 6. CANVAS PARTICLES RENDERING SYSTEM
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

function syncCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', syncCanvasSize);
syncCanvasSize();

let particles = [];
const standardEmojis = ['🎀', '💗', '✨', '🎁', '🎂', '🎈', '🧿', '🙈'];
const flowerEmojis = ['🌷', '🌸', '🌹', '🌻', '🌼', '💐', '🌺'];

function burstConfetti(count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 12 + 8,
            text: standardEmojis[Math.floor(Math.random() * standardEmojis.length)],
            velY: Math.random() * 3 + 4,
            velX: (Math.random() - 0.5) * 3
        });
    }
}

function triggerFlowerRain(duration) {
    let startTime = Date.now();
    
    function spawnFlowers() {
        if (Date.now() - startTime > duration) return; 
        
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -20,
                size: Math.random() * 18 + 14, 
                text: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
                velY: Math.random() * 2 + 3, 
                velX: (Math.random() - 0.5) * 1.5
            });
        }
        requestAnimationFrame(spawnFlowers);
    }
    spawnFlowers();
}

function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.y += p.velY;
        p.x += p.velX;
        
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.text, p.x, p.y);
        
        if (p.y > canvas.height + 30) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(updateConfetti);
}
updateConfetti();
