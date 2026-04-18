import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import User from "../models/user_models.js";



// Middleware 1 — verify JWT (any logged-in user)

export const verifyJWT = asyncHandler(async (req, _, next) => {

    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request — no token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid access token — user not found");
    }

    if (user.status === "inactive") {
        throw new ApiError(403, "Your account has been deactivated");
    }

    req.user = user;
    next();
});

// Middleware 2 — verify Admin (admin role only)
export const verifyAdmin = asyncHandler(async (req, _, next) => {
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Access denied — admins only");
    }
    next();
});