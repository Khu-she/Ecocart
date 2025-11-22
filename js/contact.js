// ===== Contact Form JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initContactAnimations();
    initSocialButtons();
});

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitContactForm(this);
            } else {
                showContactNotification('Please fix the errors and try again.', 'danger');
            }
        });
    }

    // FAQ Accordion enhancement
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = document.createElement('i');
            icon.className = this.classList.contains('collapsed') ? 
                'bi bi-chevron-down ms-auto' : 'bi bi-chevron-up ms-auto';
            
            // Remove existing icons
            const existingIcon = this.querySelector('.bi-chevron-down, .bi-chevron-up');
            if (existingIcon) {
                existingIcon.remove();
            }
            
            this.appendChild(icon);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing feedback
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Validation rules
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
            break;
            
        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
            break;
            
        case 'text':
            if (field.hasAttribute('required') && value.length < 2) {
                isValid = false;
                errorMessage = 'This field must be at least 2 characters long.';
            }
            break;
    }

    // Textarea validation
    if (field.tagName === 'TEXTAREA' && field.hasAttribute('required')) {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }
    }

    // Select validation
    if (field.tagName === 'SELECT' && field.hasAttribute('required')) {
        if (!value || value === '') {
            isValid = false;
            errorMessage = 'Please select an option.';
        }
    }

    // Apply validation classes
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        // Add error message
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = errorMessage;
        field.parentNode.appendChild(feedback);
    }

    return isValid;
}

function submitContactForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Contact form data:', data);
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
        
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Show success message
        showContactNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Optional: redirect after success
        // setTimeout(() => window.location.href = 'index.html', 2000);
        
    }, 2000);
}

function initContactAnimations() {
    // Animate contact items on scroll
    const contactItems = document.querySelectorAll('.contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });

    contactItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Floating label effect
    const formGroups = document.querySelectorAll('.form-group, .mb-3');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        
        if (input && label) {
            input.addEventListener('focus', () => {
                label.style.transform = 'translateY(-10px) scale(0.9)';
                label.style.color = '#d4a373';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = '';
                }
            });
        }
    });
}

function showContactNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.5s ease;
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${getIconForType(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getIconForType(type) {
    const icons = {
        'success': 'check-circle-fill',
        'danger': 'exclamation-triangle-fill',
        'warning': 'exclamation-circle-fill',
        'info': 'info-circle-fill'
    };
    return icons[type] || 'info-circle-fill';
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .form-control:focus + label,
    .form-control:not(:placeholder-shown) + label {
        transform: translateY(-10px) scale(0.9);
        color: #d4a373;
    }
`;
document.head.appendChild(style);

// Social buttons animation
function initSocialButtons() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Success message display
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.classList.add('show');
        
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 300);
        }, 5000);
    }
}
