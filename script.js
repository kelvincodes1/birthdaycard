// ===== Configuration & State =====
let isPlaying = false;
let isBlown = false;
const audio = document.getElementById('bgMusic');
function fadeInAudio() {
  audio.volume = 0;
  fadeInAudio();
  
  let vol = 0;
  const fade = setInterval(() => {
    if (vol < 1) {
      vol += 0.05;
      audio.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 100);
}
// ===== Initialize on DOM Load =====
document.addEventListener("click", (e) => {
    launchConfetti();
    initFloatingHearts();
    initSparkles();
    initCandleInteraction();
    initMusicToggle();
    initParallax();
    initScrollAnimations();
    initAutoPlayUnlock();
    initWishButton();

    // display the special message immediately on page enter
    typeWriterEffect();
});
let introCount = 3;
const introEl = document.getElementById("introCount");
const introScreen = document.getElementById("intro");

const introInterval = setInterval(() => {
  introCount--;
  introEl.textContent = introCount;

  if (introCount === 0) {
    clearInterval(introInterval);
    introScreen.style.opacity = "0";
    setTimeout(() => introScreen.remove(), 800);
  }
}, 1000);
// ===== Autoplay Unlock =====
// Browsers block autoplay. This function tries to play on the first user interaction (click/scroll).
function initAutoPlayUnlock() {
    const tryPlay = () => {
        if (!isPlaying) {
            audio.play()
                .then(() => {
                    isPlaying = true;
                    updateMusicIcon(true);
                    // Remove listeners after successful play
                    document.removeEventListener('click', tryPlay);
                    document.removeEventListener('scroll', tryPlay);
                    document.removeEventListener('touchstart', tryPlay);
                })
                .catch(e => console.log("Autoplay still waiting for interaction"));
        }
    };

    // Add listeners to the whole document
    document.addEventListener('click', tryPlay);
    document.addEventListener('scroll', tryPlay);
    document.addEventListener('touchstart', tryPlay);
    
    // Attempt immediately (might work if cached or allowed)
    tryPlay();
}

function updateMusicIcon(playing) {
    const iconPlay = document.querySelector('.icon-play');
    const iconPause = document.querySelector('.icon-pause');
    if (playing) {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    } else {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    }
}

// ===== Music Toggle =====
function initMusicToggle() {
    const toggleBtn = document.getElementById('musicToggle');
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the document click listener immediately
        if (isPlaying) {
            audio.pause();
            updateMusicIcon(false);
        } else {
           fadeInAudio(); 
            updateMusicIcon(true);
        }
        isPlaying = !isPlaying;
    });
}

// ===== Floating Hearts =====
function initFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    for (let i = 0; i < 15; i++) createHeart(container, i);
}

function createHeart(container, index) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = `<svg viewBox="0 0 32 32"><path d="M16 28.72a3 3 0 0 1-2.13-.88L3.57 17.54a8.72 8.72 0 0 1-2.52-6.25 8.06 8.06 0 0 1 8.14-8A8.06 8.06 0 0 1 16 6.17a8.06 8.06 0 0 1 6.81-2.87 8.06 8.06 0 0 1 8.14 8 8.72 8.72 0 0 1-2.52 6.25l-10.3 10.3a3 3 0 0 1-2.13.88z"/></svg>`;
    
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = (index * 0.6) + 's';
    heart.style.animationDuration = (6 + Math.random() * 4) + 's';
    const scale = 0.5 + Math.random() * 1;
    heart.querySelector('svg').style.transform = `scale(${scale})`;
    
    container.appendChild(heart);
}

// ===== Sparkles =====
function initSparkles() {
    const container = document.getElementById('sparklesContainer');
    setInterval(() => createSparkle(container), 200);
}

function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2000);
}
document.querySelectorAll(".photo").forEach(img => {
  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.style = `
      position:fixed;inset:0;
      background:black;
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:3000;
    `;

    const big = document.createElement("img");
    big.src = img.src;
    big.style.maxWidth = "90%";
    big.style.borderRadius = "10px";

    overlay.appendChild(big);
    overlay.onclick = () => overlay.remove();

    document.body.appendChild(overlay);
  });
});
setTimeout(() => {
  typeWriter(el2, msg2, 0, null);
}, 800);
function secret() {
  launchConfetti();
  alert("You mean the world to me 💖");
}
// ===== Candle & Wish Interaction =====
function initCandleInteraction() {
    const flame = document.getElementById('flame');
    const glow = document.getElementById('glow');
    const hint = document.getElementById('clickHint');
    const cakeWrapper = document.getElementById('cakeWrapper');
    const smoke = document.createElement("div");
    smoke.className = "smoke";
    flame.appendChild(smoke);
    setTimeout(() => smoke.remove(), 1500);

    cakeWrapper.addEventListener('click', (e) => {
        if (!isBlown) {
            // 1. Blow out candle and hide hint
            flame.classList.add('blown');
            glow.classList.add('blown');
            hint.classList.add('hidden');
            
            // 2. Trigger confetti only (message shown on load)
            launchConfetti();
            
            // 3. Start music if not already playing
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    updateMusicIcon(true);
                }).catch(e => console.log("Music play failed"));
            }
            
            // leave candle blown indefinitely until page reload
            isBlown = true;
        }
    });
}

// ===== Confetti Effect =====
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 150;
    const confetti = [];
   const colors = ['#f5e6d3', '#d4a5a5', '#c9a959', '#fff0f5'];

    class Confetto {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 4 - 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += 5;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
            ctx.restore();
        }
    }

    for (let i = 0; i < confettiCount; i++) {
        confetti.push(new Confetto());
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let stillFalling = false;
        
        confetti.forEach(c => {
            c.update();
            c.draw();
            if (c.y < canvas.height) stillFalling = true;
        });

        if (stillFalling) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animateConfetti();
}

// ===== Launch Hearts (Burst Effect) =====
function launchHearts() {
    const heartCount = 30;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'wish-heart';
            heart.innerHTML = `<svg viewBox="0 0 32 32"><path d="M16 28.72a3 3 0 0 1-2.13-.88L3.57 17.54a8.72 8.72 0 0 1-2.52-6.25 8.06 8.06 0 0 1 8.14-8A8.06 8.06 0 0 1 16 6.17a8.06 8.06 0 0 1 6.81-2.87 8.06 8.06 0 0 1 8.14 8 8.72 8.72 0 0 1-2.52 6.25l-10.3 10.3a3 3 0 0 1-2.13.88z"/></svg>`;
            
            // Calculate random burst direction
            const angle = (Math.PI * 2 * i) / heartCount;
            const distance = 150 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 200; // Extra upward movement
            
            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(heart);
            
            // Remove heart after animation completes
            setTimeout(() => heart.remove(), 2500);
        }, i * 30);
    }
}

// ===== Typewriter Effect =====
function typeWriterEffect() {
    const msg1 = "On this beautiful day, Faith, I want you to know how incredibly special you are to me. Every moment with you feels like a gift, and today we celebrate the day the world became brighter because you were born.";
    // added a short romantic happy birthday line after the original message
    const msg2 = "May your year be filled with endless joy, laughter, and al lol theve your heart can hold. Here's to another year of beautiful memories together, Faith. Happy birthday, my love – may your day be as magical and enchanting as you are.";
    
    const el1 = document.getElementById('messageText1');
    const el2 = document.getElementById('messageText2');
    
    if(el1.innerText.length > 0) return;

    typeWriter(el1, msg1, 0, () => {
        typeWriter(el2, msg2, 0, null);
    });
}

function typeWriter(element, text, index, callback) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(() => typeWriter(element, text, index, callback), 30);
    } else if (callback) {
        callback();
    }
}

// ===== Parallax Background =====
function initParallax() {
    window.addEventListener('mousemove', (e) => {
        // Calculate percentage of mouse position
        const x = (e.clientX / window.innerWidth);
        const y = (e.clientY / window.innerHeight);
        
        // Move background position slightly based on mouse
        // We use percentage strings to match background-size: 200% 200%
        document.body.style.backgroundPosition = `${x * 50}% ${y * 50}%`;
    });
}

// ===== Wish Button =====
function initWishButton() {
    const wishBtn = document.getElementById('wishBtn');
    wishBtn.addEventListener('click', () => {
        launchHearts();
    });
}
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.photo-frame').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}