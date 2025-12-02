// Init Icons
lucide.createIcons();

// 1. CẤU HÌNH SỐ LƯỢNG SLIDE
const slideConfig = {
    1: 42, 
    2: 158, 
    3: 91, 
    4: 206
};

const currentIndices = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

// 2. LOGIC LẬT SÁCH
let currentSheet = 0;
const totalSheets = 4; // Bìa + 3 tờ nội dung

const bookWrapper = document.getElementById('book-wrapper');
const backPlateLeft = document.getElementById('back-plate-left');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const sheets = document.querySelectorAll('.sheet');
const startBtn = document.getElementById('start-btn');
const controlsContainer = document.getElementById('controls-container');

function updateBook() {
    if (currentSheet > 0) {
        bookWrapper.classList.remove('book-idle-spin');
        bookWrapper.style.transform = 'rotateY(0deg)'; 
        bookWrapper.classList.remove('-translate-x-1/2');
        bookWrapper.classList.add('translate-x-0');
        backPlateLeft.classList.remove('opacity-0');
        backPlateLeft.classList.add('opacity-100');
        statusText.innerText = ">>> NAVIGATION CONTROLS ACTIVE <<<";
        statusBar.innerText = `SHEET: 0${currentSheet} / 0${totalSheets}`;
        controlsContainer.classList.remove('opacity-0', 'pointer-events-none');
        controlsContainer.classList.add('opacity-100', 'pointer-events-auto');
    } else {
        bookWrapper.classList.add('-translate-x-1/2');
        bookWrapper.classList.remove('translate-x-0');
        backPlateLeft.classList.add('opacity-0');
        backPlateLeft.classList.remove('opacity-100');
        statusText.innerText = ">>> SYSTEM STANDBY. CLICK TO INITIALIZE <<<";
        statusBar.innerText = "STATUS: LOCKED";
        controlsContainer.classList.add('opacity-0', 'pointer-events-none');
        controlsContainer.classList.remove('opacity-100', 'pointer-events-auto');
        bookWrapper.style.transform = ''; 
        bookWrapper.classList.add('book-idle-spin');
    }

    sheets.forEach((sheet, index) => {
        if (currentSheet > index) {
            sheet.style.transform = 'rotateY(-180deg)';
            sheet.style.zIndex = index; 
        } else {
            sheet.style.transform = 'rotateY(0deg)';
            sheet.style.zIndex = totalSheets - index; 
        }
    });

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
    const messages = ["Connecting...", "Verifying User...", "Loading Assets...", "System Ready."];
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