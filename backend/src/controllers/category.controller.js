import asyncHandler from "../utils/asyncHandler.js";
import Category from "../models/category_models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ─────────────────────────────────────────────────────
// Admin Only: Create Category
// ─────────────────────────────────────────────────────
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, isActive } = req.body;
    
    if (!name?.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        throw new ApiError(409, "Category with this name already exists");
    }

    // Handle Image Upload
    let imageUrl = "";
    if (req.file) {
        const localFilePath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
        if (cloudinaryResponse) {
            imageUrl = cloudinaryResponse.url;
        }
    }

    const category = await Category.create({
        name,
        description,
        image: imageUrl,
        isActive: isActive !== undefined ? isActive : true
    });

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});

// ─────────────────────────────────────────────────────
// Public: Get All Categories
// ─────────────────────────────────────────────────────
const getAllCategories = asyncHandler(async (req, res) => {
    // Only return active categories for normal fetching
    const categories = await Category.find({ isActive: true });
    
    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Get All Categories (Including Inactive)
// ─────────────────────────────────────────────────────
const getAdminCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    
    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Admin categories fetched successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Update Category
// ─────────────────────────────────────────────────────
const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Delete Category
// ─────────────────────────────────────────────────────
const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export {
    createCategory,
    getAllCategories,
    getAdminCategories,
    updateCategory,
    deleteCategory
};
