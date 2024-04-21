import {Router} from "express";
import {getAllUsers, loginUser, registerUser, updateUser} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/middleware.js";

const router = Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/update').patch(authMiddleware,updateUser);
router.route('/').get(authMiddleware,getAllUsers);
export default router;