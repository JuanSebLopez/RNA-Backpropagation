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
            // Contenedor de cada slider
            var containerSliderNeurona = document.createElement('div');
            containerSliderNeurona.classList.add('containerSlider');
            containerSliderNeurona.style.marginLeft = 10 + "px";
            containerSliderNeurona.style.marginRight = 10 + "px";

            // Numero de Capa
            var numeroCapa = document.createElement('h3');
            numeroCapa.textContent = `Capa ${i}`
            containerSliderNeurona.appendChild(numeroCapa);

            // Div range-slider
            var rangeSliderDiv = document.createElement('div');
            rangeSliderDiv.classList.add('range-slider');
            containerSliderNeurona.appendChild(rangeSliderDiv);

            // Span rs-label
            var rsLabelSpan = document.createElement('span');
            rsLabelSpan.textContent = "1";
            rsLabelSpan.classList.add('rs-label');
            rsLabelSpan.id = `rs-bullet-${i}`
            rangeSliderDiv.appendChild(rsLabelSpan);

            // Input type range
            var inputRange = document.createElement('input');
            inputRange.type = 'range';
            inputRange.min = 1;
            inputRange.max = 50;
            inputRange.value = 1;
            inputRange.id = `sliderNeurona${i}`;
            inputRange.classList.add('rs-range');
            rangeSliderDiv.appendChild(inputRange);

            // Div box-minmax
            var boxMinMaxDiv = document.createElement('div');
            boxMinMaxDiv.classList.add('box-minmax');
            containerSliderNeurona.appendChild(boxMinMaxDiv);

            // Span para el rango mínimo
            var minSpan = document.createElement('span');
            minSpan.textContent = "1";
            boxMinMaxDiv.appendChild(minSpan);

            // Span para el rango máximo
            var maxSpan = document.createElement('span');
            maxSpan.textContent = "50";
            boxMinMaxDiv.appendChild(maxSpan);
            if (i >= 2) {
                containerSliderNeurona.style.display = 'none';
            }
            sliderNeuronasContainer.appendChild(containerSliderNeurona);
            slider.push(containerSliderNeurona);
        }
        
        // Eventos Slider Principal
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

        // Evento Sliders Dinamicos
        slider.forEach((sliderElement) => {
            const inputRange = sliderElement.querySelector("input[type='range']");
            const valorSlider = sliderElement.querySelector("span[class='rs-label']");
            inputRange.addEventListener('input', function(){
                valorSlider.innerHTML = inputRange.value;
                var bulletPosition = ((inputRange.value - inputRange.min) / (inputRange.max - inputRange.min) * (326 - (inputRange.max - inputRange.min)));
                valorSlider.style.left = bulletPosition + "px";
            });
        });
        containerConfigRed.appendChild(sliderNeuronasContainer);
        return containerConfigRed;
    },
}
export default model;
