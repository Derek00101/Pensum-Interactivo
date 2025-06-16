import { Token, Type } from "../Analyzer/Token";
import { Course } from "../models/Course";
import { Semester } from "../models/Semester";
import { Career } from "../models/Career";

export const StructureCareer = (tokens: Token[]): Career[] => {
    let careers: Career[] = [];
    let flags: boolean[] = [false, false, false, false, false, false];
    let career: Career | null = null;
    let semester: Semester | null = null;
    let course: Course | null = null;

    tokens.forEach((token: Token, index: number) => {
        if (token.getLexeme() === 'Carrera') {
            flags[0] = true;
        }

        if (flags[0] && token.getTypeToken() === Type.STRING) {
            career = new Career(token.getLexeme().slice(1, -1));
            flags[0] = false;
        }

        if (token.getLexeme() === 'Semestre') {
            flags[1] = true;
        }

        if (flags[1] && token.getTypeToken() === Type.NUMBER) {
            semester = new Semester(Number(token.getLexeme()));
            flags[1] = false;
        }

        if (token.getLexeme() === 'Curso') {
            flags[2] = true;
        }

        if (flags[2]) {
            if (!flags[3] && !flags[4] && token.getTypeToken() === Type.NUMBER) {
                course = new Course(token.getLexeme());
            } else if (!flags[4] && token.getTypeToken() === Type.NUMBER && course) {
                course.setArea(Number(token.getLexeme()));
                flags[3] = false;
            } else if (flags[4] && token.getTypeToken() === Type.NUMBER && course) {
                course.addPrerequisite(Number(token.getLexeme()));
            }

            if (token.getTypeToken() === Type.STRING && course) {
                course.setName(token.getLexeme().slice(1, -1));
            }

            if (token.getLexeme() === 'Area') {
                flags[3] = true;
            }

            if (flags[3] && token.getTypeToken() === Type.PAR_OPEN) {
                flags[4] = true;
            }

            if (token.getTypeToken() === Type.PAR_CLOSE) {
                flags[4] = false;
            }

            if (token.getTypeToken() === Type.CURLY_BRACKET_CLOSE && course && semester) {
                semester.addCourse(course);
                flags[2] = false;
                flags[1] = tokens[index + 1]?.getLexeme() !== 'Curso';
            }
        }

        if (flags[1] && token.getTypeToken() === Type.CURLY_BRACKET_CLOSE && career && semester) {
            career.addSemester(semester);
            flags[1] = false;
        }

        if (token.getTypeToken() === Type.SQUARE_BRACKET_CLOSE && career) {
            careers.push(career);
            flags[0] = false;
        }
    });

    return careers;
}