// ============ PRODUCT DATABASE ============
const PRODUCTS_DB = {
    1: {
        id: 1,
        name: "Classic Sport Sneaker",
        price: 89.99,
        originalPrice: 119.99,
        rating: 4.5,
        reviews: 328,
        description: "Sneaker clásico con diseño moderno y comodidad garantizada. Perfecto para uso diario y actividades deportivas.",
        features: [
            "Material premium de alta calidad",
            "Suela antideslizante",
            "Amortiguación superior",
            "Diseño ergonómico",
            "Disponible en múltiples colores",
            "Garantía de 2 años"
        ],
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        image: "img/producto1.jpg",
        images: ["img/producto1/captura1producto1.webp", "img/producto1/captura2producto1.webp", "img/producto1/captura3producto1.webp", "img/producto1/captura4producto1.webp"]
    },
    2: {
        id: 2,
        name: "Urban Combat Boots",
        price: 129.99,
        originalPrice: 169.99,
        rating: 5,
        reviews: 412,
        description: "Botas urbanas con style y durabilidad para el día a día. Perfectas para cualquier ocasión.",
        features: [
            "Cuero auténtico",
            "Suela resistente",
            "Soporte de arco",
            "Cierre seguro",
            "Impermeables",
            "Fácil de limpiar"
        ],
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        image: "img/producto2.jpg",
        images: ["img/producto2/captura1producto2.avif", "img/producto2/captura2producto2.avif", "img/producto2/captura3producto2.avif", "img/producto2/captura4producto2.avif"]
    },
    3: {
        id: 3,
        name: "High Top Lifestyle",
        price: 109.99,
        originalPrice: 149.99,
        rating: 4,
        reviews: 267,
        description: "Zapatos altos con toque casual y estilo urbano. Combina comodidad y diseño.",
        features: [
            "Caña alta para soporte",
            "Material transpirable",
            "Plantilla acolchada",
            "Estilo versátil",
            "Peso ligero",
            "Fácil de poner y quitar"
        ],
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        image: "img/producto3.jpg",
        images: ["img/producto3/captura1producto3.avif", "img/producto3/captura2producto3.avif", "img/producto3/captura3producto3.avif", "img/producto3/captura4producto3.avif"]
    },
    4: {
        id: 4,
        name: "Casual Loafers",
        price: 74.99,
        originalPrice: 99.99,
        rating: 4.5,
        reviews: 189,
        description: "Zapatos casuales elegantes perfectos para cualquier ocasión. Diseño clásico y moderno.",
        features: [
            "Diseño slip-on",
            "Material suave",
            "Suela flexible",
            "Múltiples colores",
            "Comodidad premium",
            "Fácil mantenimiento"
        ],
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        image: "img/producto4.4.png",
        images: ["img/producto4/captura1producto4.webp", "img/producto4/captura2producto4.webp", "img/producto4/captura3producto4.webp", "img/producto4/captura4producto4.webp"]
    },
    5: {
        id: 5,
        name: "Performance Running",
        price: 119.99,
        originalPrice: 159.99,
        rating: 5,
        reviews: 445,
        description: "Zapatos deportivos con máximo rendimiento y comodidad. Ideales para correr.",
        features: [
            "Tecnología de amortiguación",
            "Suela de goma",
            "Material respirador",
            "Peso ultraliger",
            "Soporta pronación",
            "Garantía de rendimiento"
        ],
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        image: "img/producto5.jpg",
        images: ["img/producto5/captura1producto5.webp", "img/producto5/captura2producto5.webp", "img/producto5/captura3producto5.webp", "img/producto5/captura4producto5.webp"]
    },
    6: {
        id: 6,
        name: "Formal Dress Shoes",
        price: 139.99,
        originalPrice: 189.99,
        rating: 4,
        reviews: 214,
        description: "Zapatos formales elegantes para ocasiones especiales. Estilo sofisticado.",
        features: [
            "Cuero pulido",
            "Diseño refinado",
            "Comodidad absoluta",
            "Para todas las ocasiones",
            "Durabilidad premium",
            "Fácil de combinar"
        ],
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        image: "img/producto6.jpg",
        images: ["img/producto6/captura1producto6.jpg", "img/producto6/captura2producto6.jpg", "img/producto6/captura3producto6.jpg", "img/producto6/captura4producto6.jpg"]
    }
};

// ============ CART MANAGEMENT ============
class CartManager {
    constructor() {
        this.cartToggle = document.getElementById('cartToggle');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.closeCart = document.getElementById('closeCart');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartCount = document.getElementById('cartCount');
        this.clearCartBtn = document.getElementById('clearCart');
        
        this.init();
    }

    init() {
        if (this.cartToggle) {
            this.attachEventListeners();
            this.renderCart();
        }
    }

    attachEventListeners() {
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => this.toggleCart());
        }
        if (this.closeCart) {
            this.closeCart.addEventListener('click', () => this.toggleCart());
        }
        if (this.clearCartBtn) {
            this.clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        document.addEventListener('click', (e) => {
            if (this.cartSidebar && 
                !e.target.closest('.cart-sidebar') && 
                !e.target.closest('.btn-cart-toggle') && 
                this.cartSidebar.classList.contains('active')) {
                this.toggleCart();
            }
        });
    }

    toggleCart() {
        if (this.cartSidebar) {
            this.cartSidebar.classList.toggle('active');
        }
    }

    getCart() {
        const cart = localStorage.getItem('anthoshop_cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart(cart) {
        localStorage.setItem('anthoshop_cart', JSON.stringify(cart));
    }

    addToCart(product, quantity, size) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id && item.size === size);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: size
            });
        }
        
        this.saveCart(cart);
        this.renderCart();
        this.showNotification('Producto agregado al carrito');
    }

    removeFromCart(productId, size) {
        let cart = this.getCart();
        cart = cart.filter(item => !(item.id === productId && item.size === size));
        this.saveCart(cart);
        this.renderCart();
    }

    updateQuantity(productId, size, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId && item.size === size);
        if (item) {
            item.quantity = quantity > 0 ? quantity : 1;
        }
        this.saveCart(cart);
        this.renderCart();
    }

    clearCart() {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            localStorage.removeItem('anthoshop_cart');
            this.renderCart();
            this.showNotification('Carrito vaciado');
        }
    }

    renderCart() {
        const cart = this.getCart();
        
        if (cart.length === 0) {
            if (this.cartItems) {
                this.cartItems.innerHTML = '<p class="text-center text-muted py-5">Tu carrito está vacío</p>';
            }
            if (this.cartCount) {
                this.cartCount.textContent = '0';
            }
            if (this.cartTotal) {
                this.cartTotal.textContent = '$0.00';
            }
            return;
        }

        let html = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item mb-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">Talla: ${item.size}</small>
                        </div>
                        <button class="btn btn-sm btn-close" onclick="cartManager.removeFromCart(${item.id}, '${item.size}')"></button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="input-group input-group-sm" style="width: 120px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="cartManager.updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">-</button>
                            <input type="number" class="form-control text-center" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="cartManager.updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
                        </div>
                        <span class="fw-bold">$${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });

        if (this.cartItems) {
            this.cartItems.innerHTML = html;
        }
        if (this.cartCount) {
            this.cartCount.textContent = cart.length;
        }
        if (this.cartTotal) {
            this.cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gold);
            color: var(--primary-black);
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// ============ PRODUCT PAGE INITIALIZATION ============
let cartManager;
let currentProduct = null;

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

function loadProduct() {
    const productId = getProductIdFromUrl();
    currentProduct = PRODUCTS_DB[productId];

    if (!currentProduct) {
        window.location.href = 'anthoshop.html';
        return;
    }

    // Llenar imagen y detalles
    document.getElementById('productImage').src = currentProduct.image;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
    document.getElementById('originalPrice').textContent = `$${currentProduct.originalPrice.toFixed(2)}`;
    document.getElementById('productDescription').textContent = currentProduct.description;

    // Llenar rating
    let starsHTML = '';
    const fullStars = Math.floor(currentProduct.rating);
    const hasHalfStar = currentProduct.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star text-warning"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        starsHTML += '<i class="fas fa-star text-muted"></i>';
    }
    
    document.getElementById('ratingStars').innerHTML = starsHTML;
    document.getElementById('reviewCount').textContent = `(${currentProduct.reviews} reviews)`;

    // Llenar características
    let featuresHTML = '';
    currentProduct.features.forEach(feature => {
        featuresHTML += `<li>${feature}</li>`;
    });
    document.getElementById('productFeatures').innerHTML = featuresHTML;

    // Llenar tamaños
    const sizeSelect = document.getElementById('sizeSelect');
    sizeSelect.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Selecciona un tamaño';
    sizeSelect.appendChild(defaultOption);
    
    currentProduct.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    // Llenar thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    currentProduct.images.forEach((img, index) => {
        if (thumbnails[index]) {
            thumbnails[index].src = img;
        }
    });

    // Agregar event listeners
    document.getElementById('addToCartBtn').addEventListener('click', addToCart);
    document.getElementById('buyNowBtn').addEventListener('click', buyNow);
}

function changeMainImage(img) {
    document.getElementById('productImage').src = img.src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    img.classList.add('active');
}

function incrementQuantity() {
    const input = document.getElementById('quantityInput');
    input.value = Math.min(parseInt(input.value) + 1, 10);
}

function decrementQuantity() {
    const input = document.getElementById('quantityInput');
    input.value = Math.max(parseInt(input.value) - 1, 1);
}

function addToCart() {
    const size = document.getElementById('sizeSelect').value;
    const quantity = parseInt(document.getElementById('quantityInput').value);

    if (size === 'Selecciona un tamaño' || !size) {
        alert('Por favor selecciona una talla');
        return;
    }

    cartManager.addToCart(currentProduct, quantity, size);
}

function buyNow() {
    const size = document.getElementById('sizeSelect').value;
    const quantity = parseInt(document.getElementById('quantityInput').value);

    if (size === 'Selecciona un tamaño' || !size) {
        alert('Por favor selecciona una talla');
        return;
    }

    cartManager.addToCart(currentProduct, quantity, size);
    window.location.href = 'checkout.html';
}

function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    loadProduct();
});
