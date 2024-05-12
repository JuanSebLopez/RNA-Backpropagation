const model = {
    mostrarParametros: function (banco_datos){
        var numEntradas = banco_datos.entradas.length;
        var numSalidas = banco_datos.salidas.length;
        var numPatrones = banco_datos.entradas[0].length;
    
        var contenedorParametros = document.createElement('div');
        contenedorParametros.classList.add('subtituloConfigRed');
        
        var textInfo = document.createElement('h3');
        textInfo.textContent = `Parametros de Entrada`

        var textoEntradas = document.createElement('p');
        textoEntradas.textContent = `Número de Entradas: ${numEntradas}`;
    
        var textoSalidas = document.createElement('p');
        textoSalidas.textContent = `Número de Salidas: ${numSalidas}`;
    
        var textoPatrones = document.createElement('p');
        textoPatrones.textContent = `Número de Patrones: ${numPatrones}`;

        contenedorParametros.appendChild(textInfo);

        var parametrosContainer = document.createElement('div');
        parametrosContainer.classList.add('parametros-container');
    
        parametrosContainer.appendChild(textoEntradas);
        parametrosContainer.appendChild(textoSalidas);
        parametrosContainer.appendChild(textoPatrones);

        contenedorParametros.appendChild(parametrosContainer);
    
        return contenedorParametros;
    },

    configurarCapas : function() {
        // Div que contiene todo
        var contenedorInteraccion = document.createElement('div');
        contenedorInteraccion.classList.add('subtituloConfigRed');
        // H3 del titulo
        var subtituloConfig = document.createElement('h3');
        subtituloConfig.textContent = 'Configuracion Red Neuronal';
        contenedorInteraccion.appendChild(subtituloConfig);
        // Info
        var textoCapas = document.createElement('p');
        textoCapas.textContent = 'Seleccione con el siguiente deslizador el numero de capas que desea configurar a la Red';
        contenedorInteraccion.appendChild(textoCapas);
        // Primer Slider
        var sliderCapas = document.createElement('input');
        var valorSlider = document.createElement('span');
        sliderCapas.type = 'range';
        sliderCapas.min = 1;
        sliderCapas.max = 3;
        sliderCapas.value = 1;
        sliderCapas.id = 'sliderCapas';
        valorSlider.id = 'valorSlider';
        sliderCapas.classList.add('slider');
        contenedorInteraccion.appendChild(sliderCapas);
        contenedorInteraccion.appendChild(valorSlider);
        // Div que contiene los sliders dinamicos
        var sliderNeuronasContainer = document.createElement('div');
        sliderNeuronasContainer.classList.add('container-sliderNeuronas');
        // Slider dinamicos
        var slider = [];
        for(var i = 1; i <= 3; i++ ){
            var sliderNeurona = document.createElement('input');
            sliderNeurona.type = 'range';
            sliderNeurona.min = 1;
            sliderNeurona.max = 50;
            sliderNeurona.value = 1;
            sliderNeurona.id = 'sliderNeurona${i}';
            if (i >= 2){
                sliderNeurona.style.display = 'none';
            }
            sliderNeuronasContainer.appendChild(sliderNeurona);
            slider.push(sliderNeurona);
        }

        // Evento al mover el slider (Cantidad de Capas de la Red)
        sliderCapas.addEventListener('input', function(){
            var numCapas = parseInt(sliderCapas.value);
            for(var i = 0; i < slider.length; i++){
                slider[i].style.display = i < numCapas ? 'block' : 'none';
            }         
        });
        sliderCapas.addEventListener('input', function(){
            valorSlider.textContent = sliderCapas.value;
            var posicionSlider = (sliderCapas.value / sliderCapas.max) * 100;
            valorSlider.style.left = posicionSlider + '%';
        });
        sliderCapas.addEventListener('mousemove', function(){
            valorSlider.style.display = 'inline-block';
        });
        sliderCapas.addEventListener('mouseout', function(){
            valorSlider.style.display = 'none';
        });

        // Eventos sliders de Cantidad de Neuronas

        // Agrega los sliders al div
        contenedorInteraccion.appendChild(sliderNeuronasContainer);
        return contenedorInteraccion;
    },
}
export default model;
