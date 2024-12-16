import express from "express";
import { google, signin, signup } from "../controllers/auth.controller";
import { updateUser } from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyUser";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/google", google);

export default router;
