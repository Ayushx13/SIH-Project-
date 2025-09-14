// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('nav-menu-active');
        navToggle.classList.toggle('nav-toggle-active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-menu-active');
            navToggle.classList.remove('nav-toggle-active');
        });
    });
});

// Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('predictionModal');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const predictionForm = document.getElementById('predictionForm');
    const predictionResult = document.getElementById('predictionResult');
    const newPredictionBtn = document.getElementById('newPredictionBtn');
    
    // Enhanced dropdown interactions
    const dropdowns = document.querySelectorAll('.form-group select');
    
    dropdowns.forEach(dropdown => {
        // Add focus animation
        dropdown.addEventListener('focus', function() {
            this.parentElement.parentElement.classList.add('focused');
        });
        
        dropdown.addEventListener('blur', function() {
            this.parentElement.parentElement.classList.remove('focused');
        });
        
        // Add selection animation
        dropdown.addEventListener('change', function() {
            this.classList.add('selected');
            
            // Add success checkmark animation
            const label = this.parentElement.parentElement.querySelector('label');
            if (!label.querySelector('.checkmark')) {
                const checkmark = document.createElement('i');
                checkmark.className = 'fas fa-check checkmark';
                checkmark.style.color = '#4CAF50';
                checkmark.style.marginLeft = '8px';
                checkmark.style.opacity = '0';
                checkmark.style.transform = 'scale(0)';
                checkmark.style.transition = 'all 0.3s ease';
                label.appendChild(checkmark);
                
                setTimeout(() => {
                    checkmark.style.opacity = '1';
                    checkmark.style.transform = 'scale(1)';
                }, 100);
            }
        });
    });
    
    // Open modal
    getStartedBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus first dropdown after modal opens
        setTimeout(() => {
            document.getElementById('soilType').focus();
        }, 300);
    });
    
    // Close modal functions
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        predictionForm.style.display = 'block';
        predictionResult.style.display = 'none';
        predictionForm.reset();
        
        // Reset form styling
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('selected');
            const checkmark = dropdown.parentElement.parentElement.querySelector('.checkmark');
            if (checkmark) {
                checkmark.remove();
            }
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Enhanced form submission with better validation
    predictionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const soilType = document.getElementById('soilType').value;
        const temperature = document.getElementById('temperature').value;
        const location = document.getElementById('location').value;
        
        // Enhanced validation with specific messages
        if (!soilType) {
            showValidationError('soilType', 'Please select your soil type');
            return;
        }
        
        if (!temperature) {
            showValidationError('temperature', 'Please select temperature range');
            return;
        }
        
        if (!location) {
            showValidationError('location', 'Please select your location');
            return;
        }
        
        // Generate prediction based on inputs
        generatePrediction(soilType, temperature, location);
    });
    
    // New prediction button
    newPredictionBtn.addEventListener('click', function() {
        predictionForm.style.display = 'block';
        predictionResult.style.display = 'none';
        predictionForm.reset();
        
        // Reset form styling
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('selected');
            const checkmark = dropdown.parentElement.parentElement.querySelector('.checkmark');
            if (checkmark) {
                checkmark.remove();
            }
        });
    });
});

// Enhanced validation error display
function showValidationError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.parentElement.parentElement;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.style.opacity = '0';
    errorDiv.style.transform = 'translateY(-10px)';
    errorDiv.style.transition = 'all 0.3s ease';
    
    formGroup.appendChild(errorDiv);
    
    // Animate error message
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Focus the field
    field.focus();
    
    // Remove error after interaction
    field.addEventListener('change', function() {
        if (errorDiv) {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, { once: true });
}

// Generate AI prediction based on inputs
function generatePrediction(soilType, temperature, location) {
    // Simulate AI processing
    const loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing conditions...';
    loadingMessage.style.textAlign = 'center';
    loadingMessage.style.padding = '2rem';
    loadingMessage.style.color = '#4CAF50';
    
    // Show loading
    document.querySelector('.prediction-form').style.display = 'none';
    document.querySelector('.modal-content').appendChild(loadingMessage);
    
    setTimeout(() => {
        loadingMessage.remove();
        
        // Generate recommendations based on inputs
        const prediction = generateRecommendations(soilType, temperature, location);
        
        // Display results
        document.getElementById('recommendedCrops').textContent = prediction.crops;
        document.getElementById('expectedYield').textContent = prediction.yield;
        document.getElementById('plantingSeason').textContent = prediction.season;
        document.getElementById('irrigationRec').textContent = prediction.irrigation;
        
        document.getElementById('predictionResult').style.display = 'block';
    }, 2000);
}

// AI recommendation logic
function generateRecommendations(soilType, temperature, location) {
    const recommendations = {
        // Soil-based recommendations
        sandy: {
            crops: ['Groundnut', 'Millet', 'Watermelon'],
            irrigation: 'Frequent light watering'
        },
        clay: {
            crops: ['Rice', 'Wheat', 'Cotton'],
            irrigation: 'Deep, less frequent watering'
        },
        loamy: {
            crops: ['Tomato', 'Corn', 'Soybean'],
            irrigation: 'Balanced watering schedule'
        },
        silt: {
            crops: ['Lettuce', 'Cabbage', 'Potato'],
            irrigation: 'Moderate watering'
        },
        peaty: {
            crops: ['Carrot', 'Onion', 'Celery'],
            irrigation: 'Well-drained watering'
        },
        chalky: {
            crops: ['Barley', 'Spinach', 'Brassicas'],
            irrigation: 'Regular moderate watering'
        }
    };
    
    // Temperature-based adjustments
    const tempAdjustments = {
        cold: { season: 'Late Spring to Early Summer', yieldMultiplier: 0.8 },
        moderate: { season: 'Spring to Fall', yieldMultiplier: 1.2 },
        warm: { season: 'Year-round cultivation', yieldMultiplier: 1.1 },
        hot: { season: 'Early Spring or Late Fall', yieldMultiplier: 0.9 }
    };
    
    // Location-based adjustments
    const locationFactors = {
        'punjab': { yieldBonus: 1.3, specialty: 'Wheat, Rice' },
        'maharashtra': { yieldBonus: 1.2, specialty: 'Cotton, Sugarcane' },
        'uttar-pradesh': { yieldBonus: 1.25, specialty: 'Wheat, Rice' },
        'gujarat': { yieldBonus: 1.15, specialty: 'Cotton, Groundnut' },
        'karnataka': { yieldBonus: 1.1, specialty: 'Coffee, Ragi' },
        'tamil-nadu': { yieldBonus: 1.1, specialty: 'Rice, Sugarcane' },
        'andhra-pradesh': { yieldBonus: 1.15, specialty: 'Rice, Cotton' },
        'rajasthan': { yieldBonus: 0.9, specialty: 'Millet, Barley' }
    };
    
    const soilRec = recommendations[soilType] || recommendations.loamy;
    const tempRec = tempAdjustments[temperature] || tempAdjustments.moderate;
    const locationFactor = locationFactors[location] || { yieldBonus: 1.0, specialty: 'Mixed crops' };
    
    // Calculate expected yield
    const baseYield = 75; // Base yield percentage
    const expectedYield = Math.round(baseYield * tempRec.yieldMultiplier * locationFactor.yieldBonus);
    
    // Combine recommendations
    let finalCrops = soilRec.crops;
    if (locationFactor.specialty !== 'Mixed crops') {
        const specialtyCrops = locationFactor.specialty.split(', ');
        finalCrops = [...new Set([...specialtyCrops, ...soilRec.crops])];
    }
    
    return {
        crops: finalCrops.slice(0, 3).join(', '),
        yield: `${expectedYield}% of optimal yield`,
        season: tempRec.season,
        irrigation: soilRec.irrigation
    };
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Contact Form Handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate form submission
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .stat');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Add initial styles for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .stat');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Interactive buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});