import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Header = () => {
    const { items } = useSelector(state => state.cart);
    const { isLoggedIn, role, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Calculate total quantity across all items
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
                    <span>E-Shop</span>
                </Link>
                
                <nav className="flex items-center space-x-6 font-medium">
                    <Link to="/" className="hover:text-indigo-200 transition">Products</Link>
                    
                    <Link to="/cart" className="hover:text-indigo-200 transition relative">
                        Cart 
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-indigo-400">
                            <span className="text-sm">Hi, {user?.username || 'User'}</span>
                            
                            {role === "admin" ? (
                                <Link to="/admin" className="hover:text-indigo-200 transition">Admin Panel</Link>
                            ) : (
                                <Link to="/my-orders" className="hover:text-indigo-200 transition">My Orders</Link>
                            )}

                            <button 
                                onClick={handleLogout}
                                className="bg-white text-indigo-600 px-3 py-1 rounded text-sm hover:bg-gray-100 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
