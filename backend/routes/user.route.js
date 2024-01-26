import {Router} from "express";
import {loginUser, registerUser, updateUser} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/middleware.js";

const router = Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/update').patch(authMiddleware,updateUser);

export default router;