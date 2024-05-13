from flask import Flask, jsonify, render_template, request
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
    print("hola")
    # Lógica para generar el modelo de red neuronal
    return jsonify({
        "message": "holi"
    })

if __name__ == '__main__':
    app.run(debug=True)