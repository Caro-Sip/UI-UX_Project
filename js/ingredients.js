// Order management system
const orderState = {
    ingredients: {}, // Store ingredients (meat & vegetables)
    sauces: {}       // Store sauces separately
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeIngredientSelection();
    updateOrderDisplay();
});

// Set up click handlers for all ingredient items
function initializeIngredientSelection() {
    const allItems = document.querySelectorAll('.item[data-name]');
    
    allItems.forEach(item => {
        item.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const category = this.getAttribute('data-category');
            
            // Add visual feedback
            this.classList.add('selected-flash');
            setTimeout(() => {
                this.classList.remove('selected-flash');
            }, 300);
            
            // Add to appropriate category
            if (category === 'sauce') {
                addToOrder(name, price, 'sauces');
            } else {
                addToOrder(name, price, 'ingredients');
            }
            
            updateOrderDisplay();
        });
    });
}

// Add item to order
function addToOrder(name, price, category) {
    if (orderState[category][name]) {
        // Item already exists, increase quantity
        orderState[category][name].quantity += 1;
    } else {
        // New item
        orderState[category][name] = {
            quantity: 1,
            price: price
        };
    }
}

// Update the entire order display
function updateOrderDisplay() {
    updateIngredientsList();
    updateSaucesList();
    updateTotals();
}

// Update ingredients list in the order panel
function updateIngredientsList() {
    const container = document.getElementById('order-items-container');
    
    if (Object.keys(orderState.ingredients).length === 0) {
        container.innerHTML = '<p class="empty-message">Click on ingredients to add them to your bowl!</p>';
        return;
    }
    
    container.innerHTML = '';
    
    for (const [name, item] of Object.entries(orderState.ingredients)) {
        const orderItem = createOrderItemElement(name, item, 'ingredients');
        container.appendChild(orderItem);
    }
}

// Update sauces list in the order panel
function updateSaucesList() {
    const container = document.getElementById('sauce-items-container');
    
    if (Object.keys(orderState.sauces).length === 0) {
        container.innerHTML = '<p class="empty-message">Add your favorite sauces!</p>';
        return;
    }
    
    container.innerHTML = '';
    
    for (const [name, item] of Object.entries(orderState.sauces)) {
        const orderItem = createOrderItemElement(name, item, 'sauces');
        container.appendChild(orderItem);
    }
}

// Create an order item DOM element
function createOrderItemElement(name, item, category) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    const itemPrice = item.quantity * item.price;
    
    orderItem.innerHTML = `
        <div class="order-item-left">
            <span>${item.quantity}x ${name}</span>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="decreaseQuantity('${name}', '${category}')">-</button>
                <button class="qty-btn" onclick="increaseQuantity('${name}', '${category}')">+</button>
            </div>
        </div>
        <div class="order-item-price">$${itemPrice.toFixed(2)}</div>
    `;
    
    return orderItem;
}

// Increase quantity of an item
function increaseQuantity(name, category) {
    if (orderState[category][name]) {
        orderState[category][name].quantity += 1;
        updateOrderDisplay();
    }
}

// Decrease quantity of an item
function decreaseQuantity(name, category) {
    if (orderState[category][name]) {
        orderState[category][name].quantity -= 1;
        
        // Remove item if quantity reaches 0
        if (orderState[category][name].quantity <= 0) {
            delete orderState[category][name];
        }
        
        updateOrderDisplay();
    }
}

// Calculate and update totals
function updateTotals() {
    // Calculate ingredients total
    let ingredientsTotal = 0;
    for (const item of Object.values(orderState.ingredients)) {
        ingredientsTotal += item.quantity * item.price;
    }
    
    // Calculate sauces total
    let saucesTotal = 0;
    for (const item of Object.values(orderState.sauces)) {
        saucesTotal += item.quantity * item.price;
    }
    
    // Update display
    document.getElementById('bowl-total').textContent = `$${ingredientsTotal.toFixed(2)}`;
    document.getElementById('sauce-total').textContent = `$${saucesTotal.toFixed(2)}`;
}

// Handle "Another Bowl" button
document.addEventListener('DOMContentLoaded', function() {
    const anotherBowlBtn = document.querySelector('.btn-another');
    if (anotherBowlBtn) {
        anotherBowlBtn.addEventListener('click', function() {
            if (confirm('Start a new bowl? This will clear your current selection.')) {
                // Reset order state
                orderState.ingredients = {};
                orderState.sauces = {};
                updateOrderDisplay();
            }
        });
    }
});
