import model from "./model.js";

const training = {
    iniciarPesosUmbrales: function(banco_datos){
        document.getElementById('btn-pesos-umbrales').addEventListener('click', () => {
            const modelData = model.obtenerDatos(banco_datos)
            if (modelData ?? null){
                // Enviar modelData al backend
                axios.post('/generate-weights-thresholds', modelData)
                .then(response => {
                    var parametros = response.data;
                    var pesos_inicializados = parametros.pesos;
                    var umbrales_inicializados = parametros.umbrales;

                    this.mostrarPesosUmbrales(pesos_inicializados, umbrales_inicializados);
                })
                .catch(error => {
                    console.error('Error: ', error)
                });
            }
            else {
                console.log('No hay modelo de datos');
            }
        });
    },

    mostrarPesosUmbrales: function(pesos_inicializados, umbrales_inicializados){
        // Obtener contenedor 
        var divWU = document.getElementById('pesos-umbrales-container');

        // Procesar y mostrar pesos
        var pesosHTML = '';

        for (var layerName in pesos_inicializados) {
            pesosHTML += '<h3>Capa ' + layerName + '</h3>';
            var pesosLayer = pesos_inicializados[layerName];
        
            // Mostrar pesos de la capa
            pesosHTML += '<div>';
            for (var neuronIndex in pesosLayer) {
              var pesosNeuron = pesosLayer[neuronIndex];
              pesosHTML += '<div>Neurona ' + (parseInt(neuronIndex) + 1) + ': ';
              for (var i = 0; i < pesosNeuron.length; i++) {
                pesosHTML += pesosNeuron[i] + ', ';
              }
              pesosHTML += '</div>';
            }
            pesosHTML += '</div>';
        }
        
        // Mensaje de éxito
        pesosHTML += '<div class="success-message">PESOS Y UMBRALES GENERADOS CORRECTAMENTE</div>';
        divWU.innerHTML = pesosHTML;
    }
}
export default training;

