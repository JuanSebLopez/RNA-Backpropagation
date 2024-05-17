const model = {
    generarModelo: function(banco_datos) {
        document.getElementById('generar-modelo-btn').addEventListener('click', () => {
            const modelData = this.obtenerDatos(banco_datos)
            // Enviar datos al backend
            axios.post('/generate-model', modelData)   
                .then(response => {
                    // Procesar respuesta
                    this.mostrarModelo(response);
                    return 'Response: Modelo generado correctamente';
                })
                .catch(error => {
                    // Manejo errores
                    document.getElementById('configRed-container').style.display = 'block';
                    console.error('error al generar el modelo', error);
                    return null;
                });
        });
    },

    mostrarModelo: function(response){
        const graphImg = response.data.graph;

        // Elemento de imagen para mostrar el diagrama dle modelo
        const imgElement = document.createElement('img');
        imgElement.src = 'data:image/png;base64,' + graphImg;

        // Añadir imagen al DOM
        const imgContainer = this.crearContainer();
        imgContainer.appendChild(imgElement);
        
        // Informacion del modelo
        var info = document.createElement('p');
        info.textContent = 'Modelo de la Red Neuronal generado con tensorflow.'

        // Modificar contenedor de botones
        this.modificarBtnsRed();
    },

    crearContainer: function(){
        // Crear container para el modelo
        var imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');

        // Obtener container donde se mostrara el modelo de la Red y limpiarlo
        var parentContainer = document.getElementById('model-container');  
        parentContainer.innerHTML = '';

        // Titulo del modelo
        var titulo = document.createElement('h3');
        titulo.textContent = 'Modelo de la Red Neuronal'
        parentContainer.appendChild(titulo);

        // Añadir el container del modelo al contenedor padre
        parentContainer.appendChild(imgContainer);

        // Informacion adicional
        var tituloInfo = document.createElement('h3');
        tituloInfo.textContent = 'Información Modelo de la Red';
        parentContainer.appendChild(tituloInfo);
        var info = document.createElement('p');
        info.innerHTML = "En el anterior modelo, podemos ver los titulos 'Dense', estas son capas totalmente conectadas \
                            (fully connected layer) tambien conocidas como capa densa. En estas cada neurona está conectada \
                            a todas las neuronas de la capa anterior. En este caso, por ejemplo si añade 2 capas ocultas a \
                            la red, en el modelo observara solo 3 capas densas (Dense), ya que la primera capa esta \
                            conectada a las entradas. Es decir, la capa de entradas no es observable en este modelo pero \
                            la de salidas si y esto es confirmado observando el output shape de la ultima capa densa, que \
                            tiene el valor del numero de salidas que configuro para la red. <br><br>\
                            El input shape se refiere a los datos de entrada que se alimenta la capa densa correspondiente \
                            y el output shape a los datos de salida. El valor None se utiliza en estas formas por que \
                            se generan lotes de muestras de datos a la red. El tamaño del lote puede varia dependiendo la \
                            cantidad de datos, en este caso el uso de 'None' significa que el modelo puede aceptar lotes \
                            de cualquier tamaño.";
        parentContainer.appendChild(info);

        return imgContainer;
    },

    obtenerDatos: function(banco_datos){
        const numEntradas = banco_datos.entradas.length;
        const numSalidas = banco_datos.salidas.length;
        const numCapas = document.getElementById('rs-range-line').value;
        const numNeuronasArr = this.obtenerNeuronasPorCapa();
        const funcionesActivacion = this.obtenerFuncionesActivacion(numCapas);
        const modelData = {
            numCapas: numCapas,
            numEntradas: numEntradas,
            numSalidas: numSalidas,
            numNeuronas: numNeuronasArr,
            funcionesActivacion: funcionesActivacion,
            funcionesActivacionSalida: document.getElementById('selectbox-salidaFA').value,
            algoritmo: document.getElementById('selectbox-algoritmo').value
        }
        return modelData;
    },

    obtenerNeuronasPorCapa: function(){
        const containerElements = document.querySelectorAll('.containerSlider');
        
        let neuronasPorCapa = []; // Array para guardar las neuronas
        for (let i = 1; i < containerElements.length; i++){ // Empieza desde el indice 1 para saltarse el primer slider
            const container = containerElements[i];
            if (container.style.display !== 'none'){
                const sliderId = container.querySelector('.rs-range').id;
                const neuronas = document.getElementById(sliderId).value;
                neuronasPorCapa.push(parseInt(neuronas));
            }
        }
        return neuronasPorCapa;
    },

    obtenerFuncionesActivacion: function(numCapas) {
        let funcionesActivacion = [];
        const selectElements = document.querySelectorAll('.activation-function-select');
        for (let i = 0; i < numCapas; i++) {
            const selectElement = selectElements[i];
            if (selectElement.parentElement.style.display !== 'none') {
                funcionesActivacion.push(selectElement.value);
            }
        }
        return funcionesActivacion;
    },

    modificarBtnsRed: function(){
        // Obtener container y boton de pesos y umbrales
        var divBtn = document.getElementById('generateButton');
        var btnPeUmb = document.getElementById('btn-pesos-umbrales');  

        // Aplicar los estilos al contenedor de los botones
        btnPeUmb.style.display = 'block';
        divBtn.style.display = 'flex';
        divBtn.style.flexDirection = 'column';
        divBtn.style.alignItems = 'center';
        divBtn.style.justifyContent = 'space-between';
        divBtn.style.width = '100%';

        // Aplicar estilos a los botones
        divBtn.querySelectorAll('button').forEach(button => {
            button.style.margin = '10px 0';
            button.style.padding = '10px 20px';
        });
    },
}
export default model;