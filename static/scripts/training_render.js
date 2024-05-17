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
        // Añadir mensaje
        var msgWU = document.getElementById('msgWU');
        msgWU.textContent = "PESOS Y UMBRALES GENERADOS CORRECTAMENTE";
        msgWU.style.textAlign = 'center';
        msgWU.style.color = "#007bff";

        // Cambiar boton
        document.getElementById('btn-reset').style.display = 'none';
        var btnIniciarEntrenamiento = document.getElementById('btn-renderizar-vista-training');
        btnIniciarEntrenamiento.style.display = 'block';
    },

    renderizarVistaEntrenamiento: function(){
        document.getElementById('btn-renderizar-vista-training').addEventListener('click', () => {
            axios.get('/start-training').then(response => {
                // Redirige al usuario a la pagina de entrenamiento
                window.location.href = '/start-training';
            })
            .catch(error => {
                console.error('Error al renderizar la vista', error);
            });
        });
    }
}
export default training;

