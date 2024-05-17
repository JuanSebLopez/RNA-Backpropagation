from flask import Flask, jsonify, render_template, request
from configuration import create_model, initialize_weights_thresholds
from upload_utils import procesar_json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    entradas, salidas, columnas, error = procesar_json(file)

    if error:
        return error
    else:
        return jsonify({
            "message": "Archivo recibido correctamente",
            "entradas": entradas,
            "salidas": salidas,
            "columnas": columnas
        })
    
@app.route('/generate-model', methods=['POST'])
def generate_model():
    model_data = request.get_json()

    # Lógica para generar el modelo de red neuronal
    graph = create_model(model_data);
    
    return jsonify({
        "message": "Modelo generado correctamente",
        "graph": graph
    })

@app.route('/generate-weights-thresholds', methods=['POST'])
def generate_weight_thresholds():
    model_data = request.get_json()

    case, pesos_inicializados, umbrales_inicializados = initialize_weights_thresholds(model_data)

    respuesta = {
        'exito': case,
        'pesos': pesos_inicializados,
        'umbrales': umbrales_inicializados
    }
    return jsonify(respuesta)

@app.route('/start-training', methods=['GET'])
def start_training():
    return render_template('training.html')

if __name__ == '__main__':
    app.run(debug=True)