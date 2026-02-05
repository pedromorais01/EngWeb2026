import json
import os
import shutil

# --- Funções Auxiliares ---
def openjson(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def mk_dir(relative_path):
    if os.path.exists(relative_path):
        shutil.rmtree(relative_path)
    os.mkdir(relative_path)

def new_file(file_path, content):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

# --- PREPARAÇÃO DOS DADOS ---
db = openjson("dataset_reparacoes.json")
lista_reparacoes = db["reparacoes"]
lista_reparacoes.sort(key=lambda x: x["data"], reverse=True)

mk_dir("output")

# Estruturas de Agregação
dados_intervencoes = {}
dados_modelos = {} # Chave: (Marca, Modelo), Valor: Lista de Ocorrências

# --- LOOP PRINCIPAL: GERA REPARAÇÕES E RECOLHE DADOS ---

linhas_tabela_geral_reparacoes = ""

for i, rep in enumerate(lista_reparacoes):
    id_reparacao_str = f"R-{i+1:03d}"
    nome_ficheiro_rep = f"reparacao_{i}.html"
    
    marca = rep["viatura"]["marca"]
    modelo = rep["viatura"]["modelo"]
    chave_modelo = (marca, modelo)

    # --- Recolher dados para INTERVENÇÕES ---
    for interv in rep["intervencoes"]:
        cod = interv["codigo"]
        if cod not in dados_intervencoes:
            dados_intervencoes[cod] = {
                "nome": interv["nome"], "descricao": interv["descricao"], "ocorrencias": []
            }
        dados_intervencoes[cod]["ocorrencias"].append({
            "id": id_reparacao_str, "data": rep["data"], 
            "viatura": f"{marca} {modelo}", "link": nome_ficheiro_rep
        })

    # --- Recolher dados para MODELOS ---
    if chave_modelo not in dados_modelos:
        dados_modelos[chave_modelo] = []
    
    dados_modelos[chave_modelo].append({
        "id": id_reparacao_str,
        "data": rep["data"],
        "matricula": rep["viatura"]["matricula"],
        "nif": rep["nif"],
        "link": nome_ficheiro_rep
    })

    # --- Tabela Geral de Reparações ---
    linhas_tabela_geral_reparacoes += f'''
    <tr>
        <td style="text-align: center;"><a href="{nome_ficheiro_rep}"><strong>{id_reparacao_str}</strong></a></td>
        <td>{rep["data"]}</td>
        <td>{rep["nif"]}</td>
        <td>{rep["nome"]}</td>
        <td>{marca}</td>
        <td>{modelo}</td>
        <td style="text-align: center;">{rep["nr_intervencoes"]}</td>
    </tr>
    '''

    # --- Página Individual da Reparação ---
    linhas_intervencoes_detalhe = ""
    for interv in rep["intervencoes"]:
        linhas_intervencoes_detalhe += f'''
        <tr>
            <td><a href="intervencao_{interv['codigo']}.html"><strong>{interv["codigo"]}</strong></a></td>
            <td>{interv["nome"]}</td>
            <td>{interv["descricao"]}</td>
        </tr>'''

    slug_modelo = f"modelo_{marca}_{modelo}".replace(" ", "_").replace("/", "-") + ".html"

    html_detalhe_rep = f'''
    <!DOCTYPE html>
    <html>
        <head>
            <title>Detalhes - {id_reparacao_str}</title>
            <meta charset="utf-8"/>
            <style>
                body {{ font-family: sans-serif; padding: 20px; max-width: 900px; margin: auto; }}
                h1 {{ border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }}
                .container {{ display: flex; gap: 20px; margin-bottom: 20px; }}
                .info-box {{ flex: 1; background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
                th, td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
                a {{ color: #4CAF50; text-decoration: none; font-weight: bold; }}
                .btn-voltar {{ display: inline-block; margin-top: 30px; padding: 10px 20px; background-color: #555; color: white; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <h1>Reparação {id_reparacao_str}</h1>
            <div class="container">
                <div class="info-box">
                    <h3>👤 Cliente</h3>
                    <p><strong>Nome:</strong> {rep["nome"]}</p>
                    <p><strong>NIF:</strong> {rep["nif"]}</p>
                    <p><strong>Data:</strong> {rep["data"]}</p>
                </div>
                <div class="info-box">
                    <h3>🚗 Viatura</h3>
                    <p><strong>Marca:</strong> {marca}</p>
                    <p><strong>Modelo:</strong> {modelo}</p>
                    <p><strong>Matrícula:</strong> {rep["viatura"]["matricula"]}</p>
                    <p style="margin-top: 10px; font-size: 0.9em;">
                        <a href="{slug_modelo}">Ver histórico deste Modelo ➜</a>
                    </p>
                </div>
            </div>
            <h3>🛠️ Intervenções Realizadas</h3>
            <table>
                <thead><tr><th>Código</th><th>Nome</th><th>Descrição</th></tr></thead>
                <tbody>{linhas_intervencoes_detalhe}</tbody>
            </table>
            <a href="lista_reparacoes.html" class="btn-voltar">⬅ Voltar à Listagem</a>
        </body>
    </html>
    '''
    new_file(f"./output/{nome_ficheiro_rep}", html_detalhe_rep)


# --- GERAÇÃO DE PÁGINAS DE INTERVENÇÃO ---
codigos_ordenados = sorted(dados_intervencoes.keys())
linhas_tabela_catalogo = ""

for codigo in codigos_ordenados:
    dados = dados_intervencoes[codigo]
    nome_ficheiro_interv = f"intervencao_{codigo}.html"

    linhas_tabela_catalogo += f'''
    <tr>
        <td><a href="{nome_ficheiro_interv}"><strong>{codigo}</strong></a></td>
        <td>{dados["nome"]}</td>
        <td>{dados["descricao"]}</td>
    </tr>'''

    linhas_ocorrencias = ""
    for oc in dados["ocorrencias"]:
        linhas_ocorrencias += f'''
        <tr>
            <td><a href="{oc["link"]}"><strong>{oc["id"]}</strong></a></td>
            <td>{oc["data"]}</td>
            <td>{oc["viatura"]}</td>
        </tr>'''

    html_detalhe_interv = f'''
    <!DOCTYPE html>
    <html>
        <head>
            <title>Intervenção - {codigo}</title>
            <meta charset="utf-8"/>
            <style>
                body {{ font-family: sans-serif; padding: 20px; max-width: 800px; margin: auto; }}
                h1 {{ color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px; }}
                .desc-box {{ background-color: #e3f2fd; padding: 15px; border-radius: 8px; border: 1px solid #90caf9; margin-bottom: 20px; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
                th, td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
                a {{ color: #2196F3; text-decoration: none; font-weight: bold; }}
                .btn-voltar {{ display: inline-block; margin-top: 30px; padding: 10px 20px; background-color: #555; color: white; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <h1>Tipo de Intervenção: {codigo}</h1>
            <div class="desc-box">
                <h2>{dados["nome"]}</h2>
                <p><strong>Descrição:</strong> {dados["descricao"]}</p>
                <p><strong>Total Ocorrências:</strong> {len(dados["ocorrencias"])}</p>
            </div>
            <h3>Histórico de Utilização</h3>
            <table>
                <thead><tr><th>ID Reparação</th><th>Data</th><th>Viatura</th></tr></thead>
                <tbody>{linhas_ocorrencias}</tbody>
            </table>
            <a href="lista_intervencoes.html" class="btn-voltar">⬅ Voltar à Lista</a>
        </body>
    </html>
    '''
    new_file(f"./output/{nome_ficheiro_interv}", html_detalhe_interv)


# --- GERAÇÃO DE PÁGINAS DE MARCA/MODELO ---

# Ordenar modelos alfabeticamente
modelos_ordenados = sorted(dados_modelos.keys())
linhas_tabela_viaturas = ""

for (marca, modelo) in modelos_ordenados:
    lista_reps_modelo = dados_modelos[(marca, modelo)]
    
    nome_ficheiro_mod = f"modelo_{marca}_{modelo}".replace(" ", "_").replace("/", "-") + ".html"
    
    # Calcular carros únicos (baseado na matrícula)
    matriculas_unicas = set(r["matricula"] for r in lista_reps_modelo)
    qtd_unicos = len(matriculas_unicas)

    # Linha para a Lista Geral de Viaturas
    linhas_tabela_viaturas += f'''
    <tr>
        <td><a href="{nome_ficheiro_mod}"><strong>{marca}</strong></a></td>
        <td><a href="{nome_ficheiro_mod}"><strong>{modelo}</strong></a></td>
        <td style="text-align: center;">{qtd_unicos}</td>
        <td style="text-align: center;">{len(lista_reps_modelo)}</td>
    </tr>'''

    # Página Individual do Modelo
    linhas_historico_modelo = ""
    for r in lista_reps_modelo:
        linhas_historico_modelo += f'''
        <tr>
            <td><a href="{r['link']}"><strong>{r['id']}</strong></a></td>
            <td>{r['data']}</td>
            <td>{r['matricula']}</td>
            <td>{r['nif']}</td>
        </tr>'''

    html_detalhe_modelo = f'''
    <!DOCTYPE html>
    <html>
        <head>
            <title>{marca} {modelo}</title>
            <meta charset="utf-8"/>
            <style>
                body {{ font-family: sans-serif; padding: 20px; max-width: 800px; margin: auto; }}
                h1 {{ color: #333; border-bottom: 2px solid #FF9800; padding-bottom: 10px; }}
                .stats-box {{ background-color: #fff3e0; padding: 15px; border-radius: 8px; border: 1px solid #ffe0b2; margin-bottom: 20px; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
                th, td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
                a {{ color: #FF9800; text-decoration: none; font-weight: bold; }}
                .btn-voltar {{ display: inline-block; margin-top: 30px; padding: 10px 20px; background-color: #555; color: white; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <h1>{marca} {modelo}</h1>
            <div class="stats-box">
                <p><strong>Marca:</strong> {marca}</p>
                <p><strong>Modelo:</strong> {modelo}</p>
                <p><strong>Nº de Carros:</strong> {qtd_unicos}</p>
                <p><strong>Total de Reparações:</strong> {len(lista_reps_modelo)}</p>
            </div>
            <h3>Histórico de Reparações neste Modelo</h3>
            <table>
                <thead><tr><th>ID Reparação</th><th>Data</th><th>Matrícula</th><th>NIF Cliente</th></tr></thead>
                <tbody>{linhas_historico_modelo}</tbody>
            </table>
            <a href="lista_viaturas.html" class="btn-voltar">⬅ Voltar à Lista de Viaturas</a>
        </body>
    </html>
    '''
    new_file(f"./output/{nome_ficheiro_mod}", html_detalhe_modelo)


# --- GERAÇÃO DOS FICHEIROS DE ÍNDICE ---

# Lista de Reparações
new_file("./output/lista_reparacoes.html", f'''
<!DOCTYPE html>
<html>
    <head>
        <title>Listagem de Reparações</title>
        <meta charset="utf-8"/>
        <style>
            body {{ font-family: sans-serif; padding: 20px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #4CAF50; color: white; }}
            tr:nth-child(even) {{ background-color: #f2f2f2; }}
            a {{ color: #4CAF50; text-decoration: none; font-weight: bold; }}
            .btn-voltar {{ display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #555; color: white; text-decoration: none; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <h1>Gestão de reparações de automóveis</h1>
        <h3>Listagem Geral de Reparações</h3>
        <table>
            <thead><tr><th>ID</th><th>Data</th><th>NIF</th><th>Cliente</th><th>Marca</th><th>Modelo</th><th>Nº Int.</th></tr></thead>
            <tbody>{linhas_tabela_geral_reparacoes}</tbody>
        </table>
        <a href="index.html" class="btn-voltar">⬅ Voltar à Página Principal</a>
    </body>
</html>
''')

# Lista de Intervenções
new_file("./output/lista_intervencoes.html", f'''
<!DOCTYPE html>
<html>
    <head>
        <title>Tipos de Intervenção</title>
        <meta charset="utf-8"/>
        <style>
            body {{ font-family: sans-serif; padding: 20px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #2196F3; color: white; }}
            td:nth-child(1) {{ font-weight: bold; }}
            tr:nth-child(even) {{ background-color: #f2f2f2; }}
            a {{ color: #2196F3; text-decoration: none; }}
            .btn-voltar {{ display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #555; color: white; text-decoration: none; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <h1>Gestão de reparações de automóveis</h1>
        <h3>Catálogo de Tipos de Intervenção</h3>
        <table>
            <thead><tr><th>Código</th><th>Designação</th><th>Descrição Técnica</th></tr></thead>
            <tbody>{linhas_tabela_catalogo}</tbody>
        </table>
        <a href="index.html" class="btn-voltar">⬅ Voltar à Página Principal</a>
    </body>
</html>
''')

# Lista de Viaturas
new_file("./output/lista_viaturas.html", f'''
<!DOCTYPE html>
<html>
    <head>
        <title>Marcas e Modelos</title>
        <meta charset="utf-8"/>
        <style>
            body {{ font-family: sans-serif; padding: 20px; }}
            table {{ width: 80%; margin: 20px auto; border-collapse: collapse; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #FF9800; color: white; }}
            tr:nth-child(even) {{ background-color: #f2f2f2; }}
            h1, h3 {{ text-align: center; }}
            a {{ color: #FF9800; text-decoration: none; font-weight: bold; }}
            .nav {{ text-align: center; margin-top: 20px; }}
            .btn-voltar {{ display: inline-block; padding: 10px 20px; background-color: #555; color: white; text-decoration: none; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <h1>Gestão de reparações de automóveis</h1>
        <h3>Estatística de Viaturas</h3>
        <table>
            <thead><tr><th>Marca</th><th>Modelo</th><th style="text-align:center">Número de Carros</th><th style="text-align:center">Total Reparações</th></tr></thead>
            <tbody>{linhas_tabela_viaturas}</tbody>
        </table>
        <div class="nav"><a href="index.html" class="btn-voltar">⬅ Voltar à Página Principal</a></div>
    </body>
</html>
''')

# Index Principal
new_file("./output/index.html", f'''
<!DOCTYPE html>
<html>
    <head>
        <title>Gestão de reparações de automóveis - Início</title>
        <meta charset="utf-8"/>
        <style>
            body {{ font-family: sans-serif; padding: 40px; text-align: center; background-color: #f4f4f4; }}
            h1 {{ color: #333; }}
            ul {{ list-style-type: none; padding: 0; margin-top: 30px; }}
            li {{ margin: 20px 0; }}
            a {{ text-decoration: none; color: white; padding: 20px 40px; font-size: 20px; border-radius: 8px; display: inline-block; width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            a.btn-rep {{ background-color: #4CAF50; }}
            a.btn-int {{ background-color: #2196F3; }}
            a.btn-via {{ background-color: #FF9800; }}
            a:hover {{ opacity: 0.9; }}
        </style>
    </head>
    <body>
        <h1>🚗 Gestão de reparações de automóveis</h1>
        <h3>Painel de Controlo</h3>
        <ul>
            <li><a href="lista_reparacoes.html" class="btn-rep">📋 Listagem de Reparações</a></li>
            <li><a href="lista_intervencoes.html" class="btn-int">🔧 Tipos de Intervenção</a></li>
            <li><a href="lista_viaturas.html" class="btn-via">🚙 Marcas e Modelos</a></li>
        </ul>
    </body>
</html>
''')

