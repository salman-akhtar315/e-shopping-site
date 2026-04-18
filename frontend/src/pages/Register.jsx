import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axiosInstance.post("/users/register", formData);
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            console.error("Register error:", err);
            toast.error(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join E-Shop to start shopping.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="please write your username"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="please write your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            required
                            minLength="6"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                        <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="123 Main St, City"
                        ></textarea>
                    </div> */}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline font-semibold">
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
