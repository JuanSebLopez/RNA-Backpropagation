import base64
import tempfile
import tensorflow as tf
import numpy as np

def create_model(model_data):
    num_capas, num_entradas, num_salidas, num_neuronas = parameterize_data(model_data)

    # Arquitectura de la red
    model = tf.keras.Sequential()

    # Añade la capa de entrada
    model.add(tf.keras.layers.InputLayer(shape=(num_entradas,)))

    # Añade las capas ocultas
    for i in range(num_capas):
        model.add(tf.keras.layers.Dense(num_neuronas[i], activation='relu'))

    # Añade la capa de salida
    model.add(tf.keras.layers.Dense(num_salidas, activation='softmax'))

    # Compila el modelo
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    temp_file_path = tempfile.mktemp('.png')
    tf.keras.utils.plot_model(model, to_file=temp_file_path, show_shapes=True)

    with open(temp_file_path, 'rb') as f:
        encoded_img = base64.b64encode(f.read()).decode('utf-8')
    
    return encoded_img

def initialize_weights_thresholds(model_data):
    num_capas, num_entradas, num_salidas, num_neuronas = parameterize_data(model_data)
    
    # Validar que el numero de capas no sea invalido
    if num_capas < 1 or num_capas > 3:
        return False, None, None # Error: Número de capas no valido
    
    for num_neurona in num_neuronas:
        if num_neurona < 1 or num_neurona > 50:
            return False, None, None  # Error: Número de neuronas por capa no válido
    
    # Inicializar pesos y umbrales
    pesos_inicializados = {}
    umbrales_inicializados = {}

    # Capa de entrada
    pesos_inicializados['WCE'] = tf.random.truncated_normal(
        shape=(num_entradas, num_neuronas[0]), stddev=0.1
    )
    umbrales_inicializados['u1'] =tf.zeros(shape=(num_neuronas[0],))

    # Capas ocultas
    for i in range(1, num_capas):
        pesos_inicializados[f'WC{i-1}C{i}'] = tf.random.truncated_normal(
            shape=(num_neuronas[i-1], num_neuronas[i]), stddev=0.1
        )
        umbrales_inicializados[f'u{i+1}'] = tf.zeros(shape=(num_neuronas[i],))

    # Capa salida
    pesos_inicializados[f'WCS'] = tf.random.truncated_normal(
            shape=(num_neuronas[-1], num_salidas), stddev=0.1
        )
    umbrales_inicializados['uS'] = tf.zeros(shape=(num_salidas,))

    pesos_inicializados, umbrales_inicializados = convert_data(pesos_inicializados, umbrales_inicializados)

    return True, pesos_inicializados, umbrales_inicializados

def parameterize_data(model_data):
    num_capas = int(model_data['numCapas'])
    num_entradas = model_data['numEntradas']
    num_salidas = model_data['numSalidas']
    num_neuronas = model_data['numNeuronas']

    return num_capas, num_entradas, num_salidas, num_neuronas

def convert_data(pesos_inicializados, umbrales_inicializados):
    pesos_list = []
    umbrales_list = []

    for key, tensor in pesos_inicializados.items():
        pesos_list.append({'nombre': key, 'valor': tensor.numpy().tolist()})

    for key, tensor in umbrales_inicializados.items():
        umbrales_list.append({'nombre': key, 'valor': tensor.numpy().tolist()})

    return pesos_list, umbrales_list