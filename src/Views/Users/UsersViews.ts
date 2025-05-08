import { Router } from "express";
import { UsersController } from "../../Controllers";

const router = Router();

router.post("/users/signin", UsersController.signin);
router.post("/users/signup", UsersController.signup);
router.post("/users/signout", UsersController.signout);

export default router;