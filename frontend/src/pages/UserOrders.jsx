import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/Spinner";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get("/orders/my-orders");
                setOrders(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch orders error", err);
                setError("Failed to load your orders.");
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    if (loading) return <Spinner />;

    if (error) {
        return <div className="text-center text-red-500 py-10 font-medium">{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping!</p>
                <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 transition">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
            
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Order Header */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 gap-4">
                            <div className="flex flex-wrap lg:flex-nowrap gap-6 text-sm">
                                <div>
                                    <span className="block text-gray-500 font-medium">Order Placed</span>
                                    <span className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-medium">Total</span>
                                    <span className="font-semibold text-gray-900">${order.totalAmount?.toFixed(2) || "0.00"}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-medium">Order #</span>
                                    <span className="font-semibold text-gray-900">{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                </div>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status || 'pending'}
                                </span>
                            </div>
                        </div>

                        {/* Order Body / Items */}
                        <div className="p-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Items in this order</h3>
                            <ul className="space-y-4">
                                {order.items.map(item => (
                                    <li key={item._id} className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Img</div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <Link to={`/product/${item.product}`} className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1">
                                                {item.title || "Unknown Product"}
                                            </Link>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-gray-900 whitespace-nowrap">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;
