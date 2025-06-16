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
            localStorage.clear();

            let response = await fetch('http://localhost:4000/pensum/analyzePensum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: editor.innerText
            });

            let result = await response.json();

            let text = '';
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

            tableBody.innerHTML = text;

            if (result.errors.length === 0) {
                alert('Análisis completado sin errores.');
                editor.innerHTML = result.editor; // Pintar resaltado
            } else {
                alert('Se encontraron errores durante el análisis.');
                localStorage.setItem('errors', JSON.stringify(result.errors));
            }
        });
    }
});
