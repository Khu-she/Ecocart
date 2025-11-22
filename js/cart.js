// ===== EcoCart - Cart Page JavaScript (Fresh Start) =====
import { getCart, saveCart, updateCartBadge, showNotification } from './cart-module.js';

// Valid promo codes
const validPromoCodes = {
    'SAVE10': { discount: 10, description: '10% off your order' },
    'ECO20': { discount: 20, description: '20% off eco products' },
    'WELCOME15': { discount: 15, description: '15% off for new customers' }
};

// Track applied promo code
let appliedPromoCode = null;

// Load promo code from localStorage on page load
function loadPromoCode() {
    const savedPromo = localStorage.getItem('appliedPromoCode');
    if (savedPromo) {
        appliedPromoCode = JSON.parse(savedPromo);
        
        // Display the promo message
        const promoInput = document.getElementById('promo-input');
        const promoMessage = document.getElementById('promo-message');
        
        if (promoInput) promoInput.value = appliedPromoCode.code;
        if (promoMessage) {
            promoMessage.textContent = `✓ ${appliedPromoCode.discount}% discount applied!`;
            promoMessage.style.display = 'block';
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded');
    loadPromoCode(); 
    loadCartPage();
    initializeCartButtons();
});

// Initialize cart page buttons
function initializeCartButtons() {
    // Promo code button
    const promoBtn = document.getElementById('apply-promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Update cart button
    const updateBtn = document.getElementById('update-cart-btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            loadCartPage();
            showNotification('Cart updated successfully!', 'success');
        });
    }
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const promoMessage = document.getElementById('promo-message');
    
    if (!promoInput || !promoMessage) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        promoMessage.textContent = 'Please enter a promo code';
        promoMessage.className = 'text-danger small mt-2';
        promoMessage.style.display = 'block';
        return;
    }
    
    if (validPromoCodes[code]) {
        appliedPromoCode = {
            code: code,
            discount: validPromoCodes[code].discount
        };
        
        // Save to localStorage
        localStorage.setItem('appliedPromoCode', JSON.stringify(appliedPromoCode));
        
        // Show success message
        promoMessage.textContent = `✓ ${appliedPromoCode.discount}% discount applied!`;
        promoMessage.className = 'text-success small mt-2';
        promoMessage.style.display = 'block';
        
        // Update cart summary with discount
        const cart = getCart();
        updateCartSummary(cart);
        
        showNotification(`Promo code applied: ${appliedPromoCode.discount}% off!`, 'success');
    } else {
        promoMessage.textContent = '✗ Invalid promo code';
        promoMessage.className = 'text-danger small mt-2';
        promoMessage.style.display = 'block';
        
        showNotification('Invalid promo code', 'error');
    }
}


// Load and display cart items
function loadCartPage() {
    const cart = getCart();
    updateCartBadge(); // Also update badge on cart page load

    if (cart.length === 0) {
        showEmptyCart();
    } else {
        displayCartItems(cart);
        updateCartSummary(cart);
    }
}

// Display all cart items
function displayCartItems(cartItems) {
    console.log('displayCartItems called with:', cartItems);
    
    const cartContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartSummary = document.querySelector('.col-lg-4 .card');

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartContainer) cartContainer.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'block';
    
    console.log('Cart container found:', cartContainer);
    
    if (!cartContainer) {
        console.error('Cart container not found! Looking for .cart-items');
        return;
    }
    
    cartContainer.innerHTML = '';
    
    cartItems.forEach((item, index) => {
        console.log(`Rendering item ${index}:`, item);
        const cartItemHTML = `
            <div class="card mb-3 border-0 shadow-sm">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${item.image}" class="img-fluid rounded-start h-100" alt="${item.name}" style="object-fit: cover;">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <div class="row align-items-center gy-3">
                                <div class="col-12 col-md-6">
                                    <h5 class="card-title fw-bold">${item.name}</h5>
                                    <p class="card-text text-muted small">Eco-friendly product</p>
                                    <p class="text-primary fw-bold">₹${item.price.toLocaleString()}</p>
                                </div>
                                <div class="col-12 col-md-3 text-center">
                                    <label class="form-label small text-muted">Quantity</label>
                                    <div class="input-group input-group-sm" style="width: 120px; margin: 0 auto;">
                                        <button class="btn btn-outline-secondary quantity-btn" data-action="decrease" data-id="${item.id}">
                                            <i class="bi bi-dash"></i>
                                        </button>
                                        <input type="number" class="form-control text-center" value="${item.quantity}" min="1" readonly>
                                        <button class="btn btn-outline-secondary quantity-btn" data-action="increase" data-id="${item.id}">
                                            <i class="bi bi-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-12 col-md-3 text-end">
                                    <div class="fs-5 fw-bold text-primary mb-2">₹${(item.price * item.quantity).toLocaleString()}</div>
                                    <button class="btn btn-outline-danger btn-sm remove-btn" data-id="${item.id}">
                                        <i class="bi bi-trash me-1"></i>Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        cartContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });
    
    // Attach event listeners after rendering
    attachCartEventListeners();
}

// Attach event listeners to cart buttons
function attachCartEventListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const itemId = this.getAttribute('data-id');
            updateQuantity(itemId, action);
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeItem(itemId);
        });
    });
}

// Update item quantity
function updateQuantity(itemId, action) {
    // Read directly from localStorage
    let cart = getCart();
    
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
        }
        
        // Save directly to localStorage
        saveCart(cart);
        
        // Update badge if function exists
        updateCartBadge();
        
        loadCartPage();
    }
}

// Remove item from cart
function removeItem(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    
    updateCartBadge();
    loadCartPage(); // This will now correctly re-render the page
    
    showNotification('Item removed from cart', 'info');
}

// Update cart summary (totals)
function updateCartSummary(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08);
    const shipping = subtotal > 1000 ? 0 : 99;
    
    // Calculate discount if promo code is applied
    let discount = 0;
    if (appliedPromoCode) {
        discount = Math.round(subtotal * (appliedPromoCode.discount / 100));
    }
    
    const total = subtotal + tax + shipping - discount;
    
    // Update summary elements if they exist
    const subtotalEl = document.querySelector('.subtotal-amount');
    const taxEl = document.querySelector('.tax-amount');
    const shippingEl = document.querySelector('.shipping-amount');
    const discountEl = document.querySelector('.discount-amount');
    const totalEl = document.querySelector('.total-amount');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
    if (taxEl) taxEl.textContent = `₹${tax.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
    
    // Show/hide discount row based on whether promo is applied
    if (discountEl) {
        const discountRow = discountEl.closest('.d-flex');
        if (discount > 0) {
            discountEl.textContent = `-₹${discount.toLocaleString()}`;
            if (discountRow) discountRow.style.display = 'flex';
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }
    }
    
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
    
    // Update item count
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const itemCountEl = document.querySelector('.item-count');
    if (itemCountEl) {
        itemCountEl.textContent = `Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''}):`;
    }
}

// Show empty cart message
function showEmptyCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartSummary = document.querySelector('.col-lg-4 .card'); // More specific selector for summary

    if (cartItemsContainer) cartItemsContainer.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'none';
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'block';
        emptyCartMessage.classList.add('fade-in');
    }
    
    // Clear promo code when cart is empty
    appliedPromoCode = null;
    localStorage.removeItem('appliedPromoCode');
    
    const promoInput = document.getElementById('promo-input');
    const promoMessage = document.getElementById('promo-message');
    if (promoInput) promoInput.value = '';
    if (promoMessage) promoMessage.style.display = 'none';
}

