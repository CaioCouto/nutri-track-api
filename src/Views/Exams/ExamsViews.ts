import { Router } from "express";
import { ExamsController } from "../../Controllers";
import { validateUserSession } from "../../Middlewares";

const router = Router();

router.use(validateUserSession)
router.get("/exams", ExamsController.getAll);
router.get("/exams/:id", ExamsController.getExamById);
router.post("/exams", ExamsController.createExam);

export default router;