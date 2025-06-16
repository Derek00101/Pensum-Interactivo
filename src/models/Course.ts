export class Course {
    private code: string;
    private name: string;
    private area: number;
    private prerequisites: string[];

    constructor(code: string) {
        this.code = code;
        this.name = '';
        this.area = 0;
        this.prerequisites = [];
    }

    setName(name: string): void {
        this.name = name;
    }

    setArea(area: number): void {
        this.area = area;
    }

    addPrerequisite(prereq: number): void {
        this.prerequisites.push(prereq.toString());
    }

    getCode(): string {
        return this.code;
    }

    getName(): string {
        return this.name;
    }

    getArea(): number {
        return this.area;
    }

    getPrerequisites(): string[] {
        return this.prerequisites;
    }
}
