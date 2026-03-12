# Título
TPC6: Orquestração de Micro-serviços para Cinema Americano

# Data
11/03/2026

# Autor
a107319, Pedro Filipe Penha Morais, ![Imagem](../Pedro.jpg)

# UC
Engenharia Web

## Resumo
Este TPC consiste no desenvolvimento de uma aplicação web completa utilizando uma arquitetura de micro-serviços orquestrada com **Docker**. A aplicação gere um dataset de cinema americano, utilizando **MongoDB** como base de dados, uma **API de dados** em Node.js (Express) e um servidor de **interface** também em Express com o motor de templates **Pug**, estilizado com **W3.CSS**.

A aplicação oferece as seguintes funcionalidades:
*   **Preparação de Dados**: Utilização de um script **Python** (`process_dataset.py`) para processar o dataset original (`cinema.json`), dividindo-o em três coleções normalizadas: `filmes`, `atores` e `generos`, facilitando a navegação relacional.
*   **Orquestração Docker**: Isolamento dos serviços (Base de Dados, API e Interface) em contentores independentes, comunicando através de uma rede interna e orquestrados via `docker-compose`.
*   **Listagem de Filmes**: Visualização de todos os filmes com informações de ID, Título, Ano e contagem de atores no elenco e géneros associados.
*   **Detalhes do Filme**: Página individual com o elenco completo e categorias associadas, utilizando a funcionalidade `populate` do Mongoose para exibir nomes em vez de IDs.
*   **Gestão de Atores**: 
    *   **Listagem**: Tabela com todos os atores e o número total de filmes em que participaram.
    *   **Detalhes**: Página dedicada a cada ator com a lista de filmes (títulos) associada.
*   **Gestão de Géneros**:
    *   **Listagem**: Tabela com as categorias cinematográficas e contagem de filmes.
    *   **Detalhes**: Agregação de todos os filmes pertencentes a um determinado género.
*   **Interface Interativa**: Navegação fluida entre entidades através de links diretos em todas as tabelas e listas.

## Lista de resultados
A aplicação disponibiliza as seguintes rotas principais (via serviço de interface):
*   `http://localhost:7790/filmes`: Listagem de todos os filmes.
*   `http://localhost:7790/filmes/:id`: Visualização detalhada de um filme.
*   `http://localhost:7790/atores`: Listagem de todos os atores.
*   `http://localhost:7790/atores/:id`: Detalhes de um ator e a sua filmografia.
*   `http://localhost:7790/generos`: Listagem de todos os géneros.
*   `http://localhost:7790/generos/:id`: Lista de filmes filtrados por género.
