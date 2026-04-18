import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
    const { user } = useSelector(state => state.auth);

    const adminCards = [
        { title: "Manage Products", desc: "Add, update, or remove products.", link: "/admin/products", icon: "📦", color: "bg-blue-500" },
        { title: "Manage Categories", desc: "Create or delete product categories.", link: "/admin/categories", icon: "🏷️", color: "bg-purple-500" },
        { title: "Manage Orders", desc: "View and update customer orders.", link: "/admin/orders", icon: "🚚", color: "bg-green-500" },
        { title: "Manage Users", desc: "View all users and update their status.", link: "/admin/users", icon: "👥", color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, <span className="font-semibold text-indigo-600">{user?.username}</span>. Here is the control center for your store.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminCards.map((card, idx) => (
                    <Link key={idx} to={card.link} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group block">
                        <div className={`h-2 ${card.color}`}></div>
                        <div className="p-6">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition origin-left">{card.icon}</div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">{card.title}</h2>
                            <p className="text-sm text-gray-500">{card.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 mt-8">
                <h3 className="text-xl font-bold text-indigo-900 mb-2">System Status</h3>
                <p className="text-indigo-700">All systems operational. The database is actively connected and processing requests.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
