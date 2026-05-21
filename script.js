const canvas = document.getElementById('vortexCanvas');
const ctx = canvas.getContext('2d');
const splash = document.getElementById('splash');
const mainPage = document.getElementById('main-page');
const langToggle = document.getElementById('langToggle');
const langSwitcher = document.getElementById('langSwitcher');
let currentLang = 'en';

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const particles = [];
const particleCount = 800;
const neonColors = ['#00f2fe', '#9d4edd', '#00b4d8', '#7b2cbf'];
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let speedMultiplier = 1;

window.addEventListener('mousemove', (e) => {
    const targetX = window.innerWidth / 2 + (e.clientX - window.innerWidth / 2) * 0.12;
    const targetY = window.innerHeight / 2 + (e.clientY - window.innerHeight / 2) * 0.12;
    centerX += (targetX - centerX) * 0.08;
    centerY += (targetY - centerY) * 0.08;
});

class VortexParticle {
    constructor() {
        this.reset(true);
    }
    reset(init = false) {
        this.radius = init ? Math.random() * Math.max(canvas.width, canvas.height) : 5;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 2 + 1;
        this.angularSpeed = 0.008 + Math.random() * 0.012;
        this.size = Math.random() * 1.8 + 0.5;
        this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
        this.opacity = Math.random() * 0.6 + 0.4;
    }
    update() {
        this.angle += this.angularSpeed * speedMultiplier;
        this.radius += this.speed * speedMultiplier;
        if (this.radius > Math.max(canvas.width, canvas.height)) {
            this.reset(false);
        }
    }
    draw() {
        const x = centerX + Math.cos(this.angle) * this.radius;
        const y = centerY + Math.sin(this.angle) * this.radius * 0.93;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new VortexParticle());
}

function render() {
    ctx.fillStyle = 'rgba(0, 0, 3, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(render);
}
render();

splash.addEventListener('click', () => {
    speedMultiplier = 15;
    splash.style.transition = 'opacity 0.8s ease';
    splash.style.opacity = '0';
    setTimeout(() => {
        splash.classList.add('hidden');
        langSwitcher.classList.remove('hidden');
        mainPage.classList.remove('hidden');
    }, 800);
});

function translatePage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en]').forEach(element => {
        const value = element.dataset[lang];
        if (value !== undefined) {
            element.textContent = value;
        }
    });
    document.querySelector('title').textContent = document.querySelector('title').dataset[lang];
    langToggle.textContent = lang === 'en' ? 'العربية' : 'English';
    currentLang = lang;
}

langToggle.addEventListener('click', () => {
    translatePage(currentLang === 'en' ? 'ar' : 'en');
});

function type() {
    const textToType = document.getElementById('typewriter').dataset[currentLang];
    const typewriterElement = document.getElementById('typewriter');
    let index = 0;
    typewriterElement.innerHTML = '';

    function step() {
        if (index < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(index);
            index++;
            typewriterElement.style.width = 'auto';
            setTimeout(step, 140);
        } else {
            typewriterElement.style.borderLeft = 'none';
            revealMirrors();
        }
    }
    step();
}

function revealMirrors() {
    const grid = document.getElementById('mirrorsGrid');
    grid.classList.add('show');
}

function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

const myLinks = {
    instagram: 'https://www.instagram.com/____________joo____?igsh=MTAzenBmeHIxazRncQ==',
    github: 'https://github.com/JO00o0',
    discord: 'https://discord.com/users/jo4041241',
    whatsapp: 'https://wa.me/201032595121'
};

let qrInstance = null;

function generateQRCode() {
    const container = document.getElementById('qrcode');
    if (!container) return;
    container.innerHTML = '';

    function createQR(url) {
        try {
            qrInstance = new QRCode(container, {
                text: url,
                width: 140,
                height: 140,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (err) {
            container.textContent = 'QR generation error';
            console.error('QR generation failed:', err);
        }
    }

    const initialUrl = myLinks.instagram;

    if (typeof QRCode !== 'undefined') {
        createQR(initialUrl);
        return;
    }

    const scriptSrc = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
        if (typeof QRCode !== 'undefined') {
            createQR(initialUrl);
        } else {
            container.textContent = 'QR library failed to initialize';
            console.error('qrcode script loaded but QRCode is undefined');
        }
    };
    script.onerror = () => {
        container.textContent = 'Failed to load QR library';
        console.error('Failed to load qrcode script:', scriptSrc);
    };
    document.head.appendChild(script);
}

function updateQR(platform, button) {
    const targetUrl = myLinks[platform];
    if (!qrInstance) return;
    if (!targetUrl) return;

    qrInstance.clear();
    qrInstance.makeCode(targetUrl);

    document.querySelectorAll('.qr-nav-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
}

window.onload = () => {
    translatePage('en');
    type();
    generateQRCode();
};
