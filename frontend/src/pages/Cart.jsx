import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { updateQuantity, removeFromCart, clearCart } from "../redux/cartSlice";
import Spinner from "../components/Spinner";

const Cart = () => {
    const { items } = useSelector(state => state.cart);
    const { isLoggedIn, role } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");

    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
        toast.success("Item removed from cart");
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            toast("Please login to place your order.", { icon: "🔒" });
            navigate("/login?redirect=/cart");
            return;
        }

        if (role === "admin") {
            toast.error("Admins are not allowed to place orders.");
            return;
        }

        if (!address.trim()) {
            toast.error("Please enter a shipping address");
            return;
        }

        try {
            setLoading(true);
            const orderPayload = {
                items: items.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                })),
                shippingAddress: { address: address }, 
                paymentMethod: "cash_on_delivery" // Map from COD to the exact backend enum
            };

            await axiosInstance.post("/orders/place-order", orderPayload);
            
            toast.success("Order placed successfully!");
            dispatch(clearCart());
            navigate("/my-orders");
        } catch (err) {
            console.error("Order placement error:", err);
            toast.error(err.response?.data?.message || "Failed to place order. Ensure sufficient stock.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <svg className="w-32 h-32 text-gray-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything yet.</p>
                <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-md">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="text-2xl font-bold text-gray-800">Shopping Cart ({totalItems} Items)</h2>
                        <button onClick={() => dispatch(clearCart())} className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline">Clear Cart</button>
                    </div>
                    
                    <ul className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <li key={item.product} className="p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-gray-50 transition">
                                <Link to={`/product/${item.product}`} className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                    ) : (
                                        <span className="flex items-center justify-center w-full h-full text-xs text-gray-400">No Img</span>
                                    )}
                                </Link>
                                
                                <div className="flex-grow text-center sm:text-left">
                                    <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 line-clamp-1">
                                        {item.title}
                                    </Link>
                                    <p className="text-indigo-600 font-bold mt-1">${item.price}</p>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                                        <button 
                                            onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                                            className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 transition"
                                        >-</button>
                                        <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                                            className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 transition"
                                        >+</button>
                                    </div>
                                    <div className="w-20 text-right font-bold text-gray-900 hidden sm:block">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(item.product)}
                                        className="text-gray-400 hover:text-red-500 p-2 transition rounded-full hover:bg-red-50"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Order Summary Checkout */}
            <div className="lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6 text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal ({totalItems} items)</span>
                            <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-medium text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span className="font-medium text-gray-900">$0.00</span>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-extrabold text-indigo-600">${totalAmount.toFixed(2)}</span>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                            <textarea 
                                required
                                disabled={role === "admin"}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                placeholder={role === "admin" ? "Admins cannot checkout." : "Enter your full shipping address here..."}
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">Payment Method: Cash on Delivery</p>
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={loading || role === "admin"}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg flex justify-center items-center shadow-md transition ${(loading || role === "admin") ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                        >
                            {loading ? <span className="animate-pulse">Processing...</span> : (role === "admin" ? "Admins Cannot Order" : "Place Order")}
                        </button>
                    </form>
                    
                    {/* Trust badges */}
                    <div className="mt-6 flex justify-center gap-4 text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
