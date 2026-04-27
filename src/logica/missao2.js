function calcularTroco(valorPago, totalVenda) {
	if (valorPago <totalVenda) {
		return 0
	}
	return valorPago - totalVenda
}

console.log(calcularTroco(20, 13.50))
console.log(calcularTroco(10, 13.50))
console.log(calcularTroco(50, 49,99))
