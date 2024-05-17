import model from "./model.js";

const training = {
    iniciarPesosUmbrales: function(banco_datos){
        document.getElementById('btn-pesos-umbrales').addEventListener('click', () => {
            const modelData = model.obtenerDatos(banco_datos)
            if (modelData){
                // Guardar datos en Local Storage
                localStorage.setItem('modelData', JSON.stringify(modelData));
                localStorage.setItem('bancoDatos', JSON.stringify(banco_datos));

                // Enviar modelData al backend
                axios.post('/generate-weights-thresholds', modelData)
                .then(response => {
                    var parametros = response.data;
                    var pesos_inicializados = parametros.pesos;
                    var umbrales_inicializados = parametros.umbrales;
                    console.log('Pesos: ',pesos_inicializados, '\n Umbrales: ', umbrales_inicializados)
                    
                    this.mostrarPesosUmbrales();
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

    mostrarPesosUmbrales: function(){
        // Obtener contenedor 
        var divWU = document.getElementById('pesos-umbrales-container');
        var pesosHTML = '';
        
        // Mensaje de éxito
        pesosHTML += '<h3>PESOS Y UMBRALES GENERADOS CORRECTAMENTE</h3>';
        divWU.innerHTML = pesosHTML;
    }
}
export default training;

