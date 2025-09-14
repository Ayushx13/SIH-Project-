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
    
    // Location and weather functionality
    const locationInput = document.getElementById('locationInput');
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    const locationSuggestions = document.getElementById('locationSuggestions');
    const weatherInfo = document.getElementById('weatherInfo');
    
    let currentLocationData = null;
    let currentWeatherData = null;
    
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
    
    // Location input functionality
    if (locationInput) {
        // Simple input event listener
        locationInput.addEventListener('input', function(e) {
            console.log('Input event fired, value:', e.target.value);
            const query = e.target.value.trim();
            
            // Clear previous timeout
            if (locationInput.searchTimeout) {
                clearTimeout(locationInput.searchTimeout);
            }
            
            // Set new timeout for debouncing
            locationInput.searchTimeout = setTimeout(() => {
                searchLocations(query);
            }, 300);
        });
        
        // Also add focus event to show suggestions if they exist
        locationInput.addEventListener('focus', function() {
            if (locationSuggestions.children.length > 0 && locationInput.value.length >= 3) {
                locationSuggestions.style.display = 'block';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!locationInput.contains(e.target) && !locationSuggestions.contains(e.target)) {
                locationSuggestions.style.display = 'none';
            }
        });
        
    } else {
        console.error('locationInput element not found!');
    }
    
    // Get current location
    getCurrentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            getCurrentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
            getCurrentLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    getReverseGeocode(lat, lon);
                },
                function(error) {
                    alert('Error getting location: ' + error.message);
                    getCurrentLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Use Current Location';
                    getCurrentLocationBtn.disabled = false;
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
    
    // Search locations using OpenStreetMap Nominatim API
    async function searchLocations(query) {
        console.log('searchLocations called with query:', query);
        
        if (!query || query.length < 3) {
            console.log('Query too short, hiding suggestions');
            if (locationSuggestions) {
                locationSuggestions.style.display = 'none';
            }
            return;
        }
        
        try {
            console.log('Making API request for:', query);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`;
            console.log('Request URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'CropPredictionApp/1.0'
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const locations = await response.json();
            console.log('API response:', locations);
            
            displayLocationSuggestions(locations);
        } catch (error) {
            console.error('Error searching locations:', error);
            // Show error to user
            if (locationSuggestions) {
                locationSuggestions.innerHTML = '<div class="location-suggestion" style="color: red;">Error loading locations. Please try again.</div>';
                locationSuggestions.style.display = 'block';
            }
        }
    }
    
    function displayLocationSuggestions(locations) {
        console.log('displayLocationSuggestions called with:', locations);
        
        if (!locationSuggestions) {
            console.error('locationSuggestions element not found!');
            return;
        }
        
        locationSuggestions.innerHTML = '';
        
        if (!locations || locations.length === 0) {
            console.log('No locations found, hiding suggestions');
            locationSuggestions.innerHTML = '<div class="location-suggestion" style="color: #666;">No locations found</div>';
            locationSuggestions.style.display = 'block';
            setTimeout(() => {
                locationSuggestions.style.display = 'none';
            }, 2000);
            return;
        }
        
        console.log('Creating suggestions for', locations.length, 'locations');
        locations.forEach((location, index) => {
            console.log(`Creating suggestion ${index + 1}:`, location.display_name);
            const suggestion = document.createElement('div');
            suggestion.className = 'location-suggestion';
            suggestion.textContent = location.display_name;
            suggestion.style.cursor = 'pointer';
            suggestion.addEventListener('click', () => {
                console.log('Location selected:', location);
                selectLocation(location);
            });
            locationSuggestions.appendChild(suggestion);
        });
        
        locationSuggestions.style.display = 'block';
        console.log('Suggestions displayed, element style:', locationSuggestions.style.display);
        console.log('Suggestions HTML:', locationSuggestions.innerHTML);
    }
    
    function selectLocation(location) {
        locationInput.value = location.display_name;
        locationSuggestions.style.display = 'none';
        currentLocationData = location;
        
        // Get weather data for the selected location
        getWeatherData(location.lat, location.lon, location.display_name);
    }
    
    // Get reverse geocoding for current location
    async function getReverseGeocode(lat, lon) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const location = await response.json();
            
            locationInput.value = location.display_name;
            currentLocationData = location;
            
            // Get weather data
            getWeatherData(lat, lon, location.display_name);
            
            getCurrentLocationBtn.innerHTML = '<i class="fas fa-check"></i> Location Found';
            setTimeout(() => {
                getCurrentLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Use Current Location';
                getCurrentLocationBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Error getting location name:', error);
            getCurrentLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Use Current Location';
            getCurrentLocationBtn.disabled = false;
        }
    }
    
    // Get weather data using OpenWeatherMap API (you'll need to get a free API key)
    async function getWeatherData(lat, lon, locationName) {
        // For demo purposes, we'll simulate weather data
        // In production, you would use: const API_KEY = 'your_openweathermap_api_key';
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        try {
            // Simulated weather data based on location
            const simulatedWeather = generateSimulatedWeather(lat, lon);
            currentWeatherData = simulatedWeather;
            
            document.getElementById('currentTemp').textContent = `${simulatedWeather.temp}°C`;
            document.getElementById('weatherCondition').textContent = simulatedWeather.condition;
            weatherInfo.style.display = 'block';
            
        } catch (error) {
            console.error('Error getting weather data:', error);
        }
    }
    
    // Generate simulated weather data based on location
    function generateSimulatedWeather(lat, lon) {
        // Simple simulation based on latitude
        let temp, condition;
        
        if (lat > 30) { // Northern regions
            temp = Math.floor(Math.random() * 15) + 5; // 5-20°C
            condition = 'Cool';
        } else if (lat > 20) { // Central regions
            temp = Math.floor(Math.random() * 15) + 20; // 20-35°C
            condition = 'Warm';
        } else { // Southern regions
            temp = Math.floor(Math.random() * 10) + 25; // 25-35°C
            condition = 'Hot';
        }
        
        return { temp, condition };
    }
    
    // Debounce function to limit API calls
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
    
    // Enhanced form submission with location and weather data
    predictionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const soilType = document.getElementById('soilType').value;
        const locationValue = locationInput.value;
        
        // Enhanced validation
        if (!soilType) {
            showValidationError('soilType', 'Please select your soil type');
            return;
        }
        
        if (!locationValue || !currentLocationData) {
            showValidationError('locationInput', 'Please enter a valid location');
            return;
        }
        
        if (!currentWeatherData) {
            showValidationError('locationInput', 'Please wait for weather data to load');
            return;
        }
        
        // Generate prediction with location and weather data
        generatePredictionWithWeather(soilType, currentLocationData, currentWeatherData);
    });
    
    // New prediction button
    newPredictionBtn.addEventListener('click', function() {
        predictionForm.style.display = 'block';
        predictionResult.style.display = 'none';
        predictionForm.reset();
        weatherInfo.style.display = 'none';
        currentLocationData = null;
        currentWeatherData = null;
        
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

// Generate AI prediction based on inputs with weather data
function generatePredictionWithWeather(soilType, locationData, weatherData) {
    // Simulate AI processing
    const loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing conditions with real-time weather data...';
    loadingMessage.style.textAlign = 'center';
    loadingMessage.style.padding = '2rem';
    loadingMessage.style.color = '#4CAF50';
    
    // Show loading
    document.querySelector('.prediction-form').style.display = 'none';
    document.querySelector('.modal-content').appendChild(loadingMessage);
    
    setTimeout(() => {
        loadingMessage.remove();
        
        // Generate recommendations based on inputs including weather
        const prediction = generateWeatherBasedRecommendations(soilType, locationData, weatherData);
        
        // Display results
        document.getElementById('recommendedCrops').textContent = prediction.crops;
        document.getElementById('expectedYield').textContent = prediction.yield;
        document.getElementById('plantingSeason').textContent = prediction.season;
        document.getElementById('irrigationRec').textContent = prediction.irrigation;
        
        document.getElementById('predictionResult').style.display = 'block';
    }, 2000);
}

// Enhanced AI recommendation logic with weather data
function generateWeatherBasedRecommendations(soilType, locationData, weatherData) {
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
    
    // Weather-based adjustments
    const temp = weatherData.temp;
    let tempCategory, tempAdjustments;
    
    if (temp < 15) {
        tempCategory = 'cold';
        tempAdjustments = { season: 'Late Spring to Early Summer', yieldMultiplier: 0.8 };
    } else if (temp < 25) {
        tempCategory = 'moderate';
        tempAdjustments = { season: 'Spring to Fall', yieldMultiplier: 1.2 };
    } else if (temp < 35) {
        tempCategory = 'warm';
        tempAdjustments = { season: 'Year-round cultivation', yieldMultiplier: 1.1 };
    } else {
        tempCategory = 'hot';
        tempAdjustments = { season: 'Early Spring or Late Fall', yieldMultiplier: 0.9 };
    }
    
    // Location-based adjustments (extract state/region from location data)
    const locationName = locationData.display_name.toLowerCase();
    let locationFactor = { yieldBonus: 1.0, specialty: 'Mixed crops' };
    
    if (locationName.includes('punjab')) {
        locationFactor = { yieldBonus: 1.3, specialty: 'Wheat, Rice' };
    } else if (locationName.includes('maharashtra')) {
        locationFactor = { yieldBonus: 1.2, specialty: 'Cotton, Sugarcane' };
    } else if (locationName.includes('gujarat')) {
        locationFactor = { yieldBonus: 1.15, specialty: 'Cotton, Groundnut' };
    } else if (locationName.includes('karnataka')) {
        locationFactor = { yieldBonus: 1.1, specialty: 'Coffee, Ragi' };
    } else if (locationName.includes('tamil nadu')) {
        locationFactor = { yieldBonus: 1.1, specialty: 'Rice, Sugarcane' };
    } else if (locationName.includes('rajasthan')) {
        locationFactor = { yieldBonus: 0.9, specialty: 'Millet, Barley' };
    }
    
    const soilRec = recommendations[soilType] || recommendations.loamy;
    
    // Calculate expected yield with weather data
    const baseYield = 75;
    const expectedYield = Math.round(baseYield * tempAdjustments.yieldMultiplier * locationFactor.yieldBonus);
    
    // Combine recommendations with weather consideration
    let finalCrops = soilRec.crops;
    if (locationFactor.specialty !== 'Mixed crops') {
        const specialtyCrops = locationFactor.specialty.split(', ');
        finalCrops = [...new Set([...specialtyCrops, ...soilRec.crops])];
    }
    
    // Adjust irrigation based on current temperature
    let irrigationAdjustment = soilRec.irrigation;
    if (temp > 30) {
        irrigationAdjustment += ' (Increase frequency due to high temperature)';
    } else if (temp < 15) {
        irrigationAdjustment += ' (Reduce frequency due to cool weather)';
    }
    
    return {
        crops: finalCrops.slice(0, 3).join(', '),
        yield: `${expectedYield}% of optimal yield (Current temp: ${temp}°C)`,
        season: tempAdjustments.season,
        irrigation: irrigationAdjustment
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