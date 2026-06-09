// 1. Array with 3 products to match your layout columns
const products = [
    {
        id: "prod-001",
        name: "Tararua Expedition Pack 65L",
        price: 300,
        image: "assets/pack.png"
    },
    {
        id: "prod-002",
        name: "Southern Alps Alpine Tent",
        price: 300,
        image: "assets/tent.png"
    },
    {
        id: "prod-003",
        name: "Milford Waterproof Jacket",
        price: 250, 
        image: "assets/jacket.png"
    },
    {
        id: "prod-004",
        name: "Ruahine Fleece Layer",
        price: 120,
        category: "Apparel",
        description: "High-loft thermal insulation layer designed for chilly alpine nights."
    },
    {
        id: "prod-005",
        name: "Tongariro Trekking Boots",
        price: 280,
        category: "Footwear",
        description: "Full-grain leather boots offering maximum ankle support on rocky scree."
    }
];

// 2. Track where the slider display starts
let startIndex = 0;

function renderFeaturedProducts() {
    const gridContainer = document.getElementById('featured-products-grid');
    if (!gridContainer) return;

    // Wipe old content so items don't just infinitely append
    gridContainer.innerHTML = '';

    // 3. Slice the array to grab exactly 3 items starting from your pointer
    const visibleProducts = products.slice(startIndex, startIndex + 3);

    visibleProducts.forEach(product => {
        gridContainer.innerHTML += `
            <div class="col-6 col-md-3">
                <div class="card h-100 border-0 bg-transparent text-center">
                    <div class="wireframe-img ratio ratio-1x1 rounded p-3 bg-light border">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid p-4">
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

// Fire when document loads
document.addEventListener('DOMContentLoaded', renderFeaturedProducts);

// Click navigation helper
function selectProduct(productId) {
    localStorage.setItem('selectedProductID', productId);
    window.location.href = 'product-detail.html';
}