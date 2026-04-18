import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user_models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// ─────────────────────────────────────────────────────
// Helper — generate both tokens and save refresh token
// ─────────────────────────────────────────────────────
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// ─────────────────────────────────────────────────────
// Register
// Fields accepted: username, email, password
// ─────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, role } = req.body;


    // Validate — no empty fields
    if ([username, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check duplicate username or email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // Create user — only fields that exist in your schema
    const user = await User.create({
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password,
        role
        // role defaults to "user"
        // status defaults to "active"
    });

    // Return user without sensitive fields
    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

// ─────────────────────────────────────────────────────
// Login
// Accepts username OR email + password
// ─────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Block inactive users before checking password
    if (user.status === "inactive") {
        throw new ApiError(403, "Your account has been deactivated. Contact support.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
        ));
});

// ─────────────────────────────────────────────────────
// Logout
// Clears refresh token from DB and clears cookies
// ─────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ─────────────────────────────────────────────────────
// Refresh access token
// Uses refresh token from cookie or body
// ─────────────────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or already used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed"
        ));
});

// ─────────────────────────────────────────────────────
// Get current logged-in user
// Requires verifyJWT middleware
// ─────────────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"));
});



// ─────────────────────────────────────────────────────
// Admin Only: Get All Users
// ─────────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
        .select("-password -refreshToken")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, users, "All users fetched successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Update User Status (active/inactive)
// ─────────────────────────────────────────────────────
const updateUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'active' or 'inactive'.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.status = status;
    await user.save({ validateBeforeSave: false });

    // Optional: if making a user inactive, you could clear their refresh token here
    if (status === "inactive") {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
    }

    const updatedUser = await User.findById(userId).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User status updated successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Delete User
// ─────────────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    getAllUsers,
    updateUserStatus,
    deleteUser
};