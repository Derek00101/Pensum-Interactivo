import { Token, Type } from "./Token";

export class LexicalAnalyzer {
    private row: number;
    private column: number;
    private auxChar: string;
    private state: number;
    private tokenList: Token[];
    private errorList: Token[];
    private reservedWords: string[];
    private colors: string;

    constructor() {
        this.row = 1;
        this.column = 1;
        this.auxChar = '';
        this.state = 0;
        this.tokenList = [];
        this.errorList = [];
        this.reservedWords = [
            'Carrera',
            'Semestre',
            'Curso',
            'Nombre',
            'Area',
            'Prerrequisitos'
        ];
        this.colors = '';
    }

    public scanner(input: string) {
        // Limpia los arrays antes de analizar
        this.tokenList = [];
        this.errorList = [];
        this.colors = '';
        this.row = 1;
        this.column = 1;
        this.auxChar = '';
        this.state = 0;

        input += '#';
        let char: string;

        for (let i = 0; i < input.length; i++) {
            char = input[i];

            switch(this.state) {
                case 0: // estado inicial
                    switch(char) {
                        case '{': 
                            this.state = 2;
                            this.addCharacter(char);
                            break;
                        case '}': 
                            this.state = 3;
                            this.addCharacter(char);
                            break;
                        case ':': 
                            this.state = 4;
                            this.addCharacter(char);
                            break;
                        case '[': 
                            this.state = 5;
                            this.addCharacter(char);
                            break;
                        case ']': 
                            this.state = 6;
                            this.addCharacter(char);
                            break;
                        case ';': 
                            this.state = 7;
                            this.addCharacter(char);
                            break;
                        case '(': 
                            this.state = 8;
                            this.addCharacter(char);
                            break;
                        case ')': 
                            this.state = 9; 
                            this.addCharacter(char);
                            break;
                        case '"': // Inicio de cadena
                            this.state = 10; // Estado de cadena
                            this.addCharacter(char);
                            break;
                        case ' ':
                            this.column++;
                            this.colors += `${char}`;
                            continue;
                        case '\n':
                        case '\r':
                            this.row++;
                            this.column = 1;
                            continue;
                        case '\t':
                            this.column += 4;
                            continue;
                        default:
                            if (/\d/.test(char)) {
                                this.state = 11;
                                this.addCharacter(char);
                            } else if (/[A-Za-z]/.test(char)) {
                                this.state = 1;
                                this.addCharacter(char);
                            } else if (char === '#' && i === input.length - 1) {
                                // Fin del análisis
                            } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
                                // Ignorar espacios y saltos de línea
                                if (char === ' ') {
                                    this.column++;
                                    this.colors += `${char}`;
                                } else if (char === '\t') {
                                    this.column += 4;
                                } else {
                                    this.row++;
                                    this.column = 1;
                                }
                            } else {
                                this.addError(Type.UNKNOWN, char, this.row, this.column);
                                this.column++;
                            }
                            break;
                    }
                    break;


                case 1: // Palabra reservada
                    if (/[A-Za-z0-9]/.test(char)) {
                        this.addCharacter(char);
                        continue;
                    }
                    // Procesar la palabra acumulada
                    if (this.reservedWords.includes(this.auxChar)) {
                        this.addToken(Type.RESERVED_WORDS, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += `<span class="keyword">${this.auxChar}</span>`;
                        this.clean();
                        i--;
                        continue;
                    } 
                    
                    this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--; // Retroceder para procesar el carácter actual
                    break;

                case 2: // Llave abierta
                    this.addToken(Type.CURLY_BRACKET_OPEN, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 3: // Llave cerrada
                    this.addToken(Type.CURLY_BRACKET_CLOSE, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 4: // Dos puntos
                    this.addToken(Type.COLON, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 5: // Corchete abierto
                    this.addToken(Type.SQUARE_BRACKET_OPEN, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 6: // Corchete cerrado
                    this.addToken(Type.SQUARE_BRACKET_CLOSE, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 7: // Punto y coma
                    this.addToken(Type.SEMICOLON, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 8: // Paréntesis abierto
                    this.addToken(Type.PAR_OPEN, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 9: // Paréntesis cerrado
                    this.addToken(Type.PAR_CLOSE, char, this.row, this.column);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                case 10: // Cadena
                    if (char == '"') {
                        this.state = 12; 
                        this.addCharacter(char);
                        continue;
                    }
                    this.addCharacter(char);
                    break;

                case 11: // Número
                    if (/\d/.test(char)) {
                        this.addCharacter(char);
                        continue;
                    } else {
                        this.addToken(Type.NUMBER, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += `<span class="number">${this.auxChar}</span>`;
                        this.clean();
                        i--; // Retroceder para procesar el carácter actual
                    }
                    break;
                
                case 12:  // Estado de cadena cerrada
                    // Aceptación
                    this.addToken(Type.STRING, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="string">${this.auxChar}</span>`
                    this.clean();
                    i--; 
                default:
                    // Estado desconocido, resetear
                    this.clean();
                    i--;
                    break;
            }
        }

        // Si terminamos con un token pendiente, procesarlo
        if (this.auxChar !== '' && this.state !== 0) {
            switch(this.state) {
                case 1: // Palabra pendiente
                    if (this.reservedWords.includes(this.auxChar)) {
                        this.addToken(Type.RESERVED_WORDS, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += `<span class="keyword">${this.auxChar}</span>`;
                    } else {
                        this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += this.auxChar;
                    }
                    break;
                case 10: // Cadena sin cerrar
                    this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length + 1);
                    this.colors += this.auxChar;
                    break;
                case 11: // Número pendiente
                    this.addToken(Type.NUMBER, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="number">${this.auxChar}</span>`;
                    break;
            }
            this.clean();
        }

        console.log('Análisis completado. Tokens:', this.tokenList.length, 'Errores:', this.errorList.length);
        console.log('HTML generado:', this.colors);

        return this.tokenList;
    }

    private addCharacter(char: string) {
        this.auxChar += char;
        this.column++;
    }

    private clean() {
        this.state = 0;
        this.auxChar = '';
    }

    private addToken(type: Type, lexeme: string, row: number = this.row, column: number = this.column) {
        this.tokenList.push(new Token(type, lexeme, row, column));
    }

    private addError(type: Type, lexeme: string, row: number = this.row, column: number = this.column) {
        this.errorList.push(new Token(type, lexeme, row, column));
    }

    public getTokenList(): Token[] {
        return this.tokenList;
    }

    public getErrorList(): Token[] {
        return this.errorList;
    }

    public getColors(): string {
        return this.colors;
    }
}