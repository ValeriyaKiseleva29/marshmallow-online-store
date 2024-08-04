const products = [
    { id: 1, name: 'Классический зефир на яблочном пюре', price: 200, image: 'photo/DALL·E%202024-07-15%2016.50.24%20-%20A%20classic%20white%20marshmallow%20(zephyr)%20as%20the%20main%20object%20in%20the%20foreground,%20with%20a%20few%20apples%20in%20the%20background.%20The%20marshmallow%20is%20beautifully%20arrange.webp' },
    { id: 2, name: 'Нежный зефир на клубничном пюре', price: 200, image: 'photo/клубника.webp' },
    { id: 3, name: 'Ароматный зефир на основе малинового пюре', price: 210, image: 'photo/малина.webp' },
    { id: 4, name: 'Свежий зефир со вкусом черешни', price: 230, image: 'photo/черешня.webp' },
    { id: 5, name: 'Сладкий зефир на основе пюре из дыни', price: 250, image: 'photo/дыня.webp' },
    { id: 6, name: 'Заманчивый зефир со вкусом спелой груши', price: 200, image: 'photo/груша.webp' },
    { id: 7, name: 'Освежающий зефир со вкусом черники', price: 220, image: 'photo/черника.webp' },
    { id: 8, name: 'Ароматный зефир со сгущенным молоком', price: 250, image: 'photo/сгущенка.webp' },
    { id: 9, name: 'Классический зефир с ореховой начинкой', price: 260, image: 'photo/орех.webp' },
    { id: 10, name: 'Зефир с начинкой из нуги на основе яблочного пюре', price: 270, image: 'photo/нуга.webp' },
    { id: 11, name: 'Роскошный зефир на основе черного шоколада', price: 220, image: 'photo/шоколад.webp' },
    { id: 12, name: 'Классический зефир с начинкой из яблочного джема', price: 200, image: 'photo/джем.webp' }
];

let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart).map(item => {
            if (!item.quantity) {
                item.quantity = 1;
            }
            return item;
        });
    }
    updateCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showAlert(message) {
    alert(message);
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += quantity;
        showAlert(`Этот товар уже есть в корзине. Вы добавили еще ${quantity} кг. Всего в корзине данного зефира ${cartItem.quantity} кг.`);
    } else {
        cart.push({ ...product, quantity });
    }

    saveCart();
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

function changeQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (newQuantity >= 0.5) {
            cartItem.quantity = newQuantity;
        } else {
            cartItem.quantity = 0.5;
        }
        saveCart();
        updateCart();
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'flex', 'justify-between', 'items-center', 'p-2', 'border-b', 'border-gray-200');

        const itemDetails = document.createElement('div');
        itemDetails.classList.add('flex', 'items-center');

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.name;
        itemImage.classList.add('product-image', 'w-20', 'h-20', 'object-cover', 'rounded-md', 'mr-4');
        itemDetails.appendChild(itemImage);

        const itemName = document.createElement('span');
        itemName.textContent = `${item.name} - ${item.price} грн за кг (${item.quantity.toFixed(1)} кг)`;
        itemDetails.appendChild(itemName);

        const itemTotalPrice = document.createElement('span');
        itemTotalPrice.textContent = `Сумма: ${item.price * item.quantity} грн`;

        const quantityControls = document.createElement('div');
        quantityControls.classList.add('flex', 'items-center', 'ml-4');

        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.classList.add('minus', 'bg-red-500', 'text-white', 'px-2', 'py-1', 'rounded', 'mr-2');
        minusButton.addEventListener('click', () => {
            changeQuantity(item.id, item.quantity - 0.5);
        });

        const quantityDisplay = document.createElement('input');
        quantityDisplay.type = 'text';
        quantityDisplay.classList.add('quantity', 'text-center', 'w-12', 'mx-2');
        quantityDisplay.value = item.quantity.toFixed(1);
        quantityDisplay.readOnly = true;

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.classList.add('plus', 'bg-green-500', 'text-white', 'px-2', 'py-1', 'rounded');
        plusButton.addEventListener('click', () => {
            changeQuantity(item.id, item.quantity + 0.5);
        });

        quantityControls.appendChild(minusButton);
        quantityControls.appendChild(quantityDisplay);
        quantityControls.appendChild(plusButton);

        cartItem.appendChild(itemDetails);
        cartItem.appendChild(itemTotalPrice);
        cartItem.appendChild(quantityControls);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Удалить';
        removeButton.classList.add('bg-red-500', 'text-white', 'px-1', 'py-1', 'rounded', 'ml-4');
        removeButton.addEventListener('click', () => removeFromCart(item.id));

        cartItem.appendChild(removeButton);
        cartItemsContainer.appendChild(cartItem);

        total += item.price * item.quantity;
    });

    cartTotalElement.textContent = `${total.toFixed(2)} грн`;
    document.getElementById('cartCount').textContent = cart.length;
}

function openProductPage(productId) {
    window.open(`product.html?id=${productId}`, '_blank');
}

function setupEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            const quantityInput = event.target.parentElement.querySelector('.quantity');
            const quantity = parseFloat(quantityInput.value);
            addToCart(productId, quantity);
        });
    });

    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', (event) => {
            const quantityInput = event.target.parentElement.querySelector('.quantity');
            let quantity = parseFloat(quantityInput.value);
            if (quantity > 0.5) {
                quantity -= 0.5;
                quantityInput.value = quantity;
            }
        });
    });

    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', (event) => {
            const quantityInput = event.target.parentElement.querySelector('.quantity');
            let quantity = parseFloat(quantityInput.value);
            quantity += 0.5;
            quantityInput.value = quantity;
        });
    });

    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = parseInt(link.getAttribute('data-product-id'));
            openProductPage(productId);
        });
    });

    document.getElementById('cartButton').addEventListener('click', () => {
        document.getElementById('cartModal').classList.toggle('hidden');
    });

    const infoLink = document.getElementById('info-link');
    const infoModal = document.getElementById('infoModal');
    const closeInfoModal = document.getElementById('closeInfoModal');

    if (infoLink && infoModal && closeInfoModal) {
        infoLink.addEventListener('click', function (e) {
            e.preventDefault();
            infoModal.classList.remove('hidden');
        });

        closeInfoModal.addEventListener('click', function () {
            infoModal.classList.add('hidden');
        });

        window.addEventListener('click', function (e) {
            if (e.target == infoModal) {
                infoModal.classList.add('hidden');
            }
        });
    }

    const reviewsLink = document.getElementById('reviews-link');
    const reviewsModal = document.getElementById('reviewsModal');
    const closeReviewsModal = document.getElementById('closeReviewsModal');
    const reviewsForm = document.getElementById('reviewsForm');
    const nameField = document.getElementById('name');
    const reviewField = document.getElementById('review');

    if (reviewsLink && reviewsModal && closeReviewsModal && reviewsForm && nameField && reviewField) {
        reviewsLink.addEventListener('click', function (e) {
            e.preventDefault();
            reviewsModal.classList.remove('hidden');
        });

        closeReviewsModal.addEventListener('click', function () {
            reviewsModal.classList.add('hidden');
            nameField.value = '';
            reviewField.value = '';
            document.getElementById('nameError').textContent = '';
            document.getElementById('reviewError').textContent = '';
        });

        window.addEventListener('click', function (e) {
            if (e.target == reviewsModal) {
                reviewsModal.classList.add('hidden');
                nameField.value = '';
                reviewField.value = '';
                document.getElementById('nameError').textContent = '';
                document.getElementById('reviewError').textContent = '';
            }
        });

        reviewsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = nameField.value.trim();
            const review = reviewField.value.trim();
            const nameError = document.getElementById('nameError');
            const reviewError = document.getElementById('reviewError');


            if (/\d/.test(name)) {
                nameError.textContent = 'Имя не должно содержать цифры';
                return;
            } else {
                nameError.textContent = '';
            }

            if (name === '') {
                nameError.textContent = 'Имя не должно быть пустым';
                return;
            } else {
                nameError.textContent = '';
            }

            if (review === '') {
                reviewError.textContent = 'Отзыв не должен быть пустым';
                return;
            } else {
                reviewError.textContent = '';
            }

            alert('Спасибо за ваш отзыв!');
            reviewsModal.classList.add('hidden');
            nameField.value = '';
            reviewField.value = '';
        });
    }

    const feedbackLink = document.getElementById('feedback-link');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');
    const feedbackForm = document.getElementById('feedbackForm');
    const phoneField = document.getElementById('phone');
    const messageField = document.getElementById('message');
    const emailField = document.getElementById('email');

    if (feedbackLink && feedbackModal && closeFeedbackModal && feedbackForm && phoneField && messageField && emailField) {
        feedbackLink.addEventListener('click', function (e) {
            e.preventDefault();
            feedbackModal.classList.remove('hidden');
        });

        closeFeedbackModal.addEventListener('click', function () {
            feedbackModal.classList.add('hidden');
            phoneField.value = '+380';
            messageField.value = '';
            emailField.value = '';
            document.getElementById('phoneError').textContent = '';
            document.getElementById('messageError').textContent = '';
            document.getElementById('emailError').textContent = '';
        });

        window.addEventListener('click', function (e) {
            if (e.target == feedbackModal) {
                feedbackModal.classList.add('hidden');
                phoneField.value = '+380';
                messageField.value = '';
                emailField.value = '';
                document.getElementById('phoneError').textContent = '';
                document.getElementById('messageError').textContent = '';
                document.getElementById('emailError').textContent = '';
            }
        });

        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const phone = phoneField.value.trim();
            const message = messageField.value.trim();
            const email = emailField.value.trim();
            const phoneError = document.getElementById('phoneError');
            const messageError = document.getElementById('messageError');
            const emailError = document.getElementById('emailError');

            if (phone === '' || phone.length < 7 || !/^\+380\d{7,}$/.test(phone)) {
                phoneError.textContent = 'Введите корректный номер телефона (не менее 7 цифр)';
                return;
            } else {
                phoneError.textContent = '';
            }

            if (message === '') {
                messageError.textContent = 'Поле сообщения не должно быть пустым';
                return;
            } else {
                messageError.textContent = '';
            }

            if (email !== '' && !/^[^\s@]+@[^\s@]+$/.test(email)) {
                emailError.textContent = 'Введите корректный email';
                return;
            } else {
                emailError.textContent = '';
            }

            alert('Спасибо за ваше сообщение!');
            feedbackModal.classList.add('hidden');
            phoneField.value = '+380';
            messageField.value = '';
            emailField.value = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCart();
    setupEventListeners();
});

const closeCart = () => {
    document.getElementById('cartModal').classList.add('hidden');
}
