const model = {
    generarModelo: function(banco_datos) {
        document.getElementById('generateButton').addEventListener('click', () => {
            const numEntradas = banco_datos.entradas.length;
            const numSalidas = banco_datos.salidas.length;
            const numCapas = document.getElementById('rs-range-line').value;
            const numNeuronasArr = this.obtenerNeuronasPorCapa();
            console.log(numNeuronasArr);
            const modelData = {
                numCapas: numCapas,
                numEntradas: numEntradas,
                numSalidas: numSalidas,
                numNeuronas: numNeuronasArr
            }
            // Enviar datos al backend
            axios.post('/generate-model', modelData)
                .then(response => {
                    // Procesar respuesta
                    console.log('holi');
                })
                .catch(error => {
                    // Manejo errores
                    console.error('error al generar el modelo')
                });
        });
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
}
export default model;