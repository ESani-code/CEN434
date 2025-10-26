document.addEventListener('DOMContentLoaded', () => {

    // HTML Element References
    const productGrid = document.querySelector('.product-grid');
    const cartLink = document.getElementById('cart-link');
    const cartCountCounter = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalPriceSpan = document.getElementById('total-price');

    // --- STATE MANAGEMENT ---
    // This array will hold all the items in our cart.
    // Each item will be an object: { id, name, price, quantity }
    let cartItems = [];

    // --- EVENT LISTENERS ---

    // 1. Listen for clicks on the product grid (for "Add to Cart")
    // Using event delegation for scalability.
    if (productGrid) {
        productGrid.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productCard = event.target.closest('.product-card');
                addToCart(productCard.dataset);
            }
        });
    }

    // 2. Listen for clicks inside the cart modal (for "Remove")
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-cart-btn')) {
                const productId = event.target.dataset.id;
                removeFromCart(productId);
            }
        });
    }

    // 3. Open the cart modal
    cartLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the link from navigating
        openModal();
    });

    // 4. Close the cart modal
    closeModalBtn.addEventListener('click', closeModal);
    cartModal.addEventListener('click', (event) => {
        // Close only if the overlay itself is clicked, not the content inside
        if (event.target === cartModal) {
            closeModal();
        }
    });


    // --- CORE FUNCTIONS ---

    /**
     * Adds a product to the cartItems array or updates its quantity.
     * @param {Object} productData - The dataset from the product card element.
     */
    function addToCart(productData) {
        const { id, name, price } = productData;
        const priceNumber = parseInt(price);

        // Check if the item already exists in the cart
        const existingItem = cartItems.find(item => item.id === id);

        if (existingItem) {
            // If it exists, just increase the quantity
            existingItem.quantity++;
        } else {
            // If it's a new item, add it to the cart
            cartItems.push({ id, name, price: priceNumber, quantity: 1 });
        }

        // Update the UI
        updateCart();
        animateCartIcon();
    }

    /**
     * Removes an item from the cart or decreases its quantity.
     * @param {string} productId - The ID of the product to remove.
     */
    function removeFromCart(productId) {
        const itemIndex = cartItems.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            const item = cartItems[itemIndex];
            if (item.quantity > 1) {
                // If quantity is more than 1, just decrease it
                item.quantity--;
            } else {
                // If quantity is 1, remove the item completely
                cartItems.splice(itemIndex, 1);
            }
        }
        
        // Update the UI
        updateCart();
    }

    /**
     * The main function to update all parts of the cart UI.
     */
    function updateCart() {
        updateCartCount();
        renderCartItems();
        updateTotalPrice();
    }

    /**
     * Updates the number displayed on the cart link in the header.
     */
    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountCounter.textContent = totalItems;
    }

    /**
     * Renders all items from the cartItems array into the modal.
     */
    function renderCartItems() {
        // Clear the container first
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cartItems.forEach(item => {
            // Format the price with commas for readability
            const formattedPrice = `N${(item.price * item.quantity).toLocaleString()}`;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <p>${formattedPrice}</p>
                </div>
                <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    /**     * Calculates and displays the total price of all items in the cart.     **/
    function updateTotalPrice() {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = `N${total.toLocaleString()}`;
    }

    /**
     * Adds a simple CSS animation to the cart icon for user feedback.
     */
    function animateCartIcon() {
        cartCountCounter.classList.add('cart-pop');
        // Remove the class after the animation finishes
        cartCountCounter.addEventListener('animationend', () => {
            cartCountCounter.classList.remove('cart-pop');
        }, { once: true }); // The listener will run only once
    }

    // --- MODAL VISIBILITY FUNCTIONS ---
    function openModal() {
        cartModal.classList.remove('hidden');
        // A small change to the class to trigger CSS transition
        setTimeout(() => cartModal.classList.remove('hidden'), 0);
    }

    function closeModal() {
        cartModal.classList.add('hidden');
    }

});
