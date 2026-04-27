const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')

const DB_PATH = path.join(__dirname, 'pdv.db')

function criarBanco() {
  return initSqlJs().then(function(SQL) {
    var db

    if (fs.existsSync(DB_PATH)) {
      var fileBuffer = fs.readFileSync(DB_PATH)
      db = new SQL.Database(fileBuffer)
    } else {
      db = new SQL.Database()
    }

    function salvar() {
      var data = db.export()
      fs.writeFileSync(DB_PATH, Buffer.from(data))
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS produtos (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        nome    TEXT    NOT NULL,
        preco   REAL    NOT NULL,
        estoque INTEGER DEFAULT 0
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS vendas (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        total     REAL    NOT NULL,
        forma_pag TEXT    DEFAULT 'dinheiro',
        data_hora TEXT    NOT NULL
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS itens_venda (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id   INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        nome       TEXT    NOT NULL,
        preco      REAL    NOT NULL,
        quantidade INTEGER NOT NULL,
        subtotal   REAL    NOT NULL
      )
    `)

    var count = db.exec('SELECT COUNT(*) FROM produtos')
    var total = count[0].values[0][0]

    if (total === 0) {
      db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?,?,?)', ['Sacola 25x35', 4.50, 100])
      db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?,?,?)', ['Copo 200ml', 8.90, 50])
      db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?,?,?)', ['Garfo plastico', 12.00, 200])
      db.run('INSERT INTO produtos (nome, preco, estoque) VALUES (?,?,?)', ['Prato descartavel', 15.90, 80])
      salvar()
      console.log('Produtos iniciais inseridos!')
    }

    return { db: db, salvar: salvar }
  })
}

module.exports = criarBanco