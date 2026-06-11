document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});

function displayCart() {
    const cartWrapper = document.getElementById('dynamic-cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxesEl = document.getElementById('cart-taxes');
    const totalEl = document.getElementById('cart-grand-total');
    
    if (!cartWrapper) return;

    // 1. Fetch data from active local storage session
    const cart = JSON.parse(localStorage.getItem('userCart')) || [];

    // Fallback if basket empty
    if (cart.length === 0) {
        cartWrapper.innerHTML = `
            <div class="text-center py-5 border rounded bg-light mb-4">
                <p class="text-muted mb-3">Your adventure pack is currently empty.</p>
                <a href="shop.html" class="btn btn-sm btn-outline-dark px-4">Browse Catalog</a>
            </div>`;
        if (subtotalEl) subtotalEl.textContent = "$0.00";
        if (shippingEl) shippingEl.textContent = "$0.00";
        if (taxesEl) taxesEl.textContent = "$0.00";
        if (totalEl) totalEl.textContent = "$0.00";
        return;
    }

    cartWrapper.innerHTML = '';
    let subtotal = 0;

    // 2. Map stored items directly into your custom row markup structure
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

    // 3. Financial calculations including NZ standard 15% GST
    // Task 2b: Conditional Shipping ($15 standard cost, or Free if order totals over $600)
    const shippingCost = subtotal >= 600 ? 0 : 15.00;
    const gstTaxAmount = subtotal * 0.15; 
    const grandTotal = subtotal + shippingCost; // (Note: Retail items in NZ display tax inclusive, matching your total formatting)

    // 4. Update the calculations display UI text fields
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`;
    if (taxesEl) taxesEl.textContent = `$${gstTaxAmount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

// ACTION HOOK: Modify product counts dynamically from your inputs
function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    let parsedQty = parseInt(newQty);

    // Validation Guard: revert down if negative numbers or zero are provided
    if (isNaN(parsedQty) || parsedQty < 1) {
        parsedQty = 1;
    }

    cart[index].quantity = parsedQty;
    localStorage.setItem('userCart', JSON.stringify(cart));
    displayCart(); // Redraw UI calculations smoothly
}

// ACTION HOOK: Completely strip an item line from local session
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('userCart', JSON.stringify(cart));
    displayCart();
}