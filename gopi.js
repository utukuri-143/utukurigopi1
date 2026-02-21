// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formResponse = document.getElementById('form-response');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('message', document.getElementById('message').value);

        // Your specific Google Apps Script URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxMjuTZsvqWWGO-vVLpxoqWi4MZVdntpoWIr9m4yQa4oSElS_gYj5ftvFmTPzyTRL7B4A/exec';

        formResponse.textContent = 'Sending message...';
        formResponse.style.color = '#00bcd4';

        fetch(scriptURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' 
        })
        .then(() => {
            // SUCCESS UI UPDATE
            formResponse.textContent = 'Message sent successfully! Thank you for contacting 😇';
            formResponse.style.color = '#4caf50';
            contactForm.reset();

            // NEW: Wait 3 seconds, then reload the page to clear the text
            setTimeout(() => {
                window.location.reload();
            }, 3000); 
        })
        .catch(error => {
            formResponse.textContent = 'Network error. Please check your connection.';
            formResponse.style.color = '#f44336';
            console.error('Error:', error);
        });
    });
}

// ===== SKILLS TABS FUNCTIONALITY =====
const skillsTabButtons = document.querySelectorAll('.skills-tab-btn');
const skillsGrids = document.querySelectorAll('.skills-grid');

if (skillsTabButtons.length > 0) {
    skillsTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            skillsTabButtons.forEach(btn => btn.classList.remove('active'));
            skillsGrids.forEach(grid => grid.classList.remove('active'));
            button.classList.add('active');
            const targetId = button.getAttribute('data-target');
            const targetGrid = document.getElementById(targetId);
            if (targetGrid) {
                targetGrid.classList.add('active');
            }
        });
    });
}

// ===== IMPROVED FLIP CARD FUNCTIONALITY =====
const hobbyCards = document.querySelectorAll('.hobby-card');
let activeCard = null;

function closeAllCards() {
    hobbyCards.forEach(card => card.classList.remove('flipped'));
    activeCard = null;
}

function toggleCard(card) {
    if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        activeCard = null;
    } else {
        closeAllCards();
        card.classList.add('flipped');
        activeCard = card;
    }
}

hobbyCards.forEach(card => {
    const frontSide = card.querySelector('.hobby-card-front');
    if (frontSide) {
        frontSide.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCard(card);
        });
    }
    const closeBtn = card.querySelector('.hobby-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllCards();
        });
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.hobby-card') && activeCard) closeAllCards();
});

// ===== MOBILE SLIDER OPTIMIZATION =====
function updateSliderForMobile() {
    const slider = document.querySelector('.profile-slider');
    if (!slider) return;
    if (window.innerWidth <= 768) {
        slider.style.height = '250px';
        document.querySelectorAll('.profile-slide').forEach(s => s.style.padding = '0');
    } else {
        slider.style.height = '400px';
    }
}
window.addEventListener('resize', updateSliderForMobile);
updateSliderForMobile();

// ===== DOM CONTENT LOADED LOGIC =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Handle Mobile Dropdowns
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdowns.forEach(d => { if(d !== dropdown) d.classList.remove('active'); });
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Project Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectGrids = document.querySelectorAll('.projects-grid');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            projectGrids.forEach(grid => grid.classList.remove('active'));
            button.classList.add('active');
            const target = document.getElementById(button.getAttribute('data-target'));
            if (target) target.classList.add('active');
        });
    });

    // Profile Slider
    const slides = document.querySelectorAll('.profile-slide');
    const indicators = document.querySelectorAll('.profile-slider-indicator');
    const prevBtn = document.querySelector('.profile-slider-nav.prev');
    const nextBtn = document.querySelector('.profile-slider-nav.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index, direction = 'next') {
        if (slides.length === 0) return;
        slides.forEach(s => { s.classList.remove('active'); s.removeAttribute('data-direction'); });
        indicators.forEach(i => i.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        slides[currentSlide].setAttribute('data-direction', direction);
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }

    function startAutoSlide() { slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000); }
    function stopAutoSlide() { clearInterval(slideInterval); }

    if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); stopAutoSlide(); startAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1, 'prev'); stopAutoSlide(); startAutoSlide(); });

    showSlide(0);
    startAutoSlide();

    // Scroll Effects
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        window.scrollY > 50 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
});