import { Router } from "express";
import { 
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from "../controllers/order.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth_middleware.js";

const router = Router();

// ─────────────────────────────────────────────────────
// User restricted routes
// ─────────────────────────────────────────────────────
// Everything concerning orders requires the user to be at least logged in
router.use(verifyJWT);

router.route("/place-order").post(createOrder);
router.route("/my-orders").get(getMyOrders);

// ─────────────────────────────────────────────────────
// Admin restricted routes
// ─────────────────────────────────────────────────────
router.use(verifyAdmin); // Since verifyJWT is already applied above, this adds Admin protection to routes below

router.route("/all").get(getAllOrders);
router.route("/:orderId").patch(updateOrderStatus);

export default router;
