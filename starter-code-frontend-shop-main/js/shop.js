let cart = [];
let total = 0;

// Exercise 1 construimos la funcion by con la que agregaremos productos al carrito 
function buy(id) {
    // 1. buscamos el producto por -ID- en el aray de productos
    const product = products.find(product => product.id === id);
    
    if (product) {
        // 2. existe el producto en el cart?
        const cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            // - existe, pues incrementamos la cantidad
            cartItem.quantity++;
        } else {
            // no existe, lo subimos con cantidad 1
            cart.push({ ...product, quantity: 1 });
        }
        
        // 3. actualizamos el contador del producto y el carrito
        updateProductCounter(id);
        updateCartCounter();
        printCart();
    }
}

// Función para actualizar el contador de un producto
function updateProductCounter(id) {
    const cartItem = cart.find(item => item.id === id);
    const counter = document.getElementById(`product-count-${id}`);
    counter.textContent = cartItem ? cartItem.quantity : '0';
}

// Función para incrementar el contador de un producto
function incrementProduct(id) {
    const product = products.find(product => product.id === id);
    if (product) {
        const cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateProductCounter(id);
        updateCartCounter();
        printCart();
    }
}

// Función para decrementar el contador de un producto
function decrementProduct(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].quantity === 1) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity--;
        }
        updateProductCounter(id);
        updateCartCounter();
        printCart();
    }
}

// Función para actualizar el contador de productos en el carrito
function updateCartCounter() {
    const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('count_product').textContent = totalProducts;
}

// Exercise 2 creamos la funcion con la que eliminaremos productos del carrito
function cleanCart() {
    // Vaciamos el carrito y actualizamos la interfaz
    cart = [];
    total = 0;
    
    // Actualizamos el contador de productos, el total y la lista del carrito
    updateCartCounter();
    printCart();
    updateAllProductCounters();
    
    // Forzamos la actualización del total en el DOM
    document.getElementById('total_price').textContent = '0.00';
}

// Función para calcular el precio total
function calculateTotal() {
    total = 0;

    // Si el carrito está vacío, actualizamos el total a 0
    if (cart.length === 0) {
        document.getElementById('total_price').textContent = '0.00';
        return 0;
    }

    // Recorremos el array cart
    for (let i = 0; i < cart.length; i++) {
        // Calculamos el precio total por cada producto
        let subtotal = cart[i].price * cart[i].quantity;
        
        // Si el producto tiene descuento, usamos el precio con descuento
        if (cart[i].subtotalWithDiscount) {
            subtotal = cart[i].subtotalWithDiscount * cart[i].quantity;
        }
        
        total += subtotal;
    }

    // Actualizamos el total en el DOM
    const order_total = document.getElementById('total_price');
    if (order_total) {
        order_total.textContent = total.toFixed(2);
    }

    return total;
}


// Exercise 4 
function applyPromotionsCart() {
    // Recorremos el array "cart"
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];

        // Verificamos si el producto tiene una oferta y si cumple con la cantidad mínima para aplicar el descuento
        if (item.offer && item.quantity >= item.offer.number) {
            // Calculamos el descuento
            const discount = (item.price * item.offer.percent) / 100;
            const discountedPrice = item.price - discount;
            
            // Guardamos el precio con descuento
            item.subtotalWithDiscount = discountedPrice;
        }
    }
}



// Exercise 5
// Función para actualizar la lista del carrito en el modal
function printCart() {
    const cartListElement = document.getElementById('cart_list');
    if (!cartListElement) return;
    
    // Limpiamos el contenido actual del carrito
    cartListElement.innerHTML = '';
    
    // Si el carrito está vacío, mostramos un mensaje
    if (cart.length === 0) {
        cartListElement.innerHTML = '<tr><td colspan="5" class="text-center">Tu carrito esta vacio, vuelve a la tienda para seguir comprando</td></tr>';
        return;
    }
    
    // Aplicamos las promociones antes de mostrar el carrito
    applyPromotionsCart();
    
    // Añadimos cada producto al DOM
    cart.forEach(item => {
        // Calculamos el precio total (con descuento si aplica)
        let finalPrice = item.price * item.quantity;
        if (item.subtotalWithDiscount) {
            finalPrice = item.subtotalWithDiscount * item.quantity;
        }
        
        // Creamos la fila para este producto
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${item.name}</th>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${finalPrice.toFixed(2)}</td>
            <td><button type="button" onclick="removeFromCart(${item.id})" class="btn btn-outline-dark">Remove</button></td>
        `;
        cartListElement.appendChild(row);
    });
    
    // Actualizamos el total general
    calculateTotal();
}




// ** Nivell II **

// Exercise 7
function removeFromCart(id) {
    // Buscamos el producto en el carrito
    const index = cart.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Si la cantidad es 1, eliminamos el producto
        if (cart[index].quantity === 1) {
            cart.splice(index, 1);
            // Si el carrito queda vacío, actualizamos el total a 0
            if (cart.length === 0) {
                total = 0;
                document.getElementById('total_price').textContent = '0.00';
            }
        } else {
            // Si la cantidad es mayor que 1, decrementamos
            cart[index].quantity--;
        }
        
        // Actualizamos el contador del producto y el carrito
        updateProductCounter(id);
        updateCartCounter();
        printCart();
    }
}




function open_modal() {
    printCart();
    updateAllProductCounters();
}
// Exercise

// Función para actualizar todos los contadores de productos
function updateAllProductCounters() {
    products.forEach(product => {
        updateProductCounter(product.id);
    });
}