import express from "express";
import { validate } from "../../middlewares/validate";
import {
  loginHandler,
  registerHandler,
  refreshTokenHandler,
  logoutHandler,
  getMeHandler,
} from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
import passport from "passport";

const router = express.Router();

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutHandler);
router.get("/me", passport.authenticate("jwt", { session: false }), getMeHandler);

export default router;
