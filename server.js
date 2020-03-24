// configurando o servidor
const express = require('express');
const server = express();
const password = require('./password');


// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'));

// habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: password,
    host: 'localhost',
    port: 5433,
    database: 'doe'
});

// configurando a template engine
const nunjucks = require('nunjucks');
nunjucks.configure("./", {
    express: server,
    noCache: true
})


// configurar a apresentação da página
server.get("/", function(req, res) {

    db.query(`SELECT * FROM donors`, function(err, result){
        if(err) return res.send("Erro ao se comunicar com o banco de dados.");

        const donors = result.rows;
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }
        
    // coloca valores dentro do banco de dados
        const query = `
            INSERT INTO donors ("name", "email", "blood") 
            VALUES ('${name}', '${email}', '${blood}')`

        db.query(query, function(err) {
            if(err) return res.send("Erro no banco de dados.");

            return res.redirect("/")
        })

})


// ligar o servidor e permitir acesso na porta 3000
server.listen(3001, function() {
    console.log("iniciei o servidor!")
})