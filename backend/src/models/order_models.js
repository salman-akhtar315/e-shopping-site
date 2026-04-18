import mongoose from "mongoose";

// Each product row inside an order
const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    title: {
        type: String,
        required: true   
    },
    image: {
        type: String    
    },
    price: {
        type: Number,
        required: true   
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    shippingAddress: {
        fullName:  { type: String },
        phone:     { type: String },
        address:   { type: String },
        city:      { type: String },
        country:   { type: String, default: "Pakistan" }
    },
    paymentMethod: {
        type: String,
        enum: ["cash_on_delivery", "card", "easypaisa", "jazzcash"],
        default: "cash_on_delivery"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true   // createdAt = order placement date
});

// Auto-calculate totalAmount before saving
orderSchema.pre("save", function () {
    if (!this.isModified("items")) return;
    this.totalAmount = this.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );
});

export default mongoose.model("Order", orderSchema);