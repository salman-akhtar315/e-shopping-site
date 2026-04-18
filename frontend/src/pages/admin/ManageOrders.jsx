import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/Spinner";

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/orders/all");
            setOrders(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch orders error:", err);
            toast.error("Failed to load orders.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (id, e) => {
        const newStatus = e.target.value;
        try {
            setUpdatingId(id);
            await axiosInstance.patch(`/orders/${id}`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            // Update local state without refetching all
            setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update order status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading && orders.length === 0) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((o) => (
                                <tr key={o._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {o._id.substring(o._id.length - 8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{o.user?.username || "Unknown"}</div>
                                        <div className="text-sm text-gray-500">{o.user?.email || "N/A"}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">
                                        ${o.totalAmount?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <select 
                                            value={o.status || "pending"}
                                            onChange={(e) => handleUpdateStatus(o._id, e)}
                                            disabled={updatingId === o._id}
                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer bg-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
