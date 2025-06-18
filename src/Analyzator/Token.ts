enum Type {
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

class Token {
    private row: number;
    private column: number;
    private lexeme: string;
    private typeToken: Type;
    private typeTokenString: string;

    constructor(typeToken: Type, lexeme: string, row: number, column: number) {
        this.typeToken = typeToken;
        this.typeTokenString = Type[typeToken];
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
    }

    public getRow(): number {
        return this.row;
    }

    public getColumn(): number {
        return this.column;
    }

    public getLexeme(): string {
        return this.lexeme;
    }

    public getTypeToken(): Type {
        return this.typeToken;
    }

    public getTypeTokenString(): string {
        return this.typeTokenString;
    }
}


export { Token, Type };