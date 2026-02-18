# Título
Escola de Música

# Data
18/02/2026

# Autor
a107319, Pedro Filipe Penha Morais, ![Imagem](../Pedro.jpg)

# UC
Engenharia Web

## Resumo
Este tpc consiste no desenvolvimento de um servidor em Node.js servidorApp.js que gere e apresenta informações relativas a uma Escola de Música.

A aplicação disponibiliza uma interface web utilizando estilo do framework W3.CSS, permitindo a navegação entre diferentes listagens:
*   **Página Principal (`/`)**: Menu de navegação para as listas de alunos, cursos e instrumentos.
*   **Lista de Alunos (/alunos)**: Tabela com informações detalhadas dos alunos (ID, Nome, Data de Nascimento, Curso, Ano e Instrumento).
*   **Lista de Cursos (/cursos)**: Tabela com os cursos disponíveis (ID, Designação, Duração e Instrumento associado).
*   **Lista de Instrumentos (/instrumentos)**: Tabela com a listagem de todos os instrumentos musicais (ID e Nome).

## Lista de Resultados
O servidor gera dinamicamente as seguintes páginas HTML:
*   `http://localhost:3001/alunos`: Listagem completa de alunos.
*   `http://localhost:3001/cursos`: Listagem completa de cursos.
*   `http://localhost:3001/instrumentos`: Listagem completa de instrumentos.
