var http = require('http')
var fs = require('fs')
var path = require('path')
var criarBanco = require('./banco')

criarBanco().then(function(banco) {
  var db = banco.db
  var salvar = banco.salvar

  var server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    if (req.url === '/produtos-html') {
      var prodHtmlPath = path.join(__dirname, '../src/logica/produtos.html')
      var prodHtml = fs.readFileSync(prodHtmlPath)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
      res.end(prodHtml)
      return
    }

    if (req.url === '/produtos' && req.method === 'POST') {
      var body = ''
      req.on('data', function(chunk) {body += chunk })
      req.on('end', function() {
        var p = JSON.parse(body)
        db.run(
          'INSERT INTO produtos (nome, preco, estoque) VALUES (?,?,?)',
          [p.nome, p.preco, p.estoque]
          )
          salvar()
          res.writeHead(200)
          res.end(JSON.stringify({ ok: true }))
      })
      return
    }

    if (req.url.startsWith('/produtos/') && req.method === 'DELETE') {
      var id = req.url.split('/')[2]
      db.run('DELETE FROM produtos WHERE id = ?', [id])
      salvar()
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
      return
    }

    if (req.url === '/historico-html') {
      var histPath = path.join(__dirname, '../src/logica/historico.html')
      var histHtml = fs.readFileSync(histPath)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(histHtml)
      return
    }

    if (req.url === '/historico' && req.method === 'GET') {
      var vendasResult = db.exec('SELECT * FROM vendas ORDER BY id DESC')
      var todasVendas = vendasResult.length > 0 ? vendasResult[0].values.map(function(row) {
        var venda_id = row[0]
        var itensResult = db.exec('SELECT * FROM itens_venda WHERE venda_id = ' + venda_id)
        var itens = itensResult.length > 0 ? itensResult[0].values.map(function(i) {
          return { id: i[0], venda_id: i[1], produto_id: i[2], nome: i[3], preco: i[4], quantidade: i[5], subtotal: i[6] }
        }) : [];
        return { id: row[0], total: row[1], forma_pag: row[2], data_hora: row[3], itens: itens }
      }) : [];
      res.writeHead(200)
      res.end(JSON.stringify(todasVendas))
      return
    }

    if (req.url === '/' || req.url === '/pdv') {
      var htmlPath = path.join(__dirname, '../src/logica/missao9.html')
      var html = fs.readFileSync(htmlPath)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html)
      return
    }

    res.setHeader('Content-Type', 'application/json')

    if (req.url === '/produtos' && req.method === 'GET') {
      var resultado = db.exec('SELECT * FROM produtos')
      var produtos = resultado[0].values.map(function(row) {
        return { id: row[0], nome: row[1], preco: row[2], estoque: row[3] }
      })
      res.writeHead(200)
      res.end(JSON.stringify(produtos))
      return
    }

    if (req.url === '/vendas' && req.method === 'POST') {
      var body = ''
      req.on('data', function(chunk) { body += chunk })
      req.on('end', function() {
        var venda = JSON.parse(body)

        db.run(
          'INSERT INTO vendas (total, forma_pag, data_hora) VALUES (?,?,?)',
          [venda.total, venda.forma_pag, venda.data_hora]
        )

        var idResult = db.exec('SELECT last_insert_rowid()')
        var venda_id = idResult[0].values[0][0]

        venda.itens.forEach(function(item) {
          db.run(
            'INSERT INTO itens_venda (venda_id, produto_id, nome, preco, quantidade, subtotal) VALUES (?,?,?,?,?,?)',
            [venda_id, item.id, item.nome, item.preco, item.quantidade, item.subtotal]
          )
        })

        venda.itens.forEach(function(item) {
          db.run(
            'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
            [item.quantidade, item.id]
            )
        })

        salvar()

        res.writeHead(200)
        res.end(JSON.stringify({ ok: true, venda_id: venda_id }))
      })
      return
    }

    if (req.url === '/vendas' && req.method === 'GET') {
      var res_vendas = db.exec('SELECT * FROM vendas ORDER BY id DESC LIMIT 20')
      var vendas = res_vendas.length > 0 ? res_vendas[0].values.map(function(row) {
        return { id: row[0], total: row[1], forma_pag: row[2], data_hora: row[3] }
      }) : []
      res.writeHead(200)
      res.end(JSON.stringify(vendas))
      return
    }

    res.writeHead(404)
    res.end(JSON.stringify({ erro: 'Rota nao encontrada' }))
  })

  server.listen(3000, function() {
    console.log('PDV Litoral SC rodando em http://localhost:3000')
    console.log('PDV: http://localhost:3000/pdv')
    console.log('Produtos: http://localhost:3000/produtos')
    console.log('Vendas: http://localhost:3000/vendas')
  })
})