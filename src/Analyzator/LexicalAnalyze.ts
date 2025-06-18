import { Token, Type } from "./Token";

export class LexicalAnalyze {
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
        input += '#'; // Marca el final del análisis

        let char: string;

        for (let i = 0; i < input.length; i++) {
            char = input[i];

            switch (this.state) {
                case 0: // Estado inicial
                    switch (char) {
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
                        case ',':
                            this.state = 13; // Estado para procesar la coma
                            this.addCharacter(char);
                            break;
                        case '"': // Inicio de cadena
                            this.state = 10;
                            this.addCharacter(char);
                            break;
                        case ' ': // Espacio en blanco
                            this.column++;
                            this.colors += char; // Mantener espacio exactamente como está
                            break;
                        case '\n': // Nueva línea
                        case '\r': // Retorno de carro
                            this.row++;
                            this.column = 1;
                            this.colors += char; // Mantener saltos de línea
                            break;
                        case '\t': // Tabulación
                            this.column += 4;
                            this.colors += char; // Mantener tabulaciones
                            break;
                        default:
                            if (/\d/.test(char)) {
                                // Estado para procesar números
                                this.addCharacter(char);
                                this.state = 11;
                                
                                continue;
                            }

                            if (/[a-zA-Z]/.test(char)) {

                                this.addCharacter(char);
                                this.state = 1;
                                continue; // Continuar al siguiente carácter
                                
                            }

                            if (char == '#' && i == input.length - 1) {
                                // Fin del análisis
                                console.log("Fin de análisis");
                            } else {
                                this.addError(Type.UNKNOWN, char, this.row, this.column);
                                this.column++;
                            }

                            break;
                    }
                    break;

                

                case 2: // Llave abierta
                    this.addToken(Type.CURLY_BRACKET_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 3: // Llave cerrada
                    this.addToken(Type.CURLY_BRACKET_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 4: // Dos puntos
                    this.addToken(Type.COLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 5: // Corchete abierto
                    this.addToken(Type.SQUARE_BRACKET_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 6: // Corchete cerrado
                    this.addToken(Type.SQUARE_BRACKET_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 7: // Punto y coma
                    this.addToken(Type.SEMICOLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 8: // Paréntesis abierto
                    this.addToken(Type.PAR_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 9: // Paréntesis cerrado
                    this.addToken(Type.PAR_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;
                    
                case 10: // Cadena
                    if (char == '"') {
                        this.state = 12; 
                        this.addCharacter(char);
                        continue;
                    }
                    
                    // Solo permitir letras, números, espacios y puntos en strings
                    if (/[a-zA-Z0-9\s\.]/.test(char)) {
                        this.addCharacter(char);
                    } else {
                        // Agregar el carácter especial como error
                        this.addError(Type.UNKNOWN, char, this.row, this.column);
                        this.column++;
                    }
                    break;

                case 12:  // Estado de cadena cerrada
                    this.addToken(Type.STRING, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="string">${this.auxChar}</span>`;
                    this.clean();
                    i--; 
                    break; 

                case 11: // Estado para procesar números
                    if (/\d/.test(char)) {
                        this.addCharacter(char);
                        continue;
                    }
                    this.addToken(Type.NUMBER, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `<span class="number">${this.auxChar}</span>`;
                    this.clean();
                    i--;
                    break;
                
                case 13: // Estado para procesar la coma
                    this.addToken(Type.COMMA, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.colors += `${this.auxChar}`;
                    this.clean();
                    break;

                case 1: // Palabra reservada
                    if (/[A-Za-z]/.test(char)) { 
                        this.addCharacter(char);
                        continue;
                    }
                    if (this.reservedWords.includes(this.auxChar)) {
                        this.addToken(Type.RESERVED_WORDS, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += `<span class="keyword">${this.auxChar}</span>`;
                    } else {
                        this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.colors += this.auxChar;
                    }
                    this.clean();
                    i--;
                    break;
            }

        }

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

    getTokenList(): Token[] {
        return this.tokenList;
    }

    getErrorList(): Token[] {
        return this.errorList;
    }

    getColors(): string {
        return this.colors;
    }
}