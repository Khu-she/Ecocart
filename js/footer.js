// ===== Footer Component JavaScript =====
// This file creates a reusable footer that can be loaded on all pages

function loadFooter() {
    const footerHTML = `
    <footer class="bg-dark text-light py-5 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                    <h5 class="text-primary mb-3">
                        <i class="bi bi-leaf me-2"></i>EcoCart
                    </h5>
                    <p class="text-light">Your trusted partner for sustainable, eco-friendly products. Making the world a better place, one purchase at a time.</p>
                    <div class="d-flex gap-2">
                        <a href="#" class="btn btn-outline-light btn-sm">
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a href="#" class="btn btn-outline-light btn-sm">
                            <i class="bi bi-twitter"></i>
                        </a>
                        <a href="#" class="btn btn-outline-light btn-sm">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a href="#" class="btn btn-outline-light btn-sm">
                            <i class="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>
                <div class="col-lg-2 col-md-6 mb-4">
                    <h6 class="text-uppercase text-primary fw-bold mb-3">Quick Links</h6>
                    <ul class="list-unstyled">
                        <li><a href="index.html" class="text-light text-decoration-none">Home</a></li>
                        <li><a href="products.html" class="text-light text-decoration-none">Products</a></li>
                        <li><a href="cart.html" class="text-light text-decoration-none">Cart</a></li>
                        <li><a href="contact.html" class="text-light text-decoration-none">Contact</a></li>
                    </ul>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                    <h6 class="text-uppercase text-primary fw-bold mb-3">Categories</h6>
                    <ul class="list-unstyled">
                        <li><a href="products.html#decor" class="text-light text-decoration-none">Home Decor</a></li>
                        <li><a href="products.html#accessories" class="text-light text-decoration-none">Accessories</a></li>
                        <li><a href="products.html#gifts" class="text-light text-decoration-none">Gifts</a></li>
                        <li><a href="products.html" class="text-light text-decoration-none">Eco-Friendly</a></li>
                    </ul>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                    <h6 class="text-uppercase text-primary fw-bold mb-3">Newsletter</h6>
                    <p class="text-muted small">Subscribe to get special offers and updates.</p>
                    <div class="input-group">
                        <input type="email" class="form-control" placeholder="Your email" id="newsletter-email">
                        <button class="btn btn-primary" type="button" id="newsletter-btn">
                            <i class="bi bi-envelope"></i>
                        </button>
                    </div>
                </div>
            </div>
            <hr class="my-4">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="text-muted small mb-0">© ${new Date().getFullYear()} EcoCart. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <a href="#" class="text-muted text-decoration-none small me-3">Privacy Policy</a>
                    <a href="#" class="text-muted text-decoration-none small">Terms & Conditions</a>
                </div>
            </div>
        </div>
    </footer>
    `;

    // Create a footer placeholder div if it doesn't exist
    let footerContainer = document.getElementById('footer-placeholder');
    
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    } else {
        // If no placeholder exists, append to body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Add newsletter functionality
    const newsletterBtn = document.getElementById('newsletter-btn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function() {
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                alert(`Thank you for subscribing! We'll send updates to ${email}`);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

// Email validation helper
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadFooter };
}
