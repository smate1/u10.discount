// Данные о остатках товара для каждого цвета (будут загружены с сервера)


// Функция для обновления состояния селекторов цвета
function updateColorPickersState() {
	const allColorPickers = document.querySelectorAll('.color-picker')

	allColorPickers.forEach(picker => {
		const color = picker.dataset.color
		const isAvailable = isProductAvailable(color)

		// Удаляем старые классы
		picker.classList.remove('sold-out', 'available')

		if (!isAvailable) {
			picker.classList.add('sold-out')
			picker.style.pointerEvents = 'none' // отключаем клики
		} else {
			picker.classList.add('available')
			picker.style.pointerEvents = 'auto' // включаем клики
		}
	})
}

// Функция для имитации покупки товара (для тестирования)
async function simulatePurchase(color) {
	if (productStock[color].available > 0) {
		// Сначала обновляем на сервере
		const updated = await updateStockOnServer(color)
		if (!updated) {
			alert('Не вдалося оновити залишки на сервері. Спробуйте ще раз.')
			return
		}

		// Находим текущий выбранный цвет
		const selectedPicker = document.querySelector('.color-picker.selected')
		const currentColor = selectedPicker ? selectedPicker.dataset.color : 'blue'

		// Обновляем дисплей если это текущий цвет
		if (color === currentColor) {
			updateStockDisplay(color)
		}

		// Обновляем состояние всех селекторов
		updateColorPickersState()

		console.log(
			`Товар куплен! Остатки ${color}: ${productStock[color].available}`
		)
	}
}

// Функции для тестирования (доступны в консоли браузера)
window.testProductStock = {
	// Просмотр текущих остатков
	checkStock: () => {
		console.log('Текущие остатки товара:')
		Object.entries(productStock).forEach(([color, stock]) => {
			console.log(`${color}: ${stock.available}/${stock.total}`)
		})
	},

	// Имитация покупки
	buyProduct: color => {
		if (!color) {
			console.log(
				'Использование: testProductStock.buyProduct("blue|red|black")'
			)
			return
		}
		simulatePurchase(color)
	},

	// Пополнение товара (только локально, для теста)
	restockProduct: (color, amount = 10) => {
		if (productStock[color]) {
			productStock[color].available += amount

			// Обновляем дисплей если это текущий цвет
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

	// Сброс к начальным остаткам (только локально, для теста)
	resetStock: () => {
		productStock.blue.available = 50
		productStock.red.available = 50
		productStock.black.available = 0

		const selectedPicker = document.querySelector('.color-picker.selected')
		const currentColor = selectedPicker ? selectedPicker.dataset.color : 'blue'
		updateStockDisplay(currentColor)
		updateColorPickersState()
		console.log('Остатки сброшены к начальным значениям')
	},

	// Примусове завантаження залишків з сервера
	loadFromServer: () => {
		loadStockFromServer()
	},

	// Тестування покупки через сервер
	buyFromServer: async color => {
		if (!color) {
			console.log(
				'Використання: testProductStock.buyFromServer("blue|red|black")'
			)
			return
		}
		const success = await updateStockOnServer(color)
		if (success) {
			console.log(
				`✅ Покупка успішна! Залишилось ${productStock[color].available}`
			)
			// Оновлюємо дисплей
			const selectedPicker = document.querySelector('.color-picker.selected')
			const currentColor = selectedPicker
				? selectedPicker.dataset.color
				: 'blue'
			if (color === currentColor) {
				updateStockDisplay(color)
			}
			updateColorPickersState()
		} else {
			console.log('❌ Помилка при покупці')
		}
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
		{ type: 'video', src: './assets/video/blaster.mp4' }, // відео — без srcset
	],
	red: [
		{
			type: 'image',
			src: './assets/images/red.webp',
			srcset: './assets/images/red.webp 1x, ./assets/images/red@2x.webp 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Red version',
		},
		{
			type: 'image',
			src: './assets/images/red-2.webp',
			srcset: './assets/images/red.webp 1x, ./assets/images/red@2x.webp 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Red version',
		},
		{
			type: 'image',
			src: './assets/images/red-3.webp',
			srcset: './assets/images/red.webp 1x, ./assets/images/red@2x.webp 2x',
			sizes: '(max-width: 768px) 100vw, 50vw',
			alt: 'Red version',
		},
		{
			type: 'image',
			src: './assets/images/red-4.jpg',
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

		// Шукаємо alt у галереї
		const currentColor =
			document.querySelector('.color-picker.selected')?.dataset.color || 'blue'
		const altText =
			galleries[currentColor]?.find(item => item.src === src)?.alt || ''
		img.alt = altText

		mainMediaContainer.appendChild(img)
	}
}

document.querySelectorAll('#order-btn').forEach(btn => {
	btn.addEventListener('click', function (e) {
		e.preventDefault()

		// Знаходимо інпут з номером у цій же формі
		const form = btn.closest('form')

		// Якщо кнопка знаходиться всередині форми
		if (form) {
			const input = form.querySelector('.phone-mask')
			const phoneValue = input?.value.trim()

			// Перевірка, чи заповнено номер
			if (!phoneValue || phoneValue.length < 10) {
				alert('Будь ласка, введіть свій номер телефону')
				input?.focus()
				return
			}

			// Вставити номер у попап
			const popupPhoneInput = document.getElementById('phoneInput')
			if (popupPhoneInput) {
				popupPhoneInput.value = phoneValue
			}
		} else {
			// Якщо кнопка НЕ в формі, очищаємо поле номера у попапі
			const popupPhoneInput = document.getElementById('phoneInput')
			if (popupPhoneInput) {
				popupPhoneInput.value = ''
			}
		}

		// Відкриваємо попап
		document.getElementById('orderPopup').classList.add('active')
		document.body.classList.add('no-scroll')
	})
})

// Функція закриття попапу
function closeOrderPopup() {
	document.getElementById('orderPopup').classList.remove('active')
	document.body.classList.remove('no-scroll')
}

// Закриття попапу по кнопці
document.getElementById('popupClose').addEventListener('click', function () {
	closeOrderPopup()
})

// Закриття попапу по Escape
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		closeOrderPopup()
	}
})

// Закриття попапу по кліку на оверлей
document.getElementById('orderPopup').addEventListener('click', function (e) {
	// Закриваємо тільки якщо клікнули на сам попап (оверлей), а не на його контент
	if (e.target === this) {
		closeOrderPopup()
	}
})

// Обробник для кнопок choice__item-btn
document.querySelectorAll('.choice__item-btn').forEach(btn => {
	btn.addEventListener('click', function (e) {
		e.preventDefault()

		// Очищаємо поле номера у попапі для нового замовлення
		const popupPhoneInput = document.getElementById('phoneInput')
		if (popupPhoneInput) {
			popupPhoneInput.value = ''
		}

		// Відкриваємо попап
		document.getElementById('orderPopup').classList.add('active')
		document.body.classList.add('no-scroll')
	})
})

// Обробник для кнопок "Замовити дзвінок" в хедері
document.querySelectorAll('.header__call').forEach(btn => {
	btn.addEventListener('click', function (e) {
		e.preventDefault()

		// Очищаємо поле номера у попапі для нового замовлення
		const popupPhoneInput = document.getElementById('phoneInput')
		if (popupPhoneInput) {
			popupPhoneInput.value = ''
		}

		// Відкриваємо попап
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

	// Обновляем счетчик остатков и состояние селекторов цвета
	updateStockDisplay(color)
	updateColorPickersState()
}

colorPickers.forEach(picker => {
	picker.addEventListener('click', () => {
		const color = picker.dataset.color

		// Проверяем доступность товара перед переключением
		if (!isProductAvailable(color)) {
			alert('Цей товар розпроданий!')
			return
		}

		// Удаляем активный класс со всех селекторов цвета
		colorPickers.forEach(p => p.classList.remove('selected'))
		// Добавляем активный класс к выбранному
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

		// Завантаження стану
		const saved = localStorage.getItem(`heartLiked_${id}`)
		toggle.checked = saved === 'true'

		// Збереження при зміні
		toggle.addEventListener('change', () => {
			localStorage.setItem(`heartLiked_${id}`, toggle.checked)
		})
	})
}

// Запуск при завантаженні сторінки
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', async () => {
		preloadVideo()
		updateThumbnails('blue')
		initLikeToggles()
		await loadStockFromServer()
		updateStockDisplay('blue')
		updateColorPickersState()
		startStockUpdateInterval()
	})
} else {
	;(async () => {
		preloadVideo()
		updateThumbnails('blue')
		initLikeToggles()
		await loadStockFromServer()
		updateStockDisplay('blue')
		updateColorPickersState()
		startStockUpdateInterval()
	})()
}

// Обробник для sticky кнопки замовлення
document
	.getElementById('stickyOrderBtn')
	.addEventListener('click', function (e) {
		e.preventDefault()

		// Очищаємо поле номера у попапі для нового замовлення
		const popupPhoneInput = document.getElementById('phoneInput')
		if (popupPhoneInput) {
			popupPhoneInput.value = ''
		}

		// Відкриваємо попап
		document.getElementById('orderPopup').classList.add('active')
		document.body.classList.add('no-scroll')
	})

// Функція для показу/приховування sticky кнопки в залежності від прокрутки
// function handleStickyButton() {
// 	const stickyBtn = document.getElementById('stickyOrderBtn')
// 	const scrollY = window.scrollY

// 	if (scrollY > 100) {
// 		stickyBtn.style.opacity = '1'
// 		stickyBtn.style.visibility = 'visible'
// 		stickyBtn.style.transform = 'scale(1)'
// 	} else {
// 		stickyBtn.style.opacity = '0'
// 		stickyBtn.style.visibility = 'hidden'
// 		stickyBtn.style.transform = 'scale(0.8)'
// 	}
// }

// window.addEventListener('scroll', handleStickyButton)

// document.addEventListener('DOMContentLoaded', function () {
// 	const stickyBtn = document.getElementById('stickyOrderBtn')
// 	// Початково приховуємо кнопку
// 	stickyBtn.style.opacity = '0'
// 	stickyBtn.style.visibility = 'hidden'
// 	stickyBtn.style.transform = 'scale(0.8)'
// 	stickyBtn.style.transition = 'all 0.3s ease'

// 	handleStickyButton()
// })
