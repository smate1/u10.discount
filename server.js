const express = require('express')
const fs = require('fs')
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const PORT = 3000

// Статичні файли
app.use(express.static(__dirname))
app.use(express.json())

// Отримати поточну кількість товару
app.get('/stock', (req, res) => {
	const data = JSON.parse(fs.readFileSync('product.json', 'utf8'))
	res.json({ stock: data.stock })
})

// Зробити замовлення
app.post('/buy', (req, res) => {
	let data = JSON.parse(fs.readFileSync('product.json', 'utf8'))
	if (data.stock > 0) {
		data.stock -= 1
		fs.writeFileSync('product.json', JSON.stringify(data))
		io.emit('stockUpdated', data.stock)
		res.json({ success: true, stock: data.stock })
	} else {
		res.status(400).json({ success: false, message: 'Товар закінчився' })
	}
})

// WebSocket
io.on('connection', socket => {
	console.log('Підключено користувача')
})

server.listen(PORT, () => {
	console.log(`Сервер запущено: http://localhost:${PORT}`)
})
