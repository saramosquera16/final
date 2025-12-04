// ============ LOCALSTORAGE MANAGEMENT ============
const STORAGE_KEYS = {
    CART: 'anthoshop_cart',
    REVIEWS: 'anthoshop_reviews',
    CONTACTS: 'anthoshop_contacts',
    NEWSLETTER: 'anthoshop_newsletter'
};

class StorageManager {
    static getCart() {
        const cart = localStorage.getItem(STORAGE_KEYS.CART);
        return cart ? JSON.parse(cart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }

    static addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: Date.now(),
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        this.saveCart(cart);
        return cart;
    }

    static removeFromCart(productId) {
        const cart = this.getCart();
        const filtered = cart.filter(item => item.id !== productId);
        this.saveCart(filtered);
        return filtered;
    }

    static updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity > 0 ? quantity : 1;
        }
        this.saveCart(cart);
        return cart;
    }

    static clearCart() {
        localStorage.removeItem(STORAGE_KEYS.CART);
    }

    static getReviews() {
        const reviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
        return reviews ? JSON.parse(reviews) : [];
    }

    static addReview(review) {
        const reviews = this.getReviews();
        reviews.unshift({
            id: Date.now(),
            ...review,
            date: new Date().toLocaleDateString('es-ES')
        });
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
        return reviews;
    }

    static getContacts() {
        const contacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
        return contacts ? JSON.parse(contacts) : [];
    }

    static addContact(contact) {
        const contacts = this.getContacts();
        contacts.unshift({
            id: Date.now(),
            ...contact,
            date: new Date().toLocaleDateString('es-ES')
        });
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
        return contacts;
    }

    static getNewsletterSubscribers() {
        const subscribers = localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
        return subscribers ? JSON.parse(subscribers) : [];
    }

    static addNewsletterSubscriber(email) {
        const subscribers = this.getNewsletterSubscribers();
        if (!subscribers.find(sub => sub.email === email)) {
            subscribers.push({
                id: Date.now(),
                email,
                date: new Date().toLocaleDateString('es-ES')
            });
            localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(subscribers));
        }
        return subscribers;
    }
}

// ============ REVIEWS FUNCTIONALITY ============
class ReviewManager {
    constructor() {
        this.reviewForm = document.getElementById('reviewForm');
        this.ratingInput = document.getElementById('ratingInput');
        this.reviewRating = document.getElementById('reviewRating');

        this.init();
    }

    init() {
        this.attachRatingListeners();
        this.attachFormListener();
    }

    attachRatingListeners() {
        const stars = this.ratingInput.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                this.reviewRating.value = value;

                stars.forEach((s, index) => {
                    if (index < value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            star.addEventListener('mouseover', (e) => {
                const value = e.target.dataset.value;
                stars.forEach((s, index) => {
                    if (index < value) {
                        s.style.color = '#ffd700';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
        });

        this.ratingInput.addEventListener('mouseout', () => {
            const value = this.reviewRating.value;
            stars.forEach((s, index) => {
                if (index < value) {
                    s.style.color = '#ffd700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    }

    attachFormListener() {
        this.reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const review = {
                name: document.getElementById('reviewName').value,
                email: document.getElementById('reviewEmail').value,
                rating: parseInt(this.reviewRating.value),
                comment: document.getElementById('reviewComment').value
            };

            if (review.rating === 0) {
                cartManager.showNotification('⚠ Selecciona una calificación');
                return;
            }

            StorageManager.addReview(review);
            this.reviewForm.reset();
            this.reviewRating.value = 0;
            document.querySelectorAll('#ratingInput i').forEach(star => {
                star.classList.remove('active');
            });

            cartManager.showNotification('✓ ¡Gracias por tu comentario!');
            console.log('Review guardada:', review);
        });
    }
}

// ============ CONTACT FUNCTIONALITY ============
class ContactManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const contact = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            StorageManager.addContact(contact);
            this.contactForm.reset();
            cartManager.showNotification('✓ ¡Mensaje enviado correctamente!');
            console.log('Contacto guardado:', contact);
        });
    }
}

// ============ NEWSLETTER FUNCTIONALITY ============
class NewsletterManager {
    constructor() {
        this.newsletterForm = document.getElementById('newsletterForm');
        this.init();
    }

    init() {
        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = this.newsletterForm.querySelector('input[type="email"]').value;
            StorageManager.addNewsletterSubscriber(email);
            this.newsletterForm.reset();
            cartManager.showNotification('✓ ¡Suscripción exitosa!');
            console.log('Suscriptor agregado:', email);
        });
    }
}

// ============ SMOOTH SCROLLING ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .testimonial-card, .contact-info, .feature-box').forEach(el => {
    observer.observe(el);
});

// ============ INITIALIZE APP ============
let reviewManager, contactManager, newsletterManager;

document.addEventListener('DOMContentLoaded', () => {
    reviewManager = new ReviewManager();
    contactManager = new ContactManager();
    newsletterManager = new NewsletterManager();

    console.log('%c=== ANTHOSHOP INICIALIZADO ===', 'color: #ffd700; font-size: 14px; font-weight: bold;');
    console.log('Carrito:', StorageManager.getCart());
    console.log('Reviews:', StorageManager.getReviews());
    console.log('Contactos:', StorageManager.getContacts());
});

// ============ ADD CSS ANIMATION STYLES ============
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(50px);
        }
    }

    @keyframes bounce {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2) rotate(20deg);
        }
    }
`;
document.head.appendChild(style);

// ============ CUSTOM SLIDER ============
class CustomSlider {
    constructor() {
        this.slider = document.getElementById('heroSlider');
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 segundos

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.startAutoPlay();
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pausar autoplay cuando el usuario interactúe
        document.addEventListener('mouseenter', () => {
            if (this.slider.contains(event.target) || this.slider === event.target) {
                this.stopAutoPlay();
            }
        });

        document.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    showSlide(index) {
        // Remover clase active de todos los slides y dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Agregar clase active al slide y dot actual
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');

        this.currentSlide = index;
    }

    nextSlide() {
        let index = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(index);
        this.resetAutoPlay();
    }

    prevSlide() {
        let index = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(index);
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Inicializar slider cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // El slider se inicializa aquí pero después de que CartManager se cree
    if (document.getElementById('heroSlider')) {
        new CustomSlider();
    }
});
