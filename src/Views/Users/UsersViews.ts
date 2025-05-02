import { Router } from "express";
import { UsersController } from "../../Controllers";

const router = Router();

router.post("/user/signin", UsersController.signin);
router.post("/user/signup", UsersController.signup);
router.post("/user/signout", UsersController.signout);

export default router;