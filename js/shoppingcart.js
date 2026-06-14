document.addEventListener('DOMContentLoaded', () => {
    displayCart();

     // =========================================================================
    // SHIPPING DETAILS FORM  VALIDATION START
    // =========================================================================
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', function (e) {
            // Stop the page from immediately reloading/switching pages!
            e.preventDefault();

            //Grab all our input elements using our HTML IDs
            const firstNameInput = document.getElementById('shipping-first-name');
            const lastNameInput = document.getElementById('shipping-last-name');
            const addressInput = document.getElementById('shipping-address');
            const cityInput = document.getElementById('shipping-city');
            const postcodeInput = document.getElementById('shipping-postcode');
            const phoneInput = document.getElementById('shipping-phone');

            // Grab the feedback divs so we can change their text if needed
            const postcodeFeedback = document.getElementById('postcode-feedback');
            const phoneFeedback = document.getElementById('phone-feedback');

            // Reset all validation styles before checking them again
            const inputs = [firstNameInput, lastNameInput, addressInput, cityInput, postcodeInput, phoneInput];
            inputs.forEach(input => input.classList.remove('is-invalid', 'is-valid'));

            let isFormValid = true;

            if (firstNameInput.value.trim().length === 0) { firstNameInput.classList.add('is-invalid'); isFormValid = false; }
            else { firstNameInput.classList.add('is-valid'); }

            if (lastNameInput.value.trim().length === 0) { lastNameInput.classList.add('is-invalid'); isFormValid = false; }
            else { lastNameInput.classList.add('is-valid'); }

            // --- STREET ADDRESS CHECK ---
            if (addressInput.value.trim() === '') {
                addressInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                addressInput.classList.add('is-valid');
            }

            // --- CITY CHECK ---
            if (cityInput.value.trim() === '') {
                cityInput.classList.add('is-invalid');
                isFormValid = false;
            } else {
                cityInput.classList.add('is-valid');
            }

            // --- POSTCODE CHECK ---
            const postcodeVal = postcodeInput.value.trim();
            if (postcodeVal === '') {
                postcodeInput.classList.add('is-invalid');
                postcodeFeedback.textContent = "Please enter your postcode.";
                isFormValid = false;
            } else if (!isValidNZPostcode(postcodeVal)) { 
                postcodeInput.classList.add('is-invalid');
                postcodeFeedback.textContent = "New Zealand postcodes must be exactly 4 digits.";
                isFormValid = false;
            } else {
                postcodeInput.classList.add('is-valid');
            }

            // --- PHONE NUMBER CHECK ---
            const phoneVal = phoneInput.value.trim();
            
            if (phoneVal === '') {
                phoneInput.classList.add('is-invalid');
                phoneFeedback.textContent = "Please enter your phone number.";
                isFormValid = false;
            } else if (!isValidPhoneNumber(phoneVal)) { 
                phoneInput.classList.add('is-invalid');
                phoneFeedback.textContent = "NZ numbers must be between 7 and 11 digits long.";
                isFormValid = false;
            } else {
                // Additional prefix check
                const cleanPhone = phoneVal.replace(/[\s\-\(\)\+]/g, '');
                const validPrefix = /^(02|03|04|05|06|07|08|09|64)/.test(cleanPhone);
                
                if (!validPrefix) {
                    phoneInput.classList.add('is-invalid');
                    phoneFeedback.textContent = "Please enter a valid NZ prefix (e.g. 021 or 06).";
                    isFormValid = false;
                } else {
                    phoneInput.classList.add('is-valid');
                }
            }

            //Only proceed if every single field passed
            if (isFormValid) {
                // Save values to localStorage 
                localStorage.setItem('shipping_firstName', firstNameInput.value);
                localStorage.setItem('shipping_lastName', lastNameInput.value);
                
                // Proceed to payment page
                window.location.href = 'paymentdetail.html';
            }
        });
    }

     // =========================================================================
    // SHIPPING DETAILS FORM  VALIDATION END
    // =========================================================================
    

    // =========================================================================
    // PAYMENT FORM  VALIDATION START
    // =========================================================================
    const paymentForm = document.getElementById('payment-form');

    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop immediate page switch

            // Check which payment option radio button is selected
            const isPaypalSelected = document.getElementById('payPaypal').checked;

            //ROUTE  IMMEDIATELY IF PAYPAY IS SELECTED
            if (isPaypalSelected) {
                window.location.href = 'orderconfirmationpage.html';
                return; // Exit the function immediately, skipping all CC checks
            }

            // If PayPal isn't selected, validate Credit Card inputs
            const cardName = document.getElementById('card-name');
            const cardNumber = document.getElementById('card-number');
            const cardExpiry = document.getElementById('card-expiry');
            const cardCvv = document.getElementById('card-cvv');

            const cardNumberFeedback = document.getElementById('card-number-feedback');
            const cardExpiryFeedback = document.getElementById('card-expiry-feedback');
            const cardCvvFeedback = document.getElementById('card-cvv-feedback');

            // Reset visual states
            const inputs = [cardName, cardNumber, cardExpiry, cardCvv];
            inputs.forEach(input => input.classList.remove('is-invalid', 'is-valid'));

            let isFormValid = true;

            // --- CARDHOLDER NAME CHECK ---
            if (cardName.value.trim().length === 0) {
                cardName.classList.add('is-invalid');
                isFormValid = false;
            } else {
                cardName.classList.add('is-valid');
            }

            // --- CREDIT CARD NUMBER CHECK ---
            const cardNoVal = cardNumber.value.trim();
            if (cardNoVal === '') {
                cardNumber.classList.add('is-invalid');
                cardNumberFeedback.textContent = "Please enter your credit card number.";
                isFormValid = false;
            } else if (!isValidCreditCard(cardNoVal)) { 
                cardNumber.classList.add('is-invalid');
                cardNumberFeedback.textContent = "Credit card number must be exactly 16 numbers.";
                isFormValid = false;
            } else {
                cardNumber.classList.add('is-valid');
            }

            // --- EXPIRY DATE CHECK (MM/YY) ---
            const expiryVal = cardExpiry.value.trim();
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/; 

            if (expiryVal === '') {
                cardExpiry.classList.add('is-invalid');
                cardExpiryFeedback.textContent = "Please enter an expiry date.";
                isFormValid = false;
            } else if (!expiryRegex.test(expiryVal)) { 
                cardExpiry.classList.add('is-invalid');
                cardExpiryFeedback.textContent = "Format must be Month/Year (e.g., 12/28).";
                isFormValid = false;
            } else {
                cardExpiry.classList.add('is-valid');
            }

            // --- CVV CHECK ---
            const cvvVal = cardCvv.value.trim();
            if (cvvVal === '') {
                cardCvv.classList.add('is-invalid');
                cardCvvFeedback.textContent = "Please enter your security code.";
                isFormValid = false;
            } else if (!isValidCVV(cvvVal)) { 
                cardCvv.classList.add('is-invalid');
                cardCvvFeedback.textContent = "CVV must be exactly 3 digits.";
                isFormValid = false;
            } else {
                cardCvv.classList.add('is-valid');
            }

            // Success
            if (isFormValid) {
                window.location.href = 'orderconfirmationpage.html';
            }
        });
    }

      // =========================================================================
    // PAYMENT FORM  VALIDATION END
    // =========================================================================

    
});

function displayCart() {
    const cartWrapper = document.getElementById('dynamic-cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxesEl = document.getElementById('cart-taxes');
    const totalEl = document.getElementById('cart-grand-total');
    
    //Fetch data from active local storage session
    const cart = JSON.parse(localStorage.getItem('userCart')) || [];

    // Fallback if basket empty
    if (cart.length === 0) {
        if (cartWrapper) {
            cartWrapper.innerHTML = `
                <div class="text-center py-5 border rounded bg-light mb-4">
                    <p class="text-muted mb-3">Your adventure pack is currently empty.</p>
                    <a href="shop.html" class="btn btn-sm btn-outline-dark px-4">Browse Catalog</a>
                </div>`;
        }
        if (subtotalEl) subtotalEl.textContent = "$0.00";
        if (shippingEl) shippingEl.textContent = "$0.00";
        if (taxesEl) taxesEl.textContent = "$0.00";
        if (totalEl) totalEl.textContent = "$0.00";
        return;
    }

    let subtotal = 0;

    // Only map items to HTML if the cart wrapper container actually exists 
    if (cartWrapper) {
        cartWrapper.innerHTML = '';
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            cartWrapper.innerHTML += `
                <div class="row align-items-center g-3 pb-4 mb-4 border-bottom">
                    <div class="col-auto">
                        <div class="wireframe-img rounded" style="width: 110px; height: 110px;">
                            <img src="${item.image || 'assets/icon_placeholder.png'}" alt="${item.name}" style="max-height: 80%; object-fit: contain;" class="img-fluid p-2">
                        </div>
                    </div>
                    <div class="col">
                        <h4 class="text-dark h6 mb-1 text-uppercase tracking-wider">${item.name}</h4>
                        <p class="text-muted small mb-2 d-none d-md-block">Premium dynamic adventure select line item option.</p>
                        <span class="text-muted fw-bold">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="col-auto d-flex flex-column align-items-end gap-2">
                        <div class="input-group">
                            <input type="number" class="form-control qty-input" value="${item.quantity}" min="1" 
                                   onchange="updateQuantity(${index}, this.value)" required>
                            <span class="input-group-text bg-white text-muted small">pcs</span>
                        </div>
                        <button onclick="removeFromCart(${index})" class="btn btn-sm btn-link text-danger text-decoration-none p-0 small" style="font-size: 0.8rem;">
                            <i class="bi bi-trash3 me-1"></i>Remove
                        </button>
                    </div>
                </div>
            `;
        });
    } else {
        // If cartWrapper doesn't exist  we still need to calculate the subtotal from the cart array!
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
    }

    const sidebarWrapper = document.getElementById('sidebar-items-container');
    if (sidebarWrapper) {
        sidebarWrapper.innerHTML = ''; // Wipe old wireframe blocks
        
        cart.forEach(item => {
            sidebarWrapper.innerHTML += `
                <div class="row align-items-center mb-3 g-2 pb-2 border-bottom-dashed">
                    <div class="col-auto">
                        <div class="wireframe-img rounded bg-white border" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                            <img src="${item.image || 'assets/icon_placeholder.png'}" alt="${item.name}" style="max-height: 80%; max-width: 80%; object-fit: contain;">
                        </div>
                    </div>
                    <div class="col ps-2">
                        <h4 class="text-dark mb-0 text-uppercase fw-bold" style="font-size: 0.8rem; tracking-wide">${item.name}</h4>
                        <div class="text-muted small">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
    }

    //Financial calculations including NZ standard 15% GST
    const shippingCost = subtotal >= 600 ? 0 : 15.00;
    const gstTaxAmount = subtotal * 0.15; 
    const grandTotal = subtotal + shippingCost; 

    // Update the calculations display UI text fields safely
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`;
    if (taxesEl) taxesEl.textContent = `$${gstTaxAmount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

//Modify product counts dynamically from  inputs
function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    let parsedQty = parseInt(newQty);

    if (isNaN(parsedQty) || parsedQty < 1) {
        parsedQty = 1;
    }

    cart[index].quantity = parsedQty;
    localStorage.setItem('userCart', JSON.stringify(cart));
    displayCart(); 
}

//Completely strip an item line from local session
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('userCart', JSON.stringify(cart));
    displayCart();
}

//DATA VALIDATION FUNCTIONS

//email address validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//NZ Post Code Check (Exactly 4 digits)
function isValidNZPostcode(postcode) {
    const postcodeRegex = /^[0-9]{4}$/;
    return postcodeRegex.test(postcode);
}

//Credit Card Check (Exactly 16 digits)
function isValidCreditCard(cardNumber) {
    // Strip spaces or dashes the user might have typed
    const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
    return cleanNumber.length === 16 && !isNaN(cleanNumber);
}

//CVV Check (Exactly 3 digits)
function isValidCVV(cvv) {
    return /^[0-9]{3}$/.test(cvv);
}

function isValidPhoneNumber(phone) {
    //Strip out common formatting characters: spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    
    //Check if the remaining string consists entirely of numbers
    if (isNaN(cleanPhone) || cleanPhone === '') {
        return false;
    }
    
    //Enforce length constraints (Standard NZ mobile/landline numbers range between 7 to 11 digits)
    return cleanPhone.length >= 7 && cleanPhone.length <= 11;
}