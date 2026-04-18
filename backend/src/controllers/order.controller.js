import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/order_models.js";
import Product from "../models/product_model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─────────────────────────────────────────────────────
// User: Place a new order
// ─────────────────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        throw new ApiError(400, "Order must contain at least one item");
    }

    if (!shippingAddress) {
        throw new ApiError(400, "Shipping address is required");
    }

    // Process each item to create the snapshot based on the real product data
    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new ApiError(404, `Product not found: ${item.product}`);
        }

        // Verify stock
        if (product.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.title}`);
        }

        // Add to processed array
        const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;

        orderItems.push({
            product: product._id,
            title: product.title,
            image: product.images[0] || "",
            price: priceToUse,
            quantity: item.quantity
        });

        // Deduct stock from the database
        product.stock -= item.quantity;
        await product.save({ validateBeforeSave: false });

        calculatedTotal += (priceToUse * item.quantity);
    }

    const order = await Order.create({
        user: req.user._id, // Coming from verifyJWT middleware
        items: orderItems,
        totalAmount: calculatedTotal,
        shippingAddress,
        paymentMethod
    });

    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order placed successfully"));
});

// ─────────────────────────────────────────────────────
// User: Get their own order history
// ─────────────────────────────────────────────────────
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "My orders fetched successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Get All Orders from all users
// ─────────────────────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate("user", "username email")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// ─────────────────────────────────────────────────────
// Admin Only: Update Order Status (e.g. pending -> shipped)
// ─────────────────────────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, isPaid, isDelivered } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (status) order.status = status;
    
    if (isPaid !== undefined) {
        order.isPaid = isPaid;
        if (isPaid && !order.paidAt) order.paidAt = Date.now();
    }
    
    if (isDelivered !== undefined) {
        order.isDelivered = isDelivered;
        if (isDelivered && !order.deliveredAt) order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};
