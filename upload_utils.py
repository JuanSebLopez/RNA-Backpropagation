import json

def procesar_json(file):
    if file.filename.endswith('.json'):
        try:
            data = json.load(file)
            # Verifica si se encuentran las claves 'entrada' y 'salida'
            if 'entradas' in data and 'salidas' in data:
                entradas = data['entradas']
                salidas = data['salidas']
                entradas, salidas, columnas = establecer_entradas_salidas(entradas, salidas)
                return entradas, salidas, columnas, None
            else:
                return None, None, 'Error: El archivo JSON no contiene las claves necesarias'
        except json.JSONDecodeError:
            return None, None, 'Error: El archivo JSON está mal formateado'
    else:
        return None, None, 'Error: El archivo debe tener extensión .json'
    
def establecer_entradas_salidas(dicc_entradas, dicc_salidas):
    entradas = list(dicc_entradas.values())
    salidas = list(dicc_salidas.values())
    colm_salidas = list(dicc_salidas.keys())
    colm_entradas = list(dicc_entradas.keys())
    columnas = colm_entradas + colm_salidas
    return entradas, salidas, columnas