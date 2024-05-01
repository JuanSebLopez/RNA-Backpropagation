document.getElementById('archivoJSON').addEventListener('change', function(event) {
    var archivo = event.target.files[0];
    var formData = new FormData();
    formData.append('file', archivo);
    console.log('Archivo adjuntado:', archivo);

    axios.post('/upload', formData)
        .then(function(response) {
            var parametros = response.data;
            document.getElementById('parametrosRed').textContent = `Entradas: ${parametros.entradas}, Salidas: ${parametros.salidas}, Patrones: ${parametros.patrones}`;
            document.getElementById('btnCargarParametros').textContent = "Empezar Entrenamiento";
            document.getElementById('nombreArchivo').style.display = 'block';
            document.getElementById('nombreArchivo').textContent = `Archivo cargado: ${archivo.name}`;
        })
        .catch(function(error) {
            console.error('Error al cargar el archivo:', error);
        });
});