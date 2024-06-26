import config from './config.js';
import model from './model.js';
import training  from './training_render.js';

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

            // Configurar Red Neuronal
            configurarRedNeuronal(banco_datos, columnas);
        })
        .catch(function(error) {
            console.error('Error al cargar el archivo:', error);
        });
});

function configurarRedNeuronal(banco_datos, columnas){
    // Clear previous content
    var contenedorModeloRed = document.getElementById('contenedorModeloRed');
    document.querySelector('.grupo-carga-parametros').innerHTML = ''; 

    // Generar titulo 
    crearTitulo(contenedorModeloRed);
    
    // Configuracion Red Neuronal
    contenedorModeloRed.appendChild(mostrarTabla(banco_datos, columnas)); // Append table to container
    contenedorModeloRed.appendChild(config.mostrarParametros(banco_datos));
    contenedorModeloRed.appendChild(config.configurarCapas());
    
    // Modelo Red Neuronal
    var [divModelo, divInicializar] = crearDivModelo();
    contenedorModeloRed.appendChild(divModelo);
    contenedorModeloRed.appendChild(divInicializar);

    // Boton de Modelar
    crearBtn(contenedorModeloRed);

    // Generar Modelo
    model.generarModelo(banco_datos);

    // Inicializar Pesos y Umbrales
    training.iniciarPesosUmbrales(banco_datos);

    // Registrar evento para iniciar entrenamiento
    training.renderizarVistaEntrenamiento();
}

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
    tituloModelo.textContent = 'CONFIGURACION DE LA RED NEURONAL';
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
    generarModeloBtn.id = 'generar-modelo-btn';
    btnSection.appendChild(generarModeloBtn);

    var cambiarArchivoBtn = document.createElement('button');
    cambiarArchivoBtn.textContent = 'Cambiar Archivo';
    cambiarArchivoBtn.id = 'btn-reset';
    btnSection.appendChild(cambiarArchivoBtn);

    var btnIniciarEntrenamiento = document.createElement('button');
    btnIniciarEntrenamiento.textContent = 'Iniciar Entrenamiento';
    btnIniciarEntrenamiento.id = 'btn-renderizar-vista-training';
    btnIniciarEntrenamiento.style.display = 'none';
    btnSection.appendChild(btnIniciarEntrenamiento);

    var btnPeUmb = document.createElement('button');
    btnPeUmb.textContent = 'Generar Pesos y Umbrales';
    btnPeUmb.id = 'btn-pesos-umbrales';
    btnPeUmb.style.display = 'none';
    btnSection.appendChild(btnPeUmb);

    contenedorModeloRed.appendChild(btnSection);
}

function crearDivModelo(){
    var divModelo = document.createElement('div');
    divModelo.id = 'model-container'

    var divInicializar = document.createElement('div');
    divInicializar.id = 'pesos-umbrales-container';

    var msgWU = '<h3 id="msgWU"></h3>';
    divInicializar.innerHTML = msgWU;

    return [divModelo, divInicializar];
}
