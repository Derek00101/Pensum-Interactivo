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
        // Guardar el texto original para preservar el formato
        const originalText = input;
        input += '#';

        // Inicializar el array de tokens coloreados
        let coloredTokens: { lexeme: string, colored: string, position: number }[] = [];
        this.colors = originalText;

        let char: string;

        for (let i = 0; i < input.length; i++) {
            char = input[i];

            switch (this.state) {
                case 0:
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
                            this.state = 13;
                            this.addCharacter(char);
                            break;
                        case '"':
                            this.state = 10;
                            this.addCharacter(char);
                            break;
                        case ' ':
                            this.column++;
                            this.colors += char;
                            break;
                        case '\n':
                        case '\r':
                            this.row++;
                            this.column = 1;
                            this.colors += '\n';
                            break;
                        case '\t':
                            this.column += 4;
                            this.colors += '\t';
                            break;
                        default:
                            if (/\d/.test(char)) {
                                console.log('Encontrado posible número:', char);
                                this.addCharacter(char);
                                this.state = 11;
                            } else if (/[a-zA-Z]/.test(char)) {
                                this.addCharacter(char);
                                this.state = 1;
                            } else if (char == '#' && i == input.length - 1) {
                                console.log("Fin de análisis");
                            } else {
                                this.addError(Type.UNKNOWN, char, this.row, this.column);
                                this.column++;
                            }
                            break;
                    }
                    break;

                case 11:  // Estado para procesar números
                    if (/\d/.test(char)) {
                        this.addCharacter(char);
                        console.log('Acumulando número:', this.auxChar);
                    } else {
                        console.log('Finalizando número:', this.auxChar);
                        this.addToken(Type.NUMBER, this.auxChar, this.row, this.column - this.auxChar.length);
                        coloredTokens.push({
                            lexeme: this.auxChar,
                            colored: `<span class="number">${this.auxChar}</span>`,
                            position: i - this.auxChar.length
                        });
                        this.clean();
                        i--;  // Retroceder para procesar el carácter actual
                    }
                    break;

                case 2:
                    this.addToken(Type.CURLY_BRACKET_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;

                case 3:
                    this.addToken(Type.CURLY_BRACKET_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                    
                case 4:
                    this.addToken(Type.COLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                    
                case 5:
                    this.addToken(Type.SQUARE_BRACKET_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                    
                case 6:
                    this.addToken(Type.SQUARE_BRACKET_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                    
                case 7:
                    this.addToken(Type.SEMICOLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                    
                case 8:
                    this.addToken(Type.PAR_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                    
                case 9:
                    this.addToken(Type.PAR_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                    
                case 10:
                    if (char == '"') {
                        this.state = 12;
                        this.addCharacter(char);
                    } else if (/[a-zA-Z0-9\s\.]/.test(char)) {
                        this.addCharacter(char);
                    } else {
                        this.addError(Type.UNKNOWN, char, this.row, this.column);
                        this.column++;
                    }
                    break;

                case 12:
                    this.addToken(Type.STRING, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `<span class="string">${this.auxChar}</span>`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    i--;
                    break;
                
                case 13:
                    this.addToken(Type.COMMA, this.auxChar, this.row, this.column - this.auxChar.length);
                    coloredTokens.push({
                        lexeme: this.auxChar,
                        colored: `${this.auxChar}`,
                        position: i - this.auxChar.length
                    });
                    this.clean();
                    break;

                case 1: 
                    if (/[A-Za-z0-9]/.test(char)) {
                        this.addCharacter(char);
                    } else {
                        if (this.reservedWords.includes(this.auxChar)) {
                            this.addToken(Type.RESERVED_WORDS, this.auxChar, this.row, this.column - this.auxChar.length);
                            coloredTokens.push({
                                lexeme: this.auxChar,
                                colored: `<span class="keyword">${this.auxChar}</span>`,
                                position: i - this.auxChar.length
                            });
                        } else {
                            this.addError(Type.UNKNOWN, this.auxChar, this.row, this.column - this.auxChar.length);
                            this.colors += this.auxChar;
                        }
                        this.clean();
                        i--;
                    }
                    break;
            }
        }

        // Aplicar el coloreado manteniendo el formato original
        for (const token of coloredTokens.reverse()) {
            this.colors = this.colors.substring(0, token.position) + 
                         token.colored + 
                         this.colors.substring(token.position + token.lexeme.length);
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
