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

// ============ CART FUNCTIONALITY ============
class CartManager {
    constructor() {
        this.cartToggle = document.getElementById('cartToggle');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.closeCart = document.getElementById('closeCart');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartCount = document.getElementById('cartCount');
        this.clearCartBtn = document.getElementById('clearCart');
        this.addToCartButtons = document.querySelectorAll('.add-to-cart');

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.renderCart();
    }

    attachEventListeners() {
        this.cartToggle.addEventListener('click', () => this.toggleCart());
        this.closeCart.addEventListener('click', () => this.toggleCart());
        this.clearCartBtn.addEventListener('click', () => this.clearCart());

        this.addToCartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = {
                    name: e.currentTarget.dataset.product,
                    price: parseFloat(e.currentTarget.dataset.price)
                };
                this.addToCart(product);
            });
        });

        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-sidebar') && 
                !e.target.closest('.btn-cart-toggle') && 
                this.cartSidebar.classList.contains('active')) {
                this.toggleCart();
            }
        });
    }

    toggleCart() {
        this.cartSidebar.classList.toggle('active');
    }

    addToCart(product) {
        StorageManager.addToCart(product);
        this.renderCart();
        this.showNotification(`✓ ${product.name} agregado al carrito`);
        
        // Animar el botón del carrito
        this.cartToggle.style.animation = 'none';
        setTimeout(() => {
            this.cartToggle.style.animation = 'bounce 0.6s';
        }, 10);
    }

    renderCart() {
        const cart = StorageManager.getCart();
        
        if (cart.length === 0) {
            this.cartItems.innerHTML = '<p class="text-center text-muted py-5">Tu carrito está vacío</p>';
            this.cartCount.textContent = '0';
            this.cartTotal.textContent = '$0.00';
            return;
        }

        let total = 0;
        this.cartItems.innerHTML = '';

        cart.forEach(item => {
            total += item.price * item.quantity;

            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h6>${item.name}</h6>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="number" min="1" value="${item.quantity}" 
                               class="quantity-input" data-id="${item.id}" 
                               style="width: 50px; padding: 5px; border: 1px solid #ddd; border-radius: 5px;">
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            this.cartItems.innerHTML += itemHTML;
        });

        // Agregar event listeners a botones de eliminar
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                StorageManager.removeFromCart(id);
                this.renderCart();
            });
        });

        // Agregar event listeners a inputs de cantidad
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const quantity = parseInt(e.target.value);
                StorageManager.updateQuantity(id, quantity);
                this.renderCart();
            });
        });

        this.cartCount.textContent = cart.length;
        this.cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    clearCart() {
        if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
            StorageManager.clearCart();
            this.renderCart();
            this.showNotification('✓ Carrito vaciado');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 25px;
            right: 25px;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #1a1a1a;
            padding: 16px 28px;
            border-radius: 50px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
            z-index: 1001;
            font-weight: 700;
            animation: slideInRight 0.4s ease-out;
            letter-spacing: 0.5px;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => notification.remove(), 400);
        }, 3500);
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
let cartManager, reviewManager, contactManager, newsletterManager;

document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
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
