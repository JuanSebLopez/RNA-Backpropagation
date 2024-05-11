const model = {
    mostrarParametros: function (banco_datos){
        var numEntradas = banco_datos.entradas.length;
        var numSalidas = banco_datos.salidas.length;
        var numPatrones = banco_datos.entradas[0].length;
    
        var contenedorParametros = document.createElement('div');
        contenedorParametros.classList.add('parametrosRed');
        
        var textInfo = document.createElement('h3');
        textInfo.textContent = `Parametros de Entrada`
        textInfo.style.textAlign = 'center';

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

    configurarCapas : function(numCapas) {
        var contenedorInteraccion = document.createElement('div');
        contenedorInteraccion.classList.add('interaccionUsuario');

        var textoCapas = document.createElement('p');
        textoCapas.textContent = 'Numero de capas Ocultas:';
        contenedorInteraccion.appendChild(textoCapas);

        var sliderCapas = document.createElement('input');
        sliderCapas.type = 'range'
        sliderCapas.min = 1;
        sliderCapas.max = 3;
        sliderCapas.value = 1;
        sliderCapas.id = 'sliderCapas'
        contenedorInteraccion.appendChild(sliderCapas);

        var sliderNeuronas = [];
        for(var i = 1; i <= 3; i++){
            var sliderNeurona = document.createElement('input');
            sliderNeurona.type = 'range';
            sliderNeurona.min = 1;
            sliderNeurona.max = 50;
            sliderNeurona.value = 1;
            sliderNeurona.classList.add(`sliderNeuronas${i}`)
            sliderNeurona.style.display = i <= numCapas ? 'block' : 'none'; // Mostrar solo los sliders hasta el número de capas seleccionado
            contenedorInteraccion.appendChild(sliderNeurona);
            sliderNeuronas.push(sliderNeurona);
        }

        sliderCapas.addEventListener('input', function(){
            var numCapas = parseInt(sliderCapas.value);
            for(var i = 0; i < 3; i++){
                sliderNeuronas[i].style.display = i < numCapas ? 'block' : 'none';
            }
        });

        return contenedorInteraccion;
    }
}
export default model;
