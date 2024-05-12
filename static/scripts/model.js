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
        // Contenedor Principal
        var containerConfigRed = document.createElement('div');
        containerConfigRed.classList.add('container-configRed');

        // Subtitulo
        var divSubtitulo = document.createElement('div');
        divSubtitulo.classList.add('subtituloConfigRed');
        containerConfigRed.appendChild(divSubtitulo);

        var subtituloConfig = document.createElement('h3');
        subtituloConfig.textContent = 'Configuracion Red Neuronal';
        divSubtitulo.appendChild(subtituloConfig);

        // Informacion
        var divInfo = document.createElement('div');
        divInfo.classList.add('info');
        containerConfigRed.appendChild(divInfo);

        var textoCapas = document.createElement('p');
        textoCapas.textContent = 'Seleccione con el siguiente deslizador el numero de capas que desea configurar a la Red';
        divInfo.appendChild(textoCapas);

        // Slider Principal
        var contenedorCapas = document.createElement('div');
        contenedorCapas.classList.add('containerSlider');
        containerConfigRed.appendChild(contenedorCapas);

        var containerSlider = document.createElement('div');
        containerSlider.classList.add('range-slider')
        contenedorCapas.appendChild(containerSlider);

        var divRange = document.createElement('div');
        divRange.classList.add('box-minmax');
        contenedorCapas.appendChild(divRange);

        var minRange = document.createElement('span');
        minRange.textContent = "1";
        divRange.appendChild(minRange);

        var maxRange = document.createElement('span');
        maxRange.textContent = "3";
        divRange.appendChild(maxRange);

        var valorSlider = document.createElement('span');
        valorSlider.textContent = 1;
        valorSlider.classList.add("rs-label");
        valorSlider.id = 'rs-bullet';
        containerSlider.appendChild(valorSlider);

        var sliderCapas = document.createElement('input');
        sliderCapas.type = 'range';
        sliderCapas.min = 1;
        sliderCapas.max = 3;
        sliderCapas.value = 1;
        sliderCapas.id = 'rs-range-line';
        sliderCapas.classList.add('rs-range');
        containerSlider.appendChild(sliderCapas);

        // Sliders Dinamicos
        var sliderNeuronasContainer = document.createElement('div');
        sliderNeuronasContainer.classList.add('container-sliderNeuronas');

        var slider = [];
        for(var i = 1; i <= 3; i++ ) {
            var sliderNeurona = document.createElement('input');
            sliderNeurona.type = 'range';
            sliderNeurona.min = 1;
            sliderNeurona.max = 50;
            sliderNeurona.value = 1;
            sliderNeurona.id = `sliderNeurona${i}`;
            if (i >= 2){
                sliderNeurona.style.display = 'none';
            }
            sliderNeuronasContainer.appendChild(sliderNeurona);
            slider.push(sliderNeurona);
        }

        // Eventos
        sliderCapas.addEventListener('input', showSliderValue, false);
        function showSliderValue(){
            valorSlider.innerHTML = sliderCapas.value;
            var bulletPosition = ((sliderCapas.value - sliderCapas.min) / (sliderCapas.max - sliderCapas.min)) * (279 - (sliderCapas.max - sliderCapas.min));
            valorSlider.style.left = bulletPosition + "px";
        }    

        sliderCapas.addEventListener('input', function(){
            var numCapas = parseInt(sliderCapas.value);
            for(var i = 0; i < slider.length; i++){
                slider[i].style.display = i < numCapas ? 'block' : 'none';
            }         
        });

        // Agregar elementos al contenedor principal
        containerConfigRed.appendChild(sliderNeuronasContainer);

        return containerConfigRed;
    },
}
export default model;
