import { Router } from "express";
import { ExamsController } from "../../Controllers";
import { validateUserSession } from "../../Middlewares";

const router = Router();

router.get("/exams", ExamsController.getAll);
router.get("/exams/:id", ExamsController.getExamById);
router.post("/exams", ExamsController.createExam);
router.delete("/exams/:id", ExamsController.deleteExam);
router.put("/exams/:id", ExamsController.updateExam);

export default router;