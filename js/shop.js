// js/shop.js

let searchQuery = "";

document.addEventListener('DOMContentLoaded', () => {
    // Initial paint displaying the complete flat array list
    renderCatalog();

    // Attach submit filter action to the search form selector
    const searchForm = document.getElementById('shop-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard form refresh
            const searchInput = document.getElementById('shop-search-input');
            searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
            renderCatalog();
        });
    }
});

//Resets the search state cleanly
function resetSearch() {
    searchQuery = "";
    const searchInput = document.getElementById('shop-search-input');
    if (searchInput) searchInput.value = "";
    renderCatalog();
}

// CATALOG RENDERING LOOPS ENGINE
function renderCatalog() {
    const gridTarget = document.getElementById('dynamic-shop-grid');
    if (!gridTarget) return;

    // Filter dataset down simply using the keyword string match query
    let filteredProducts = products;

    if (searchQuery !== "") {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery) || 
            (p.description && p.description.toLowerCase().includes(searchQuery))
        );
    }

    // Wipe the existing columns out of the target grid section before redrawing
    gridTarget.innerHTML = '';

    // Empty search boundary fallback block
    if (filteredProducts.length === 0) {
        gridTarget.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-4 text-muted d-block mb-3"></i>
                <p class="text-muted fw-bold">No gear matched your search text.</p>
                <button onclick="resetSearch()" class="btn btn-sm btn-outline-dark mt-2">Clear Search</button>
            </div>`;
        return;
    }

    // Cycle over filtered elements and render them straight to the DOM
    filteredProducts.forEach(product => {
        // Star score handling fallback default
        const ratingScore = product.rating || 4;
        let starMarkup = '';
        for (let i = 1; i <= 5; i++) {
            starMarkup += (i <= ratingScore) ? '<i class="bi bi-star-fill filled"></i>' : '<i class="bi bi-star"></i>';
        }

        gridTarget.innerHTML += `
            <div class="col d-flex gap-3 align-items-center clickable-product-row" 
                 onclick="navigateToProduct('${product.id}')" 
                 itemscope itemtype="https://schema.org/Product">
                
                <div class="wireframe-img rounded flex-shrink-0" style="width: 100px; height: 100px;">
                    <img itemprop="image" src="${product.image || 'assets/icon_placeholder.png'}" 
                         alt="${product.name}" class="img-fluid p-2" style="max-height: 100%; object-fit: contain;">
                </div>
                
                <div>
                    <h5 itemprop="name" class="text-dark small mb-1 fw-bold text-uppercase tracking-wider">${product.name}</h5>
                    <div class="star-rating mb-1">
                        ${starMarkup}
                    </div>
                    <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <span itemprop="priceCurrency" content="NZD" class="fw-bold text-dark">$</span>
                        <span itemprop="price" content="${product.price}" class="fw-bold text-dark">${product.price}</span>
                    </div>
                </div>
            </div>
        `;
    });
}

// CROSS-PAGE ID STRATEGY HOOK
function navigateToProduct(productId) {
    localStorage.setItem('selectedProductID', productId);
    window.location.href = 'product-detail.html';
}