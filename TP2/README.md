# Título
A Oficina - um servidor de gestão de reparações de automóveis

# Data
12/02/2026

# Autor
a107319, Pedro Filipe Penha Morais, ![Imagem](../Pedro.jpg)

# UC
Engenharia Web
 
## Resumo
O que faz: Este tpc consiste num servidor que utiliza os módulos `http` e `axios` para criar uma aplicação web dinâmica. O servidor consome dados do ficheiro dataset_reparacoes.json que contém um registo de reparações de automóveis.
 
O servidor disponibiliza três rotas principais:
*   `/reparacoes`: Apresenta uma lista de todas as reparações, ordenada por data (da mais recente para a mais antiga).
*   `/intervencoes`: Agrega e conta os diferentes tipos de intervenção realizados, apresentando uma lista ordenada alfabeticamente.
*   `/viaturas`: Agrega e conta o número de reparações por viatura (agrupada por marca e modelo), apresentando uma lista ordenada.
 
Para que a aplicação funcione, é necessário ter o `json-server` a servir o ficheiro `dataset_reparacoes.json` na porta 3000 e, de seguida, executar o servidor server.js na porta 7777.
 
## Lista de resultados
A partir do ficheiro `server.js`, é iniciado um servidor na porta 7777. Este servidor, ao receber pedidos, vai buscar os dados ao `json-server` (que deve estar a correr na porta 3000 com o ficheiro `dataset_reparacoes.json`) e gera dinamicamente as seguintes páginas HTML:
*   `http://localhost:7777/reparacoes`: Uma tabela com a lista de todas as reparações.
*   `http://localhost:7777/intervencoes`: Uma tabela com a contagem de cada tipo de intervenção.
*   `http://localhost:7777/viaturas`: Uma tabela com a contagem de reparações por marca e modelo de viatura.