const express = require("express")
const app = express()
const sever = app.listen(8081, () => console.log("Rodando..."))
const io = require("socket.io")(Server)
const handlebars = require("express-handlebars")
const axios = require("axios")


app.set("view engine", "handlebars")
app.engine("handlebars", handlebars)


lastRequest = ""
lastPrices = []
io.on("connect", socket => {
	socket.emit('lastPrice', lastPrices)

	function throttle(delay){
		
	}


	socket.on('updatePrice', () => {
		throttle(5000)
	})
})