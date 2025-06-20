import { Token, Type } from "../Analyzator/Token";
import { Career } from "../models/Career";
import { Course } from "../models/Course";
import { Semester } from "../models/Semester";

export const getCareers = (tokens: Token[]): Career[] => {
    let careers: Career[] = [];
    let flags: boolean[] = [false, false, false, false, false];
    let career: Career;
    let semester: Semester;
    let course: Course;

    tokens.forEach((token: Token, index: number) => {
        if (token.getLexeme() == 'Carrera') {
            flags[0] = true;
        }

        if (flags[0] && token.getTypeToken() == Type.STRING) {
            career = new Career(token.getLexeme().slice(1, token.getLexeme().length - 1));
            flags[0] = false;
        }

        if (token.getLexeme() == 'Semestre') {
            flags[1] = true;
        }

        if (flags[1] && token.getTypeToken() == Type.NUMBER) {
            semester = new Semester(Number(token.getLexeme()));
            flags[1] = false;
        }

        if (token.getLexeme() == 'Curso') {
            flags[2] = true;
        }

        if (flags[2]) {
            if (!flags[3] && !flags[4] && token.getTypeToken() == Type.NUMBER) {
                course = new Course(token.getLexeme());
            } else if (flags[3] && !flags[4] && token.getTypeToken() == Type.NUMBER) {
                course.setArea(Number(token.getLexeme()));
                flags[3] = false;
            } else if (flags[4] && token.getTypeToken() == Type.NUMBER) {
                course.addPrerequisite(token.getLexeme());
            }

            if (token.getTypeToken() == Type.STRING) {
                course.setName(token.getLexeme().slice(1, token.getLexeme().length - 1));
            }

            if (token.getLexeme() == 'Area') {
                flags[3] = true;
            }

            if (token.getTypeToken() == Type.PAR_OPEN) {
                flags[4] = true;
            }

            if (token.getTypeToken() == Type.PAR_CLOSE) {
                flags[4] = false;
            }

            if (token.getTypeToken() == Type.CURLY_BRACKET_CLOSE) {
                course.generateHtml();
                semester.addCourse(course);
                flags[2] = false;
                // Si el siguiente token no es 'Curso', se debe cerrar el semestre
                flags[1] = tokens[index + 1] && tokens[index + 1].getLexeme() != 'Curso' ? true : false;
            }
        }

        // Cuando se cierra un semestre, asegúrate de generar el HTML de todos los cursos antes de generar el del semestre
        if (flags[1] && token.getTypeToken() == Type.CURLY_BRACKET_CLOSE) {
            // Generar HTML de todos los cursos antes del semestre
            semester.getCourses().forEach(c => c.generateHtml());
            semester.generateHtml();
            career.addSemester(semester);
            flags[1] = false;
        }

        // Cuando se cierra la carrera, asegúrate de generar el HTML de todos los semestres y cursos antes de generar el de la carrera
        if (token.getTypeToken() == Type.SQUARE_BRACKET_CLOSE) {
            career.getSemesters().forEach(s => {
                s.getCourses().forEach(c => c.generateHtml());
                s.generateHtml();
            });
            career.generateHtml();
            careers.push(career);
        }
    });

    return careers;
}
