# Título
Gestão de Exames Médicos Desportivos (EMD)

# Data
25/02/2026

# Autor
a107319, Pedro Filipe Penha Morais, ![Imagem](../Pedro.jpg)

# UC
Engenharia Web

## Resumo
Este TPC consiste no desenvolvimento de uma aplicação web completa em Node.js para a gestão de Exames Médicos Desportivos (EMD). A aplicação utiliza o módulo `http` nativo para o servidor, `axios` para a comunicação com uma API de dados (`json-server`) e o motor de templates `Pug` para a geração dinâmica de páginas HTML.

A aplicação oferece as seguintes funcionalidades:
*   **Preparação de Dados**: O repositório inclui um script Python (`script.py`) que converte o dataset original (`emd.json`) num formato compatível com o `json-server` (`db.json`) (faz também a conversão de chaves (`_id` para `id`).
*   **Listagem de EMDs**: Visualização de todos os exames registados, com suporte para ordenação por campos específicos.
*   **Detalhes do EMD**: Página individual com toda a informação detalhada de um exame e do respetivo atleta.
*   **Gestão de Registos (CRUD)**:
    *   **Criação**: Formulário para registar novos exames médicos.
    *   **Edição**: Possibilidade de alterar dados de exames já existentes.
    *   **Remoção**: Funcionalidade para apagar registos da base de dados.
*   **Estatísticas**: Uma página dedicada que apresenta a distribuição dos exames por Género, Modalidade, Clube, Resultado (Apto/Não Apto) e estado de Federação.
*   **Recursos Estáticos**: Servidor configurado para servir ficheiros CSS (W3.CSS) e imagens de forma eficiente.

Para executar a aplicação, é necessário iniciar o `json-server` com o ficheiro de dados certo - `db.json` e, posteriormente, executar o `emd_server.js`.

## Lista de resultados
A aplicação disponibiliza as seguintes rotas:
*   `http://localhost:7777/`: Página principal com a lista de todos os EMDs.
*   `http://localhost:7777/emd/:id`: Visualização detalhada de um EMD específico.
*   `http://localhost:7777/emd/registo`: Formulário para inserção de um novo registo.
*   `http://localhost:7777/emd/editar/:id`: Formulário para edição de um registo existente.
*   `http://localhost:7777/emd/stats`: Página com estatísticas agregadas sobre os exames.
*   `http://localhost:7777/emd/apagar/:id`: Rota para eliminação de um registo.
