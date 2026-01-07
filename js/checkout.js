// Load order data from localStorage
let orderData = null;
let selectedLocation = null;

// Predefined locations on the map
const locations = [
    { id: 1, name: "Campus Cafe", x: 25, y: 30 },
    { id: 2, name: "Student Center", x: 60, y: 45 },
    { id: 3, name: "Library Hub", x: 40, y: 70 },
    { id: 4, name: "Main Building", x: 75, y: 25 }
];

document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
    initializeMap();
    updateOrderDisplay();
});

// Load order data from localStorage
function loadOrderData() {
    const savedOrder = localStorage.getItem('orderData');
    if (savedOrder) {
        try {
            orderData = JSON.parse(savedOrder);
        } catch (e) {
            console.error('Error loading order data:', e);
            orderData = { ingredients: {}, sauces: {} };
        }
    } else {
        // No order data, redirect back to ingredients
        alert('No order found. Please select your ingredients first.');
        window.location.href = 'Ingredients.html';
    }
}

// Initialize map with location markers
function initializeMap() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    locations.forEach(location => {
        const marker = document.createElement('div');
        marker.className = 'location-marker';
        marker.style.left = `${location.x}%`;
        marker.style.top = `${location.y}%`;
        marker.setAttribute('data-location-id', location.id);
        marker.setAttribute('title', location.name);
        
        marker.innerHTML = `
            <div class="marker-icon"></div>
            <div class="marker-label">${location.name}</div>
        `;
        
        marker.addEventListener('click', function() {
            selectLocation(location);
        });
        
        mapPlaceholder.appendChild(marker);
    });
}

// Select a location
function selectLocation(location) {
    selectedLocation = location;
    
    // Remove previous selection
    document.querySelectorAll('.location-marker').forEach(marker => {
        marker.classList.remove('selected');
    });
    
    // Add selected class to clicked marker
    const selectedMarker = document.querySelector(`[data-location-id="${location.id}"]`);
    if (selectedMarker) {
        selectedMarker.classList.add('selected');
    }
    
    // Update display
    updateLocationDisplay();
}

// Update location display
function updateLocationDisplay() {
    let locationDisplay = document.getElementById('selected-location-display');
    
    if (!locationDisplay) {
        // Create location display if it doesn't exist
        locationDisplay = document.createElement('div');
        locationDisplay.id = 'selected-location-display';
        locationDisplay.className = 'selected-location';
        const orderPanel = document.querySelector('.order-panel');
        const actionButtons = document.querySelector('.action-buttons');
        orderPanel.insertBefore(locationDisplay, actionButtons);
    }
    
    if (selectedLocation) {
        locationDisplay.innerHTML = `
            <div class="location-info">
                <i class="fa-solid fa-location-dot"></i>
                <span><strong>Pickup Location:</strong> ${selectedLocation.name}</span>
            </div>
        `;
    } else {
        locationDisplay.innerHTML = `
            <div class="location-info warning">
                <i class="fa-solid fa-location-dot"></i>
                <span>Please select a pickup location on the map</span>
            </div>
        `;
    }
}

// Display order data
function updateOrderDisplay() {
    if (!orderData) return;
    
    // Update ingredients
    const ingredientsContainer = document.getElementById('order-items-container');
    const ingredientsTotal = displayItems(orderData.ingredients, ingredientsContainer);
    
    // Update sauces
    const saucesContainer = document.getElementById('sauce-items-container');
    const saucesTotal = displayItems(orderData.sauces, saucesContainer);
    
    // Update totals
    document.getElementById('bowl-total').textContent = `$${ingredientsTotal.toFixed(2)}`;
    document.getElementById('sauce-total').textContent = `$${saucesTotal.toFixed(2)}`;
    
    // Update grand total if exists
    const grandTotal = ingredientsTotal + saucesTotal;
    const grandTotalElement = document.getElementById('grand-total');
    if (grandTotalElement) {
        grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
    }
    
    // Show location prompt
    updateLocationDisplay();
}

// Display items in a container
function displayItems(items, container) {
    let total = 0;
    
    if (!items || Object.keys(items).length === 0) {
        container.innerHTML = '<p class="empty-message">No items</p>';
        return total;
    }
    
    container.innerHTML = '';
    
    for (const [name, item] of Object.entries(items)) {
        const itemTotal = item.quantity * item.price;
        total += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.quantity}x ${name}</span>
            <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
        `;
        
        container.appendChild(orderItem);
    }
    
    return total;
}

// Handle ORDER button
document.addEventListener('DOMContentLoaded', function() {
    const orderBtn = document.querySelector('.btn-order');
    if (orderBtn) {
        orderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!selectedLocation) {
                alert('Please select a pickup location on the map before ordering.');
                return;
            }
            
            // Save location to localStorage
            localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
            
            // Navigate to confirmation
            window.location.href = 'confirmation.html';
        });
    }
});
