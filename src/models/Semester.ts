import { Course } from './Course';

export class Semester {
    private num: number;
    private courses: Course[];

    constructor(num: number) {
        this.num = num;
        this.courses = [];
    } 

    getNum(): number {
        return this.num;
    }

    addCourse(course: Course): void {
        this.courses.push(course);
    }

    getCourse(): Course[] {
        return this.courses;
    }
}