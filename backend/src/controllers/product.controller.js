import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/product_model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ─────────────────────────────────────────────────────
// Admin Only: Create Product
// ─────────────────────────────────────────────────────
const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, category, stock, discountPrice, isFeatured } = req.body;

    if (!title || !description || !price || !category) {
        throw new ApiError(400, "Title, description, price, and category are required");
    }

    // Handle Multiple Images Upload
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const localFilePath = file.path;
            const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
            if (cloudinaryResponse) {
                imageUrls.push(cloudinaryResponse.url);
            }
        }
    }

    const product = await Product.create({
        title,
        description,
        price,
        category,
        images: imageUrls,
        stock: stock || 0,
        discountPrice: discountPrice || 0,
        isFeatured: isFeatured || false
    });

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});

// ─────────────────────────────────────────────────────
// Public: Get All Products (With Filters)
// ─────────────────────────────────────────────────────
const getAllProducts = asyncHandler(async (req, res) => {
    const { category, search, limit = 10, page = 1 } = req.query;
    let query = { isActive: true };

    if (category) {
        query.category = category;
    }

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    // We populate the category so frontend gets category name/slug details
    const products = await Product.find(query)
        .populate("category", "name slug")
        .skip(skip)
        .limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);

    return res
        .status(200)
        .json(new ApiResponse(200, { products, totalProducts, page }, "Products fetched successfully"));
});

// ─────────────────────────────────────────────────────
// Public: Get Single Product By ID
// ─────────────────────────────────────────────────────
const getSingleProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid Product ID provided");
    }

    const product = await Product.findById(productId).populate("category", "name slug");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Update Product
// ─────────────────────────────────────────────────────
const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    
    let updateFields = { ...req.body };

    // Handle Multiple Images Upload if provided
    if (req.files && req.files.length > 0) {
        const imageUrls = [];
        for (const file of req.files) {
            const localFilePath = file.path;
            const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
            if (cloudinaryResponse) {
                imageUrls.push(cloudinaryResponse.url);
            }
        }
        if (imageUrls.length > 0) {
            updateFields.images = imageUrls;
        }
    }

    // Find product and update using updateFields
    // { new: true } returns the updated document
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updateFields }, 
        { new: true, runValidators: true }
    );

    if (!updatedProduct) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Delete Product
// ─────────────────────────────────────────────────────
const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};
