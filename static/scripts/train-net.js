// Inicializar sliders al cargar la página
document.addEventListener('DOMContentLoaded', initializeSliders);

function initializeSliders(){
    const sliders = document.querySelectorAll('.rs-range');
    sliders.forEach(slider => {
        updateSliderValue(slider);
        slider.addEventListener('input', (event) => {
            updateSliderValue(event.target);
        });
    });
}

function updateSliderValue(slider) {
    const bullet = slider.parentElement.querySelector('.rs-label');
    const sliderWidth = slider.offsetWidth;
    const max = slider.max;
    const min = slider.min;
    const value = slider.value;

    bullet.innerHTML = slider.value;

    const bulletPosition = ((value - min) / (max - min) *  ((sliderWidth - 21)));

    bullet.style.left = `${bulletPosition}px`
}

document.getElementById('btn-start-training').addEventListener('click', () => {
    const modelData = JSON.parse(localStorage.getItem('modelData'));
    const bancoDatos = JSON.parse(localStorage.getItem('bancoDatos'));

    // Verificar las dimensiones de bancoDatos
    console.log("modelData:", modelData);
    console.log("bancoDatos:", bancoDatos);

     // Capturar valores de los sliders
     const numIteraciones = document.getElementById('rs-range-iter').value;
     const maxError = document.getElementById('rs-range-error').value;
     const tasaAprendizaje = document.getElementById('rs-range-tasa').value;

    // Agregar estos valores al objeto de datos
    const trainingData = {
        modelData: modelData,
        bancoDatos: bancoDatos,
        numIteraciones: numIteraciones,
        maxError: maxError,
        tasaAprendizaje: tasaAprendizaje
    };

    // Enviar datos al backend
    axios.post('/start-training', trainingData)
    .then(response => {
        console.log('Entrenamiento iniciado:', response.data);
        // Conectar a WebSocket para recibir actualizaciones
        setupWebSocket();
    })
    .catch(error => {
        console.error('Error al iniciar el entrenamiento:', error);
    });
});

function setupWebSocket() {
    const socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('training_update', function(data) { 
        console.log('Actualización de entrenamiento:', data);
        // Actualizar gráfica en tiempo real
        updateGraph(data.iteration, data.error);
    });
    
    socket.on('training_complete', function(data) {
        console.log('Entrenamiento completo:', data);
        // Mostrar datos finales de pesos y umbrales
        displayFinalWeightsAndThresholds(data.weights, data.thresholds);
    });
}

let chart;
function createChart() {
    const ctx = document.getElementById('trainingChart').getContext('2d');
    chart = new Chart(ctx, {
        'type': 'line',
        'data': {
            labels: [],
            datasets: [{
                label: 'Error vs Iteracion',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWith: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iteracion'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Error' 
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function updateGraph(iteration, error) {
    if(!chart) {
        createChart();
    }
    chart.data.labels.push(iteration);
    chart.data.datasets[0].data.push(error);
    chart.update();
}

function displayFinalWeightsAndThresholds(weights, thresholds) {
    const downloadButton = document.getElementById('btn-download');
    downloadButton.style.display = 'block';
    downloadButton.addEventListener('click', () => {
        const data = {
            weights: weights,
            thresholds: thresholds
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pesos_umbrales.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Simular Red
    const simulateButton = document.getElementById('btn-simulate');
    simulateButton.style.display='block';
    simulateButton.addEventListener('click', () => {
        axios.get('/render-simulate').then(response => {
            // Redirige al usuario a la pagina de entrenamiento
            window.location.href = '/render-simulate';
        })
        .catch(error => {
            console.error('Error al renderizar la vista', error);
        });
    });
}