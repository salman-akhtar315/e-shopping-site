import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/Spinner";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/users/admin/all");
            setUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch users error:", err);
            toast.error("Failed to load users.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        try {
            await axiosInstance.patch(`/users/admin/${id}/status`, { status: newStatus });
            toast.success(`User set to ${newStatus}`);
            // Update local state without refetching all
            setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update user status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user completely?")) return;
        try {
            await axiosInstance.delete(`/users/admin/${id}`);
            toast.success("User deleted successfully");
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete user");
        }
    };

    if (loading && users.length === 0) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {u.role !== 'admin' && ( // Prevent admin from deactivating themselves or other admins easily
                                            <>
                                                <button 
                                                    onClick={() => handleToggleStatus(u._id, u.status)}
                                                    className={`transition mr-4 ${u.status === 'active' ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
                                                >
                                                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(u._id)}
                                                    className="transition text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
