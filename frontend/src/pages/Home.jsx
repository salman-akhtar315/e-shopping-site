import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch categories and products in parallel
                const [catRes, prodRes] = await Promise.all([
                    axiosInstance.get("/categories/all"),
                    axiosInstance.get("/products/all")
                ]);

                setCategories(catRes.data.data);
                setProducts(prodRes.data.data.products);
                setLoading(false);
            } catch (err) {
                console.error("Home data fetch error", err);
                setError("Failed to load store data. Please try again later.");
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    if (loading) return <Spinner />;

    if (error) {
        return <div className="text-center text-red-500 py-10 font-medium">{error}</div>;
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-indigo-700 text-white rounded-2xl p-8 text-center md:text-left shadow-lg flex flex-col items-center md:flex-row md:justify-between">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Welcome to E-Shop</h1>
                    <p className="text-lg text-indigo-100 mb-6">Discover amazing products at unbeatable prices, featuring the latest trends and everyday essentials.
                        Shop now for quality, style, and great deals all in one place!</p>
                </div>

                {/* Discover amazing products at unbeatable prices. Shop the latest trends today! */}

                <div className="hidden md:block">
                    {/* Placeholder for a nice hero graphic */}
                    <svg className="w-48 h-48 opacity-80" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            to={`/category/${category._id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md hover:border-indigo-300 transition group"
                        >
                            {category.image ? (
                                <img src={category.image} alt={category.name} className="w-16 h-16 object-cover rounded-full mx-auto mb-3 group-hover:scale-110 transition duration-300" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-400 group-hover:scale-110 transition duration-300">
                                    Cat
                                </div>
                            )}
                            <h3 className="font-medium text-gray-800 text-sm">{category.name}</h3>
                        </Link>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-gray-500 col-span-full">No categories found.</p>
                    )}
                </div>
            </section>

            {/* All Products Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    {products.length === 0 && (
                        <p className="text-gray-500 col-span-full py-10 text-center text-lg">No products available at the moment.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
