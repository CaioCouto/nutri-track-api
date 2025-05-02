import { Router, Request, Response } from "express";
import { FormatterController } from "../../Controllers";

const router = Router();

router.get("/formatter", FormatterController.formatDiet);

export default router;