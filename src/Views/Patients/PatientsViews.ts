import { Router } from "express";
import { PatientsController } from "../../Controllers";
import { validateUserSession } from "../../Middlewares";

const router = Router();

router.get("/patients", PatientsController.getAll);
router.get("/patients/:id", PatientsController.getPatientById);
router.post("/patients", PatientsController.createPatient);
router.delete("/patients/:id", PatientsController.deletePatient);
router.put("/patients/:id", PatientsController.updatePatient);

export default router;