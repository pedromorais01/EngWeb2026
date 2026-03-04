# Título
Gestão de Filmes e Atores (Cinema)

# Data
04/03/2026

# Autor
a107319, Pedro Filipe Penha Morais, ![Imagem](../Pedro.jpg)

# UC
Engenharia Web

## Resumo
Este TPC consiste no desenvolvimento de uma aplicação web completa em Node.js, utilizando a framework **Express**, para a gestão e consulta de um dataset de cinema. A aplicação utiliza o `json-server` como API de dados e o motor de templates **Pug** para a geração dinâmica de páginas HTML, estilizadas com **W3.CSS**.

A aplicação oferece as seguintes funcionalidades:
*   **Preparação de Dados**: Inclui um script Python (`process_cinema.py`) que processa o dataset original (`cinema.json`), atribuindo identificadores únicos (`id`) a cada filme e extraindo listas estruturadas de atores e géneros para um novo ficheiro (`cinema_db.json`), facilitando a navegação relacional no `json-server`.
*   **Listagem de Filmes**: Visualização de todos os filmes com informações de ID, Título, Ano e contagem de géneros e atores.
*   **Detalhes do Filme**: Página individual com o elenco completo e categorias associadas.
*   **Gestão de Atores**: 
    *   **Listagem**: Tabela com todos os atores e o número total de filmes em que participaram.
    *   **Detalhes**: Página dedicada a cada ator com a cronologia/lista de filmes associada.
*   **Gestão de Géneros**:
    *   **Listagem**: Tabela com as categorias cinematográficas presentes no dataset.
    *   **Detalhes**: Agregação de todos os filmes pertencentes a um determinado género.
*   **Interface Interativa**: Tabelas com suporte para navegação direta (clique na linha) entre filmes, atores e géneros.

Para executar a aplicação, é necessário iniciar o `json-server` com o ficheiro `cinema_db.json` e, posteriormente, executar o servidor Express na pasta `cinema_app`.

## Lista de resultados
A aplicação disponibiliza as seguintes rotas:
*   `http://localhost:7777/` ou `/filmes`: Página principal com a lista de todos os filmes.
*   `http://localhost:7777/filmes/:id`: Visualização detalhada de um filme específico.
*   `http://localhost:7777/atores`: Listagem de todos os atores e respetiva contagem de filmes.
*   `http://localhost:7777/atores/:id`: Detalhes de um ator e a sua filmografia.
*   `http://localhost:7777/generos`: Listagem de todos os géneros cinematográficos.
*   `http://localhost:7777/generos/:id`: Lista de filmes filtrados por género.
