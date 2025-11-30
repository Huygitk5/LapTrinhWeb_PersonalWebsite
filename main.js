// Init Icons
lucide.createIcons();

// =================================================================
// 1. CẤU HÌNH SỐ LƯỢNG SLIDE CHO 8 TUẦN (SỬA Ở ĐÂY)
// =================================================================
// Cú pháp: [Tuần]: [Số lượng ảnh]
const slideConfig = {
    1: 42,   // Tuần 1 có 5 ảnh
    2: 4,   // Tuần 2 có 4 ảnh
    3: 6,   // Tuần 3 có 6 ảnh
    4: 3,   // Tuần 4...
    5: 5,
    6: 5,
    7: 5,
    8: 5
};

// State: Lưu vị trí trang hiện tại của từng tuần (Mặc định là 0 hết)
const currentIndices = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
};

// =================================================================
// 2. LOGIC CHUNG CHO SLIDE & LINK (KHÔNG CẦN SỬA)
// =================================================================

/**
 * Hàm lấy đường dẫn ảnh tự động
 * Quy tắc: assets/image/Slide/Week[X]/Slide[Y].JPG
 */
function getSlidePath(week, index) {
    // index + 1 vì file ảnh bắt đầu từ Slide1.JPG, còn code đếm từ 0
    return `assets/image/Slide/Week${week}/Slide${index + 1}.JPG`;
}

/**
 * Hàm chuyển Slide (Dùng chung cho cả 8 tuần)
 * @param {number} week - Số tuần (1, 2, 3...)
 * @param {number} direction - Hướng (-1 là Prev, 1 là Next)
 */
function changeSlide(week, direction) {
    // 1. Kiểm tra xem tuần này có tồn tại trong config không
    if (!slideConfig[week]) return;

    // 2. Cập nhật chỉ số index
    currentIndices[week] += direction;
    
    const maxSlides = slideConfig[week];

    // Loop lại (Vòng tròn)
    if (currentIndices[week] < 0) currentIndices[week] = maxSlides - 1;
    if (currentIndices[week] >= maxSlides) currentIndices[week] = 0;

    // 3. Tìm các thẻ HTML tương ứng để hiển thị
    // Yêu cầu HTML phải đặt ID theo chuẩn: w1-slide-img, w2-slide-img...
    const imgElement = document.getElementById(`w${week}-slide-img`);
    const numElement = document.getElementById(`w${week}-slide-num`);
    
    if (imgElement && numElement) {
        imgElement.src = getSlidePath(week, currentIndices[week]);
        numElement.innerText = `${currentIndices[week] + 1}/${maxSlides}`;
    }
}

/**
 * Hàm Execute Links (Dùng chung)
 * @param {number} week - Số tuần
 */
function executeLinks(week) {
    // Tìm các thẻ a có class: w1-link, w2-link...
    const links = document.querySelectorAll(`.w${week}-link`);
    
    if (links.length === 0) {
        alert(`No links found for Week ${week}`);
        return;
    }

    if (confirm(`System: Open ${links.length} tabs for Week ${week}?`)) {
        links.forEach(link => {
            window.open(link.href, '_blank');
        });
    }
}

// =================================================================
// 3. LOGIC LẬT SÁCH (GIỮ NGUYÊN)
// =================================================================

let currentSheet = 0;
const totalSheets = 5; 
// Lưu ý: Nếu bạn có 8 tuần, bạn sẽ cần tăng số lượng Sheet trong HTML và sửa số totalSheets này lên tương ứng (ví dụ 8 tuần = 4 tờ giấy 2 mặt + bìa => totalSheets = 5)

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

if(startBtn) {
    startBtn.addEventListener('click', nextPage);
}

// Init
updateBook();