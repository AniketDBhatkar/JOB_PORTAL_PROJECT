import express from "express"
import { updateProfile, register,login,logout} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticate.js";

const router=express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/profile/update").post(isAuthenticated,updateProfile);

export default router;