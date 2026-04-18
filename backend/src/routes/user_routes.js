import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, getAllUsers, updateUserStatus, deleteUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth_middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);



router.route("/refresh-token").post(refreshAccessToken);



router.use( verifyJWT);

router.route("/logout").post(logoutUser);
router.route("/current-user").get(getCurrentUser);


// ─────────────────────────────────────────────────────
// Admin restricted routes
// ─────────────────────────────────────────────────────
router.route("/admin/all").get(verifyAdmin, getAllUsers);
router.route("/admin/:userId/status").patch(verifyAdmin, updateUserStatus);
router.route("/admin/:userId").delete(verifyAdmin, deleteUser);

export default router;