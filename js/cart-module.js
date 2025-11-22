// js/cart-module.js

// Get cart from localStorage
export function getCart() {
    return JSON.parse(localStorage.getItem('ecocart')) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
    localStorage.setItem('ecocart', JSON.stringify(cart));
}

// Add item to cart
export function addToCart(id, name, price, image) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartBadge();
    showNotification(`${name} added to cart!`, 'success');
}

// Update cart badge count
export function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Show notification
export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'warning' ? 'alert-warning' : 
                      type === 'info' ? 'alert-info' : 'alert-success';
    
    notification.className = `alert ${alertClass} position-fixed top-0 end-0 m-3 alert-dismissible fade show`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    const icon = type === 'success' ? 'bi-check-circle' : 
                 type === 'warning' ? 'bi-exclamation-triangle' : 
                 type === 'info' ? 'bi-info-circle' : 'bi-check-circle';
    
    notification.innerHTML = `
        <i class="bi ${icon} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
