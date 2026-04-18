import { Router } from "express";
import { 
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth_middleware.js";
import { upload } from "../middlewares/multer_middleware.js";

const router = Router();

// ─────────────────────────────────────────────────────
// Public routes
// ─────────────────────────────────────────────────────
router.route("/all").get(getAllProducts);
router.route("/:productId").get(getSingleProduct);

// ─────────────────────────────────────────────────────
// Admin restricted routes
// Apply middlewares: first verify login, then verify admin role
// ─────────────────────────────────────────────────────
router.use(verifyJWT, verifyAdmin);

// Accept up to 5 images under the field name "images"
router.route("/").post(upload.array("images", 5), createProduct);

router.route("/:productId")
    .patch(upload.array("images", 5), updateProduct)
    .delete(deleteProduct);

export default router;
