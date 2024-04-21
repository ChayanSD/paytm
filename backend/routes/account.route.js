import {Router} from "express";
import authMiddleware from "../middleware/middleware.js";
import { getBalance, transferMoney } from "../controllers/account.controller.js";

const router = Router();

router.route('/balance').get(authMiddleware,getBalance);
router.route('/transfer').post(authMiddleware,transferMoney)

export default router;