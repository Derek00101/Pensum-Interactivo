import { Request, Response } from 'express';
import { LexicalAnalyzer } from '../Analyzer/LexicalAnalyzer';
import { Career } from '../models/Career';
import { StructureCareer } from '../utils/StructureCareer';

export const home = (req: Request, res: Response) => {
    res.render('pages/index');
}
    
export const analyze = (req: Request, res: Response) => {
    const body = req.body;

    let scanner: LexicalAnalyzer = new LexicalAnalyzer();
    let tokens = scanner.scanner(body);
    let careers: Career[] = StructureCareer(tokens);

    res.json({
        "tokens": scanner.getTokenList(),
        "errors": scanner.getErrorList(),
        "editor": scanner.getColors(),
        "careers": careers
    });
}





