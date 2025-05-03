import { Router } from "express";
import { ExamsResultsController } from "../../Controllers";
import { validateUserSession } from "../../Middlewares";

const router = Router();

router.use(validateUserSession)
router.post("/exams-results", ExamsResultsController.createExamResult);
router.delete("/exams-results/:id", ExamsResultsController.deleteExamResult);
router.put("/exams-results", ExamsResultsController.updateExamResult);

export default router;