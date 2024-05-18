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
                graficarResultados(comparacion);
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

function graficarResultados(comparacion) {
    var labels = comparacion.map((_, index) => `Patrón ${index + 1}`);
    var salidasEsperadas = comparacion.map(resultado => resultado.salida_esperada);
    var salidasPredichas = comparacion.map(resultado => resultado.salida_predicha);

    var ctx = document.getElementById('simulationChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Salidas Esperadas',
                    data: salidasEsperadas.map(salida => salida[0]), // Asumiendo una sola salida esperada
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Salidas Predichas',
                    data: salidasPredichas.map(salida => salida[0]), // Asumiendo una sola salida predicha
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Patrón'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor de la Salida'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}