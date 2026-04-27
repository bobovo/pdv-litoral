let carrinho = []
let historicoVendas = []

function adicionarItem(nome, preco, quantidade) {
	let item = {
		nome: nome,
		preco: preco,
		quantidade: quantidade,
		subtotal: preco * quantidade
	}
	carrinho.push(item)
}

function calcularTotal() {
	let total = 0
	for (let item of carrinho) {
		total = total + item.subtotal
	}
	return total
}

function finalizarVenda(valorPago){
	let total = calcularTotal()

	if (valorPago < total) {
		console.log("Valor insuficiente!")
		return
	}
	let venda = {
		itens: carrinho,
		total: total,
		valorPago: valorPago,
		troco: valorPago - total,
		data: new Date().toLocaleDateString("pt-BR"),
		hora: new Date().toLocalTimeString("pt-BR")
	}

	historicoVendas.push(venda)
	carrinho = []

	console.log("Venda finalizada!")
	console.log("Total:", venda.total)
	console.log("Troco:", venda.troco)
	console.log("Data:", venda.data)
	console.log("Hora:", venda.Hora)
}

adicionarItem("Sacola 25x35", 4.50, 3)
adicionarItem("Copo 200ml", 8.90, 2)

console.log("--- Venda 1 ---")
finalizarVenda(50)

console.log("--- Carrinho depois ---")
console.log(carrinho)

console.log("--- Historico ---")
console.log(historicoVendas)