import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
        default: 0    
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    images: {
        type: [String],   // array of image paths/URLs
        default: []
    },
    ratings: {
        type: Number,
        default: 0        // average rating, updated when review is added
    },
    reviews: [reviewSchema],
    isFeatured: {
        type: Boolean,
        default: false    // show on homepage featured section
    },
    isActive: {
        type: Boolean,
        default: true     // admin can disable without deleting
    }
}, {
    timestamps: true
});

// Auto-calculate average rating whenever reviews change
productSchema.methods.updateRating = function () {
    if (this.reviews.length === 0) {
        this.ratings = 0;
        return;
    }
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.ratings = Math.round((total / this.reviews.length) * 10) / 10;
};

export default mongoose.model("Product", productSchema);