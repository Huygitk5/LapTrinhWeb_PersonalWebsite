// Init Icons
lucide.createIcons();

// 1. CẤU HÌNH SỐ LƯỢNG SLIDE
const slideConfig = {
    1: 42,
    2: 158,
    3: 91,
    4: 206,
    5: 67
};

const currentIndices = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

// 2. LOGIC LẬT SÁCH
let currentSheet = 0;
const totalSheets = 5; // 2 Bìa + 3 tờ nội dung

const bookWrapper = document.getElementById('book-wrapper');
const backPlateLeft = document.getElementById('back-plate-left');
const backPlateRight = document.getElementById('back-plate-right');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const sheets = document.querySelectorAll('.sheet');
const startBtn = document.getElementById('start-btn');
const controlsContainer = document.getElementById('controls-container');


function updateBook() {
    // === TRƯỜNG HỢP 1: BÌA ĐẦU (START - currentSheet = 0) ===
    if (currentSheet === 0) {
        // 1. Vị trí: Giữa màn hình
        // QUAN TRỌNG: Phải thêm translateX(-50%) vào đây để không bị lệch
        bookWrapper.style.transform = 'translateX(-50%) rotateY(0deg)';
        
        bookWrapper.classList.remove('book-idle-spin'); 

        // 2. Các class hỗ trợ (Giữ nguyên để đảm bảo tính nhất quán)
        bookWrapper.classList.add('-translate-x-1/2');
        bookWrapper.classList.remove('translate-x-0');

        // 3. Bìa lót: Ẩn trái, Hiện phải
        backPlateLeft.classList.remove('opacity-100');
        backPlateLeft.classList.add('opacity-0');
        if(backPlateRight) backPlateRight.style.opacity = '1';
        
        // 4. UI Controls
        statusText.innerText = ">>> SYSTEM STANDBY. CLICK TO INITIALIZE <<<";
        statusBar.innerText = "STATUS: LOCKED";
        controlsContainer.classList.add('opacity-0', 'pointer-events-none');
        controlsContainer.classList.remove('opacity-100', 'pointer-events-auto');
    } 
    
    // === TRƯỜNG HỢP 2: BÌA CUỐI (END - currentSheet = 5) ===
    else if (currentSheet === totalSheets) {
        // 1. Vị trí: Giữa màn hình
        // QUAN TRỌNG: Cũng phải thêm translateX(-50%) vào đây
        bookWrapper.style.transform = 'translateX(50%) rotateY(0deg)';
        
        bookWrapper.classList.remove('book-idle-spin');

        bookWrapper.classList.add('-translate-x-1/2');
        bookWrapper.classList.remove('translate-x-0');

        // 2. Bìa lót: Ẩn hết
        backPlateLeft.classList.remove('opacity-100');
        backPlateLeft.classList.add('opacity-0');
        if(backPlateRight) backPlateRight.style.opacity = '0'; 

        // 3. UI Controls
        statusText.innerText = ">>> SESSION TERMINATED <<<";
        statusBar.innerText = "STATUS: OFFLINE";
        statusBar.innerText = `SHEET: 0${currentSheet} / 0${totalSheets}`;
        controlsContainer.classList.remove('opacity-0', 'pointer-events-none');
        controlsContainer.classList.add('opacity-100', 'pointer-events-auto');
    }

    // === TRƯỜNG HỢP 3: ĐANG ĐỌC SÁCH (OPEN - 1 đến 4) ===
    else {
        // 1. Vị trí: Lệch sang phải (translateX(0))
        // Khi mở sách thì không cần -50% nữa
        bookWrapper.style.transform = 'translateX(0) rotateY(0deg)';
        
        bookWrapper.classList.remove('book-idle-spin');

        bookWrapper.classList.remove('-translate-x-1/2');
        bookWrapper.classList.add('translate-x-0');

        // 2. Bìa lót: Hiện cả 2
        backPlateLeft.classList.remove('opacity-0');
        backPlateLeft.classList.add('opacity-100');
        if(backPlateRight) backPlateRight.style.opacity = '1';

        // 3. UI Controls
        statusText.innerText = ">>> NAVIGATION CONTROLS ACTIVE <<<";
        statusBar.innerText = `SHEET: 0${currentSheet} / 0${totalSheets}`;
        controlsContainer.classList.remove('opacity-0', 'pointer-events-none');
        controlsContainer.classList.add('opacity-100', 'pointer-events-auto');
    }

    // --- LOGIC Z-INDEX (GIỮ NGUYÊN) ---
    sheets.forEach((sheet, index) => {
        if (currentSheet > index) {
            sheet.style.transform = 'rotateY(-180deg)';
            sheet.style.zIndex = index; 
        } else {
            sheet.style.transform = 'rotateY(0deg)';
            sheet.style.zIndex = totalSheets - index; 
        }
    });

    // --- LOGIC NÚT BẤM (GIỮ NGUYÊN) ---
    btnPrev.disabled = currentSheet === 0;
    btnNext.disabled = currentSheet === totalSheets;
    
    btnPrev.style.opacity = currentSheet === 0 ? '0.3' : '1';
    btnNext.style.opacity = currentSheet === totalSheets ? '0.3' : '1';
    
    btnPrev.style.cursor = currentSheet === 0 ? 'not-allowed' : 'pointer';
    btnNext.style.cursor = currentSheet === totalSheets ? 'not-allowed' : 'pointer';
}

function nextPage() {
    if (currentSheet < totalSheets) {
        currentSheet++;
        updateBook();
    }
}

function prevPage() {
    if (currentSheet > 0) {
        currentSheet--;
        updateBook();
    }
}

// 3. LOGIC SLIDE & LINKS
function getSlidePath(week, index) {
    return `assets/image/Slide/Week${week}/Slide${index + 1}.JPG`;
}

function changeSlide(week, direction) {
    if (!slideConfig[week]) return;
    currentIndices[week] += direction;
    const maxSlides = slideConfig[week];
    if (currentIndices[week] < 0) currentIndices[week] = maxSlides - 1;
    if (currentIndices[week] >= maxSlides) currentIndices[week] = 0;

    const imgElement = document.getElementById(`w${week}-slide-img`);
    const numElement = document.getElementById(`w${week}-slide-num`);

    if (imgElement && numElement) {
        imgElement.src = getSlidePath(week, currentIndices[week]);
        numElement.innerText = `${currentIndices[week] + 1} / ${maxSlides}`;
    }
}

function executeLinks(week) {
    const links = document.querySelectorAll(`.w${week}-link`);
    if (links.length === 0) { alert(`No links found for Week ${week}`); return; }
    if (confirm(`System: Launching ${links.length} protocols for Week ${week}?`)) {
        let blocked = false;
        links.forEach((link, index) => {
            if (index === 0) {
                const win = window.open(link.href, '_blank');
                if (!win) blocked = true;
            } else {
                setTimeout(() => {
                    const win = window.open(link.href, '_blank');
                    if (!win && !blocked) {
                        alert("⚠️ Browser blocked popup. Please allow popups.");
                        blocked = true;
                    }
                }, index * 800);
            }
        });
        links.forEach(link => {
            link.classList.add('link-clicked');
        });
    }
}

// 4. MATRIX & LOADING
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charArray = chars.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
for (let i = 0; i < columns; i++) { drops[i] = 1; }

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold ' + fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 33);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

document.addEventListener("DOMContentLoaded", () => {
    const bootLogs = document.getElementById('boot-logs');
    const bootStatus = document.getElementById('boot-status');
    const loadingScreen = document.getElementById('loading-screen');
    const messages = ["Hello Teacher...", "I'm DOAN QUOC HUY...", "Loading Assets...", "System Ready."];
    let msgIndex = 0; let charIndex = 0;

    function typeLine() {
        if (msgIndex < messages.length) {
            let currentLine = messages[msgIndex];
            if (charIndex === 0) {
                const newLine = document.createElement('div');
                newLine.classList.add('flex', 'items-baseline');
                const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
                newLine.innerHTML = `<span class="text-cyan-900 text-[10px] mr-2 font-mono shrink-0">[${timeString}]</span><span class="text-cyan-600 mr-2 shrink-0">➜</span><span class="log-content"></span>`;
                bootLogs.appendChild(newLine);
            }
            const currentLogLine = bootLogs.lastElementChild.querySelector('.log-content');
            currentLogLine.innerHTML += currentLine.charAt(charIndex);
            charIndex++;
            bootLogs.scrollTop = bootLogs.scrollHeight;
            if (charIndex < currentLine.length) setTimeout(typeLine, 15);
            else { msgIndex++; charIndex = 0; setTimeout(typeLine, 100); }
        } else {
            bootStatus.classList.remove('hidden');
            bootStatus.classList.add('flex');
            setTimeout(() => { loadingScreen.classList.add('loading-finished'); setTimeout(() => loadingScreen.remove(), 1000); }, 1000);
        }
    }
    typeLine();
});

// Init
updateBook();

// 5. LINK TRACKING LOGIC
// Tự động chạy khi web tải xong
document.addEventListener("DOMContentLoaded", () => {
    // Chọn tất cả thẻ <a> nằm trong danh sách bài tập (thẻ ul)
    // Để tránh ảnh hưởng đến các link email hay facebook ở trang Intro
    const exerciseLinks = document.querySelectorAll('ul li a');

    exerciseLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Khi click, thêm class 'link-clicked' vào thẻ a
            // Class này sẽ kích hoạt CSS ::after ở trên
            this.classList.add('link-clicked');
        });
    });
});

// 6. KEYBOARD NAVIGATION (Phím mũi tên)
document.addEventListener('keydown', (e) => {
    // Chỉ cho phép điều khiển khi màn hình Loading đã biến mất
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('loading-finished')) return;

    // Buộc user phải click "Access System" để mở khóa
    if (currentSheet === 0) return;

    // Mũi tên Phải -> Trang tiếp theo
    if (e.key === "ArrowRight") {
        nextPage();
    } 
    // Mũi tên Trái -> Quay lại
    else if (e.key === "ArrowLeft") {
        prevPage();
    }
});