const axios = require('axios')
const http = require('http')

// ----------------- Utils -------------------
function pagina(titulo, corpo){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>${titulo}</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
    </head>
    <body class="w3-light-grey">

        <div class="w3-container w3-teal">
            <h1>${titulo}</h1>
        </div>

        <div class="w3-container w3-margin-top">
            ${corpo}
        </div>
        
        <footer class="w3-container w3-teal w3-margin-top">
            <h5>TPC3 - Escola de Música</h5>
        </footer>

    </body>
    </html>
    `
}

function link(href, texto){
    return `<a href="${href}">${texto}</a>`
}

function card(titulo, conteudo){
    return `
    <div class="w3-card-4 w3-white w3-margin-bottom">
        <header class="w3-container w3-teal">
            <h3>${titulo}</h3>
        </header>
        <div class="w3-container w3-padding">
            ${conteudo}
        </div>
    </div>
    `
}

function botaoVoltar(){
    return `<a class="w3-button w3-teal w3-margin-top" href="/">Voltar</a>`
}

// ---------------------------------------------------------------

var myServer = http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    switch(req.method){
        case "GET":
            // --- Página principal
            if(req.url == "/"){
                var corpo = `
                <div class="w3-container">
                    <ul class="w3-ul w3-card-4 w3-white">
                        <li>${link("/alunos", "Lista de Alunos")}</li>
                        <li>${link("/cursos", "Lista de Cursos")}</li>
                        <li>${link("/instrumentos", "Lista de Instrumentos")}</li>
                    </ul>
                </div>
                `
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(pagina("Escola de Música", corpo))
            }
            // --- Página de Alunos
            else if(req.url == "/alunos"){
                try{
                    const resp = await axios.get("http://localhost:3000/alunos")
                    var alunos = resp.data
                    var linhas = alunos.map(a => `
                        <tr>
                            <td>${a.id}</td>
                            <td>${a.nome}</td>
                            <td>${a.dataNasc}</td>
                            <td>${a.curso}</td>
                            <td>${a.anoCurso}</td>
                            <td>${a.instrumento}</td>
                        </tr>
                    `).join("")

                    var corpo = card("Lista de Alunos", `
                        <table class="w3-table w3-striped w3-bordered w3-hoverable">
                            <tr class="w3-light-grey">
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Data de Nascimento</th>
                                <th>Curso</th>
                                <th>Ano do curso</th>
                                <th>Instrumento</th>
                            </tr>
                            ${linhas}
                        </table>
                        `) + botaoVoltar()
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Gestão de Alunos", corpo))
                }
                catch(erro){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(`<p>Erro ao carregar alunos: ${erro}</p>`)
                }
            }
            // --- Página de Cursos
            else if(req.url == "/cursos"){
                try{
                    const resp = await axios.get("http://localhost:3000/cursos")
                    var cursos = resp.data
                    var linhas = cursos.map(c => `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.designacao}</td>
                            <td>${c.duracao}</td>
                            <td>${c.instrumento["#text"]}</td>
                        </tr>
                    `).join("")

                    var corpo = card("Lista de Cursos", `
                        <table class="w3-table w3-striped w3-bordered w3-hoverable">
                            <tr class="w3-light-grey">
                                <th>ID</th>
                                <th>Designação</th>
                                <th>Duração</th>
                                <th>Instrumento</th>
                            </tr>
                            ${linhas}
                        </table>
                        `) + botaoVoltar()
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Gestão de Cursos", corpo))
                }
                catch(erro){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(`<p>Erro ao carregar cursos: ${erro}</p>`)
                }
            }
            // --- Página de Instrumentos
            else if(req.url == "/instrumentos"){
                try{
                    const resp = await axios.get("http://localhost:3000/instrumentos")
                    var instrumentos = resp.data
                    var linhas = instrumentos.map(i => `
                        <tr>
                            <td>${i.id}</td>
                            <td>${i["#text"]}</td>
                        </tr>
                    `).join("")

                    var corpo = card("Lista de Instrumentos", `
                        <table class="w3-table w3-striped w3-bordered w3-hoverable">
                            <tr class="w3-light-grey">
                                <th>ID</th>
                                <th>Nome</th>
                            </tr>
                            ${linhas}
                        </table>
                        `) + botaoVoltar()
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Gestão de Instrumentos", corpo))
                }
                catch(erro){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(`<p>Erro ao carregar instrumentos: ${erro}</p>`)
                }
            }
            else{
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(`<p>Rota não suportada: ${req.url}.</p>`)
            }
            break

        default: 
            res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(`<p>Método não suportado: ${req.method}.</p>`)
    }
})

const PORT = 3001
myServer.listen(PORT)
console.log("Servidor à escuta na porta " + PORT + "...")
