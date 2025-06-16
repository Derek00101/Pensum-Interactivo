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
                    if (/[a-zA-Z]/.test(char)) { 
                        this.addCharacter(char);
                        this.state = 1;
                        continue;
                    } else if (/\d/.test(char)) {
                        this.addCharacter(char);
                        this.state = 11;
                        continue;
                    } else if (char === '"') {
                        this.addCharacter(char);
                        this.state = 10;
                        continue;
                    } else {
                        switch(char) {
                            case '{':
                                this.addToken(Type.CURLY_BRACKET_OPEN, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case '}':
                                this.addToken(Type.CURLY_BRACKET_CLOSE, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case '[':
                                this.addToken(Type.SQUARE_BRACKET_OPEN, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case ']':
                                this.addToken(Type.SQUARE_BRACKET_CLOSE, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case '(':
                                this.addToken(Type.PAR_OPEN, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case ')':
                                this.addToken(Type.PAR_CLOSE, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case ':':
                                this.addToken(Type.COLON, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case ';':
                                this.addToken(Type.SEMICOLON, char, this.row, this.column);
                                this.colors += char;
                                this.column++;
                                break;
                            case ' ':
                                this.column++;
                                this.colors += char;
                                break;
                            case '\n':
                            case '\r':
                                this.row++;
                                this.column = 1;
                                this.colors += char;
                                break;
                            case '\t':
                                this.column += 4;
                                this.colors += char;
                                break;
                            default:
                                if (char !== '#' || i !== input.length - 1) {
                                    this.addError(Type.UNKNOWN, char);
                                    this.colors += char;
                                    this.column++;
                                }
                                break;
                        }
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
                    } else {
                        this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += this.auxChar;
                    }
                    this.clean();
                    i--; // Retroceder para procesar el carácter actual
                    break;

                case 10: // Cadena
                    if (char === '"') {
                        this.addCharacter(char);
                        this.addToken(Type.STRING, this.auxChar, this.row, this.column - this.auxChar.length + 1);
                        this.colors += `<span class="string">${this.auxChar}</span>`;
                        this.clean();
                    } else if (char === '\n' || char === '\r') {
                        // Error: cadena no cerrada
                        this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length + 1);
                        this.colors += this.auxChar;
                        this.clean();
                        this.row++;
                        this.column = 1;
                    } else if (char === '#' && i === input.length - 1) {
                        // Error: cadena no cerrada al final del archivo
                        this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length + 1);
                        this.colors += this.auxChar;
                        this.clean();
                    } else {
                        this.addCharacter(char);
                    }
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