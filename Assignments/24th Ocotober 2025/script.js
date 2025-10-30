document.addEventListener('DOMContentLoaded', () => {
    

    const productGrid = document.querySelector('.product-grid');
    const cartLink = document.getElementById('cart-link');
    const cartCount = document.getElementById('cart-count');
    const cartList = document.getElementById('cart-list');
    const closeListBtn = document.getElementById('close-list-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalPriceSpan = document.getElementById('total-price');

    
    
    let cart = [];

    // Add to Cart
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productCard = e.target.closest('.product-card');
                addToCart(productCard);
            }
        });
    }

    // Remove
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart-btn')) {
                const name = e.target.getAttribute('data-name');
                removeFromCart(name);
            }
        });
    }

    // Open / close the cart
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    closeListBtn.addEventListener('click', closeCart);

    cartList.addEventListener('click', (e) => {
        if (e.target === cartList) closeCart();
    });

    




    function addToCart(productCard) {


        // Extract product info from the html card
        const name = productCard.querySelector('h3').textContent.trim();
        const priceText = productCard.querySelector('.price').textContent.replace(/[^\d]/g, '');
        const price = parseInt(priceText, 10);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
    }

    function removeFromCart(productName) {
        const index = cart.findIndex(item => item.name === productName);

        if (index > -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
        }

        updateCart();
    }

    // UI Update

    function updateCart() {
        renderCartItems();
        updateCartCount();
        updateTotalPrice();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
            return;
        }

        cart.forEach(item => {
            const totalItemPrice = item.price * item.quantity;
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');

            itemDiv.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <p>N${totalItemPrice.toLocaleString()}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">Remove</button>
            `;

            cartItemsContainer.appendChild(itemDiv);
        });
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateTotalPrice() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = `N${total.toLocaleString()}`;
    }

    function openCart() {
        cartList.classList.remove('hidden');
    }

    function closeCart() {
        cartList.classList.add('hidden');
    }
});
