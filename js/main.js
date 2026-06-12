// Track where the carousel display window starts
let startIndex = 0;

// Initialize both blocks as soon as the DOM finishes building
document.addEventListener('DOMContentLoaded', () => {
    populateStaticHero();
    renderFeaturedCarousel();
    populateMixedGrid();
});

// Listen for window resizing
// This makes sure if someone shrinks their browser live on desktop, it responds immediately.
window.addEventListener('resize', () => {
    renderFeaturedCarousel();
});

document.addEventListener('DOMContentLoaded', () => {
    const topAnchor = document.getElementById('floating-top-anchor');

    if (topAnchor) {
        // Listen to the browser's scroll action
        window.addEventListener('scroll', () => {
            // If user scrolls down more than 300 pixels, reveal the anchor
            if (window.scrollY > 300) {
                topAnchor.classList.remove('d-none');
                topAnchor.classList.add('d-flex');
            } else {
                // Hide it when they are near the top of the Kiwi journey
                topAnchor.classList.remove('d-flex');
                topAnchor.classList.add('d-none');
            }
        });
    }
});


// 1. POPULATE STATIC TOP ROW (Grabs the first 3 products directly from the start of the array)
function populateStaticHero() {
    const staticContainer = document.getElementById('static-hero-grid');
    if (!staticContainer) return;

    staticContainer.innerHTML = '';

    // Pull products 0, 1, and 2
    const staticSelection = products.slice(0, 3);

    staticSelection.forEach(product => {
        staticContainer.innerHTML += `
            <div class="col-6 col-md-3">
                <div class="card h-100 border-0 bg-transparent text-center">
                    <div class="wireframe-img ratio ratio-1x1 rounded p-3 bg-light border">
                        <img src="${product.image || 'assets/icon_placeholder.png'}" alt="${product.name}" class="img-fluid p-4">
                    </div>
                    <div class="card-body pt-3 px-0">
                        <h5 class="h6 text-dark mb-1">${product.name}</h5>
                        <p class="text-muted small mb-2">$${product.price}</p>
                        <button onclick="selectProduct('${product.id}')" class="btn btn-sm btn-outline-dark py-1 px-3">
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// RENDER FEATURED CAROUSEL (Renders a moving 2-card window using Microdata)
function renderFeaturedCarousel() {
    const gridContainer = document.getElementById('featured-products-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    // DYNAMICALLY DETECT SCREEN WIDTH
    // If the window width is less than 768px (Bootstrap's md breakpoint), show 1 item. Otherwise, show 2.
    const isMobile = window.innerWidth < 768;
    const itemsToShow = isMobile ? 1 : 2;

    // Slice out a moving frame based on screen sizes
    const visibleProducts = products.slice(startIndex, startIndex + itemsToShow);

    visibleProducts.forEach(product => {
        //UPDATED CLASSES: Full width 'col-12' on mobile, 'col-md-5' on desktop
        gridContainer.innerHTML += `
            <div class="col-12 col-md-5" itemscope itemtype="https://schema.org/Product">
                <div class="card h-100 border-0 bg-transparent text-center">
                    <div class="wireframe-img ratio ratio-4x3 rounded mb-3">
                        <img itemprop="image" src="${product.image || 'assets/icon_placeholder_large.png'}" alt="${product.name}" class="img-fluid p-5">
                    </div>
                    <div class="text-center">
                        <h4 itemprop="name" class="text-muted small mb-1">${product.name.toUpperCase()}</h4>
                        <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="mb-3">
                            <span itemprop="priceCurrency" content="NZD">$</span>
                            <span itemprop="price" content="${product.price}" class="h5">${product.price}</span>
                        </div>
                        <button onclick="selectProduct('${product.id}')" class="btn btn-sm btn-outline-dark py-1 px-4">
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}


// POPULATE THE MIXED LOWER GRID (Large Standout Card + 2x2 Sub-Grid)
function populateMixedGrid() {
    const largeTarget = document.getElementById('dynamic-large-product-target');
    const subGridTarget = document.getElementById('dynamic-grid-products-target');
    
    if (!largeTarget || !subGridTarget) return;

    // Wipe any old layout shells
    largeTarget.innerHTML = '';
    subGridTarget.innerHTML = '';

    // RENDER THE LARGE PROMINENT PRODUCT (Index 0) ---
    const largeProduct = products[0];
    if (largeProduct) {
        largeTarget.innerHTML = `
            <div itemscope itemtype="https://schema.org/Product" class="card h-100 border-0 bg-transparent">
                <div class="wireframe-img ratio ratio-1x1 rounded mb-3">
                    <img itemprop="image" src="${largeProduct.image || 'assets/icon_placeholder_large.png'}" alt="${largeProduct.name}" class="img-fluid p-5">
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 itemprop="name" class="text-muted small m-0">${largeProduct.name.toUpperCase()}</h4>
                        <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                            <span itemprop="priceCurrency" content="NZD">$</span>
                            <span itemprop="price" content="${largeProduct.price}" class="h5">${largeProduct.price}</span>
                        </div>
                    </div>
                    <div class="star-rating h5">
                        <i class="bi bi-star-fill filled"></i>
                        <i class="bi bi-star-fill filled"></i>
                        <i class="bi bi-star-fill filled"></i>
                        <i class="bi bi-star-fill filled"></i>
                        <i class="bi bi-star-fill filled"></i>
                    </div>
                </div>
                <button onclick="selectProduct('${largeProduct.id}')" class="btn btn-sm btn-outline-dark py-1 px-3 mt-3 align-self-start">
                    Details
                </button>
            </div>
        `;
    }

    // RENDER THE 2x2 SUB-GRID OF SMALLER PRODUCTS (Indices 1 through 4) ---
    const subGridSelection = products.slice(0, 4);

    subGridSelection.forEach(product => {
        subGridTarget.innerHTML += `
            <div class="col" itemscope itemtype="https://schema.org/Product">
                <div class="card h-100 border-0 bg-transparent d-flex flex-column justify-content-between">
                    <div>
                        <div class="wireframe-img ratio ratio-16x9 rounded mb-2">
                            <img itemprop="image" src="${product.image || 'assets/icon_placeholder.png'}" alt="${product.name}" class="img-fluid p-3">
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div class="small">
                                <h4 itemprop="name" class="text-muted small m-0" style="font-size: 0.8rem;">${product.name.toUpperCase()}</h4>
                                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                                    <span itemprop="priceCurrency" content="NZD">$</span>
                                    <span itemprop="price" content="${product.price}" class="h6">${product.price}</span>
                                </div>
                            </div>
                            <div class="star-rating" style="font-size: 0.8rem;">
                                <i class="bi bi-star-fill filled"></i>
                                <i class="bi bi-star-fill filled"></i>
                                <i class="bi bi-star-fill filled"></i>
                                <i class="bi bi-star-fill filled"></i>
                                <i class="bi bi-star"></i>
                            </div>
                        </div>
                    </div>
                    <button onclick="selectProduct('${product.id}')" class="btn btn-sm btn-outline-dark py-0 px-2 align-self-start" style="font-size: 0.75rem;">
                        Details
                    </button>
                </div>
            </div>
        `;
    });
}

// MOVE CAROUSEL INDICES (Fires via the button onclick events)
function moveCarousel(direction) {
    startIndex += direction;

    //Check current screen layout capacity dynamically
    const isMobile = window.innerWidth < 768;
    const itemsToShow = isMobile ? 1 : 2;

    //Safety checks using the dynamic itemsToShow limit
    if (startIndex < 0) {
        startIndex = 0;
    } else if (startIndex > products.length - itemsToShow) {
        startIndex = products.length - itemsToShow; // Safely clamps based on visible screen window size
    }

    renderFeaturedCarousel();
}

// 4. PERSIST PRODUCT SELECTION FOR DETAIL VIEWS
function selectProduct(productId) {
    localStorage.setItem('selectedProductID', productId);
    window.location.href = 'product-detail.html';
}