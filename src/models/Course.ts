export class Course {
    
    private code: string;
    private name: string;
    private area: number;
    private prerequisites: string[];
    private html: string;

    constructor(code: string) {
        this.code = code;
        this.name = '';
        this.area = 0;
        this.prerequisites = [];
        this.html = '';
    }

    setName(name: string): void {
        this.name = name;
    }

    setArea(area: number): void {
        this.area = area;
    }

    addPrerequisite(code: string) {
        this.prerequisites.push(code);
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

    generateHtml() {
        // Crear div contenedor del curso con el ID
        this.html = `
            <div id="${this.code}" class="course">
                <div class="course-code">${this.code}</div>
                <div class="course-name">${this.name}</div>
                <div class="course-prereqs">
                    ${this.prerequisites.map(prereq => `<span>${prereq}</span>`).join('')}
                </div>
            </div>
        `;
    }

    getHtml(): string {
        return this.html;
    }
}
