import { Semester } from "./Semester";

export class Career {
    private name: string;
    private semesters: Semester[];

    constructor(name: string) {
        this.name = name;
        this.semesters = [];
    }

    getName(): string {
        return this.name;
    }

    addSemester(semester: Semester): void {
        this.semesters.push(semester);
    }

    getSemesters(): Semester[] {
        return this.semesters;
    }
}