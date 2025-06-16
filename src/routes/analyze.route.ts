import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { LexicalAnalyzer } from '../Analyzer/LexicalAnalyzer';
import { Type } from '../Analyzer/Token';
import { StructureCareer } from '../utils/StructureCareer';

const router = Router();

router.post('/analyzePensum', (req: Request, res: Response, next: NextFunction) => {
    try {
        const analyzer = new LexicalAnalyzer();
        const tokens = analyzer.scanner(req.body);
        const errors = analyzer.getErrorList();
        const careers = StructureCareer(tokens);
        
        res.json({
            tokens: tokens.map(token => ({
                type: Type[token.type],
                lexeme: token.lexeme,
                row: token.row,
                column: token.column
            })),
            errors: errors,
            careers: careers
        });
    } catch (error) {
        next(error);
    }
});

export default router;