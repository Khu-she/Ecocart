// ===== Navbar Component JavaScript =====
// This file creates a reusable navbar that can be loaded on all pages

function loadNavbar(activePage = 'home') {
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold fs-3 text-primary" href="index.html">
                <i class="bi bi-leaf me-2"></i>EcoCart
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'home' ? 'active fw-semibold' : ''}" ${activePage === 'home' ? 'aria-current="page"' : ''} href="index.html">
                            <i class="bi bi-house me-1"></i>Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'products' ? 'active fw-semibold' : ''}" ${activePage === 'products' ? 'aria-current="page"' : ''} href="products.html">
                            <i class="bi bi-grid me-1"></i>Products
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'cart' ? 'active fw-semibold' : ''}" ${activePage === 'cart' ? 'aria-current="page"' : ''} href="cart.html">
                            <i class="bi bi-cart me-1"></i>Cart
                            <span class="badge bg-primary ms-1" id="cart-badge">0</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${activePage === 'contact' ? 'active fw-semibold' : ''}" ${activePage === 'contact' ? 'aria-current="page"' : ''} href="contact.html">
                            <i class="bi bi-envelope me-1"></i>Contact
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    // Create a navbar placeholder div if it doesn't exist
    let navbarContainer = document.getElementById('navbar-placeholder');
    
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
    } else {
        // If no placeholder exists, prepend to body
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    }
}

// Auto-detect active page from URL
function getActivePage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page.includes('index') || page === '') return 'home';
    if (page.includes('products')) return 'products';
    if (page.includes('cart')) return 'cart';
    if (page.includes('contact')) return 'contact';
    
    return 'home';
}

// Load navbar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadNavbar(getActivePage());
    });
} else {
    loadNavbar(getActivePage());
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadNavbar, getActivePage };
}
