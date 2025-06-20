export class Course {
    
    private code: string;
    private name: string;
    private area: number;
    private prerequisites: string[];
    public html: string;

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
        this.html = `
            <div id="${this.code}">
                <span class="codigo">${this.code}</span>
                <span>${this.name}</span>
                <span class="pre">
                    ${this.prerequisites.map((item) => {
                        return `<p>${item}</p>`;
                    }).join('\n\t')}
                </span> 
                </div>
            </div>
        `;
    }

    getHtml(): string {
        return this.html;
    }
}
