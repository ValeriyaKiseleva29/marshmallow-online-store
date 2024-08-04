const setCookie = (name, value, days) => {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
};

const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
};

const saveFormDataToCookies = () => {
    setCookie('customerName', document.getElementById('customerName').value, 7);
    setCookie('customerEmail', document.getElementById('customerEmail').value, 7);
    setCookie('city', document.getElementById('city').value, 7);
    setCookie('postalOffice', document.getElementById('postalOffice').value, 7);
    setCookie('phoneNumber', document.getElementById('phoneNumber').value, 7);
};

const loadFormDataFromCookies = () => {
    if (getCookie('customerName')) document.getElementById('customerName').value = getCookie('customerName');
    if (getCookie('customerEmail')) document.getElementById('customerEmail').value = getCookie('customerEmail');
    if (getCookie('city')) document.getElementById('city').value = getCookie('city');
    if (getCookie('postalOffice')) document.getElementById('postalOffice').value = getCookie('postalOffice');
    if (getCookie('phoneNumber')) document.getElementById('phoneNumber').value = getCookie('phoneNumber');
};

document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    saveFormDataToCookies();

    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const city = document.getElementById('city').value;
    const postalOffice = document.getElementById('postalOffice').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const totalAmount = document.getElementById('totalAmount').innerText;

    if (!/^\d+$/.test(phoneNumber)) {
        alert('Номер телефона должен содержать только цифры');
        return;
    }

    console.log('Имя клиента:', customerName);
    console.log('Email клиента:', customerEmail);
    console.log('Город:', city);
    console.log('Почтовое отделение:', postalOffice);
    console.log('Номер телефона:', phoneNumber);
    console.log('Сумма заказа:', totalAmount);

    alert('Заказ успешно отправлен!');

    clearFormAndCart();
    goBack();
});

const goBack = () => {
    window.location.href = 'index.html';
};

function clearFormAndCart() {
    document.getElementById('orderForm').reset();
    localStorage.removeItem('cart');
    updateTotalAmount();
    renderCartItems();
}

function updateTotalAmount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = 0;

    cart.forEach(item => {
        totalAmount += item.price * item.quantity;
    });

    document.getElementById('totalAmount').innerText = `${totalAmount.toFixed(2)} грн`;
    document.getElementById('cartTotalAmount').innerText = `${totalAmount.toFixed(2)} грн`;
}

const renderCartItems = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = '';

    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b');
        listItem.innerHTML = `
            <div class="w-full flex items-center justify-between">
                <span class="font-semibold w-40">${item.name}</span>
                 <div class="text-right">
                    <span>${(item.price * item.quantity).toFixed(2)} грн</span>
                </div>
                <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantityInput ml-2 border border-gray-300 rounded-md px-2 py-1 w-16 text-center">
            </div>
        `;
        cartItemsList.appendChild(listItem);
    });

    document.querySelectorAll('.quantityInput').forEach(input => {
        input.addEventListener('change', function() {
            const index = this.dataset.index;
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotalAmount();
                renderCartItems();
            } else {
                alert('Количество товара должно быть больше нуля');
                this.value = cart[index].quantity;
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', function () {
    updateTotalAmount();
    renderCartItems();
    loadFormDataFromCookies();
});

const apiKey = "56cbc2dffe2a0fba48d813e00efea8ff";
const url = "https://api.novaposhta.ua/v2.0/json/";

const getAddresses = async (searchQuery) => {
    const addressEntity = {
        apiKey: apiKey,
        modelName: "AddressGeneral",
        calledMethod: "searchSettlements",
        methodProperties: {
            CityName: searchQuery,
            Limit: 50,
            Page: 1
        }
    };

    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressEntity)
    });

    const content = await rawResponse.json();
    return content.data[0].Addresses;
};

const getWarehouses = async (cityRef) => {
    const warehouseEntity = {
        apiKey: apiKey,
        modelName: "AddressGeneral",
        calledMethod: "getWarehouses",
        methodProperties: {
            CityRef: cityRef,
            Page: 1,
            Limit: "500",
            Language: "UA",
        }
    };

    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(warehouseEntity)
    });

    const content = await rawResponse.json();
    return content.data;
};

const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

document.getElementById('city').addEventListener('input', debounce(async function () {
    const cityInput = this.value;
    const cityListOptions = Array.from(document.querySelectorAll('#cityList option'));
    const matchedOption = cityListOptions.find(option => option.value === cityInput);

    if (cityInput.length >= 3 && !matchedOption) {
        const addresses = await getAddresses(cityInput);
        const cityList = document.getElementById('cityList');
        cityList.innerHTML = '';

        addresses.forEach(address => {
            const option = document.createElement('option');
            option.value = address.Present;
            option.dataset.deliveryCity = address.DeliveryCity;
            cityList.appendChild(option);
        });
    }
}, 300));

document.getElementById('city').addEventListener('change', async function () {
    const selectedCity = Array.from(document.querySelectorAll('#cityList option')).find(option => option.value === this.value);
    const warehouseList = document.getElementById('warehouseList');
    warehouseList.innerHTML = '';

    if (selectedCity) {
        const cityRef = selectedCity.dataset.deliveryCity;
        console.log(cityRef);
        const warehouses = await getWarehouses(cityRef);
        const selectedOffice = document.getElementById('postalOffice');
        selectedOffice.value = '';

        warehouses.forEach(warehouse => {
            const option = document.createElement('option');
            option.value = warehouse.Description;
            warehouseList.appendChild(option);
        });
    }
});