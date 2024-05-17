import os
from flask import Flask, jsonify, render_template, request
from configuration import create_model, initialize_weights_thresholds
from upload_utils import procesar_json
from flask_socketio import SocketIO, emit
import numpy as np
import json
import tensorflow as tf

app = Flask(__name__)
socketio = SocketIO(app)
MODEL_PATH = 'model.h5'


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

@app.route('/training', methods=['GET'])
def start_training():
    return render_template('training.html')

@app.route('/start-training', methods=['POST'])
def train_net():
    data = request.get_json()
    socketio.start_background_task(target=background_training, data=data)
    return jsonify({'status': 'training started'})

@app.route('/render-simulate', methods=['GET'])
def simulate_net():
    return render_template('simulate.html')

@app.route('/upload-simulation-data', methods=['POST'])
def upload_simulation_data():
    file = request.files['file']
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    data = json.load(file)
    entradas = np.array(data['entradas'])
    salidas_esperadas = np.array(data['salidas_esperadas'])

    # Cargar modelo entrenado
    model = load_model()  # Esta función debería cargar el modelo entrenado y sus pesos

    # Realizar predicciones
    predicciones = model.predict(entradas).tolist()

    # Comparar salidas predichas con salidas esperadas
    comparacion = []
    for i in range(len(predicciones)):
        comparacion.append({
            'salida_esperada': salidas_esperadas[i].tolist(),
            'salida_predicha': predicciones[i]
        })
    print('Comparacion:', comparacion)  # Depuración
    return jsonify({'comparacion': comparacion})

def load_model():
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        return model
    else:
        raise FileNotFoundError(f"Modelo no encontrado en la ruta: {MODEL_PATH}")

def create_model_net(model_data):
    num_capas = int(model_data['numCapas'])
    num_entradas = model_data['numEntradas']
    num_salidas = model_data['numSalidas']
    num_neuronas = model_data['numNeuronas']
    funciones_activacion = model_data['funcionesActivacion']
    funcion_activacion_salida = model_data['funcionesActivacionSalida']

    # Convertir las funciones de activación a funciones de Keras
    activation_map = {
        'Sigmoide': 'sigmoid',
        'Seno': 'sigmoid',  # Nota: no hay una función seno nativa en Keras, esto es solo un ejemplo
        'Tangente Hiperbólica': 'tanh',
        'Gaussiana': 'gelu',  # Nota: no hay una función gaussiana nativa en Keras, esto es solo un ejemplo
        'Lineal': 'linear'
    }
    funciones_activacion = [activation_map[fa] for fa in funciones_activacion]
    funcion_activacion_salida = activation_map[funcion_activacion_salida]

    # Crear el modelo secuencial
    model = tf.keras.Sequential()

    # Capa de entrada
    model.add(tf.keras.layers.InputLayer(input_shape=(num_entradas,)))

    # Capas ocultas
    for i in range(num_capas):
        model.add(tf.keras.layers.Dense(num_neuronas[i], activation=funciones_activacion[i]))

    # Capa de salida
    model.add(tf.keras.layers.Dense(num_salidas, activation=funcion_activacion_salida))

    return model

def background_training(data):
    model_data = data['modelData']
    banco_datos = data['bancoDatos']
    num_iteraciones = int(data['numIteraciones'])
    max_error = float(data['maxError'])
    tasa_aprendizaje = float(data['tasaAprendizaje'])
    algoritmo = model_data['algoritmo']

    # Reestructurar los datos para que cada patrón contenga entradas y salidas
    entradas = np.array(banco_datos['entradas'])
    salidas = np.array(banco_datos['salidas'])

    # Verificar que el número de patrones en entradas y salidas sea el mismo
    if entradas.shape[1] != salidas.shape[1]:
        raise ValueError(f'Inconsistent number of samples: entradas has {entradas.shape[1]}, salidas has {salidas.shape[1]}')

    # Datos de entrenamiento
    x_train = np.transpose(entradas)
    y_train = np.transpose(salidas)

    # Imprimir las formas de los datos para depuración
    print(f"x_train shape: {x_train.shape}")
    print(f"y_train shape: {y_train.shape}")

    # Crear y compilar el modelo
    model = create_model_net(model_data)

    # Elegir el optimizador basado en el algoritmo seleccionado
    if algoritmo == 'Backpropagation':
        optimizer = tf.keras.optimizers.SGD(learning_rate=tasa_aprendizaje)
    elif algoritmo == 'Backpropagation Cascade':
        # Puedes implementar otro optimizador o algoritmo aquí
        optimizer = tf.keras.optimizers.Adam(learning_rate=tasa_aprendizaje)
    else:
        optimizer = tf.keras.optimizers.SGD(learning_rate=tasa_aprendizaje)

    model.compile(optimizer=optimizer, loss='mean_squared_error')


    errores = []
    for epoch in range(num_iteraciones):
        history = model.fit(x_train, y_train, epochs=1, verbose=0)
        error = history.history['loss'][0]
        errores.append(error)

        # Emitir datos al frontend para actualizar la gráfica
        socketio.emit('training_update', {'iteration': epoch + 1, 'error': error})
        
        if error <= max_error:
            break

    # Guardar el modelo entrenado
    model.save(MODEL_PATH)

    # Emitir datos finales de pesos y umbrales
    pesos_finales = [layer.get_weights()[0].tolist() for layer in model.layers if isinstance(layer, tf.keras.layers.Dense)]
    umbrales_finales = [layer.get_weights()[1].tolist() for layer in model.layers if isinstance(layer, tf.keras.layers.Dense)]
    socketio.emit('training_complete', {'weights': pesos_finales, 'thresholds': umbrales_finales})

if __name__ == '__main__':
    app.run(debug=True)