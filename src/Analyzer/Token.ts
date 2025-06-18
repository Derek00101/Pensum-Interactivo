export enum Type {
    RESERVED_WORDS,
    NUMBER,
    STRING,
    CURLY_BRACKET_OPEN,
    CURLY_BRACKET_CLOSE,
    SQUARE_BRACKET_OPEN,
    SQUARE_BRACKET_CLOSE,
    PAR_OPEN,
    PAR_CLOSE,
    COLON,
    COMMA,
    SEMICOLON,
    UNKNOWN
}

export class Token {
    constructor(
        public type: Type,
        public lexeme: string,
        public row: number,
        public column: number
    ) {}

    getTypeToken(): Type {
        return this.type;
    }

    getLexeme(): string {
        return this.lexeme;
    }
}