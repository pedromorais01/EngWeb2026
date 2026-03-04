import json

def process_cinema(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    filmes = data.get('filmes', [])
    atores_map = {}
    generos_map = {}

    for i, filme in enumerate(filmes):
        filme_id = f"f{i+1}"
        filme['id'] = filme_id
        
        # Process cast
        cast = filme.get('cast', [])
        for ator in cast:
            if ator not in atores_map:
                atores_map[ator] = {
                    "id": f"a{len(atores_map) + 1}",
                    "nome": ator,
                    "filmes": []
                }
            atores_map[ator]["filmes"].append({
                "id": filme_id,
                "title": filme.get('title')
            })

        # Process genres
        genres = filme.get('genres', [])
        for genre in genres:
            if genre not in generos_map:
                generos_map[genre] = {
                    "id": f"g{len(generos_map) + 1}",
                    "nome": genre,
                    "filmes": []
                }
            generos_map[genre]["filmes"].append({
                "id": filme_id,
                "title": filme.get('title')
            })

    # Convert maps to lists for json-server
    atores = list(atores_map.values())
    generos = list(generos_map.values())

    # Add numFilmes for easier display in tables
    for ator in atores:
        ator['numFilmes'] = len(ator['filmes'])
    for gen in generos:
        gen['numFilmes'] = len(gen['filmes'])

    new_data = {
        "filmes": filmes,
        "atores": atores,
        "generos": generos
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    process_cinema('cinema.json', 'cinema_db.json')
