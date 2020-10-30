'use strict';


const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const menuTitle = document.querySelector('.menu-title');
const modalBody = document.querySelector('.modal-body');
const modalPriceTag = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');



const cartStorage = JSON.parse(localStorage.getItem('cart'));
const cart = (cartStorage === null) ? [] : cartStorage;

let login = localStorage.getItem('jsIntensiv');
console.log(cart);

const getData = async function (url) {

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`ошибка по адресу ${url}, статус ошибка ${response.status}`)
	}
	return await response.json();
};

function toggleModal() {
	modal.classList.toggle("is-open");
};

function toggleModalAuth() {
	modalAuth.classList.toggle("is-open");
	// очищаем форму при нажатии крестика
	loginInput.value = '';
	passwordInput.value = '';
};

function authorized() {

	function logOut() {
		login = null;
		localStorage.removeItem('jsIntensiv');
		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		cartButton.style.display = '';
		containerPromo.classList.remove('hide');
		restaurants.classList.remove('hide');
		menu.classList.add('hide');
		buttonOut.removeEventListener('click', logOut);
		localStorage.clear();
		checAuth();
	}

	console.log('Авторизован');
	userName.textContent = login;

	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'flex';
	cartButton.style.display = 'flex';

	buttonOut.addEventListener('click', logOut)
};

function notAuthorized() {
	console.log('Не авторизован');

	function logIn(event) {
		event.preventDefault();
		loginInput.placeholder = '';
		login = loginInput.value;
		if (login !== '') {
			localStorage.setItem('jsIntensiv', login);

			toggleModalAuth();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			logInForm.reset();
			checAuth();
		} else {
			loginInput.placeholder = 'Введите логин!'
		}

	}

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn)
};

function checAuth() {
	if (login) {
		authorized();
	} else {
		notAuthorized();
	}
};

function createCardRestaurant({ name, image, kitchen, price,
	products, stars, time_of_delivery: timeOfDelivery }) {


	const card = `
		<a class="card card-restaurant" data-products="${products}">
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery}</span>
				</div>
				<div class="card-info">
					<div class="rating">
						${stars}
					</div>
					<div class="price">От ${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
			</div>
		</a>
	`;


	cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

function createCardGood({ description, image, name, price, id }) {
	const card = document.createElement('div');
	card.className = 'card';

	card.insertAdjacentHTML('beforeend', `
		<img src="${image}" alt="image" class="card-image" />
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">
				${description}
				</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart" id="${id}">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold card-price">${price} ₽</strong>
			</div>
		</div>						
	`);

	cardsMenu.insertAdjacentElement('beforeend', card)
};

function openGoods(event) {

	const target = event.target;
	const restaurant = target.closest('.card-restaurant');

	if (restaurant) {

		cardsMenu.textContent = '';
		menuTitle.textContent = '';
		containerPromo.classList.add('hide');
		restaurants.classList.add('hide');
		menu.classList.remove('hide');

		const name = restaurant.querySelector('.card-title').textContent;
		const stars = restaurant.querySelector('.rating').textContent;
		const price = restaurant.querySelector('.price').textContent;
		const category = restaurant.querySelector('.category').textContent;

		const sectionHeading = document.createElement('div');
		sectionHeading.className = 'section-heading';
		sectionHeading.insertAdjacentHTML('afterbegin', `
			<h2 class="section-title restaurant-title">${name}</h2>
			<div class="card-info">
				<div class="rating">
					${stars}
				</div>
				<div class="price">${price}</div>
				<div class="category">${category}</div>
			</div>
		`);
		menuTitle.insertAdjacentElement('afterbegin', sectionHeading);

		getData(`./db/${restaurant.dataset.products}`).then(function (data) {
			data.forEach(createCardGood);
		});

	}

};

function addToCart(event) {
	const target = event.target;
	const buttonAddTocart = target.closest('.button-add-cart');

	if (buttonAddTocart) {
		const card = target.closest('.card');
		const title = card.querySelector('.card-title-reg').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = buttonAddTocart.id;
		const food = cart.find(function (item) {
			return item.id === id;
		});
		if (food) {
			food.count += 1;
		} else {
			cart.push({
				id,
				title,
				cost,
				count: 1
			});
		};
	};

};

function renderCart() {
	modalBody.textContent = '';


	cart.forEach(function ({ title, cost, count, id }) {
		const foodRow = `
		<div class="food-row">
			<span class="food-name">${title}</span>
			<strong class="food-price">${cost}</strong>
			<div class="food-counter">
				<button class="counter-button counter-minus" data-id=${id}>-</button>
				<span class="counter">${count}</span>
				<button class="counter-button counter-plus" data-id=${id}>+</button>
			</div>
		</div>
	`;
		modalBody.insertAdjacentHTML('afterbegin', foodRow);
	});

	const totalPtice = cart.reduce(function (result, item) {
		return result + (parseFloat(item.cost) * item.count);
	}, 0);
	modalPriceTag.textContent = totalPtice + ' ₽';

	localStorage.setItem('cart', JSON.stringify(cart));
};

function changeCount(event) {
	const target = event.target;
	if (target.classList.contains('counter-minus')) {
		const food = cart.find(function (item) {
			return item.id === target.dataset.id;
		});
		food.count--;
		if (food.count === 0) {
			cart.splice(cart.indexOf(food), 1);
		}
		renderCart();
	};

	if (target.classList.contains('counter-plus')) {
		const food = cart.find(function (item) {
			return item.id === target.dataset.id;
		});
		food.count++;
		renderCart();
	}
};
function clear() {
	cart.length = 0;
	renderCart();

}

function init() {
	getData('./db/partners.json').then(function (data) {
		data.forEach(createCardRestaurant);
	});

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	modalBody.addEventListener('click', changeCount);
	cartButton.addEventListener('click', function () {
		renderCart();
		toggleModal();
	});
	cardsMenu.addEventListener('click', addToCart);
	clearCart.addEventListener('click', clear);

	close.addEventListener("click", toggleModal);

	//cardsRestaurants.addEventListener('click', openGoods);

	cardsRestaurants.addEventListener('click', function () {
		if (login) {

			openGoods(event);
		} else {
			toggleModalAuth();
		}
	});


	logo.addEventListener('click', function () {
		containerPromo.classList.remove('hide');
		restaurants.classList.remove('hide');
		menu.classList.add('hide');
	})

	checAuth();

}

init();
