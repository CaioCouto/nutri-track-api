import { Router } from "express";
import { PatientResultsController } from "../../Controllers";
import { validateUserSession } from "../../Middlewares";

const router = Router();

router.post("/patients-results", PatientResultsController.createPatientResult);
router.delete("/patients-results/:id", PatientResultsController.deletePatientResult);
router.put("/patients-results", PatientResultsController.updatePatientResult);

export default router;