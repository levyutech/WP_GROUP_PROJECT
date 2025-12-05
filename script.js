//Javascript Functionality
/* Group Members:
    Adien-Neil McLeod: 2407731
    Lorri-Ann Levy: 2407726
*/

// Question 1: User Authentification
// User Authentication & Registration (LocalStorage)
// Get the RegistrationData array from localStorage (or empty array if none)

function getRegistrationData() {
    // Parse the JSON string from localStorage; if null, use empty array
    return JSON.parse(localStorage.getItem('RegistrationData')) || [];
}

// Save the updated RegistrationData array back to localStorage
function saveRegistrationData(data) {
    localStorage.setItem('RegistrationData', JSON.stringify(data));
}

// Calculate age from the date of birth string (YYYY-MM-DD)
function calculateAge(dobString) {
    const today = new Date();
    const dob = new Date(dobString);

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    // Adjust age if birthday has not occurred yet
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
}

//TRN format: 000-000-000
function isValidTrnFormat(trn) {
    const trnRegex = /^\d{3}-\d{3}-\d{3}$/;
    return trnRegex.test(trn);
}

// Registration Form Validation & Storage

function validateRegistrationForm() {
    // Get field values from the form
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const trn = document.getElementById('trn').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let validResponse = true;

    // Clear previous error messages
    document.getElementById('firstNameError').textContent = '';
    document.getElementById('lastNameError').textContent = '';
    document.getElementById('dobError').textContent = '';
    document.getElementById('genderError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('trnError').textContent = '';
    document.getElementById('regPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    // Required field checks

    if (!firstName) {
        document.getElementById('firstNameError').textContent = 'First name is required';
        validResponse = false;
    }

    if (!lastName) {
        document.getElementById('lastNameError').textContent = 'Last name is required';
        validResponse = false;
    }

    if (!dob) {
        document.getElementById('dobError').textContent = 'Date of birth is required';
        validResponse = false;
    }

    if (!gender) {
        document.getElementById('genderError').textContent = 'Gender is required';
        validResponse = false;
    }

    if (!phone) {
        document.getElementById('phoneError').textContent = 'Phone number is required';
        validResponse = false;
    }

    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        validResponse = false;
    } else if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        validResponse = false;
    }

    if (!trn) {
        document.getElementById('trnError').textContent = 'TRN is required';
        validResponse = false;
    } else if (!isValidTrnFormat(trn)) {
        document.getElementById('trnError').textContent = 'TRN must be in the format 000-000-000';
        validResponse = false;
    }

    // Password must be at least 8 characters
    if (!password) {
        document.getElementById('regPasswordError').textContent = 'Password is required';
        validResponse = false;
    } else if (password.length < 8) {
        document.getElementById('regPasswordError').textContent = 'Password must be at least 8 characters';
        validResponse = false;
    }

    // Confirm password must match
    if (!confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Please confirm your password';
        validResponse = false;
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        validResponse = false;
    }

    // Age check: must be over 18
    if (dob) {
        const age = calculateAge(dob);
        if (age < 18) {
            document.getElementById('dobError').textContent = 'You must be at least 18 years old to register';
            validResponse = false;
        }
    }

    // TRN uniqueness check: TRN must not already exist in RegistrationData
    if (trn && isValidTrnFormat(trn)) {
        const registrationData = getRegistrationData();
        const existingUser = registrationData.find(u => u.trn === trn);
        if (existingUser) {
            document.getElementById('trnError').textContent = 'This TRN is already registered';
            validResponse = false;
        }
    }

    // If validation fails, stop here
    if (!validResponse) {
        return false;
    }

    //Build registration record object to store in localStorage
    const registrationData = getRegistrationData();

    const newUser = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        gender: gender,
       phone: phone,
        email: email,
        trn: trn,                       // used as username for login
        password: password,             
        dateOfRegistration: new Date().toISOString(), // current date/time
        cart: {},                       // empty cart object
        invoices: []                    // empty invoices array
    };

    // Append new user to the RegistrationData array
    registrationData.push(newUser);

    // Save updated array back to localStorage
    saveRegistrationData(registrationData);

    // Show success message and redirect to login page
    alert('Your Registration was successful! Welcome to Lily of the Valley Spa.');
    window.location.href = "login.html";

    return true;
}


// Login Form Validation (TRN + Password)


// Track login attempts using localStorage so it persists
function getLoginAttempts() {
    return Number(localStorage.getItem('loginAttempts')) || 0;
}

function setLoginAttempts(value) {
    localStorage.setItem('loginAttempts', String(value));
}

function validateLoginForm() {
    const trn = document.getElementById('loginTrn').value.trim();
    const password = document.getElementById('loginPassword').value;

    let validResponse = true;

    // Clear previous errors
    document.getElementById('loginTrnError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';

    // Get current failed attempt count from localStorage
    let attempts = getLoginAttempts();

    // Basic validation for empty fields
    if (!trn) {
        document.getElementById('loginTrnError').textContent = 'TRN is required';
        validResponse = false;
    } else if (!isValidTrnFormat(trn)) {
        document.getElementById('loginTrnError').textContent = 'TRN must be in the format 000-000-000';
        validResponse = false;
    }

    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Password is required';
        validResponse = false;
    }

    if (!validResponse) {
        return false;
    }

    // Look up the user in RegistrationData
    const registrationData = getRegistrationData();
    const user = registrationData.find(u => u.trn === trn && u.password === password);

    if (user) {
        // Successful login
        alert('Login successful!');
        setLoginAttempts(0); // reset attempts

        // Optionally store current user TRN
        localStorage.setItem('CurrentUserTRN', trn);

        // Redirect to product catalog
        window.location.href = "Products.html";
        return true;
    } else {
        // Failed login attempt
        attempts++;
        setLoginAttempts(attempts);

        if (attempts >= 3) {
            alert('Too many failed attempts. Your account is now locked.');
            window.location.href = "account_locked.html";
        } else {
            const remaining = 3 - attempts;
            alert(`Invalid TRN or password. You have ${remaining} attempt(s) remaining.`);
        }
        return false;
    }
}


// Reset Password (via hyperlink on login page)


function resetPasswordFlow() {
    // Ask user for their TRN
    const trnInput = prompt('Enter your TRN (000-000-000) to reset your password:');
    if (!trnInput) {
        return; // user cancelled
    }

    const trn = trnInput.trim();
    if (!isValidTrnFormat(trn)) {
        alert('Invalid TRN format. Please use 000-000-000.');
        return;
    }

    const registrationData = getRegistrationData();
    const userIndex = registrationData.findIndex(u => u.trn === trn);

    if (userIndex === -1) {
        alert('No account found with that TRN.');
        return;
    }

    // Ask for a new password
    const newPassword = prompt('Enter your new password (at least 8 characters):');
    if (!newPassword) {
        return; // user cancelled
    }

    if (newPassword.length < 8) {
        alert('Password must be at least 8 characters.');
        return;
    }

    // Update password in the array
    registrationData[userIndex].password = newPassword;
    saveRegistrationData(registrationData);

    // Reset login attempts so user can try again
    setLoginAttempts(0);

    alert('Your password has been updated successfully. You can now log in with your new password.');
}


// Attach auth event listeners


document.addEventListener('DOMContentLoaded', function () {
    // Login form
    const loginForm = document.getElementById('validateLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            validateLoginForm();
        });

        const loginCancelBtn = document.getElementById('loginCancelBtn');
        if (loginCancelBtn) {
            loginCancelBtn.addEventListener('click', function () {
                loginForm.reset();
                document.getElementById('loginTrnError').textContent = '';
                document.getElementById('loginPasswordError').textContent = '';
            });
        }

        const resetLink = document.getElementById('resetPasswordLink');
        if (resetLink) {
            resetLink.addEventListener('click', function (e) {
                e.preventDefault();
                resetPasswordFlow();
            });
        }
    }

    // Registration form
    const registerForm = document.getElementById('validateRegistrationForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            validateRegistrationForm();
        });

        const registrationCancelBtn = document.getElementById('registrationCancelBtn');
        if (registrationCancelBtn) {
            registrationCancelBtn.addEventListener('click', function () {
                registerForm.reset();
                document.getElementById('firstNameError').textContent = '';
                document.getElementById('lastNameError').textContent = '';
                document.getElementById('dobError').textContent = '';
                document.getElementById('genderError').textContent = '';
                document.getElementById('phoneError').textContent = '';
                document.getElementById('emailError').textContent = '';
                document.getElementById('trnError').textContent = '';
                document.getElementById('regPasswordError').textContent = '';
                document.getElementById('confirmPasswordError').textContent = '';
            });
        }
    }
});












//Question 2: Product Catalogue

/* PRODUCT ARRAY */

//a) Create an array of product objects in JavaScript
const set_Products = [
    //Bath and Shower Products
   {
        name: "Lavender Bath and Body Oil",
        price:  2500.99,
        description: "Unwind with our harmonious blend of calming lavender and eucalyptus, transforming your bath into a tranquil, dew-kissed retreat.",
        image: "assets/Bath oil.jpg"
    },
    {
        name: "Golden Hour Turmeric Scrub",
        price: 1200.20,
        description: "Our potent, natural blend gently revitalizes and exfoliates softly. Turmeric's brightening properties help even skin tone, while creamy oils moisturize, for a healthy radiant glow.",
        image: "assets/tumeric scrub.jpg"
    },
    {
        name: "Soy Milk & Rice Body Cleanser Set",
        price: 1000.99,
        description: "A gentle cleanser enriched with soothing plant-based milks, cerella rice, and linseed. This creamy formula nourishes the skin while it cleanses, leaving it feeling soft and comfortably refreshed.",
        image: "assets/body wash.jpg"
    },

    //Skincare and Facial Products
    {
        name: "Bubble Relaxing Facial Cleansing Oil",
        price: 1300.55,
        description: "Watch your routine become a moment of calm. This foaming cleansing facial oil effortlessly dissolves the day's buildup. It cleanses deeply without stripping the skin, leaving behind only a pure, silky relaxation.",
        image: "assets/face.jpg"
    },
    {
        name: "Watermelon Glow Sleeping Mask",
        price: 1200.55,
        description: "This essential hydrating mask is infused with watermelon extract and soothing enzymes to gently exfoliate, replenish moisture, and reveal a dewy, glowing complexion by morning.",
        image: "assets/face mask.jpg"
    },
    {
        name: "Dr. Pepti Peptide Volume Waterglow Serum",
        price: 1000.00,
        description: "See a plumper, dewy glow. Our powerful peptide complex firms skin while hyaluronic acid delivers intense hydration. Brightening niacinamide evens tone for instantly radiant, lit-from-within skin.",
        image: "assets/face serum.jpg"
    },

    //Hand and Foot Care Products

    {
        name: "HAAN Hand Cream Collection",
        price: 1000.20,
        description: "Nourish your hands with 95% natural formulas. Enriched with a prebiotic complex, this moisturising textures absorb instantly to strengthen your skin's barrier and lock in moisture.",
        image: "assets/hand cream collection.jpg"
    },
    {
        name: "LondonTown Nature Blend",
        price: 850.00,
        description: "Our foot scrub combines aloe vera, peppermint and green tea ingredients to create an effective scrub that leaves your feet feeling silky smooth and renewed.",
        image: "assets/foot scrub.jpg"
    },
    {
        name: "Hyda Spa Foot Bath Massager",
        price: 14880.95,
        description: "The Hyda Spa provides heated bubbles, vibration and roller massagers. The Liquid Crystal Display puts total relaxation at your fingertips, leaving your feet feeling refreshed and renewed.",
        image: "assets/foot bath massager.jpg"
    },

    //Deodorant & Antiperspirant Products
    {
        name: "Respire",
        price: 500.00,
        description: "Make your body a priority with our ultimate naturally trio of orange, aloe vera, and rosemary. Orange provides a fresh scent while fighting bacteria. Aloe vera calms the skin, and rosemary offers natural protection to keep you feeling fresh and confident all day.",
        image: "assets/deoderant.jpg"
    },
    {
        name: "Disco",
        price: 600.25,
        description: "Meet a fresh, confident you. This natural deodorant combines the crisp, cleansing power of eucalyptus with odor-fighting minerals to keep you feeling refreshed and protected all day long.",
        image: "assets/euc. deoderant.jpg"
    },
    {
        name: "Modern Botany",
        price: 540.99,
        description: "Experience all-day freshness with our dermatologist-tested product. Designed especially for sensitive skin, it provides effective, natural odor protection without compromise.",
        image: "assets/mist deoderant.jpg"
    },

    //Fragrance Products
    {
        name: "Lily of the Valley Perfume Oil",
        price: 350.00,
        description: "Let the uplifting scent of lily ease your mind and lift your spirits throughout the day. The blend of pure essential oils like coconut and peppermint ensures the fragrance long-lasting scent naturally mixes with your skin's chemistry. This creates a unique personal aroma that feels like a fresh start everyday.",
        image: "assets/lily of the valley fragrance.jpg"
    },
    {
        name: "Lavender Esscence",
        price: 400.90,
        description: "Discover your favourite lavender scent. Lavender essential oil melts away daily stress while rose uplifts your mood, creating a balanced calm. A hint of vanilla and nourishing carrier oils provide lasting comfort, leaving your skin scented and your mind at ease.",
        image: "assets/lavender fragrance.jpg"
    },
    {
        name: "Haute Sauce - Strawberry Glaze Edible Fragrance",
        price: 578.99,
        description: "Indulge in the sweet allure of sun-ripened strawberries with this deliciously fragrance. This formula lets you taste your scent as you get ready for your day, leaving a tempting glaze of strawberry sweetness on your skin and lips.",
        image: "assets/strawberry scent.jpg"
    },
    {
        name: "Haute Sauce - Vanilla Coco Edible Fragrance",
        price: 530.99,
        description: "Surround yourself with the creamy comfort of coconut and warm, sweet vanilla. This edible fragrance lets you indulge in a tropical escape, leaving a deliciously smooth, dessert-like scent on your skin.",
        image: "assets/coconut fragrance.jpg"
    },

];

//Question 2.b) An updated product list must be kept on localStorage, as AllProducts. 
// Always update localStorage with the latest product list to ensure descriptions match FProducts.html
localStorage.setItem("AllProducts", JSON.stringify(set_Products));

// Load saved product list (now always using the latest from set_Products)
const products = JSON.parse(localStorage.getItem("AllProducts")) || [];

/* DYNAMIC PRODUCT DISPLAY */

function loadProducts() {
    const container = document.getElementById("productList");
    if (!container) return;

    // Ensure products array exists
    const productsToDisplay = products && products.length > 0 ? products : [];
    
    if (productsToDisplay.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">No products available. Please refresh the page.</p>';
        return;
    }

    container.innerHTML = "";

    productsToDisplay.forEach((product, index) => {
        container.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/Lily Logo.png'; this.alt='Image not found';">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">US $${product.price.toFixed(2)}</p>
                
                <button class="add-to-cart" 
                        onclick="addToCart(${index})"
                        data-name="${product.name}" 
                        data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

// Load products when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

//Question 3: Cart Functionality

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
    // Read cart from localStorage to ensure we have the latest data
    const currentCart = JSON.parse(localStorage.getItem('spaCart')) || {};
    let subtotal = 0;
    
    for (const productId in currentCart) {
        const item = currentCart[productId];
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


//Question 4: Checkout Functionality

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

        // Auto-fill TRN if user is logged in
        const currentUserTRN = localStorage.getItem('CurrentUserTRN');
        const trnInput = document.getElementById('checkoutTRN');
        if (trnInput && currentUserTRN) {
            trnInput.value = currentUserTRN;
        }
    }
});

// Confirm Checkout
function confirmCheckout(e) {
    e.preventDefault();
    console.log('Confirm checkout called');

    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let valid = true; // Assume valid until checks fail

    
    // Get form values

    const firstName = document.getElementById('checkoutfirstName').value.trim(); // Trim whitespace
    const lastName  = document.getElementById('checkoutlastName').value.trim();
    const email     = document.getElementById('checkoutEmail').value.trim();
    const trn      = document.getElementById('checkoutTRN') ? document.getElementById('checkoutTRN').value.trim() : '';
    const address   = document.getElementById('checkoutAddress').value.trim();
    const city      = document.getElementById('checkoutCity').value.trim();
    const zipCode   = document.getElementById('checkoutZipCode').value.trim();
    const payment = Number(document.getElementById('paymentAmount').value) || 0;
    
    console.log('Form values:', { firstName, lastName, email, trn, address, city, zipCode, payment });

    // Validate inputs
    if (!firstName) { document.getElementById('checkoutfirstNameError').textContent = 'First name is required'; valid = false; }
    if (!lastName)  { document.getElementById('checkoutlastNameError').textContent  = 'Last name is required'; valid = false; }
    if (!email || !email.includes('@') || !email.includes('.')) {
        document.getElementById('checkoutEmailError').textContent = 'Please enter a valid email'; valid = false;
    }
    if (!trn) {
        if (document.getElementById('checkoutTRNError')) {
            document.getElementById('checkoutTRNError').textContent = 'TRN is required'; valid = false;
        }
    } else if (!isValidTrnFormat(trn)) {
        if (document.getElementById('checkoutTRNError')) {
            document.getElementById('checkoutTRNError').textContent = 'TRN must be in the format 000-000-000'; valid = false;
        }
    }
    if (!address)   { document.getElementById('checkoutAddressError').textContent = 'Address is required'; valid = false; }
    if (!city)      { document.getElementById('checkoutCityError').textContent = 'City is required'; valid = false; }
    if (!zipCode)   { document.getElementById('checkoutZipCodeError').textContent = 'Zip code is required'; valid = false; }
    if (isNaN(payment) || payment <= 0) { // Invalid payment amount
        document.getElementById('paymentAmountError').textContent = 'Enter a valid payment amount'; valid = false;
    }

    // Cart empty check - read from localStorage to ensure we have latest data
    const currentCart = JSON.parse(localStorage.getItem('spaCart')) || {};
    if (Object.keys(currentCart).length === 0) { // If cart is empty
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
        console.log('Validation passed, proceeding with checkout');
        
        // Get TRN - try from form, or from CurrentUserTRN in localStorage
        const userTRN = trn || localStorage.getItem('CurrentUserTRN') || '';
        
        if (!userTRN) {
            alert('TRN is required for checkout. Please log in or enter your TRN.');
            return;
        }

        // Generate invoice
        const checkoutData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            trn: userTRN,
            address: address,
            city: city,
            zipCode: zipCode
        };

        console.log('Generating invoice with data:', checkoutData);
        
        // Read cart BEFORE generating invoice to ensure we have the data
        const cartBeforeClear = JSON.parse(localStorage.getItem('spaCart')) || {};
        console.log('Cart before invoice generation:', cartBeforeClear);
        
        if (Object.keys(cartBeforeClear).length === 0) {
            alert('Your cart is empty! Cannot generate invoice.');
            return;
        }
        
        const invoice = generateInvoice(checkoutData);
        
        if (invoice) {
            console.log('Invoice generated successfully:', invoice);
            const successMsg = document.getElementById('orderSuccess');
            if (successMsg) {
                successMsg.style.display = 'block'; // Show success message only when order is successful
            }
            
            // Clear cart after successful invoice generation
            clearCart();
            
            // Redirect to invoice page after a short delay to show success message
            setTimeout(() => {
                console.log('Redirecting to invoice page');
                window.location.href = 'invoice.html';
            }, 1500);
        } else {
            console.error('Failed to generate invoice - cart may be empty');
            alert('Error generating invoice. Your cart may be empty. Please try again.');
        }
    } else {
        console.log('Validation failed');
        // Scroll to first error
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        alert('Please fix the errors in the form before submitting.');
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

// Auto-run on invoice.html when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('invoice-content')) {
        displayInvoice();
    }
});

//Additional Functionality

// 6.a: Show User Frequency (Gender & Age Group)
function ShowUserFrequency() {
    const genderChartEl = document.getElementById('genderChart');
    const ageGroupChartEl = document.getElementById('ageGroupChart');
    
    // Only run if on dashboard page
    if (!genderChartEl || !ageGroupChartEl) {
        return;
    }

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
    const maxGenderCount = Math.max(...Object.values(genderCount), 1);
    for (const [label, count] of Object.entries(genderCount)) {
        const percentage = maxGenderCount > 0 ? Math.max(30, (count / maxGenderCount) * 70 + 30) : 30;
        genderHTML += `<div class="bar" style="width: ${percentage}%;"><span class="bar-label">${label}:</span><span>${count}</span></div>`;
    }
    genderChartEl.innerHTML = genderHTML;

    // Render Age Group Chart
    let ageHTML = '';
    const maxAgeCount = Math.max(...Object.values(ageGroups), 1);
    for (const [label, count] of Object.entries(ageGroups)) {
        const percentage = maxAgeCount > 0 ? Math.max(30, (count / maxAgeCount) * 70 + 30) : 30;
        ageHTML += `<div class="bar" style="width: ${percentage}%;"><span class="bar-label">${label}:</span><span>${count}</span></div>`;
    }
    ageGroupChartEl.innerHTML = ageHTML;
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
