// script.js - CHỈNH SỬA LẠI

// ===== CẤU HÌNH =====
const CONFIG = {
    password: '2915', // Mật mã - THAY ĐỔI TẠI ĐÂY
    letterText: `Anh vẫn thường tự hỏi, một người nhỏ bé như em sao lại có sức mạnh lớn lao đến thế? Sức mạnh để khiến trái tim anh lời nhịp, để mọi suy nghĩ trong đầu anh đều bắt đầu và kết thúc bằng tên em. Thế giới ngoài kia có thể ồn ào và vội vã, nhưng đúng là, anh sẽ là 'trạm dừng' yên bình nhất để em tựa vào mỗi khi thấy em mỗi chán. Yêu em nhiều hơn những gì anh có thể nói thành lời. ❤️`
};

// ===== BIẾN TOÀN CỤC =====
let currentPass = '';
let isScratching = false;
let scratchPercent = 0;
let isPlaying = false;
let isImageRevealed = false; // Biến để theo dõi trạng thái ảnh

// ===== DOM =====
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const dots = [
    document.getElementById('dot1'),
    document.getElementById('dot2'),
    document.getElementById('dot3'),
    document.getElementById('dot4')
];
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const letterText = document.getElementById('letterText');
const scratchCanvas = document.getElementById('scratchCanvas');
const ctx = scratchCanvas.getContext('2d');
const chessBoard = document.getElementById('chessBoard');
const chessGrid = document.getElementById('chessGrid');
const imageContainer = document.getElementById('imageContainer');
const bgImage = document.getElementById('bgImage');

// ===== HOA RƠI =====
const flowersCanvas = document.getElementById('flowersCanvas');
const fctx = flowersCanvas.getContext('2d');
flowersCanvas.width = window.innerWidth;
flowersCanvas.height = window.innerHeight;

class Flower {
    constructor() {
        this.reset();
        this.y = Math.random() * flowersCanvas.height;
    }
    
    reset() {
        this.x = Math.random() * flowersCanvas.width;
        this.y = -20;
        this.size = Math.random() * 15 + 10;
        this.speed = Math.random() * 1 + 0.5;
        this.swing = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        
        const types = ['🌸', '🌺', '🌼', '🌻', '🌹', '💮', '🏵️'];
        this.emoji = types[Math.floor(Math.random() * types.length)];
    }
    
    update() {
        this.y += this.speed;
        this.x += this.swing;
        this.rotation += this.rotationSpeed;
        
        if (this.y > flowersCanvas.height + 20) {
            this.reset();
        }
    }
    
    draw() {
        fctx.save();
        fctx.translate(this.x, this.y);
        fctx.rotate(this.rotation * Math.PI / 180);
        fctx.font = this.size + 'px Arial';
        fctx.textAlign = 'center';
        fctx.textBaseline = 'middle';
        fctx.fillText(this.emoji, 0, 0);
        fctx.restore();
    }
}

const flowers = [];
for (let i = 0; i < 50; i++) {
    flowers.push(new Flower());
}

function animateFlowers() {
    fctx.clearRect(0, 0, flowersCanvas.width, flowersCanvas.height);
    flowers.forEach(flower => {
        flower.update();
        flower.draw();
    });
    requestAnimationFrame(animateFlowers);
}

animateFlowers();

window.addEventListener('resize', () => {
    flowersCanvas.width = window.innerWidth;
    flowersCanvas.height = window.innerHeight;
});

// ===== MUSIC =====
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.querySelector('span').textContent = 'Play Music';
        musicBtn.querySelector('.music-icon').textContent = '▶';
    } else {
        bgMusic.play();
        musicBtn.classList.add('playing');
        musicBtn.querySelector('span').textContent = 'Pause Music';
        musicBtn.querySelector('.music-icon').textContent = '⏸';
    }
    isPlaying = !isPlaying;
});

// ===== SCREEN 1: PASSWORD =====
function updateDots() {
    dots.forEach((dot, i) => {
        if (i < currentPass.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function checkPassword() {
    if (currentPass === CONFIG.password) {
        screen1.classList.remove('active');
        setTimeout(() => {
            screen2.classList.add('active');
            typeLetterText();
            initScratchCanvas();
            
            if (!isPlaying) {
                bgMusic.play().catch(() => {});
                musicBtn.classList.add('playing');
                musicBtn.querySelector('span').textContent = 'Pause Music';
                musicBtn.querySelector('.music-icon').textContent = '⏸';
                isPlaying = true;
            }
        }, 800);
    } else {
        dots.forEach(dot => {
            dot.style.animation = 'shake 0.5s';
            setTimeout(() => dot.style.animation = '', 500);
        });
        
        setTimeout(() => {
            currentPass = '';
            updateDots();
        }, 500);
    }
}

document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const num = btn.dataset.num;
        
        if (num === 'del') {
            currentPass = currentPass.slice(0, -1);
            updateDots();
        } else if (currentPass.length < 4) {
            currentPass += num;
            updateDots();
            
            if (currentPass.length === 4) {
                setTimeout(checkPassword, 300);
            }
        }
    });
});

// ===== TYPING ANIMATION =====
function typeLetterText() {
    let i = 0;
    const text = CONFIG.letterText;
    
    function type() {
        if (i < text.length) {
            letterText.textContent = text.substring(0, i + 1);
            i++;
            setTimeout(type, 30);
        } else {
            letterText.classList.add('done');
        }
    }
    
    type();
}

// ===== SCRATCH CANVAS - CẢI TIẾN =====
function initScratchCanvas() {
    const container = document.getElementById('imageContainer');
    const rect = container.getBoundingClientRect();
    
    scratchCanvas.width = rect.width;
    scratchCanvas.height = rect.height;
    
    // Vẽ lớp phủ gradient đẹp hơn
    const gradient = ctx.createRadialGradient(
        scratchCanvas.width / 2, 
        scratchCanvas.height / 2, 
        0,
        scratchCanvas.width / 2, 
        scratchCanvas.height / 2, 
        scratchCanvas.width / 2
    );
    gradient.addColorStop(0, '#ffb3c6');
    gradient.addColorStop(0.5, '#ff8fab');
    gradient.addColorStop(1, '#ff6b9d');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    
    // Thêm pattern hoa nhẹ
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '30px Arial';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * scratchCanvas.width;
        const y = Math.random() * scratchCanvas.height;
        ctx.fillText('✿', x, y);
    }
    
    // Events
    scratchCanvas.addEventListener('mousedown', startScratch);
    scratchCanvas.addEventListener('mousemove', scratch);
    scratchCanvas.addEventListener('mouseup', stopScratch);
    scratchCanvas.addEventListener('mouseleave', stopScratch);
    
    scratchCanvas.addEventListener('touchstart', handleTouchStart);
    scratchCanvas.addEventListener('touchmove', handleTouchMove);
    scratchCanvas.addEventListener('touchend', stopScratch);
}

function startScratch(e) {
    isScratching = true;
    scratch(e);
}

function scratch(e) {
    if (!isScratching) return;
    
    const rect = scratchCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2); // Tăng bán kính để cào dễ hơn
    ctx.fill();
    
    checkScratchComplete();
}

function stopScratch() {
    isScratching = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    isScratching = true;
    handleTouchMove(e);
}

function handleTouchMove(e) {
    if (!isScratching) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = scratchCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    
    checkScratchComplete();
}

function checkScratchComplete() {
    const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparent++; // Thay đổi threshold
    }
    
    scratchPercent = (transparent / (pixels.length / 4)) * 100;
    
    // Cào 60% là đủ
    if (scratchPercent >= 60 && !isImageRevealed) {
        revealImage();
    }
}

function revealImage() {
    isImageRevealed = true;
    
    // Hiệu ứng mượt hơn
    scratchCanvas.style.transition = 'opacity 0.8s ease';
    scratchCanvas.style.opacity = '0';
    
    setTimeout(() => {
        scratchCanvas.style.display = 'none';
        
        // Thêm hiệu ứng cho ảnh
        bgImage.style.transform = 'scale(1.05)';
        bgImage.style.filter = 'brightness(1.1)';
        
        setTimeout(() => {
            bgImage.style.transition = 'all 0.5s ease';
            bgImage.style.transform = 'scale(1)';
            bgImage.style.filter = 'brightness(1)';
        }, 100);
        
        // Thêm nút click để mở bàn cờ
        showClickHint();
    }, 800);
}

function showClickHint() {
    // Tạo hint text
    const hint = document.createElement('div');
    hint.className = 'click-hint';
    hint.innerHTML = '👆 Nhấn vào ảnh để mở bàn cờ';
    imageContainer.appendChild(hint);
    
    // Thêm cursor pointer
    imageContainer.style.cursor = 'pointer';
    
    // Event click để mở bàn cờ
    imageContainer.addEventListener('click', openChessBoard, { once: true });
}

function openChessBoard() {
    // Xóa hint
    const hint = document.querySelector('.click-hint');
    if (hint) hint.remove();
    
    imageContainer.style.cursor = 'default';
    
    // Hiện bàn cờ
    chessBoard.classList.add('active');
    createChessGrid();
}

// ===== BÀN CỜ - TRỐNG KHÔNG CÓ QUÂN =====
function createChessGrid() {
    chessGrid.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell';
            
            // Tạo pattern đen-trắng (light/dark) - đúng theo chuẩn cờ vua
            if ((row + col) % 2 === 0) {
                cell.classList.add('light');
            } else {
                cell.classList.add('dark');
            }
            
            const colLetter = String.fromCharCode(97 + col); // a-h (chữ thường)
            const rowNum = 8 - row; // 8-1 (từ trên xuống)
            const cellId = colLetter + rowNum;
            
            cell.dataset.cell = cellId;
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            chessGrid.appendChild(cell);
        }
    }
}

// ===== NÚT ĐIỀU HƯỚNG =====
document.getElementById('upBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('downBtn').addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});