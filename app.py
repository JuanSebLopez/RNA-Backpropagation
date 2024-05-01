from flask import Flask, jsonify, render_template, request
from upload_utils import procesar_json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    print("Recibiendo solicitud POST en /upload")
    if 'archivo' not in request.files:
        print('archivo')
        return 'No file part'
    
    print("r1")
    file = request.files['archivo']
    print("r2")

    entradas, salidas, error = procesar_json(file)
    print("r3")

    if error:
        print("r4")
        return error
    else:
        print("r5")
        return jsonify({"message": "Archivo recibido correctamente"})

if __name__ == '__main__':
    app.run(debug=True)