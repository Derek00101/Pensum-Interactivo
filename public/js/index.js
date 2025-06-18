document.addEventListener('DOMContentLoaded', () => {

    const button = document.getElementById('analyze');
    const editor = document.getElementById('editor');
    const tableBody = document.getElementById('tableBody');
    const clear = document.getElementById('clear');
    const open = document.getElementById('open');
    const save = document.getElementById('save');
    const errorReportBtn = document.getElementById('errorReport');
    const pensums = document.getElementById('pensum');

    clear.addEventListener('click', () => {
        editor.innerHTML = ''; // Limpia el contenido del editor
        tableBody.innerHTML = ''; // Limpia la tabla de tokens y errores
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

    // Modifica el evento click del botón analyze
    button.addEventListener('click', async () => {
        localStorage.clear(); // Limpia el almacenamiento local antes de cada análisis
        
        const pensums = document.getElementById('pensums'); 
        if (pensums) {
            pensums.innerHTML = '';
        }
        
        try {
            if (!editor.innerText.trim()) {
                alert('El editor está vacío');
                return;
            }

            let response = await fetch('/pensum/analyzePensum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: editor.innerText
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            let result = await response.json();
            
            // Mostrar el resultado completo en la consola
            console.log('Respuesta completa:', {
                tokens: result.tokens.map(token => ({
                    typeToken: token.typeToken,
                    typeTokenString: token.typeTokenString,
                    lexeme: token.lexeme,
                    row: token.row,
                    column: token.column
                })),
                errors: result.errors.map(error => ({
                    typeToken: error.typeToken,
                    typeTokenString: error.typeTokenString,
                    lexeme: error.lexeme,
                    row: error.row,
                    column: error.column
                })),
                editor: result.editor,
                careers: result.careers
            });
            
            // Actualizar el editor con el texto coloreado
            if (result.editor) {
                editor.innerHTML = result.editor;
            }

            // Limpiar y actualizar la tabla
            tableBody.innerHTML = '';
            if (result.tokens) {
                result.tokens.forEach((token, index) => {
                    const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${token.row}</td>
                        <td>${token.column}</td>
                        <td>${token.lexeme}</td>
                        <td>${token.typeTokenString}</td>
                    </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }

            // Actualizar tabla de errores
            const errorTableContainer = document.getElementById('errorTableContainer');
            const errorTableBody = document.getElementById('errorTableBody');
            errorTableBody.innerHTML = '';

            if (result.errors && result.errors.length > 0) {
                errorTableContainer.style.display = 'block';
                result.errors.forEach((error, index) => {
                    const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${error.row}</td>
                        <td>${error.column}</td>
                        <td><code class="text-danger">"${error.lexeme}"</code></td>
                        <td>Token no reconocido</td>
                    </tr>
                    `;
                    errorTableBody.innerHTML += row;
                });
                alert(`Se encontraron ${result.errors.length} errores en el análisis.`);
            } else {
                errorTableContainer.style.display = 'none';
                alert('Análisis completado sin errores.');

                editor.innerHTML = result.editor;

                // Verificar que result.careers existe y es un array
                if (result.careers && Array.isArray(result.careers)) {
                    result.careers.forEach((career, index) => {
                        if (pensums) {
                            pensums.innerHTML += `
                                <a class="btn btn-success btn_user m-2" 
                                   href="/pensum/${index + 1}" 
                                   target="_blank">
                                    Ver Pensum ${index + 1}
                                </a>`;
                        }
                        
                        // Modificar cómo guardamos en localStorage
                        if (career) {
                            localStorage.setItem(`pensum${index + 1}`, JSON.stringify(career));
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al realizar el análisis');
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

