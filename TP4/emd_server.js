// emd_server.js
// EW2025 : 2025-02-25
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');
var url = require('url');

var templates = require('./templates.js')
var static = require('./static.js')

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            let data = parse(body);
            // Process nested objects for 'nome.primeiro' and 'nome.último'
            let processed = {
                nome: {}
            };
            for (let key in data) {
                if (key === 'nome.primeiro') processed.nome.primeiro = data[key];
                else if (key === 'nome.último') processed.nome.último = data[key];
                else if (key === 'federado' || key === 'resultado') processed[key] = true;
                else processed[key] = data[key];
            }
            // Add false for checkboxes if they are missing
            if (!processed.federado) processed.federado = false;
            if (!processed.resultado) processed.resultado = false;
            
            callback(processed);
        });
    }
    else {
        callback(null);
    }
}

// Server creation
var emdServer = http.createServer((req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    var parsedUrl = url.parse(req.url, true);

    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET / ou /emd ------------------------------------------------------------------
                if(parsedUrl.pathname == '/' || parsedUrl.pathname == '/emd'){
                    let sort = parsedUrl.query.sort || 'dataEMD';
                    let order = parsedUrl.query.order || 'asc';
                    axios.get(`http://localhost:3000/emd?_sort=${sort}&_order=${order}`)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdListPage(resp.data, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.errorPage(erro, d))
                    })
                }
                // GET /emd/stats -----------------------------------------------------------
                else if(parsedUrl.pathname == '/emd/stats'){
                    axios.get("http://localhost:3000/emd")
                    .then(resp => {
                        let emds = resp.data;
                        let stats = {
                            "Sexo": {},
                            "Modalidade": {},
                            "Clube": {},
                            "Resultado": {},
                            "Federado": {}
                        };
                        emds.forEach(e => {
                            stats["Sexo"][e.género] = (stats["Sexo"][e.género] || 0) + 1;
                            stats["Modalidade"][e.modalidade] = (stats["Modalidade"][e.modalidade] || 0) + 1;
                            stats["Clube"][e.clube] = (stats["Clube"][e.clube] || 0) + 1;
                            let resLabel = e.resultado ? "Apto" : "Não Apto";
                            stats["Resultado"][resLabel] = (stats["Resultado"][resLabel] || 0) + 1;
                            let fedLabel = e.federado ? "Sim" : "Não";
                            stats["Federado"][fedLabel] = (stats["Federado"][fedLabel] || 0) + 1;
                        });
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdStatsPage(stats, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.errorPage(erro, d))
                    })
                }
                // GET /emd/registo ---------------------------------------------------------
                else if(parsedUrl.pathname == '/emd/registo'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(templates.emdFormPage(d))
                }
                // GET /emd/editar/:id ------------------------------------------------------
                else if(/\/emd\/editar\/[0-9a-zA-Z_]+$/.test(parsedUrl.pathname)){
                    var id = parsedUrl.pathname.split('/')[3]
                    axios.get('http://localhost:3000/emd/' + id)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdFormPage(d, resp.data))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.errorPage(erro, d))
                    })
                }
                // GET /emd/apagar/:id ------------------------------------------------------
                else if(/\/emd\/apagar\/[0-9a-zA-Z_]+$/.test(parsedUrl.pathname)){
                    var id = parsedUrl.pathname.split('/')[3]
                    axios.delete('http://localhost:3000/emd/' + id)
                    .then(resp => {
                        res.writeHead(302, {'Location': '/'})
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.errorPage(erro, d))
                    })
                }
                // GET /emd/:id --------------------------------------------------------------
                else if(/\/emd\/[0-9a-zA-Z_]+$/.test(parsedUrl.pathname)){
                    var id = parsedUrl.pathname.split('/')[2]
                    axios.get('http://localhost:3000/emd/' + id)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdPage(resp.data, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.errorPage(erro, d))
                    })
                }
                else {
                    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(templates.errorPage("Rota não suportada: " + req.url, d))
                }
                break
            case "POST":
                // POST /emd/:id (Update)
                if(/\/emd\/[0-9a-zA-Z_]+$/.test(parsedUrl.pathname)){
                    var id = parsedUrl.pathname.split('/')[2]
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.put('http://localhost:3000/emd/' + id, result)
                            .then(resp => {
                                res.writeHead(302, {'Location': '/emd/' + id})
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.end(templates.errorPage(erro, d))
                            })
                        }
                    })
                }
                // POST /emd (Insert)
                else if(parsedUrl.pathname == '/emd'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.post('http://localhost:3000/emd', result)
                            .then(resp => {
                                res.writeHead(302, {'Location': '/'})
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.end(templates.errorPage(erro, d))
                            })
                        }
                    })
                }
                break
            default: 
                res.writeHead(405, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(templates.errorPage("Método não suportado: " + req.method, d))
        }
    }
})

emdServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})
