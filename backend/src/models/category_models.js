import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
        
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,   
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true   
    }
}, {
    timestamps: true
});


categorySchema.pre("save", function () {
    if (!this.isModified("name")) return;
    this.slug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")   
        .replace(/\s+/g, "-");          
});

export default mongoose.model("Category", categorySchema);