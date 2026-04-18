import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getAdminCategories,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth_middleware.js";
import { upload } from "../middlewares/multer_middleware.js";

const router = Router();

// Public routes
router.route("/all").get(getAllCategories);

// Admin restricted routes
// Apply middlewares: first verify login, then verify admin role
router.use(verifyJWT, verifyAdmin);

// Accept a single image upload under the field name "image"
router.route("/").post(upload.single("image"), createCategory);

router.route("/admin/all").get(getAdminCategories);

router.route("/:categoryId")
    // Update might also include a new image
    .patch(upload.single("image"), updateCategory)
    .delete(deleteCategory);

export default router;
