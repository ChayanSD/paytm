import express,{Router} from "express";
import {userController} from "../controllers/user.controller.js";

const router = Router();

router.route('/hello').get(userController);


export default router;