const galleries = {
	blue: [
		{ type: 'image', src: './assets/images/bluster-2.jpg' },
		{ type: 'image', src: './assets/images/bluster-3.jpg' },
		{ type: 'image', src: './assets/images/bluster-4.jpg' },
		{ type: 'image', src: './assets/images/bluster-5.jpg' },
		{ type: 'video', src: './assets/video/blaster.mp4' },
	],
	red: [{ type: 'image', src: './assets/images/red.webp' }],
	black: [
		{ type: 'image', src: './assets/images/black-1.webp' },
		{ type: 'image', src: './assets/images/black-2.webp' },
		{ type: 'image', src: './assets/images/black-3.webp' },
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
		mainMediaContainer.appendChild(img)
	}
}

document.querySelectorAll('#order-btn').forEach(btn => {
	btn.addEventListener('click', function (e) {
		e.preventDefault()

		// Знаходимо інпут з номером у цій же формі
		const form = btn.closest('form')
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

		// Відкриваємо попап
		document.getElementById('orderPopup').classList.add('active')
	})
})

// Закриття попапу по кнопці
document.getElementById('popupClose').addEventListener('click', function () {
	document.getElementById('orderPopup').classList.remove('active')
})

// Закриття попапу по Escape
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		document.getElementById('orderPopup').classList.remove('active')
	}
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
			thumb.poster = item.src.replace('.mp4', '-preview.png')
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
}

colorPickers.forEach(picker => {
	picker.addEventListener('click', () => {
		const color = picker.dataset.color
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
	document.addEventListener('DOMContentLoaded', () => {
		preloadVideo()
		updateThumbnails('blue')
		initLikeToggles()
	})
} else {
	preloadVideo()
	updateThumbnails('blue')
	initLikeToggles()
}
