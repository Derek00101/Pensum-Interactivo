document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('analyze');
    const editor = document.getElementById('editor');
    const tableBody = document.getElementById('tableBody');
    const clear = document.getElementById('clear');
    const open = document.getElementById('open');
    const save = document.getElementById('save');
    const fileInput = document.getElementById('fileInput');

    // Limpiar editor y tabla
    if (clear) {
        clear.addEventListener('click', () => {
            editor.innerHTML = '';
            tableBody.innerHTML = '';
        });
    }

    // Abrir archivo
    if (open) {
        open.addEventListener('click', () => {
            fileInput.value = ''; // Limpiar selección previa
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    editor.innerText = event.target.result;
                };
                reader.readAsText(file);
            }
        });
    }

    // Guardar archivo
    if (save) {
        save.addEventListener('click', () => {
            const download = document.createElement('a');
            download.href = `data:text/plain;charset=utf-8,${encodeURIComponent(editor.innerText)}`;
            download.download = 'archivo.plfp';
            download.click();
        });
    }

    // Analizar texto
    if (button) {
        button.addEventListener('click', async () => {
            try {
                localStorage.clear();

                console.log('Enviando texto:', editor.innerText);

                let response = await fetch('http://localhost:4000/pensum/analyzePensum', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: editor.innerText
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let result = await response.json();
                
                // DEBUG: Veamos qué contiene exactamente la respuesta
                console.log('Respuesta completa:', result);
                console.log('Tokens:', result.tokens);
                console.log('Errors:', result.errors);
                console.log('Tipo de errors:', typeof result.errors);
                console.log('Es array errors?', Array.isArray(result.errors));
                console.log('Longitud de errors:', result.errors ? result.errors.length : 'undefined');

                let text = '';
                if (result.tokens && Array.isArray(result.tokens)) {
                    result.tokens.forEach((token, index) => {
                        text += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${token.row}</td>
                            <td>${token.column}</td>
                            <td>${token.lexeme}</td>
                            <td>${token.type}</td>
                        </tr>
                        `;
                    });
                }

                tableBody.innerHTML = text;

                // Verificación más robusta de errores
                const hasErrors = result.errors && Array.isArray(result.errors) && result.errors.length > 0;
                
                console.log('¿Tiene errores?', hasErrors);

                if (!hasErrors) {
                    alert('Análisis completado sin errores.');
                    if (result.editor) {
                        editor.innerHTML = result.editor; // Pintar resaltado
                        console.log('HTML del editor aplicado:', result.editor);
                    } else {
                        console.warn('No se recibió HTML para el editor');
                    }
                } else {
                    alert(`Se encontraron ${result.errors.length} errores durante el análisis.`);
                    localStorage.setItem('errors', JSON.stringify(result.errors));
                    console.log('Errores encontrados:', result.errors);
                }
            } catch (error) {
                console.error('Error en el análisis:', error);
                alert('Error al procesar el análisis: ' + error.message);
            }
        });
    }
});