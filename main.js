// Init Icons
lucide.createIcons();

// State
let currentSheet = 0;
const totalSheets = 5; 

// Elements
const bookWrapper = document.getElementById('book-wrapper');
const backPlateLeft = document.getElementById('back-plate-left');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const sheets = document.querySelectorAll('.sheet');
const startBtn = document.getElementById('start-btn');
const controlsContainer = document.getElementById('controls-container'); // Lấy element thanh điều khiển

function updateBook() {
    // 1. Xử lý trạng thái Đóng/Mở sách
    if (currentSheet > 0) {
        // --- SÁCH MỞ ---
        bookWrapper.classList.remove('-translate-x-1/2');
        bookWrapper.classList.add('translate-x-0');
        
        backPlateLeft.classList.remove('opacity-0');
        backPlateLeft.classList.add('opacity-100');
        
        statusText.innerText = ">>> NAVIGATION CONTROLS ACTIVE <<<";
        statusBar.innerText = `SHEET: 0${currentSheet} / 0${totalSheets}`;

        // HIỆN thanh điều hướng
        controlsContainer.classList.remove('opacity-0', 'pointer-events-none');
        controlsContainer.classList.add('opacity-100', 'pointer-events-auto');
    } else {
        // --- SÁCH ĐÓNG (Về bìa) ---
        bookWrapper.classList.add('-translate-x-1/2');
        bookWrapper.classList.remove('translate-x-0');
        
        backPlateLeft.classList.add('opacity-0');
        backPlateLeft.classList.remove('opacity-100');
        
        statusText.innerText = ">>> SYSTEM STANDBY. CLICK TO INITIALIZE <<<";
        statusBar.innerText = "STATUS: LOCKED";

        // ẨN thanh điều hướng (Để bắt buộc click vào bìa mới mở được)
        controlsContainer.classList.add('opacity-0', 'pointer-events-none');
        controlsContainer.classList.remove('opacity-100', 'pointer-events-auto');
    }

    // 2. Xử lý lật trang (Logic Z-index)
    sheets.forEach((sheet, index) => {
        if (currentSheet > index) {
            // Trang đã lật sang trái
            sheet.style.transform = 'rotateY(-180deg)';
            sheet.style.zIndex = index; 
        } else {
            // Trang còn nằm bên phải
            sheet.style.transform = 'rotateY(0deg)';
            sheet.style.zIndex = totalSheets - index; 
        }
    });

    // 3. Cập nhật trạng thái nút Next/Prev (Disable khi hết trang)
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

// Sự kiện click nút ở trang bìa
if(startBtn) {
    startBtn.addEventListener('click', nextPage);
}

// Chạy lần đầu
updateBook();