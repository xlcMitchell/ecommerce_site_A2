// Track where the carousel display window starts
let startIndex = 0;

// Initialize both blocks as soon as the DOM finishes building
document.addEventListener('DOMContentLoaded', () => {
    populateStaticHero();
    renderFeaturedCarousel();
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

// 2. RENDER FEATURED CAROUSEL (Renders a moving 2-card window using Microdata)
function renderFeaturedCarousel() {
    const gridContainer = document.getElementById('featured-products-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    // Slice out a moving frame of 2 items based on current startIndex
    const visibleProducts = products.slice(startIndex, startIndex + 2);

    visibleProducts.forEach(product => {
        gridContainer.innerHTML += `
            <div class="col-md-5" itemscope itemtype="https://schema.org/Product">
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

// 3. MOVE CAROUSEL INDICES (Fires via the button onclick events)
function moveCarousel(direction) {
    startIndex += direction;

    // Safety checks to ensure it doesn't push past array limits
    if (startIndex < 0) {
        startIndex = 0;
    } else if (startIndex > products.length - 2) {
        startIndex = products.length - 2; // Clamp it so a full window of 2 always renders
    }

    renderFeaturedCarousel();
}

// 4. PERSIST PRODUCT SELECTION FOR DETAIL VIEWS
function selectProduct(productId) {
    localStorage.setItem('selectedProductID', productId);
    window.location.href = 'product-detail.html';
}