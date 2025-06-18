import { Token, Type } from "../Analyzator/Token";
import { Career } from "../models/Career";
import { Course } from "../models/Course";
import { Semester } from "../models/Semester";

export const getCareers = (tokens: Token[]): Career[] => {
    let careers: Career[] = [];
    let flags = {
        carrera: false,
        semestre: false,
        curso: false,
        area: false,
        prereq: false
    };
    let career: Career | null = null;
    let semester: Semester | null = null;
    let course: Course | null = null;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // Procesar Carrera
        if (token.getLexeme() === 'Carrera') {
            flags.carrera = true;
            continue;
        }
        
        if (flags.carrera && token.getTypeToken() === Type.STRING) {
            career = new Career(token.getLexeme().replace(/"/g, ''));
            flags.carrera = false;
            continue;
        }

        // Procesar Semestre
        if (token.getLexeme() === 'Semestre') {
            flags.semestre = true;
            continue;
        }

        if (flags.semestre && token.getTypeToken() === Type.NUMBER) {
            semester = new Semester(Number(token.getLexeme()));
            flags.semestre = false;
            continue;
        }

        // Procesar Curso
        if (token.getLexeme() === 'Curso') {
            flags.curso = true;
            continue;
        }

        if (flags.curso && !course && token.getTypeToken() === Type.NUMBER) {
            course = new Course(token.getLexeme()); // NO uses Number()
            continue;
        }

        // Procesar propiedades del curso
        if (course) {
            if (token.getLexeme() === 'Nombre') {
                let j = i + 1;
                while (j < tokens.length) {
                    if (tokens[j].getTypeToken() === Type.STRING) {
                        course.setName(tokens[j].getLexeme().replace(/"/g, ''));
                        break;
                    }
                    j++;
                }
            }

            if (token.getLexeme() === 'Area') {
                flags.area = true;
            }

            if (flags.area && token.getTypeToken() === Type.NUMBER) {
                course.setArea(Number(token.getLexeme()));
                flags.area = false;
            }

            if (token.getLexeme() === 'Prerrequisitos') {
                flags.prereq = true;
            }

            if (flags.prereq && course && token.getTypeToken() === Type.NUMBER) {
                course.addPrerequisite(token.getLexeme()); // NO uses Number()
                continue;
            }

            if (token.getTypeToken() === Type.PAR_CLOSE) {
                flags.prereq = false;
            }
        }

        // Cerrar estructuras
        if (token.getTypeToken() === Type.CURLY_BRACKET_CLOSE) {
            if (course) {
                course.generateHtml();
                if (semester) {
                    semester.addCourse(course);
                }
                course = null;
                flags.curso = false;
            } else if (semester) {
                semester.generateHtml();
                if (career) {
                    career.addSemester(semester);
                }
                semester = null;
            }
        }

        if (token.getTypeToken() === Type.SQUARE_BRACKET_CLOSE && career) {
            career.generateHtml();
            careers.push(career);
            career = null;
        }
    }

    return careers;
}