const express = require('express')
const app = express()
const server = app.listen(8081, console.log('rodando'))
const io = require("socket.io")(server)
const handlebars = require("express-handlebars")
const axios = require("axios")


app.set("view engine", "handlebars")
app.engine("handlebars", handlebars({ defaultLayout: false }))
app.use(express.static('public'))

lastRequest = '' //salva em milisegundos a hora do ultimo request para update
lastPrices = [] //salva o ultimo preço 
const errorMsg = 'Houve um erro. Tente novamente mais tarde'

io.on("connect", socket => {

	if(lastPrices.length == 0){ //checa se tem algum valor salvo no array de preços, se nao tiver faz request
		(async() => {			//para depois retornar os valores para o usuario na primeira conexao 					
			try{
				const dolar = await axios('https://economia.awesomeapi.com.br/all/USD')
				const btc =  await axios('https://blockchain.info/ticker')
				
				lastPrices.push(dolar.data)
				lastPrices.push(btc.data) 
				
				socket.emit('lastPrice', lastPrices)
			}catch (err){
				socket.emit('err', errorMsg) //Error handler
			}
		})()
	}else{

		return socket.emit('lastPrice', lastPrices) 
	
	}


	function sendUpdate() { //faz o update dos valores 
		socket.emit('prices', lastPrices)
		socket.broadcast.emit('prices', lastPrices)
	}


	socket.on('updatePrice', async () => {
		
		now = Date.now() //pega o horario de agora
		delay = 30000 //delay para cada update
		//se o valor da hora que recebeu request para update menos o valor da hr do ultimo update for maior ou igual o delay faz um novo update
		
		if((now - lastRequest) >= delay){ 
			try{
			
			const dolar = await axios('https://economia.awesomeapi.com.br/all/USD')
			const btc = await axios('https://blockchain.info/ticker')
			
			lastPrices.push(dolar.data) //manda valor do dolar para o array 
			lastPrices.push(btc.data) //manda valor do btc para o array 
			lastRequest = Date.now() //salva o horario do ultimo update
			sendUpdate() //chama a funçao que faz update dos valores
			
		}catch (err){
				socket.emit('err', errorMsg) //Error handler
			}
		}
	})
})

app.get("/", (req, res) => {
	res.render('index')
})