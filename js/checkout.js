// ============ CHECKOUT PAGE ============
const PROMO_CODES = {
    'SAVE10': { discount: 0.10, description: '10% descuento' },
    'SAVE20': { discount: 0.20, description: '20% descuento' },
    'WELCOME': { discount: 0.15, description: '15% de bienvenida' },
    'SHIPPING': { discount: 0, freeShipping: true, description: 'Envío gratis' }
};

class CheckoutManager {
    constructor() {
        this.form = document.getElementById('checkoutForm');
        this.paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        this.cardDetails = document.getElementById('cardDetails');
        this.applyPromoBtn = document.getElementById('applyPromo');
        this.promoInput = document.getElementById('promoCode');
        
        this.subtotal = 0;
        this.shipping = 10;
        this.tax = 0;
        this.discount = 0;
        this.freeShipping = false;

        this.init();
    }

    init() {
        this.loadCartItems();
        this.calculateTotals();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Cambiar método de pago
        this.paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                this.toggleCardDetails();
            });
        });

        // Aplicar código de promoción
        if (this.applyPromoBtn) {
            this.applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        // Enviar formulario
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Validar campos de tarjeta
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        const expiry = document.getElementById('expiry');
        if (expiry) {
            expiry.addEventListener('input', (e) => this.formatExpiry(e));
        }
    }

    loadCartItems() {
        const cart = localStorage.getItem('anthoshop_cart');
        const items = cart ? JSON.parse(cart) : [];

        if (items.length === 0) {
            window.location.href = 'anthoshop.html';
            return;
        }

        let html = '';
        this.subtotal = 0;

        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            this.subtotal += itemTotal;

            html += `
                <div class="order-item">
                    <div class="order-item-info">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-details">Talla: ${item.size} | Cantidad: ${item.quantity}</div>
                    </div>
                    <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });

        document.getElementById('orderItems').innerHTML = html;
    }

    calculateTotals() {
        this.tax = this.subtotal * 0.08; // 8% tax

        let total = this.subtotal + this.tax;

        if (!this.freeShipping) {
            total += this.shipping;
        }

        total -= this.discount;

        document.getElementById('subtotal').textContent = `$${this.subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${this.tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = this.freeShipping ? 'Gratis' : `$${this.shipping.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${Math.max(0, total).toFixed(2)}`;
    }

    applyPromoCode() {
        const code = this.promoInput.value.toUpperCase().trim();

        if (!code) {
            alert('Por favor ingresa un código de promoción');
            return;
        }

        const promo = PROMO_CODES[code];

        if (!promo) {
            alert('Código de promoción inválido');
            this.promoInput.value = '';
            return;
        }

        // Aplicar descuento
        this.discount = this.subtotal * promo.discount;
        
        if (promo.freeShipping) {
            this.freeShipping = true;
            this.discount = 0;
        }

        // Mostrar descuento
        const discountSection = document.getElementById('discountSection');
        const discountAmount = document.getElementById('discountAmount');
        
        if (this.freeShipping) {
            discountAmount.textContent = `-$${this.shipping.toFixed(2)}`;
        } else {
            discountAmount.textContent = `-$${this.discount.toFixed(2)}`;
        }

        discountSection.classList.remove('d-none');
        this.promoInput.disabled = true;
        this.applyPromoBtn.disabled = true;
        this.applyPromoBtn.textContent = `✓ ${promo.description}`;

        this.calculateTotals();
    }

    toggleCardDetails() {
        const cardDetails = document.getElementById('cardDetails');
        const creditCardRadio = document.getElementById('creditCard');

        if (creditCardRadio.checked) {
            cardDetails.style.display = 'block';
            // Hacer campos requeridos
            document.getElementById('cardName').required = true;
            document.getElementById('cardNumber').required = true;
            document.getElementById('expiry').required = true;
            document.getElementById('cvv').required = true;
        } else {
            cardDetails.style.display = 'none';
            // Hacer campos opcionales
            document.getElementById('cardName').required = false;
            document.getElementById('cardNumber').required = false;
            document.getElementById('expiry').required = false;
            document.getElementById('cvv').required = false;
        }
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
        e.target.value = formattedValue;
    }

    formatExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    validateForm() {
        // Validar datos personales
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (!firstName || !lastName || !email || !phone) {
            alert('Por favor completa todos los datos personales');
            return false;
        }

        // Validar dirección
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postal = document.getElementById('postal').value;

        if (!address || !city || !postal) {
            alert('Por favor completa la dirección de envío');
            return false;
        }

        // Validar método de pago
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (paymentMethod === 'creditCard') {
            const cardName = document.getElementById('cardName').value;
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardName || cardNumber.length < 16 || !expiry || cvv.length < 3) {
                alert('Por favor completa los datos de la tarjeta correctamente');
                return false;
            }
        }

        // Validar términos
        if (!document.getElementById('termsCheck').checked) {
            alert('Debes aceptar los términos y condiciones');
            return false;
        }

        return true;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        // Mostrar loading
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        // Simular procesamiento de pago
        setTimeout(() => {
            this.completeOrder();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    }

    completeOrder() {
        // Obtener datos del formulario
        const orderData = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString('es-ES'),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postal: document.getElementById('postal').value,
            state: document.getElementById('state').value,
            country: document.getElementById('country').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            subtotal: this.subtotal,
            tax: this.tax,
            shipping: this.freeShipping ? 0 : this.shipping,
            discount: this.discount,
            total: parseFloat(document.getElementById('totalAmount').textContent.replace('$', '')),
            items: JSON.parse(localStorage.getItem('anthoshop_cart') || '[]')
        };

        // Guardar orden en localStorage
        let orders = localStorage.getItem('anthoshop_orders');
        orders = orders ? JSON.parse(orders) : [];
        orders.push(orderData);
        localStorage.setItem('anthoshop_orders', JSON.stringify(orders));

        // Vaciar carrito
        localStorage.removeItem('anthoshop_cart');

        // Mostrar confirmación
        this.showOrderConfirmation(orderData);
    }

    showOrderConfirmation(orderData) {
        const confirmationHTML = `
            <div class="order-confirmation">
                <div class="confirmation-content">
                    <i class="fas fa-check-circle text-success" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                    <h2>¡Pedido Confirmado!</h2>
                    <p class="text-muted mb-3">Tu pedido ha sido procesado exitosamente</p>
                    
                    <div class="confirmation-details mb-4">
                        <p><strong>Número de Pedido:</strong> ${orderData.id}</p>
                        <p><strong>Correo de confirmación:</strong> ${orderData.email}</p>
                        <p><strong>Fecha:</strong> ${orderData.date}</p>
                    </div>

                    <div class="confirmation-total mb-4">
                        <p><strong>Total Pagado:</strong> <span class="text-gold" style="font-size: 1.5rem; font-weight: bold;">$${orderData.total.toFixed(2)}</span></p>
                    </div>

                    <p class="text-muted small mb-4">Se ha enviado un correo de confirmación a ${orderData.email}</p>

                    <button class="btn btn-luxury" onclick="window.location.href = 'anthoshop.html'">
                        Volver a la tienda
                    </button>
                </div>
            </div>
        `;

        document.querySelector('.checkout-section .container').innerHTML = confirmationHTML;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});
