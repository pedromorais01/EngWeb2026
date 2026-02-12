const http = require('http')
const axios = require('axios');

http.createServer((req, res) => {
      const baseURL = 'http://localhost:3000';

      if (req.url == '/reparacoes') {
        axios.get(`${baseURL}/reparacoes`)
            .then(resp => {
              let data = resp.data;
              // Ordenar por data, da mais recente para a mais antiga
              data.sort((a, b) => new Date(b.data) - new Date(a.data));

              let html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8"/>
                        <title>Lista de Reparações</title>
                    </head>
                    <body>
                        <h1>Lista de Reparações</h1>
                        <table border="1">
                            <tr>
                                <th>ID da Reparação</th>
                                <th>Data</th>
                                <th>Nome do Cliente</th>
                                <th>NIF</th>
                                <th>Viatura (Marca)</th>
                                <th>Viatura (Modelo)</th>
                                <th>Matrícula</th>
                                <th>Nº de Intervenções</th>
                            </tr>
                `;
              data.forEach((r, index) => {
                html += `<tr>
                                <td>rep-${index + 1}</td>
                                <td>${r.data}</td>
                                <td>${r.nome}</td>
                                <td>${r.nif}</td>
                                <td>${r.viatura.marca}</td>
                                <td>${r.viatura.modelo}</td>
                                <td>${r.viatura.matricula}</td>
                                <td style="text-align: center;">${
                    r.nr_intervencoes}</td>
                             </tr>`;
              });
              html += `</table></body></html>`;
              res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
              res.end(html);
            })
            .catch(error => {
              res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
              res.end('<pre>' + JSON.stringify(error) + '</pre>');
            });
      } else if (req.url == '/intervencoes') {
        axios.get(`${baseURL}/reparacoes`)
            .then(resp => {
              const data = resp.data;
              const counts = {};
              data.forEach(reparacao => {
                reparacao.intervencoes.forEach(intervencao => {
                  counts[intervencao.nome] =
                      (counts[intervencao.nome] || 0) + 1;
                });
              });

              // Ordenar alfabeticamente pelo nome da intervenção
              const sortedIntervencoes = Object.entries(counts).sort(
                  (a, b) => a[0].localeCompare(b[0]));

              let html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8"/>
                        <title>Tipos de Intervenção</title>
                    </head>
                    <body>
                        <h1>Tipos de Intervenção</h1>
                        <table border="1">
                            <tr>
                                <th>Tipo de Intervenção</th>
                                <th>Número de Ocorrências</th>
                            </tr>
                `;
              for (const [intervencao, count] of sortedIntervencoes) {
                html += `<tr><td>${intervencao}</td><td>${count}</td></tr>`;
              }
              html += `</table></body></html>`;
              res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
              res.end(html);
            })
            .catch(error => {
              res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
              res.end('<pre>' + JSON.stringify(error) + '</pre>');
            });
      } else if (req.url == '/viaturas') {
        axios.get(`${baseURL}/reparacoes`)
            .then(resp => {
              const data = resp.data;
              const counts = {};
              data.forEach(r => {
                const key = `${r.viatura.marca}::${r.viatura.modelo}`;
                counts[key] = (counts[key] || 0) + 1;
              });

              // Ordenar por marca e depois por modelo
              const sortedViaturas = Object.entries(counts).sort(
                  (a, b) => a[0].localeCompare(b[0]));

              let html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8"/>
                        <title>Viaturas Intervencionadas</title>
                    </head>
                    <body>
                        <h1>Viaturas Intervencionadas</h1>
                        <table border="1">
                            <tr>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Número de Reparações</th>
                            </tr>
                `;
              for (const [key, count] of sortedViaturas) {
                const [marca, modelo] = key.split('::');
                html += `<tr><td>${marca}</td><td>${modelo}</td><td>${
                    count}</td></tr>`;
              }
              html += `</table></body></html>`;
              res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
              res.end(html);
            })
            .catch(error => {
              res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
              res.end('<pre>' + JSON.stringify(error) + '</pre>');
            });
      } else {
        res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
        res.end('<p>404 - Página não encontrada</p>');
      }
    })
    .listen(7777, () => {
      console.log('Servidor à escuta na porta 7777...');
    });
