document.getElementById('btn-upload').addEventListener('click', function() {
    var archivo = document.getElementById('archivoJSON').files[0];
    var formData = new FormData();
    formData.append('file', archivo);

    axios.post('/upload-simulation-data', formData)
        .then(function(response) {
            console.log('Respuesta del servidor:', response.data);
            var comparacion = response.data.comparacion;
            if (comparacion) {
                mostrarResultados(comparacion);
            } else {
                console.error('Estructura de datos incorrecta:', response.data);
            }
        })
        .catch(function(error) {
            console.error('Error al cargar el archivo:', error);
        });
});

function mostrarResultados(comparacion) {
    var contenedorResultados = document.getElementById('resultadosSimulacion');
    contenedorResultados.innerHTML = '<h3>Resultados de la Simulación</h3>';
    var listaResultados = document.createElement('ul');

    comparacion.forEach((resultado, index) => {
        var item = document.createElement('li');
        item.innerHTML = `Patrón ${index + 1}:<br>Salida Esperada: ${JSON.stringify(resultado.salida_esperada)}<br>Salida Predicha: ${JSON.stringify(resultado.salida_predicha)}`;
        listaResultados.appendChild(item);
    });

    contenedorResultados.appendChild(listaResultados);
}
