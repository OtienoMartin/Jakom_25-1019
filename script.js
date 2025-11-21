// Navigation active state
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.orange-strip-section, .why-section, .support-card, .photo-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Photo gallery lightbox (if needed)
    initializePhotoGallery();
});

function initializePhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.photo-caption h3').textContent;
            openLightbox(img.src, caption);
        });
    });
}

function openLightbox(src, caption) {
    // Create lightbox modal
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    `;
    
    const captionEl = document.createElement('div');
    captionEl.textContent = caption;
    captionEl.style.cssText = `
        position: absolute;
        bottom: 20px;
        color: white;
        font-size: 1.2em;
        text-align: center;
        background: rgba(255,107,53,0.9);
        padding: 10px 20px;
        border-radius: 5px;
    `;
    
    lightbox.appendChild(img);
    lightbox.appendChild(captionEl);
    
    lightbox.addEventListener('click', function() {
        document.body.removeChild(lightbox);
    });
    
    document.body.appendChild(lightbox);
}

// Donation amount selection
function selectDonation(amount) {
    const options = document.querySelectorAll('.donation-option');
    options.forEach(opt => opt.style.background = '#fff');
    options.forEach(opt => opt.style.color = '#333');
    
    event.target.style.background = '#ff6b35';
    event.target.style.color = '#fff';
    
    // Update donation form
    document.getElementById('donation-amount').value = amount;
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#28a745';
        }
    });
    
    return isValid;
}

// Workshop Diary Table Enhancements
function initializeWorkshopTable() {
    const table = document.querySelector('.workshop-table');
    if (!table) return;
    
    // Add row numbering
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.setAttribute('data-row', index + 1);
    });
    
    // Add click to expand functionality for mobile
    if (window.innerWidth < 768) {
        makeTableRowsExpandable();
    }
    
    // Add sorting capability
    addTableSorting();
}

function makeTableRowsExpandable() {
    const rows = document.querySelectorAll('.workshop-table tbody tr');
    
    rows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
}

function addTableSorting() {
    const table = document.querySelector('.workshop-table');
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        if (index === 0) { // Only make date column sortable
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => sortTableByDate(index));
        }
    });
}

function sortTableByDate(columnIndex) {
    const table = document.querySelector('.workshop-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const isAscending = !table.getAttribute('data-sort-dir') || table.getAttribute('data-sort-dir') === 'desc';
    
    rows.sort((a, b) => {
        const dateA = parseDate(a.cells[columnIndex].textContent);
        const dateB = parseDate(b.cells[columnIndex].textContent);
        
        return isAscending ? dateA - dateB : dateB - dateA;
    });
    
    // Remove existing rows
    rows.forEach(row => tbody.removeChild(row));
    
    // Add sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort direction
    table.setAttribute('data-sort-dir', isAscending ? 'asc' : 'desc');
    
    // Visual feedback
    updateSortIndicator(columnIndex, isAscending);
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

function updateSortIndicator(columnIndex, isAscending) {
    const headers = document.querySelectorAll('.workshop-table th');
    
    // Remove existing indicators
    headers.forEach(header => {
        header.textContent = header.textContent.replace(' ↑', '').replace(' ↓', '');
    });
    
    // Add new indicator
    const currentHeader = headers[columnIndex];
    currentHeader.textContent += isAscending ? ' ↑' : ' ↓';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeWorkshopTable();
});

// Additional workshop diary functionality
function exportWorkshopDiary() {
    const table = document.querySelector('.workshop-table');
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            let data = cols[j].textContent.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
            data = data.replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        
        csv.push(row.join(','));
    }
    
    const csvString = csv.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'workshop_diary.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}