// js/product-detail.js

let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});

function loadProductDetails() {
    const selectedID = localStorage.getItem('selectedProductID');
    
    if (!selectedID) {
        console.error("No product ID found in local storage.");
        window.location.href = 'shop.html'; 
        return;
    }

    currentProduct = products.find(p => p.id === selectedID);

    if (!currentProduct) {
        console.error("Product match not found in catalog array.");
        return;
    }

    const imgElement = document.getElementById('detail-product-image');
    const nameElement = document.getElementById('detail-product-name');
    const priceElement = document.getElementById('detail-product-price');
    const descElement = document.getElementById('detail-product-description');

    if (imgElement) imgElement.src = currentProduct.image || 'assets/icon_placeholder_large.png';
    if (nameElement) nameElement.textContent = currentProduct.name;
    
    if (priceElement) {
        priceElement.textContent = currentProduct.price;
        priceElement.setAttribute('content', currentProduct.price);
    }
    
    if (descElement) {
        descElement.textContent = currentProduct.description || 
            `Premium quality ${currentProduct.name} built explicitly to handle the beautiful, rugged, and unpredictable New Zealand wild.`;
    }

    //Populate the similar products grid right after loading the main details
    populateSimilarProducts();
}

// POPULATE SIMILAR PRODUCTS GRID 
function populateSimilarProducts() {
    const similarTarget = document.getElementById('dynamic-similar-products-target');
    if (!similarTarget || !currentProduct) return;

    similarTarget.innerHTML = '';

    // Filter out the current product so it doesn't recommend itself
    let recommendations = products.filter(product => product.id !== currentProduct.id);

    // Grab exactly 3 products for the row
    recommendations = recommendations.slice(0, 3);

    recommendations.forEach(product => {
        similarTarget.innerHTML += `
            <div class="col text-center" itemscope itemtype="https://schema.org/Product">
                <div class="card h-100 border-0 bg-transparent d-flex flex-column justify-content-between">
                    <div>
                        <div class="wireframe-img ratio ratio-16x9 rounded mb-2">
                            <img itemprop="image" src="${product.image || 'assets/icon_placeholder.png'}" alt="${product.name}" class="img-fluid" style="max-height: 70%; object-fit: contain;">
                        </div>
                        <span itemprop="name" class="small d-block text-muted text-uppercase fw-bold mb-1" style="font-size: 0.8rem; letter-spacing: 0.5px;">
                            ${product.name}
                        </span>
                        <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="mb-2">
                            <span itemprop="priceCurrency" content="NZD" class="small fw-bold text-dark">$</span>
                            <span itemprop="price" content="${product.price}" class="small fw-bold text-dark">${product.price}</span>
                        </div>
                    </div>
                    <div>
                        <button onclick="selectProduct('${product.id}')" class="btn btn-sm btn-outline-dark py-1 px-3 mt-1" style="font-size: 0.75rem;">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}


function selectProduct(productId) {
    localStorage.setItem('selectedProductID', productId);
    // Reloads the exact same page, which will instantly load the newly chosen product!
    window.location.href = 'product-detail.html';
}


function addToCart() {
    // Safety check to ensure the active product data loaded correctly
    if (!currentProduct) {
        console.error("No active product data found to add to cart.");
        return;
    }

    // Pull the current cart array from storage, or initialize an empty array []
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];

    // Check if this product is already in the basket
    const existingItem = cart.find(item => item.id === currentProduct.id);

    if (existingItem) {
        // If it's already there, just increment its unit count by 1
        existingItem.quantity += 1;
    } else {
        // Otherwise, push a clean new line item object with a default quantity of 1
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: parseFloat(currentProduct.price),
            image: currentProduct.image,
            quantity: 1
        });
    }

    // Stringify the updated array and save it back to localStorage memory
    localStorage.setItem('userCart', JSON.stringify(cart));
    
    // Give the user clear confirmation feedback
    alert(`Success! Added 1x ${currentProduct.name.toUpperCase()} to your selection.`);
}