document.addEventListener('DOMContentLoaded', () => {

    const button = document.getElementById('analyze');
    const editor = document.getElementById('editor');
    const table = document.getElementById('tableBody');
    const clear = document.getElementById('clear');
    const open = document.getElementById('open');
    const save = document.getElementById('save');
    const errorReportBtn = document.getElementById('errorReport');
    const pensums = document.getElementById('pensums');
    let errorTableBody = document.getElementById('errorTableBody');
    let errorTableContainer = document.getElementById('errorTableContainer');

    clear.addEventListener('click', () => {
        editor.innerHTML = ''; // Limpia el contenido del editor
        table.innerHTML = ''; // Limpia la tabla de tokens y errores
    });

    open.addEventListener('click', () => {

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.plfp';

        fileInput.addEventListener('change', () => {
            
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];

                const reader = new FileReader();

                reader.onload = (e) => {
                    const fileContent = e.target.result;
                    editor.innerText = fileContent; // Carga el contenido del archivo en el editor
                }

                reader.readAsText(file);
            }

            fileInput.remove(); // Elimina el input después de usarlo

        });

        fileInput.click(); // Simula un clic para abrir el selector de archivos
    });    

    save.addEventListener('click', () => {
        const download = document.createElement('a');
        download.href = `data:text/plain;charset=utf-8,${encodeURIComponent(editor.innerText)}`;
        download.download = 'archivo.plfp';
        download.click();
    });

    button.addEventListener('click', async () => {

        localStorage.clear(); // Limpia el almacenamiento local antes de cada análisis
        pensums.innerHTML = ''; // Limpia el contenedor de pensums
        
        let response = await fetch('http://localhost:3001/pensum/analyzePensum', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: editor.innerText
        });

        let result = await response.json();

        let textTable = ``;

        result.tokens.forEach((token, index) => {
            textTable += `
            <tr>
                <td> ${index + 1}</td>
                <td> ${token.typeTokenString}</td>
                <td> ${token.lexeme}</td>
                <td> ${token.row}</td>
                <td> ${token.column}</td>
            </tr>
            `;
            
        });

        table.innerHTML = textTable;    

        if (result.errors.length === 0) {

            alert('No se encontraron errores');

            editor.innerHTML = result.editor; // Actualiza el editor con el contenido procesado

            console.log(result.careers);

            result.careers.forEach(( _, index) => {
                pensums.innerHTML += `<a class="btn btn-success btn_user" href="${'/pensum/' + (index + 1)}" target="_blank"> ${'Pensum: ' + (index + 1)}</a>\n`;
            });

            // Guardar el objeto completo de la carrera (incluyendo el HTML) en localStorage
            result.careers.forEach((career, index) => {
                localStorage.setItem(`pensum${index + 1}`, JSON.stringify(career));
            });

        } else {
            alert('Se encontraron errores, revisa la tabla de tokens');

            // Guarda los errores en el almacenamiento local
            localStorage.setItem('errors', JSON.stringify(result.errors));

            if (result.errors.length > 0) {
                // Mostrar la tabla de errores
                errorTableContainer.style.display = 'block';
                let errorRows = '';
                result.errors.forEach((error, idx) => {
                    errorRows += `
                        <tr>
                            <td>${idx + 1}</td>
                            <td>${error.row}</td>
                            <td>${error.column}</td>
                            <td><code class="text-danger">"${error.lexeme}"</code></td>
                            <td>Token no reconocido</td>
                        </tr>
                    `;
                });
                errorTableBody.innerHTML = errorRows;
            } else {
                // Ocultar la tabla de errores si no hay errores
                errorTableContainer.style.display = 'none';
                errorTableBody.innerHTML = '';
            }

        }
        
    });

    errorReportBtn.addEventListener('click', () => {
        const errorsJson = localStorage.getItem('errors');
        console.log('Errores recuperados:', errorsJson); // Debug

        if (errorsJson) {
            try {
                const errors = JSON.parse(errorsJson);
                console.log('Errores parseados:', errors); // Debug

                if (Array.isArray(errors) && errors.length > 0) {
                    // Redirigir con los errores codificados
                    window.location.href = `/error-report?errors=${encodeURIComponent(errorsJson)}`;
                } else {
                    alert('No hay errores para mostrar.');
                }
            } catch (error) {
                console.error('Error al procesar errores:', error);
                alert('Error al procesar los errores.');
            }
        } else {
            alert('No hay errores para mostrar.');
        }
    });

});

