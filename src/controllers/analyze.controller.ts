import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { LexicalAnalyzer } from '../Analyzer/LexicalAnalyzer';
import { Type } from '../Analyzer/Token';
import { StructureCareer } from '../utils/StructureCareer';

const router = Router();

router.post('/analyzePensum', (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Texto recibido:', req.body);
        
        const analyzer = new LexicalAnalyzer();
        const tokens = analyzer.scanner(req.body);
        const errors = analyzer.getErrorList();
        const careers = StructureCareer(tokens);
        
        console.log('Tokens generados:', tokens.length);
        console.log('Errores encontrados:', errors.length);
        console.log('Lista de errores:', errors);
        console.log('HTML generado:', analyzer.getColors());
        
        const response = {
            tokens: tokens.map(token => ({
                type: Type[token.type],
                lexeme: token.lexeme,
                row: token.row,
                column: token.column
            })),
            errors: errors.map(error => ({
                type: Type[error.type],
                lexeme: error.lexeme,
                row: error.row,
                column: error.column
            })),
            editor: analyzer.getColors(), 
            careers: careers
        };
        
        console.log('Respuesta final:', JSON.stringify(response, null, 2));
        
        res.json(response);
    } catch (error) {
        console.error('Error en el controlador:', error);
        next(error);
    }
});

export default router;