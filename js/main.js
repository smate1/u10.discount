// Данные о остатках товара для каждого цвета
let productStock = {
	blue: {
		available: 50, // количество доступно
		total: 540, // общее количество
	},
	red: {
		available: 50, // количество доступно
		total: 540,
	},
	black: {
		available: 0, // нет в наличии - будет показано "продано"
		total: 540,
	},
}

// Функция для загрузки данных о товарах из localStorage
function loadStockFromStorage() {
	const saved = localStorage.getItem('productStock')
	if (saved) {
		try {
			const parsedStock = JSON.parse(saved)
			// Проверяем структуру данных перед использованием
			if (parsedStock && typeof parsedStock === 'object') {
				productStock = { ...productStock, ...parsedStock }
			}
		} catch (e) {
			console.error('Ошибка при загрузке данных о товарах:', e)
		}
	}
}

// Функция для сохранения данных о товарах в localStorage
function saveStockToStorage() {
	try {
		localStorage.setItem('productStock', JSON.stringify(productStock))
	} catch (e) {
		console.error('Ошибка при сохранении данных о товарах:', e)
	}
}

// Загружаем данные при инициализации
loadStockFromStorage()

// Функция для обновления счетчика остатков
function updateStockDisplay(color) {
	const stock = productStock[color]
	const stockElements = document.querySelectorAll('.header__amount')

	stockElements.forEach(element => {
		const availableSpan = element.querySelector('span:first-child')
		const totalSpan = element.querySelector('span:last-child')

		if (availableSpan && totalSpan) {
			availableSpan.textContent = stock.available
			totalSpan.textContent = stock.total

			element.classList.remove('low-stock')

			if (stock.available > 0 && stock.available < 10) {
				element.classList.add('low-stock')
			}
		}
	})
}

// Функция для проверки доступности товара
function isProductAvailable(color) {
	return productStock[color].available > 0
}

// Функция для обновления состояния селекторов цвета
function updateColorPickersState() {
	const allColorPickers = document.querySelectorAll('.color-picker')

	allColorPickers.forEach(picker => {
		const color = picker.dataset.color
		const isAvailable = isProductAvailable(color)

		picker.classList.remove('sold-out', 'available')

		if (!isAvailable) {
			picker.classList.add('sold-out')
			picker.style.pointerEvents = 'none'
		} else {
			picker.classList.add('available')
			picker.style.pointerEvents = 'auto'
		}
	})
}

// Функция для уменьшения количества товара при заказе
function processPurchase(color) {
	if (productStock[color] && productStock[color].available > 0) {
		productStock[color].available--
		saveStockToStorage()

		// Обновляем отображение для всех элементов
		updateStockDisplay(color)
		updateColorPickersState()

		console.log(
			`Товар заказан! Остатки ${color}: ${productStock[color].available}`
		)

		// Запускаем событие для синхронизации между вкладками
		window.dispatchEvent(
			new StorageEvent('storage', {
				key: 'productStock',
				newValue: JSON.stringify(productStock),
			})
		)

		return true
	}
	return false
}

// Слушатель для синхронизации между вкладками браузера
window.addEventListener('storage', function (e) {
	if (e.key === 'productStock' && e.newValue) {
		try {
			const newStock = JSON.parse(e.newValue)
			productStock = newStock

			// Обновляем отображение на текущей вкладке
			const selectedPicker = document.querySelector('.color-picker.selected')
			const currentColor = selectedPicker
				? selectedPicker.dataset.color
				: 'blue'
			updateStockDisplay(currentColor)
			updateColorPickersState()
		} catch (error) {
			console.error('Ошибка синхронизации данных:', error)
		}
	}
})

// Функция для получения выбранного цвета товара
function getSelectedColor() {
	const selectedPicker = document.querySelector('.color-picker.selected')
	return selectedPicker ? selectedPicker.dataset.color : 'blue'
}

// Функция для имитации покупки товара (для тестирования)
function simulatePurchase(color) {
	if (productStock[color].available > 0) {
		productStock[color].available--
		saveStockToStorage()

		const selectedPicker = document.querySelector('.color-picker.selected')
		const currentColor = selectedPicker ? selectedPicker.dataset.color : 'blue'

		if (color === currentColor) {
			updateStockDisplay(color)
		}

		updateColorPickersState()

		console.log(
			`Товар куплен! Остатки ${color}: ${productStock[color].available}`
		)
	}
}

// Функции для тестирования (доступны в консоли браузера)
window.testProductStock = {
	checkStock: () => {
		console.log('Текущие остатки товара:')
		Object.entries(productStock).forEach(([color, stock]) => {
			console.log(`${color}: ${stock.available}/${stock.total}`)
		})
	},

	buyProduct: color => {
		if (!color) {
			console.log(
				'Использование: testProductStock.buyProduct("blue|red|black")'
			)
			return
		}
		simulatePurchase(color)
	},

	restockProduct: (color, amount = 10) => {
		if (productStock[color]) {
			productStock[color].available += amount
			saveStockToStorage()

			const selectedPicker = document.querySelector('.color-picker.selected')
			const currentColor = selectedPicker
				? selectedPicker.dataset.color
				: 'blue'

			if (color === currentColor) {
				updateStockDisplay(color)
			}

			updateColorPickersState()
			console.log(
				`Товар пополнен! ${color}: +${amount}, итого: ${productStock[color].available}`
			)
		}
	},

	resetStock: () => {
		productStock.blue.available = 50
		productStock.red.available = 50
		productStock.black.available = 0
		saveStockToStorage()

		const selectedPicker = document.querySelector('.color-picker.selected')
		const currentColor = selectedPicker ? selectedPicker.dataset.color : 'blue'
		updateStockDisplay(currentColor)
		updateColorPickersState()
		console.log('Остатки сброшены к начальным значениям')
	},
}

const galleries = {
	blue: [
		{
			type: 'image',
			src: './assets/images/bluster-2.avif',
			srcset:
				'./assets/images/bluster-2.avif 1x, ./assets/images/bluster-2@2x.avif 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Blue bluster 2',
		},
		{
			type: 'image',
			src: './assets/images/bluster-3.avif',
			srcset:
				'./assets/images/bluster-3.avif 1x, ./assets/images/bluster-3@2x.avif 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Blue bluster 3',
		},
		{
			type: 'image',
			src: './assets/images/bluster-4.avif',
			srcset:
				'./assets/images/bluster-4.avif 1x, ./assets/images/bluster-4@2x.avif 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Blue bluster 4',
		},
		{
			type: 'image',
			src: './assets/images/bluster-5.avif',
			srcset:
				'./assets/images/bluster-5.avif 1x, ./assets/images/bluster-5@2x.avif 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Blue bluster 5',
		},
		{ type: 'video', src: './assets/video/blaster.mp4' },
	],
	red: [
		{
			type: 'image',
			src: './assets/images/red.webp',
			srcset: './assets/images/red.webp 1x, ./assets/images/red@2x.webp 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Red version',
		},
	],
	black: [
		{
			type: 'image',
			src: './assets/images/black-1.webp',
			srcset:
				'./assets/images/black-1.webp 1x, ./assets/images/black-1@2x.webp 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Black version 1',
		},
		{
			type: 'image',
			src: './assets/images/black-2.webp',
			srcset:
				'./assets/images/black-2.webp 1x, ./assets/images/black-2@2x.webp 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Black version 2',
		},
		{
			type: 'image',
			src: './assets/images/black-3.webp',
			srcset:
				'./assets/images/black-3.webp 1x, ./assets/images/black-3@2x.webp 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Black version 3',
		},
	],
}

const thumbnailsContainer = document.getElementById('thumbnails')
const mainMediaContainer = document.getElementById('mainMediaContainer')
const colorPickers = document.querySelectorAll('.color-picker')

function updateMain(type, src) {
	mainMediaContainer.innerHTML = ''

	if (type === 'video') {
		const video = document.createElement('video')
		video.src = src
		video.autoplay = true
		video.muted = true
		video.loop = true
		video.playsInline = true
		video.preload = 'auto'
		video.controls = false
		video.disablePictureInPicture = true
		video.id = 'mainMedia'

		video.setAttribute('webkit-playsinline', 'true')
		video.setAttribute('x5-playsinline', 'true')
		video.setAttribute('x5-video-player-type', 'h5')
		video.setAttribute('x5-video-player-fullscreen', 'false')

		mainMediaContainer.appendChild(video)

		const playVideo = () => {
			video.play().catch(e => {
				console.warn('Autoplay prevented:', e)
				setTimeout(() => {
					video.play().catch(err => console.warn('Second attempt failed:', err))
				}, 100)
			})
		}

		video.addEventListener('loadeddata', playVideo)
		video.addEventListener('canplay', playVideo)

		if (video.readyState >= 3) {
			playVideo()
		}
	} else {
		const img = document.createElement('img')
		img.src = src
		img.id = 'mainMedia'

		const currentColor =
			document.querySelector('.color-picker.selected')?.dataset.color || 'blue'
		const altText =
			galleries[currentColor]?.find(item => item.src === src)?.alt || ''
		img.alt = altText

		mainMediaContainer.appendChild(img)
	}
}

// Обработчик отправки формы заказа
function handleOrderSubmission(form, phoneValue) {
	const selectedColor = getSelectedColor()

	// Проверяем доступность товара
	if (!isProductAvailable(selectedColor)) {
		alert('Вибачте, цей товар розпроданий!')
		return false
	}

	// Проверяем корректность номера телефона
	if (!phoneValue || phoneValue.length < 10) {
		alert('Будь ласка, введіть коректний номер телефону')
		return false
	}

	// Уменьшаем количество товара
	const success = processPurchase(selectedColor)

	if (success) {
		alert(`Дякуємо за замовлення! Ваш бластер (${selectedColor}) зарезервовано.
Залишилося товарів: ${productStock[selectedColor].available}
Ми зв'яжемося з вами найближчим часом.`)

		form.reset()
		closeOrderPopup()

		return true
	} else {
		alert('Помилка при оформленні замовлення. Спробуйте ще раз.')
		return false
	}
}

// Обработчик для кнопок заказа (открытие попапа только для кнопок вне форм)
document.querySelectorAll('#order-btn').forEach(btn => {
	btn.addEventListener('click', function (e) {
		// Проверяем, находится ли кнопка внутри формы
		const form = btn.closest('form')

		// Если кнопка внутри формы, позволяем форме обработать отправку
		if (form) {
			// Не прерываем стандартное поведение - форма отправится
			return
		}

		// Если кнопка НЕ в форме, открываем попап
		e.preventDefault()

		const popupPhoneInput = document.getElementById('phoneInput')
		if (popupPhoneInput) {
			popupPhoneInput.value = ''
		}

		document.getElementById('orderPopup').classList.add('active')
		document.body.classList.add('no-scroll')
	})
})

// Обработчик отправки формы заказа (в попапе)
document.addEventListener('DOMContentLoaded', function () {
	document
		.getElementById('orderForm')
		?.addEventListener('submit', function (e) {
			e.preventDefault()
			const form = e.target
			const phoneInput = form.querySelector('.phone-mask, #phoneInput')
			const phoneValue = phoneInput?.value.trim()
			handleOrderSubmission(form, phoneValue)
		})

	// Обработчики для всех остальных форм заказа на странице
	document.querySelectorAll('.order__form').forEach(form => {
		form.addEventListener('submit', function (e) {
			e.preventDefault()
			const phoneInput = form.querySelector('.phone-mask, .order__input')
			const phoneValue = phoneInput?.value.trim()
			handleOrderSubmission(form, phoneValue)
		})
	})

	// Обработчик для формы в футере
	document
		.querySelector('.footer__form')
		?.addEventListener('submit', function (e) {
			e.preventDefault()
			const phoneInput = e.target.querySelector('.order__input')
			const phoneValue = phoneInput?.value.trim()
			handleOrderSubmission(e.target, phoneValue)
		})
})

// Функция закриття попапу
function closeOrderPopup() {
	document.getElementById('orderPopup').classList.remove('active')
	document.body.classList.remove('no-scroll')
}

// Закриття попапу по кнопці
document.getElementById('popupClose')?.addEventListener('click', function () {
	closeOrderPopup()
})

// Закриття попапу по Escape
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		closeOrderPopup()
	}
})

// Закриття попапу по кліку на оверлей
document.getElementById('orderPopup')?.addEventListener('click', function (e) {
	if (e.target === this) {
		closeOrderPopup()
	}
})

// Обробник для кнопок choice__item-btn
document.querySelectorAll('.choice__item-btn').forEach(btn => {
	btn.addEventListener('click', function (e) {
		e.preventDefault()
		const popupPhoneInput = document.getElementById('phoneInput')
		if (popupPhoneInput) {
			popupPhoneInput.value = ''
		}
		document.getElementById('orderPopup').classList.add('active')
		document.body.classList.add('no-scroll')
	})
})

// Обробник для кнопок "Замовити дзвінок" в хедері
document.querySelectorAll('.header__call').forEach(btn => {
	btn.addEventListener('click', function (e) {
		e.preventDefault()
		const popupPhoneInput = document.getElementById('phoneInput')
		if (popupPhoneInput) {
			popupPhoneInput.value = ''
		}
		document.getElementById('orderPopup').classList.add('active')
		document.body.classList.add('no-scroll')
	})
})

function updateThumbnails(color) {
	const items = galleries[color]
	thumbnailsContainer.innerHTML = ''

	items.forEach(item => {
		const thumb = document.createElement(
			item.type === 'image' ? 'img' : 'video'
		)
		thumb.classList.add('thumbnail')
		thumb.src = item.src
		thumb.dataset.type = item.type
		thumb.dataset.src = item.src

		if (item.type === 'video') {
			thumb.muted = true
			thumb.loop = true
			thumb.playsInline = true
			thumb.poster = item.src.replace('.mp4', '-preview.avif')
		}

		thumb.onclick = () => updateMain(item.type, item.src)
		thumbnailsContainer.appendChild(thumb)
	})

	let mainItem
	if (color === 'blue') {
		mainItem = items.find(item => item.type === 'video') || items[0]
	} else {
		mainItem = items[0]
	}

	updateMain(mainItem.type, mainItem.src)

	updateStockDisplay(color)
	updateColorPickersState()
}

colorPickers.forEach(picker => {
	picker.addEventListener('click', () => {
		const color = picker.dataset.color

		if (!isProductAvailable(color)) {
			alert('Цей товар розпроданий!')
			return
		}

		colorPickers.forEach(p => p.classList.remove('selected'))
		picker.classList.add('selected')

		updateThumbnails(color)
	})
})

function preloadVideo() {
	const videoSrc = './assets/video/blaster.mp4'
	const video = document.createElement('video')
	video.src = videoSrc
	video.preload = 'auto'
	video.muted = true
	video.load()
}

// ===== ЛОГІКА ДЛЯ ВСІХ .likeToggle =====
function initLikeToggles() {
	document.querySelectorAll('.likeToggle').forEach(toggle => {
		const id = toggle.dataset.id
		if (!id) return

		const saved = localStorage.getItem(`heartLiked_${id}`)
		toggle.checked = saved === 'true'

		toggle.addEventListener('change', () => {
			localStorage.setItem(`heartLiked_${id}`, toggle.checked)
		})
	})
}

// Lazy load функції для оптимізації
function initializeSwiper() {
	if (typeof Swiper !== 'undefined') {
		const swiper = new Swiper('.mySwiper', {
			slidesPerView: 'auto',
			spaceBetween: 16,
			centeredSlides: true,
			freeMode: {
				enabled: true,
				sticky: false,
			},
			watchSlidesProgress: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			resistanceRatio: 0,
			watchOverflow: true,
			on: {
				reachEnd: function () {
					this.allowSlideNext = false
				},
				reachBeginning: function () {
					this.allowSlidePrev = false
				},
				fromEdge: function () {
					this.allowSlideNext = true
					this.allowSlidePrev = true
				},
				slideChange: function () {
					if (this.isEnd) {
						this.allowSlideNext = false
					} else {
						this.allowSlideNext = true
					}

					if (this.isBeginning) {
						this.allowSlidePrev = false
					} else {
						this.allowSlidePrev = true
					}
				},
			},
		})
	}
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', function () {
	// Загружаем данные о товарах при инициализации
	loadStockFromStorage()

	initializeSwiper()

	if (typeof IMask !== 'undefined') {
		const phoneInputs = document.querySelectorAll('.phone-mask')
		phoneInputs.forEach(input => {
			IMask(input, {
				mask: '+{38}(000)000-00-00',
			})
		})
	}

	if ('IntersectionObserver' in window) {
		const lazyImages = document.querySelectorAll('img[loading="lazy"]')
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target
					img.loading = 'eager'
					observer.unobserve(img)
				}
			})
		})

		lazyImages.forEach(img => imageObserver.observe(img))
	}

	updateColorPickersState()

	const firstAvailableColor = Object.keys(productStock).find(
		color => productStock[color].available > 0
	)
	if (firstAvailableColor) {
		updateStockDisplay(firstAvailableColor)
	}
})

// Оптимізація для WebP/AVIF підтримки
function checkImageSupport() {
	return new Promise(resolve => {
		const webp = new Image()
		webp.onload = webp.onerror = () => {
			resolve(webp.height === 2)
		}
		webp.src =
			'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
	})
}

checkImageSupport().then(supportsWebP => {
	if (!supportsWebP) {
		console.log('WebP not supported, using fallback images')
	}
})

function openVideoModal() {
	const modal = document.getElementById('videoModal')
	if (modal) {
		modal.style.display = 'block'
		document.body.classList.add('no-scroll')
	}
}

function closeVideoModal() {
	const modal = document.getElementById('videoModal')
	if (modal) {
		modal.style.display = 'none'
		document.body.classList.remove('no-scroll')
		const video = modal.querySelector('video')
		if (video) {
			video.pause()
			video.currentTime = 0
		}
	}
}

// Запуск при завантаженні сторінки
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		// Загружаем данные о товарах при инициализации
		loadStockFromStorage()

		preloadVideo()
		updateThumbnails('blue')
		initLikeToggles()
		updateStockDisplay('blue')
		updateColorPickersState()
	})
} else {
	// Загружаем данные о товарах при инициализации
	loadStockFromStorage()

	preloadVideo()
	updateThumbnails('blue')
	initLikeToggles()
	updateStockDisplay('blue')
	updateColorPickersState()
}

document
	.getElementById('stickyOrderBtn')
	?.addEventListener('click', function (e) {
		e.preventDefault()
		const popupPhoneInput = document.getElementById('phoneInput')
		if (popupPhoneInput) {
			popupPhoneInput.value = ''
		}
		document.getElementById('orderPopup').classList.add('active')
		document.body.classList.add('no-scroll')
	})

function handleStickyButton() {
	const stickyBtn = document.getElementById('stickyOrderBtn')
	const scrollY = window.scrollY

	if (scrollY > 100) {
		stickyBtn.style.opacity = '1'
		stickyBtn.style.visibility = 'visible'
		stickyBtn.style.transform = 'scale(1)'
	} else {
		stickyBtn.style.opacity = '0'
		stickyBtn.style.visibility = 'hidden'
		stickyBtn.style.transform = 'scale(0.8)'
	}
}

window.addEventListener('scroll', handleStickyButton)

document.addEventListener('DOMContentLoaded', function () {
	const stickyBtn = document.getElementById('stickyOrderBtn')
	if (stickyBtn) {
		stickyBtn.style.opacity = '0'
		stickyBtn.style.visibility = 'hidden'
		stickyBtn.style.transform = 'scale(0.8)'
		stickyBtn.style.transition = 'all 0.3s ease'
		handleStickyButton()
	}
})
