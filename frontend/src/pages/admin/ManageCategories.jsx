import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/Spinner";

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/categories/all");
            setCategories(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch categories error:", err);
            toast.error("Failed to load categories.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            if (editingCategoryId) {
                await axiosInstance.patch(`/categories/${editingCategoryId}`, { name, description });
                toast.success("Category updated successfully!");
                setEditingCategoryId(null);
            } else {
                await axiosInstance.post("/categories", { name, description });
                toast.success("Category created successfully!");
            }
            setName("");
            setDescription("");
            fetchCategories(); // Refresh list
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${editingCategoryId ? 'update' : 'create'} category`);
        }
    };

    const handleEdit = (cat) => {
        setName(cat.name);
        setDescription(cat.description || "");
        setEditingCategoryId(cat._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setName("");
        setDescription("");
        setEditingCategoryId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await axiosInstance.delete(`/categories/${id}`);
            toast.success("Category deleted");
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete category");
        }
    };

    if (loading && categories.length === 0) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>

            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <h2 className="text-lg font-bold text-gray-800 mb-4">{editingCategoryId ? "Update Category" : "Add New Category"}</h2>
                <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="e.g., Laptops"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="Category description..."
                            rows="2"
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                            {editingCategoryId ? "Update Category" : "Create Category"}
                        </button>
                        {editingCategoryId && (
                            <button type="button" onClick={handleCancelEdit} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{cat.description || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{cat.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleEdit(cat)}
                                            className="text-indigo-600 hover:text-indigo-900 transition mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(cat._id)}
                                            className="text-red-600 hover:text-red-900 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCategories;
