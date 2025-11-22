// ===== Products Page JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
    initProductFilters();
    initProductSearch();
    initPagination();
});

function initProductsPage() {
    // Add product data attributes
    addProductDataAttributes();
    
    // Initialize product interactions
    initProductHovers();
    initAddToCartButtons();
    initWishlistButtons();
    initQuickViewButtons();
    
    // Initialize tooltips
    initializeTooltips();
}

function addProductDataAttributes() {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach((product, index) => {
        const productContainer = product.closest('.col-xl-3, .col-lg-4, .col-md-6');
        const productName = product.querySelector('.card-title').textContent;
        const productPrice = product.querySelector('.text-primary').textContent.replace(/[₹,]/g, '');
        
        // Assign categories based on product names (you can customize this)
        let category = 'accessories';
        if (productName.toLowerCase().includes('basket') || productName.toLowerCase().includes('furniture')) {
            category = 'decor';
        } else if (productName.toLowerCase().includes('soap') || productName.toLowerCase().includes('bottle')) {
            category = 'gifts';
        }
        
        productContainer.setAttribute('data-category', category);
        productContainer.setAttribute('data-price', productPrice);
        productContainer.setAttribute('data-name', productName.toLowerCase());
        
        // Note: Add-to-cart buttons already have data attributes in HTML
        // We don't need to add them dynamically
        
        // Add wishlist button data
        const wishlistBtn = product.querySelector('.btn-light');
        if (wishlistBtn) {
            wishlistBtn.setAttribute('data-wishlist', '');
            wishlistBtn.setAttribute('data-product-id', `product-${index + 1}`);
        }
    });
}

function initProductHovers() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.transition = 'all 0.3s ease';
            
            const image = this.querySelector('.card-img-top');
            if (image) {
                image.style.transform = 'scale(1.05)';
                image.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            
            const image = this.querySelector('.card-img-top');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

function initAddToCartButtons() {
    // Add to cart buttons are handled by main.js initCart()
    // This ensures consistency across all pages
    console.log('Product page add-to-cart buttons ready');
}

function initWishlistButtons() {
    document.querySelectorAll('[data-wishlist]').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const productId = this.getAttribute('data-product-id');
            
            if (icon.classList.contains('bi-heart')) {
                // Add to wishlist
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                this.classList.add('text-danger');
                
                addToWishlist(productId);
                showProductNotification('Added to wishlist!', 'success');
                
                // Animate button
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
            } else {
                // Remove from wishlist
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                this.classList.remove('text-danger');
                
                removeFromWishlist(productId);
                showProductNotification('Removed from wishlist', 'info');
            }
        });
    });
}

function initQuickViewButtons() {
    document.querySelectorAll('.btn-outline-secondary').forEach(button => {
        if (button.querySelector('.bi-eye')) {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.card-title').textContent;
                const productPrice = productCard.querySelector('.text-primary').textContent;
                const productImage = productCard.querySelector('.card-img-top').src;
                const productRating = productCard.querySelector('.text-warning');
                
                showQuickViewModal(productName, productPrice, productImage, productRating);
            });
        }
    });
}

function initProductFilters() {
    // Category filters
    document.querySelectorAll('[name="category"]').forEach(radio => {
        radio.addEventListener('change', function() {
            filterProductsByCategory(this.value);
            updateFilterUI(this);
        });
    });
    
    // Sort dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sortType = this.textContent.trim();
            sortProducts(sortType);
            updateSortUI(this, sortType);
        });
    });
    
    // Price range filter (if you want to add it)
    addPriceRangeFilter();
}

function filterProductsByCategory(category) {
    const productsGrid = document.getElementById('products-grid');
    const products = productsGrid.querySelectorAll('[data-category]');
    let visibleCount = 0;
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = '';
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
                product.style.transition = 'all 0.3s ease';
            }, visibleCount * 50);
            
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
}

function sortProducts(sortType) {
    const container = document.querySelector('.row.g-4');
    const products = Array.from(container.children);
    
    products.sort((a, b) => {
        if (sortType.includes('Price: Low to High')) {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            return priceA - priceB;
        } else if (sortType.includes('Price: High to Low')) {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            return priceB - priceA;
        } else if (sortType.includes('Most Popular')) {
            // Sort by rating (simulate)
            return Math.random() - 0.5;
        } else if (sortType.includes('Newest First')) {
            // Sort by index (simulate newest)
            return Math.random() - 0.5;
        }
        return 0;
    });
    
    // Re-append sorted products with animation
    products.forEach((product, index) => {
        product.style.opacity = '0';
        setTimeout(() => {
            container.appendChild(product);
            product.style.opacity = '1';
            product.style.transition = 'opacity 0.3s ease';
        }, index * 50);
    });
}

function initProductSearch() {
    // Add search functionality to existing search input
    const searchInput = document.getElementById('product-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchProducts(this.value.trim().toLowerCase());
        }, 300));
    }
}

function searchProducts(searchTerm) {
    const productsGrid = document.getElementById('products-grid');
    const products = productsGrid.querySelectorAll('[data-category]');
    let visibleCount = 0;
    
    products.forEach(product => {
        const productCard = product.querySelector('.card-title');
        const productName = productCard ? productCard.textContent.toLowerCase() : '';
        
        if (searchTerm === '' || productName.includes(searchTerm)) {
            product.style.display = '';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount === 0);
}

function addPriceRangeFilter() {
    const filterSection = document.querySelector('.container.my-4 .row');
    
    if (filterSection && !document.querySelector('.price-filter')) {
        const priceFilter = document.createElement('div');
        priceFilter.className = 'col-12 mt-3 price-filter';
        priceFilter.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Price Range</h6>
                    <div class="row align-items-center">
                        <div class="col-4">
                            <input type="range" class="form-range" id="minPrice" min="0" max="1000" value="0" step="50">
                            <label for="minPrice" class="form-label small">Min: ₹<span id="minPriceValue">0</span></label>
                        </div>
                        <div class="col-4">
                            <input type="range" class="form-range" id="maxPrice" min="0" max="1000" value="1000" step="50">
                            <label for="maxPrice" class="form-label small">Max: ₹<span id="maxPriceValue">1000</span></label>
                        </div>
                        <div class="col-4">
                            <button class="btn btn-sm btn-primary" onclick="filterByPrice()">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        filterSection.appendChild(priceFilter);
        
        // Add price range listeners
        document.getElementById('minPrice').addEventListener('input', function() {
            document.getElementById('minPriceValue').textContent = this.value;
        });
        
        document.getElementById('maxPrice').addEventListener('input', function() {
            document.getElementById('maxPriceValue').textContent = this.value;
        });
    }
}

function filterByPrice() {
    const minPrice = parseInt(document.getElementById('minPrice').value);
    const maxPrice = parseInt(document.getElementById('maxPrice').value);
    const productsGrid = document.getElementById('products-grid');
    const products = productsGrid.querySelectorAll('[data-category]');
    let visibleCount = 0;
    
    products.forEach(product => {
        const priceElement = product.querySelector('.text-primary');
        const priceText = priceElement ? priceElement.textContent.replace('₹', '').trim() : '0';
        const productPrice = parseInt(priceText);
        
        if (productPrice >= minPrice && productPrice <= maxPrice) {
            product.style.display = '';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
}

function initPagination() {
    const paginationItems = document.querySelectorAll('.page-item');
    
    paginationItems.forEach(item => {
        const link = item.querySelector('.page-link');
        if (link && !item.classList.contains('disabled')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all items
                paginationItems.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked item
                if (!link.querySelector('.bi-chevron-left, .bi-chevron-right')) {
                    item.classList.add('active');
                }
                
                // Scroll to top with animation
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                showProductNotification(`Loading page ${link.textContent}...`, 'info');
            });
        }
    });
}

// Utility Functions
function showQuickViewModal(name, price, image, rating) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Quick View</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${image}" class="img-fluid rounded" alt="${name}">
                        </div>
                        <div class="col-md-6">
                            <h4>${name}</h4>
                            <div class="mb-3">${rating ? rating.outerHTML : ''}</div>
                            <p class="text-muted">Eco-friendly and sustainable product made with care for the environment. Perfect for conscious consumers who want to make a positive impact.</p>
                            <h5 class="text-primary mb-3">${price}</h5>
                            <div class="mb-3">
                                <label class="form-label">Quantity:</label>
                                <div class="input-group" style="width: 120px;">
                                    <button class="btn btn-outline-secondary" type="button">-</button>
                                    <input type="number" class="form-control text-center" value="1" min="1">
                                    <button class="btn btn-outline-secondary" type="button">+</button>
                                </div>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary">Add to Cart</button>
                                <button class="btn btn-outline-secondary">Add to Wishlist</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

function updateFilterUI(activeRadio) {
    document.querySelectorAll('[name="category"]').forEach(radio => {
        const label = radio.nextElementSibling;
        if (radio === activeRadio) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

function updateSortUI(activeItem, sortType) {
    const dropdownButton = document.getElementById('sortDropdown');
    if (dropdownButton) {
        dropdownButton.innerHTML = `<i class="bi bi-sort-down me-1"></i>${sortType}`;
    }
}

function updateResultsCount(count) {
    let resultsElement = document.querySelector('.results-count');
    if (!resultsElement) {
        resultsElement = document.createElement('div');
        resultsElement.className = 'results-count text-muted small mb-3';
        const container = document.querySelector('.container .row.g-4').parentNode;
        container.insertBefore(resultsElement, container.querySelector('.row.g-4'));
    }
    
    resultsElement.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
}

function showNoResultsMessage(show) {
    let noResultsElement = document.querySelector('.no-results');
    
    if (show && !noResultsElement) {
        noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results col-12 text-center py-5';
        noResultsElement.innerHTML = `
            <i class="bi bi-search display-1 text-muted mb-3"></i>
            <h4>No products found</h4>
            <p class="text-muted">Try adjusting your filters or search terms</p>
        `;
        
        const container = document.querySelector('.row.g-4');
        container.appendChild(noResultsElement);
    } else if (!show && noResultsElement) {
        noResultsElement.remove();
    }
}

function clearSearch() {
    const searchInput = document.querySelector('[data-search]');
    if (searchInput) {
        searchInput.value = '';
        searchProducts('');
    }
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function showProductNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close ms-2" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    notification.querySelector('.btn-close').addEventListener('click', () => {
        notification.remove();
    });
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions available globally
window.filterByPrice = filterByPrice;
window.clearSearch = clearSearch;
