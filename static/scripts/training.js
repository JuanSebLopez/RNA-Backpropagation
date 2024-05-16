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
        console.log(pesos_inicializados)
        // Obtener contenedor 
        var divWU = document.getElementById('pesos-umbrales-container');

        // Procesar y mostrar pesos
        var pesosHTML = '';
        for (var i = 0; i < pesos_inicializados.length; i++) {
            pesosHTML += '<div>Peso ' + (i+1) + ': ' + pesos_inicializados[i] + '</div>;'
        }
        divWU.innerHTML = pesosHTML;
    }
}
export default training;

