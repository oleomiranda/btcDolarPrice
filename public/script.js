var socket = io()
var btcprice = document.getElementById('bitcoin')
var dolarprice = document.getElementById('dolar')


socket.on('lastPrice', prices => {
	formatPrice(prices)
})




function formatPrice(prices){
	btcprice.innerHTML = ``
}