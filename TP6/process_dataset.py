import json
import os

def process_cinema():
    input_path = 'api_dados/cinema.json'
    
    if not os.path.exists(input_path):
        print(f"Erro: {input_path} não encontrado!")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Suporta tanto {"filmes": [...]} como [...]
    movies_list = data.get('filmes', data) if isinstance(data, dict) else data

    movie_entries = []
    actor_map = {}
    genre_map = {}

    for i, m in enumerate(movies_list):
        movie_id = f"m{i+1}"
        movie_entry = {
            "_id": movie_id,
            "title": m.get("title", "Sem título"),
            "year": m.get("year", 0),
            "cast": [],
            "genres": []
        }

        # Processar Atores
        for actor_name in m.get("cast", []):
            if actor_name not in actor_map:
                actor_id = f"a{len(actor_map) + 1}"
                actor_map[actor_name] = {"_id": actor_id, "name": actor_name, "movies": []}
            
            actor_id = actor_map[actor_name]["_id"]
            movie_entry["cast"].append(actor_id)
            actor_map[actor_name]["movies"].append(movie_id)

        # Processar Géneros
        for genre_name in m.get("genres", []):
            if genre_name not in genre_map:
                genre_id = f"g{len(genre_map) + 1}"
                genre_map[genre_name] = {"_id": genre_id, "name": genre_name, "movies": []}
            
            genre_id = genre_map[genre_name]["_id"]
            movie_entry["genres"].append(genre_id)
            genre_map[genre_name]["movies"].append(movie_id)

        movie_entries.append(movie_entry)

    # Guardar os resultados
    with open('api_dados/filmes.json', 'w', encoding='utf-8') as f:
        json.dump(movie_entries, f, indent=2, ensure_ascii=False)
    
    with open('api_dados/atores.json', 'w', encoding='utf-8') as f:
        json.dump(list(actor_map.values()), f, indent=2, ensure_ascii=False)
    
    with open('api_dados/generos.json', 'w', encoding='utf-8') as f:
        json.dump(list(genre_map.values()), f, indent=2, ensure_ascii=False)

    print("Processamento concluído:")
    print(f"- Filmes: {len(movie_entries)}")
    print(f"- Atores: {len(actor_map)}")
    print(f"- Géneros: {len(genre_map)}")

if __name__ == "__main__":
    process_cinema()
