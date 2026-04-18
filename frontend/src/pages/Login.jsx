import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { loginSuccess } from "../redux/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/users/login", formData);
            
            // Dispatch to Redux
            dispatch(loginSuccess({
                user: res.data.data.user
            }));

            toast.success("Welcome back!");
            
            // Redirect based on role or search param
            if (res.data.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate(redirectUrl);
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Log in to track your orders and checkout faster.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
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
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition animate-none ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
                    Don't have an account?{" "}
                    <Link to={`/register${redirectUrl !== "/" ? `?redirect=${redirectUrl}` : ""}`} className="text-indigo-600 hover:underline font-semibold">
                        Sign up here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
