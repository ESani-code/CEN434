document.addEventListener('DOMContentLoaded', () => {

    // HTML Element Constants
    const productGrid = document.querySelector('.product-grid');
    const cartLink = document.getElementById('cart-link');
    const cartCountCounter = document.getElementById('cart-count');
    const cartlist = document.getElementById('cart-list');
    const closelistBtn = document.getElementById('close-list-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalPriceSpan = document.getElementById('total-price');

    // Array for cart items
    let cartItems = [];



    // EVENTS

    // Listen for clicks on the product grid

    if (productGrid) {
        productGrid.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productCard = event.target.closest('.product-card');
                addToCart(productCard.dataset);
            }
        });
    }

    // Listen for clicks inside the cart list for Remove
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-cart-btn')) {
                const productId = event.target.dataset.id;
                removeFromCart(productId);
            }
        });
    }

    // Opening the cart list
    cartLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the link from navigating
        openlist();
    });

    // Closing the cart list
    closelistBtn.addEventListener('click', closelist);
    cartlist.addEventListener('click', (event) => {
        // Close only if the overlay itself is clicked, not the content inside
        if (event.target === cartlist) {
            closelist();
        }
    });




    //  Main Functions
    
    function addToCart(productData) {

        const id = productData.id;
        const name = productData.name;
        const price = productData.price;

        const priceNumber = parseInt(price);

        // Check item already exists in cart
        const existingItem = cartItems.find(cartItem => cartItem.id === id);

        if (existingItem) {
            // Existing, just increase the quantity
            existingItem.quantity++;
        } else {
            // New item, add it to the cart
            cartItems.push({ id, name, price: priceNumber, quantity: 1 });
        }
        
        updateCart();        
    }



    function removeFromCart(productId) {
        const itemIndex = cartItems.findIndex(cartItem => cartItem.id === productId);

        if (itemIndex > -1) {
            const item = cartItems[itemIndex];
            if (item.quantity > 1) {
                // If quantity is more than 1, decrease it
                item.quantity--;
            } else {
                // If quantity is 1, remove the item
                cartItems.splice(itemIndex, 1);
            }
        }        
        
        updateCart();
    }

    // The main function to update all parts of the cart UI.
    
    
    function updateCart() {
        updateCartCount();
        renderCartItems();
        updateTotalPrice();
    }

    // Updates the number displayed on the cart link in the header.

    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountCounter.textContent = totalItems;
    }

    // Shows all items from the array into the list.

    function renderCartItems() {
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

    // Calculates and displays the total price of all items in the cart.
    function updateTotalPrice() {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = `N${total.toLocaleString()}`;
    }

    // Cart list Visibility
    function openlist() {
        cartlist.classList.remove('hidden');
        setTimeout(() => cartlist.classList.remove('hidden'), 0);
    }

    function closelist() {
        cartlist.classList.add('hidden');
    }

});
