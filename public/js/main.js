var socket = io()
var btcprice = document.getElementById('bitcoin') 
var dolarprice = document.getElementById('dolar')


socket.on('lastPrice', prices => {
	formatPrice(prices)
})

socket.on('prices', prices => {
	formatPrice(prices) 
})

//funcao para mostrar os preços 
function formatPrice(prices){ 
	btcprice.innerHTML = `US$${prices[1].USD.buy} <br> R$${prices[1].BRL.buy}`
	dolarprice.innerHTML = `R$${prices[0].USD.bid}`
}

//manda request para update 
setInterval(() => {
	socket.emit('updatePrice')	
}, 30000);