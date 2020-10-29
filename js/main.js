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

let login = localStorage.getItem('jsIntensiv');


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
	buttonOut.style.display = 'block';



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

function createCardGood({ description, image, name, price }) {
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
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">${price} ₽</strong>
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



function init() {
	getData('./db/partners.json').then(function (data) {
		data.forEach(createCardRestaurant);
	});

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);

	cartButton.addEventListener("click", toggleModal);

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
