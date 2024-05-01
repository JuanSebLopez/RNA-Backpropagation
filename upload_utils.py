import json

def procesar_json(file):
    if file.filename.endswith('.json'):
        try:
            data = json.load(file)
            # Verifica si se encuentran las claves 'entrada' y 'salida'
            if 'entradas' in data and 'salidas' in data:
                entradas = data['entradas']
                salidas = data['salidas']
                return entradas, salidas, None
            else:
                return None, None, 'Error: El archivo JSON no contiene las claves necesarias'
        except json.JSONDecodeError:
            return None, None, 'Error: El archivo JSON está mal formateado'
    else:
        return None, None, 'Error: El archivo debe tener extensión .json'