// Оптимізовані скрипти для u10.discount

// Phone mask script
document.addEventListener('DOMContentLoaded', function () {
	const phoneMasks = document.querySelectorAll('.phone-mask')
	phoneMasks.forEach(input => {
		input.addEventListener('input', function () {
			let value = input.value.replace(/\D/g, '')
			if (value.length > 10) value = value.slice(0, 10)

			const parts = [
				value.slice(0, 3),
				value.slice(3, 6),
				value.slice(6, 8),
				value.slice(8, 10),
			].filter(Boolean)

			input.value = parts.join('-')
		})
	})
})

// Order form submission
document.addEventListener('DOMContentLoaded', function () {
	const orderForm = document.querySelector('.order-popup__form')
	if (orderForm) {
		orderForm.addEventListener('submit', async function (e) {
			e.preventDefault()

			const countryCode = document.getElementById('countrySelect').value
			const phone = document.getElementById('phoneInput').value.trim()
			const fullPhone = `${countryCode} ${phone}`

			const noCall = document.getElementById('noCallCheckbox').checked
			const selectedColor =
				document.querySelector('.color-picker.selected')?.dataset.color ||
				'не вибрано'
			const productName = 'Водяний пістолет Weal Maker'
			const price = '1099₴'

			const message = `
🛒 НОВЕ ЗАМОВЛЕННЯ

📦 Товар: ${productName}
🎨 Колір: ${selectedColor}
💰 Ціна: ${price}
📞 Телефон: ${fullPhone}
📵 Не дзвонити: ${noCall ? '✅' : '❌'}
      `

			const token = '7778812492:AAHYUPIK9mvPmaWwxnScL9IrrrnUlaUYJXQ'
			const chatId = '-4962267225'
			const url = `https://api.telegram.org/bot${token}/sendMessage`

			try {
				const res = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ chat_id: chatId, text: message }),
				})

				if (res.ok) {
					if (
						typeof simulatePurchase === 'function' &&
						selectedColor !== 'не вибрано'
					) {
						simulatePurchase(selectedColor)
					}
					window.location.href = '/thank-you.html'
				} else {
					alert('❌ Помилка при надсиланні. Спробуйте пізніше.')
				}
			} catch (error) {
				console.error('Помилка:', error)
				alert('❌ Не вдалося надіслати замовлення.')
			}
		})
	}
})

// Color picker functionality
document.addEventListener('DOMContentLoaded', function () {
	const mainImage = document.querySelector('.order-popup__main-img')
	const colorPickers = document.querySelectorAll('.color-picker')

	colorPickers.forEach(picker => {
		picker.addEventListener('click', () => {
			const newImage = picker.getAttribute('data-img')
			if (newImage && mainImage) {
				mainImage.src = newImage

				// Highlight active thumbnail
				colorPickers.forEach(p => p.classList.remove('active'))
				picker.classList.add('active')
			}
		})
	})
})

// Swiper initialization (only load when needed)
function initSwiper() {
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

// Burger menu functionality
document.addEventListener('DOMContentLoaded', function () {
	const burger = document.getElementById('burger')
	const navMenu = document.getElementById('navMenu')
	const overlay = document.getElementById('overlay')

	if (burger && navMenu && overlay) {
		const navLinks = navMenu.querySelectorAll('a')

		function toggleMenu() {
			burger.classList.toggle('active')
			navMenu.classList.toggle('active')
			overlay.classList.toggle('active')
			document.body.classList.toggle('no-scroll')
		}

		burger.addEventListener('click', toggleMenu)
		overlay.addEventListener('click', toggleMenu)

		navLinks.forEach(link => {
			link.addEventListener('click', () => {
				burger.classList.remove('active')
				navMenu.classList.remove('active')
				overlay.classList.remove('active')
				document.body.classList.remove('no-scroll')
			})
		})
	}
})

// Video modal functionality
function openVideoModal() {
	const modal = document.getElementById('videoModal')
	const video = document.getElementById('videoPlayer')
	if (modal && video) {
		modal.style.display = 'flex'
		video.currentTime = 0
		video.play()
	}
}

function closeVideoModal() {
	const modal = document.getElementById('videoModal')
	const video = document.getElementById('videoPlayer')
	if (modal && video) {
		video.pause()
		video.currentTime = 0
		modal.style.display = 'none'
	}
}

// Lazy load Swiper when needed
document.addEventListener('DOMContentLoaded', function () {
	const swiperContainer = document.querySelector('.mySwiper')
	if (swiperContainer) {
		// Load Swiper script dynamically
		const script = document.createElement('script')
		script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
		script.onload = initSwiper
		document.head.appendChild(script)
	}
})

// Expose global functions
window.openVideoModal = openVideoModal
window.closeVideoModal = closeVideoModal
