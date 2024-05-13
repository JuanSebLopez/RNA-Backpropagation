import config from './config.js';
import model from './model.js';

document.getElementById('archivoJSON').addEventListener('change', function(event) {
    var submitBtn = document.getElementById('submitBtn');
    submitBtn.style.display = 'block';
});

document.getElementById('submitBtn').addEventListener('click', function() {
    var archivo = document.getElementById('archivoJSON').files[0];
    var formData = new FormData();
    formData.append('file', archivo);

    axios.post('/upload', formData)
        .then(function(response) {
            // Datos para generar la Red Neuronal
            var parametros = response.data;
            var columnas = parametros.columnas;
            var banco_datos = {
                "entradas": parametros.entradas,
                "salidas": parametros.salidas
            }

            // Clear previous content
            var contenedorModeloRed = document.getElementById('contenedorModeloRed');
            document.querySelector('.grupo-carga-parametros').innerHTML = ''; 
           
            // Generar titulo 
            crearTitulo(contenedorModeloRed);

            // Configuracion Red Neuronal
            contenedorModeloRed.appendChild(mostrarTabla(banco_datos, columnas)); // Append table to container
            contenedorModeloRed.appendChild(config.mostrarParametros(banco_datos));
            contenedorModeloRed.appendChild(config.configurarCapas());
            
            // Boton de Modelar
            crearBtn(contenedorModeloRed);

            // Generar Modelo
            model.generarModelo(banco_datos);
        })
        .catch(function(error) {
            console.error('Error al cargar el archivo:', error);
        });
});

function mostrarTabla(banco_datos, columnas) {
    // Se crea la tabla y se añade los estilos ya definidos
    var tabla = document.createElement('table');
    tabla.classList.add('banco_datos-style');

    // Crea el encabezado de la tabla
    var encabezado = tabla.createTHead().insertRow();
    for (var i = 0; i < columnas.length; i++) {
        var celdaEncabezado = encabezado.insertCell();
        celdaEncabezado.textContent = columnas[i];
    }

    // Concatena las entradas y salidas en una sola matriz para facilitar el proceso de generar la tabla
    var datosCombinados = banco_datos.entradas.concat(banco_datos.salidas);

    // Crea el cuerpo de la tabla y llena las celdas con los datos
    var cuerpoTabla = tabla.createTBody();
    for(var i = 0; i < datosCombinados[0].length; i++){ // Itera sobre las filas
        var fila = cuerpoTabla.insertRow();
        for(var j = 0; j < columnas.length; j++){ // Itera sobre las columnas
            var celdaDato = fila.insertCell();
            celdaDato.textContent = datosCombinados[j][i]; // Transposicion para que los datos se muestren correctamente
        }
    }
    return tabla;
}

function crearTitulo(contenedorModeloRed){
    var tituloModelo = document.createElement('h2');
    tituloModelo.textContent = 'MODELO DE LA RED NEURONAL';
    tituloModelo.style.textAlign = 'center';
    contenedorModeloRed.appendChild(tituloModelo)

    var subtituloBancoDatos = document.createElement('h3');
    subtituloBancoDatos.textContent = 'Banco de Datos';
    subtituloBancoDatos.style.textAlign = 'center';
    contenedorModeloRed.appendChild(subtituloBancoDatos);
}

function crearBtn (contenedorModeloRed){
    var btnSection = document.createElement('div');
    btnSection.classList.add('btnSection');
    btnSection.id = 'generateButton';

    var generarModeloBtn = document.createElement('button');
    generarModeloBtn.textContent = 'Generar Modelo RNA';
    // event
    btnSection.appendChild(generarModeloBtn);

    var textEl = document.createElement('p');
    textEl.textContent = 'O si prefieres...'
    btnSection.appendChild(textEl);

    var cambiarArchivoBtn = document.createElement('button');
    cambiarArchivoBtn.textContent = 'Cambiar Archivo';
    cambiarArchivoBtn.id = 'btn-reset';
    // Event
    btnSection.appendChild(cambiarArchivoBtn);

    contenedorModeloRed.appendChild(btnSection);
}
