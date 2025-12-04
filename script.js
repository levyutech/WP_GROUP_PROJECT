// Javascript Functionality
/* Group Members:
    Lorri-Ann Levy: 2407726
*/

// Question 1: User Authentification











//Question 2: Product Catalogue

/* PRODUCT ARRAY */

//a) Create an array of product objects in JavaScript
const set_Products = [
    //Bath and Shower Products
   {
        name: "Lavender Bath and Body Oil",
        price:  2500.99,
        description: "Pure Lavender Body Oil in violet glass with dropper. 100% natural, deeply hydrating, and calming. Perfect for skin, massage, or bath. 1 fl oz.",
        image: "Images/Bath oil.jpg"
    },
    {
        name: "Golden Hour Turmeric Scrub",
        price: 1200.20,
        description: "Turmeric Glow Body Scrub in glass jar. Natural exfoliating sugar with turmeric, oils, and warm spice. Brightens, smooths, and nourishes skin. 4 oz.",
        image: "Images/tumeric scrub.jpg"
    },
    {
        name: "Soy Milk & Rice Body Cleanser Set",
        price: 1000.99,
        description: "Fresh Soy Milk & Rice Body Set: gentle cleanser (260ml), nourishing lotion (260ml), and soy face cleanser (150ml). Plant-based, soothing, hydrating.",
        image: "Images/body wash.jpg"
    },

    //Skincare and Facial Products
    {
        name: "Bubble Relaxing Facial Cleansing Oil",
        price: 1300.55,
        description: "ZEESEA Bubble Relaxing Cleansing Oil in pump bottle. Foamy, gentle makeup remover with calming marine scent. 185ml.",
        image: "Images/face.jpg"
    },
    {
        name: "Watermelon Glow Sleeping Mask",
        price: 1200.55,
        description: "Glow Recipe Watermelon Glow Sleeping Mask in glass jar. Hydrating, radiance-boosting overnight treatment. 80ml.",
        image: "Images/face mask.jpg"
    },
    {
        name: "Dr. Pepti Peptide Volume Waterglow Serum",
        price: 1000.00,
        description: "Dr. Pepti Peptide Volume Waterglow Serum in pump bottle. Hydrating, plumping, glow-boosting peptides. 50ml.",
        image: "Images/face serum.jpg"
    },

    //Hand and Foot Care Products

    {
        name: "HAAN Hand Cream Collection",
        price: 1000.20,
        description: "HAAN Hand Cream Trio: Coco Cooler, Fig Fizz, Carrot Kick. 96% natural, prebiotic-rich, fast-absorbing. 50ml each.",
        image: "Images/hand cream collection.jpg"
    },
    {
        name: "LondonTown Nature Blend",
        price: 850.00,
        description: "LondonTown Nature Blend Foot Scrub in tube. Natural exfoliant, invigorating treat for tired feet. 4.2 oz / 120 g.",
        image: "Images/foot scrub.jpg"
    },
    {
        name: "Hyda Spa Foot Bath Massager",
        price: 14880.95,
        description: "Hyda Spa Foot Bath Massager with digital controls, heated water, and pumice stone. Soothes, relaxes, and rejuvenates tired feet.",
        image: "../Assets/coconutscrub.jpg"
    },

    //Deodorant & Antiperspirant Products
    {
        name: "Respire",
        price: 500.00,
        description: "Respire Natural Deodorant Roll-On. Orange Blossom scent, 100% natural, aluminum-free. 50ml.",
        image: "Images/deoderant.jpg"
    },
    {
        name: "Disco",
        price: 600.25,
        description: "Disco Eucalyptus Deodorant Stick. Natural, aluminum-free, refreshing scent. 2.5 oz (71 g).",
        image: "Images/euc. deoderant.jpg"
    },
    {
        name: "Modern Botany",
        price: 540.99,
        description: "Modern Botany Natural Deodorant Spray. Gentle, plant-based, sensitive-skin friendly. 100ml.",
        image: "Images/mist deoderant.jpg"
    },

    //Fragrance Products
    {
        name: "Lily of the Valley Perfume Oil",
        price: 350.00,
        description: "Sopranolabs Lily of the Valley Perfume Oil. Clean, vegan roll-on in coconut oil. 10ml.",
        image: "Images/lily of the valley fragrance.jpg"
    },
    {
        name: "Lavender Esscence",
        price: 400.90,
        description: "Floral Collection Lavender Eau de Toilette. Fresh, calming lavender scent. 100ml.",
        image: "Images/lavender fragrance.jpg"
    },
    {
        name: "Haute Sauce - Strawberry Glaze Edible Fragrance",
        price: 578.99,
        description: "Haute Sauce Strawberry Glaze Edible Fragrance. Sweet, dessert-inspired scent with natural oils. 50ml.",
        image: "Images/strawberry scent.jpg"
    },
    {
        name: "Haute Sauce - Vanilla Coco Edible Fragrance",
        price: 530.99,
        description: "Haute Sauce Vanilla Coco Edible Fragrance. Creamy vanilla-coconut scent with natural oils. 50ml.",
        image: "Images/coconut fragrance.jpg"
    },

];

//Question 2.b) An updated product list must be kept on localStorage, as AllProducts. 
// Save products to localStorage ONLY if it doesn't exist
if (!localStorage.getItem("AllProducts")) {
    localStorage.setItem("AllProducts", JSON.stringify(set_Products));
}

// Load saved product list
const products = JSON.parse(localStorage.getItem("AllProducts"));

/* DYNAMIC PRODUCT DISPLAY */

function loadProducts() {
    const container = document.getElementById("productList");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>US $${product.price.toFixed(2)}</p>
                
                <button class="add-to-cart" 
                        data-name="${product.name}" 
                        data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

//Cart Page

//Cart Functionality
    let cart = JSON.parse(localStorage.getItem('spaCart')) || {};

// Add to Cart Function
    function addToCart(productId) 
    {
        if (cart[productId]) // If product already in cart
            {
                cart[productId].quantity += 1; // Increase quantity
    } else {
            cart[productId] = { // New product added to cart
            product: products[productId],
            quantity: 1 // Initial quantity
        };
    }

// Save to localStorage
    localStorage.setItem('spaCart', JSON.stringify(cart));

// Update cart counter
    updateCartCounter();

// Show confirmation
    alert(`${products[productId].name} added to cart!`);
    
// Update cart display if on cart page
    if (document.getElementById('cart') || document.getElementById('checkout')) //Check if the user is on the cart or checkout page
        {

            updateCartDisplay(); // Refresh cart display

        }
    }

// Update Cart Display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some spa products to get started!</p>
                    <button class="btn" onclick="window.location.href='Products.html'" style="margin-top: 1rem;">Browse Products</button>
                </div>
            `;
        } else {
            for (const productId in cart) {
                const item = cart[productId];
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.product.image}" alt="${item.product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='${item.product.name}';">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.product.name}</div>
                        <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${productId}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${productId}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div>
                        <div class="cart-item-price">$${(item.product.price * item.quantity).toFixed(2)}</div>
                        <button class="btn" onclick="removeFromCart(${productId})" style="margin-top: 0.5rem;">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            }
        }
    }
    
    updateCartTotals();
}
// Update Quantity
    function updateQuantity(productId, newQuantity) 
    {
        if (newQuantity <= 0) // If quantity is zero or less, remove item
            {
                removeFromCart(productId); // Call remove function
    } else {
        cart[productId].quantity = newQuantity; // Update quantity
        localStorage.setItem('spaCart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCounter();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    delete cart[productId];
    localStorage.setItem('spaCart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCounter();
    alert('Item removed from cart'); 
}

// Clear Cart
function clearCart() {
    cart = {};
    localStorage.setItem('spaCart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCounter();
    alert('Cart cleared successfully.');
}

// Update Cart Counter
function updateCartCounter() {
    let totalItems = 0;
    for (const productId in cart) {
        totalItems += cart[productId].quantity;
    }
    
    // Update cart counter in navigation
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
}

// Calculate Cart Totals
function calculateCartTotal() {
    let subtotal = 0;
    
    for (const productId in cart) {
        const item = cart[productId];
        subtotal += item.product.price * item.quantity;
    }
    
    const discount = subtotal * 0.1; // 10% discount
    const tax = (subtotal - discount) * 0.15; // 15% tax on discounted amount
    const total = subtotal - discount + tax;
    
    return {
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total
    };
}

// Update Cart Totals Display
function updateCartTotals() 
{
    const totals = calculateCartTotal();
    
    // Update cart page totals
    const subtotalElement = document.getElementById('subtotal');

    const discountElement = document.getElementById('discount');

    const taxElement = document.getElementById('tax');

    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${totals.subtotal.toFixed(2)}`; 

    if (discountElement) discountElement.textContent = `$${totals.discount.toFixed(2)}`;

    if (taxElement) taxElement.textContent = `$${totals.tax.toFixed(2)}`;

    if (totalElement) totalElement.textContent = `$${totals.total.toFixed(2)}`;
}

// Initialize Cart on Page Load
document.addEventListener('DOMContentLoaded', function() 
{
    updateCartCounter();
    
    // Update cart display if on cart page
    if (document.getElementById('cartItems')) {
        updateCartDisplay();
    }
});


//Checkout Page
// Checkout Functionality

document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkoutForm'); // Get checkout form element
    if (checkoutForm) { // If on checkout page
        checkoutForm.addEventListener('submit', confirmCheckout); // Attach submit event listener

        updateCheckoutDisplay();
        updateCartCounter();

        // Auto-fill payment amount
        const totals = calculateCartTotal();
        const paymentInput = document.getElementById('paymentAmount');
        if (paymentInput) paymentInput.value = totals.total.toFixed(2);
    }
});

// Confirm Checkout
function confirmCheckout(e) {
    e.preventDefault();

    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let valid = true; // Assume valid until checks fail

    
    // Get form values

    const firstName = document.getElementById('checkoutfirstName').value.trim(); // Trim whitespace
    const lastName  = document.getElementById('checkoutlastName').value.trim();
    const email     = document.getElementById('checkoutEmail').value.trim();
    const address   = document.getElementById('checkoutAddress').value.trim();
    const city      = document.getElementById('checkoutCity').value.trim();
    const zipCode   = document.getElementById('checkoutZipCode').value.trim();
    const payment = Number(document.getElementById('paymentAmount').value) || 0;

    // Validate inputs
    if (!firstName) { document.getElementById('checkoutfirstNameError').textContent = 'First name is required'; valid = false; }
    if (!lastName)  { document.getElementById('checkoutlastNameError').textContent  = 'Last name is required'; valid = false; }
    if (!email || !email.includes('@') || !email.includes('.')) {
        document.getElementById('checkoutEmailError').textContent = 'Please enter a valid email'; valid = false;
    }
    if (!address)   { document.getElementById('checkoutAddressError').textContent = 'Address is required'; valid = false; }
    if (!city)      { document.getElementById('checkoutCityError').textContent = 'City is required'; valid = false; }
    if (!zipCode)   { document.getElementById('checkoutZipCodeError').textContent = 'Zip code is required'; valid = false; }
    if (isNaN(payment) || payment <= 0) { // Invalid payment amount
        document.getElementById('paymentAmountError').textContent = 'Enter a valid payment amount'; valid = false;
    }

    // Cart empty check
    if (Object.keys(cart).length === 0) { // If cart is empty
        alert('Your cart is empty!'); // Alert message
        return;
    }

    // Payment too low
    const total = calculateCartTotal().total;

if (payment < total - 0.01) {   // allows being 1 cent short due to rounding
    document.getElementById('paymentAmountError').textContent = `Payment must be at least $${total.toFixed(2)}`; //Error Message
    valid = false;
}

    // Successful checkout
    if (valid) {
        document.getElementById('orderSuccess').style.display = 'block'; // Show success message only when order is successful
        clearCart(); // Clear cart after successful checkout
        setTimeout(() => window.location.href = 'index.html', 30000); // Redirect after 30 seconds
    }
}

// Update Checkout Display
function updateCheckoutDisplay() {
    const container = document.querySelector('.checkout-items'); // Container for checkout items
    if (!container) return; // Exit if container not found

    container.innerHTML = ''; // Clear existing content

    if (Object.keys(cart).length === 0) { // If cart is empty
        container.innerHTML = '<p style="text-align:center; padding:2rem;">Your cart is empty</p>'; // Display empty message
    } else {
        for (const id in cart) { // Loop through cart items
            const item = cart[id];
            container.innerHTML += `
               <div class="checkout-item">
                    <div style="background-image:url('${item.product.image}'); background-size:cover; width:60px; height:60px; border-radius:8px;"></div>
                    <div style="margin-left:15px; flex-grow:1;">
                        <strong>${item.product.name}</strong><br>
                        Qty: ${item.quantity} × $${item.product.price.toFixed(2)}
                    </div>
                    <strong>$${(item.product.price * item.quantity).toFixed(2)}</strong>
                </div>
            `;// End of checkout item layout
        }
    }

    const t = calculateCartTotal(); // Get totals

    // Update totals display
    document.getElementById('checkoutSubtotal').textContent = `$${t.subtotal.toFixed(2)}`;
    document.getElementById('checkoutDiscount').textContent = `$${t.discount.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$${t.tax.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${t.total.toFixed(2)}`;
}












// Question 5: Invoice Generation

// Function to generate and save invoice after successful checkout
// Call this inside confirmCheckout() in script.js after validation
function generateInvoice(checkoutData) {
    const cart = JSON.parse(localStorage.getItem('spaCart')) || {};
    if (Object.keys(cart).length === 0) return null;

    // Calculate totals
    let subtotal = 0;
    const items = [];
    for (const id in cart) {
        const item = cart[id];
        subtotal += item.product.price * item.quantity;
        items.push({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        });
    }
    const discount = subtotal * 0.10; // 10%
    const tax = (subtotal - discount) * 0.15; // 15% on discounted amount
    const total = subtotal - discount + tax;

    // Create unique invoice number
    const invoiceNumber = 'INV-' + Date.now();

    // Build invoice object (Task 5.a)
    const invoice = {
        invoiceNumber: invoiceNumber,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        trn: checkoutData.trn,
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        email: checkoutData.email,
        address: checkoutData.address,
        city: checkoutData.city,
        items: items,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total
    };

    // Task 5.b: Save to global AllInvoices
    let allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    allInvoices.push(invoice);
    localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));

    // Task 5.b: Save to user's RegistrationData record
    let registrations = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const userIndex = registrations.findIndex(user => user.trn === checkoutData.trn);
    if (userIndex !== -1) {
        if (!registrations[userIndex].invoices) {
            registrations[userIndex].invoices = [];
        }
        registrations[userIndex].invoices.push(invoice);
        localStorage.setItem('RegistrationData', JSON.stringify(registrations));
    }

    // Save as latest for invoice.html
    localStorage.setItem('latestInvoice', JSON.stringify(invoice));

    return invoice;
}

// Display invoice on invoice.html (Task 5.a + 5.c)
function displayInvoice() {
    const invoice = JSON.parse(localStorage.getItem('latestInvoice'));
    const container = document.getElementById('invoice-content');
    if (!invoice) {
        container.innerHTML = '<p>No invoice found. Please complete a checkout first.</p>';
        return;
    }

    // Build items table rows
    let itemsHtml = '';
    invoice.items.forEach(item => {
        const lineTotal = (item.price * item.quantity).toFixed(2);
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${lineTotal}</td>
            </tr>
        `;
    });

    // Build full invoice HTML
    const html = `
        <div>
            <h2>Lily of the Valley Spa</h2>
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${invoice.date}</p>
            <p><strong>TRN:</strong> ${invoice.trn}</p>

            <h3>Shipping Information</h3>
            <p>${invoice.firstName} ${invoice.lastName}</p>
            <p>${invoice.address}, ${invoice.city}</p>
            <p>${invoice.email}</p>

            <h3>Purchased Items</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div>
                <p><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</p>
                <p><strong>Discount (10%):</strong> -$${invoice.discount.toFixed(2)}</p>
                <p><strong>Tax (15%):</strong> $${invoice.tax.toFixed(2)}</p>
                <h3>Total: $${invoice.total.toFixed(2)}</h3>
            </div>

            <p>A copy of this invoice has been sent to <strong>${invoice.email}</strong>.</p>
        </div>
    `;
    container.innerHTML = html;
}

// Auto-run on invoice.html
if (document.getElementById('invoice-content')) {
    displayInvoice();
}

//Additional Functionality

// 6.a: Show User Frequency (Gender & Age Group)
function ShowUserFrequency() {
    const registrations = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    const genderCount = { Male: 0, Female: 0, Other: 0 };
    const ageGroups = { '18-25': 0, '26-35': 0, '36-50': 0, '50+': 0 };

    registrations.forEach(user => {
        // Gender
        const g = user.gender || 'Other';
        if (genderCount[g] !== undefined) genderCount[g]++;
        else genderCount['Other']++;

        // Age
        const dob = new Date(user.dob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (today.getMonth() < dob.getMonth() || 
           (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age >= 18 && age <= 25) ageGroups['18-25']++;
        else if (age <= 35) ageGroups['26-35']++;
        else if (age <= 50) ageGroups['36-50']++;
        else if (age > 50) ageGroups['50+']++;
    });

    // Render Gender Chart
    let genderHTML = '';
    for (const [label, count] of Object.entries(genderCount)) {
        const width = count > 0 ? Math.max(50, count * 40) : 50;
        genderHTML += `<div class="bar" style="width: ${width}px;"><span class="bar-label">${label}:</span> ${count}</div>`;
    }
    document.getElementById('genderChart').innerHTML = genderHTML;

    // Render Age Group Chart
    let ageHTML = '';
    for (const [label, count] of Object.entries(ageGroups)) {
        const width = count > 0 ? Math.max(50, count * 40) : 50;
        ageHTML += `<div class="bar" style="width: ${width}px;"><span class="bar-label">${label}:</span> ${count}</div>`;
    }
    document.getElementById('ageGroupChart').innerHTML = ageHTML;
}

// 6.b: Log all invoices to console
function ShowInvoices() {
    const invoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    console.log('All Invoices:', invoices);
    return invoices;
}

// 6.c: Get invoices for a specific TRN
function GetUserInvoices(trn) {
    const registrations = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const user = registrations.find(u => u.trn === trn);
    if (user && user.invoices) {
        console.log(`Invoices for TRN ${trn}:`, user.invoices);
        return user.invoices;
    }
    console.log(`No invoices found for TRN: ${trn}`);
    return [];
}

// Search invoices by TRN (for dashboard UI)
function searchInvoicesByTRN() {
    const trn = document.getElementById('searchTRN').value.trim();
    if (!trn) {
        alert('Please enter a TRN.');
        return;
    }

    ShowInvoices(); // Ensure AllInvoices is loaded
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    const userInvoices = allInvoices.filter(inv => inv.trn === trn);

    const resultsDiv = document.getElementById('invoiceResults');
    if (userInvoices.length === 0) {
        resultsDiv.innerHTML = `<p>No invoices found for TRN: ${trn}</p>`;
    } else {
        let html = `<h3>Found ${userInvoices.length} invoice(s):</h3><ul>`;
        userInvoices.forEach(inv => {
            html += `<li>Invoice #${inv.invoiceNumber} - ${inv.date} - Total: $${inv.total.toFixed(2)}</li>`;
        });
        html += `</ul>`;
        resultsDiv.innerHTML = html;
    }
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', function () {
    ShowUserFrequency();
});
