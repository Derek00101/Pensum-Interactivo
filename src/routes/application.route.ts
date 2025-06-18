import { Router } from "express";
import { home, analyze, errorReport, pensum } from "../controllers/application.controller";

const router = Router();

router.get("/", home); // Esta línea es clave

router.post("/pensum/analyzePensum", analyze);
router.get("/error-report", errorReport);
router.get("/pensum/:id", pensum);

export default router;