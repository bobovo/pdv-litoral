let carrinho[]

function adicionarItem(nome, preco, quantidade) {
	let item = {
		nome: nome,
		preco: preco,
		quantidade: quantidade,
		subtotal: preco * quantidade
	}
	carrinho.push(item)
}

function removerItem(nome) {
	carrinho = carrinho.filter(function(item) {
		return item.nome !== nome
	})
}

function calcularTotal() {
	let total = 0
	for (let item of carrinho) {
		total = total + item.subtotal
	}
}

adicionarItem("Sacola 25x35", 4.50, 3)
adicionarItem("Copo 200ml", 8.90, 2)
adicionarItem("Garfo plastico", 12.00, 1)

console.log("Total antes:", calcularTotal())

removerItem("Copo 200ml")

console.log("Total depois:", calcularTotal())
console.log("Itens:", carrinho)
