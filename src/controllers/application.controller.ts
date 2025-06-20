import { Request, Response } from "express";
import { LexicalAnalyze } from "../Analyzator/LexicalAnalyze";
import { Career } from "../models/Career";
import { getCareers } from "../utils/StructureCareer";

export const home = (req: Request, res: Response) => {
    res.render('pages/index');
};

export const analyze = (req: Request, res: Response) => {
    const body = req.body;
    
    let scanner: LexicalAnalyze = new LexicalAnalyze();
    scanner.scanner(body);

    // Solo genera carreras si NO hay errores léxicos
    let careers: Career[] = [];
    if (scanner.getErrorList().length === 0) {
        careers = getCareers(scanner.getTokenList());
    }

    res.json({
        "tokens": scanner.getTokenList(),
        "errors": scanner.getErrorList(),
        "editor": scanner.getColors(),
        "careers": careers
    });
};

export const errorReport = (req: Request, res: Response) => {
    try {
        const errorsJson = req.query.errors as string;
        
        if (!errorsJson) {
            console.log('No errors in query');
            return res.render('pages/error-report', { errors: [] });
        }

        // Decodificar y parsear los errores
        const decodedErrors = decodeURIComponent(errorsJson);
        console.log('Decoded errors string:', decodedErrors); // Debug
        
        const errors = JSON.parse(decodedErrors);
        console.log('Parsed errors:', errors); // Debug

        return res.render('pages/error-report', { errors: errors });

    } catch (error) {
        console.error('Error in errorReport:', error);
        return res.render('pages/error-report', { errors: [] });
    }
};

//endpoint para generar el pensum
export const pensum = (req: Request, res: Response) => {

    const id = req.params.id;
    
    res.render('pages/carrera', {id});

}
