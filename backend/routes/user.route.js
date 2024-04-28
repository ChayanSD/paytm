import {Router} from "express";
import {getAllUsers, getCurrentUser, loginUser, registerUser, updateUser} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/middleware.js";

const router = Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(authMiddleware,getCurrentUser);
router.route('/update').patch(authMiddleware,updateUser);
router.route('/bulk').get(getAllUsers);
export default router;