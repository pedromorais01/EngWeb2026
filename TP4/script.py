import json

def transform_dataset():
    try:
        with open('emd.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # In json-server, the top-level structure must be an object 
        # where each key is a collection. 
        # Also, json-server expects 'id' as the primary key.
        for entry in data:
            if '_id' in entry:
                entry['id'] = entry.pop('_id')

        new_data = {
            "emd": data
        }
        
        with open('db.json', 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=4)
        
        print("Successfully transformed emd.json into db.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    transform_dataset()
