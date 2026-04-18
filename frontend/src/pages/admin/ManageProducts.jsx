import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/Spinner";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        category: ""
    });
    const [images, setImages] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                axiosInstance.get("/products/all"),
                axiosInstance.get("/categories/all")
            ]);
            setProducts(prodRes.data.data.products);
            setCategories(catRes.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch data error:", err);
            toast.error("Failed to load products and categories.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        if (!editingProductId && (!images || images.length === 0)) {
            toast.error("Please select at least one product image");
            return;
        }

        try {
            setIsSubmitting(true);
            const uploadData = new FormData();
            
            // Append text fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null) {
                    uploadData.append(key, formData[key]);
                }
            });
            
            // Append files
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    uploadData.append("images", images[i]);
                }
            }

            if (editingProductId) {
                await axiosInstance.patch(`/products/${editingProductId}`, uploadData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Product updated successfully!");
                setEditingProductId(null);
            } else {
                await axiosInstance.post("/products", uploadData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Product created successfully!");
            }
            
            // Reset form
            setFormData({
                title: "", description: "", price: "", discountPrice: "", stock: "", category: ""
            });
            setImages(null);
            e.target.reset(); // clear file input
            
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${editingProductId ? 'update' : 'create'} product`);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice || "",
            stock: product.stock,
            category: product.category?._id || ""
        });
        setEditingProductId(product._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setFormData({
            title: "", description: "", price: "", discountPrice: "", stock: "", category: ""
        });
        setEditingProductId(null);
        setImages(null);
        document.getElementById("productForm")?.reset();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axiosInstance.delete(`/products/${id}`);
            toast.success("Product deleted");
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete product");
        }
    };

    if (loading && products.length === 0) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>

            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">{editingProductId ? "Update Product" : "Add New Product"}</h2>
                <form id="productForm" onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                                <input type="number" name="discountPrice" min="0" step="0.01" value={formData.discountPrice} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                            <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea name="description" required value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Images (Multiple allowed) {editingProductId ? "(Optional)" : "*"}
                            </label>
                            <input type="file" required={!editingProductId} multiple accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-4">
                        <button type="submit" disabled={isSubmitting} className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-white transition ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                            {isSubmitting ? (editingProductId ? 'Updating...' : 'Uploading...') : (editingProductId ? 'Update Product' : 'Create Product')}
                        </button>
                        {editingProductId && (
                            <button type="button" onClick={handleCancelEdit} disabled={isSubmitting} className="w-full md:w-auto px-8 py-3 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                                                {p.images?.[0] && <img className="h-10 w-10 rounded object-cover" src={p.images[0]} alt="" />}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 line-clamp-1 w-48">{p.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {p.category?.name || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${p.discountPrice > 0 ? p.discountPrice : p.price}
                                        {p.discountPrice > 0 && <span className="text-xs text-gray-400 line-through ml-2">${p.price}</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {p.stock} left
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleEdit(p)}
                                            className="text-indigo-600 hover:text-indigo-900 transition mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(p._id)}
                                            className="text-red-600 hover:text-red-900 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
