let carrinho= []

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

adicionarItem("Sacola 25X35" , 4.50,3)
adicionarItem("Copo 200ML" , 8.90, 2)
adicionarItem("Garfo plastico" , 12.00,1)

console.log(carrinho)
console.log("Total:", calcularTotal())
