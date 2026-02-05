# Título
Gestão de reparações de automóveis

# Data
04/02/2026

# Autor
a107319, Pedro Filipe Penha Morais, ![Imagem](../Pedro.jpg)

# UC
Engenharia Web


## Resumo
O que faz: Basicamente, o script em Python pega no dataset JSON gigante e gera automaticamente um website estático completo. Ele cria uma pasta "output" e enche-a com centenas de ficheiros HTML, todos organizados e com estilo CSS básico já incluído.

O site tem um menu inicial que leva para três sítios: a Lista de Reparações (ordenada da mais recente para a mais antiga), o Catálogo de Intervenções (onde se pode ver os tipos de serviço sem repetições) e a Estatística de Viaturas (agrupada por Marca e Modelo).

Páginas de Detalhe: O script não faz só listas. Ele cria uma página individual para cada coisa. Cada reparação tem a sua página com os dados do cliente e do carro. Cada tipo de intervenção (ex: "Mudança de Óleo") tem uma página que lista todas as vezes que esse serviço foi feito. E cada Modelo de carro tem uma página com o histórico todo desse modelo na oficina.

Se se estiver na página de uma reparação, pode-se clicar no nome do serviço para ver estatísticas sobre ele, ou clicar no modelo do carro para ver outras reparações iguais. Tem sempre botões para voltar aos menus anteriores.

## Lista de resultados
A partir do dataset_reparacoes.json e do script json2html.py foram gerados vários ficheiros html na pasta output, nomeadamente, o da página principal (index.html), os das listagens (lista_intervencoes.html, lista_reparacoes.html, lista_viaturas.html), e os das páginas individuais da intervencao, modelo e reparacao