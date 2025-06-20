document.addEventListener('DOMContentLoaded', () => {

    const pensum = document.getElementById('pensum');
    
    let id = pensum.classList.item(0);

    let carrera = JSON.parse(localStorage.getItem(`pensum${id}`));
    console.log('Carrera cargada desde localStorage:', carrera);

    if (carrera !== null && carrera.html) {
        // Renderizar el pensum
        pensum.innerHTML = carrera.html;

        let cursos = pensum.querySelectorAll('div');

        const limpiarDivs = () => {
            for (const curso of cursos) {
                curso.classList.remove('pre_curso');
            }
        };

        const marcarCursos = (pres) => {
            if (pres.length !== 0) {

                for (const pre of pres) {
                    const pre_curso = document.getElementById(pre.innerText);

                    pre_curso.classList.add('pre_curso');

                    marcarCursos(pre_curso.children[2].children);
                }

                return;
            }
        }

        const getCurso = (event) => {
            
            limpiarDivs();

            const curso = event.currentTarget;
            curso.classList.add('pre_curso');

            console.log(curso);

            const pre = curso.children[2].children;
            console.log(pre);

            if (pre.length === 0) alert('El curso no tiene prerrequisitos'); 

            marcarCursos(pre);

        } 

        for (const curso of cursos) {
            curso.addEventListener('click', getCurso);
        }

    } else {
        pensum.innerHTML = '<div style="color:red;">No se pudo cargar el pensum. Verifica que el análisis fue exitoso y que el HTML está presente en localStorage.</div>';
        console.error('No se encontró el HTML del pensum o el objeto carrera es nulo:', carrera);
    }
});