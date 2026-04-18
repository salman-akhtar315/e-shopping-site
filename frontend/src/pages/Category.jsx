import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const Category = () => {
    // Note: App.jsx route is currently '/category/:slug', but we'll use it as ID for backend querying easily
    // You might want to rename App.jsx route param to :id if it makes more sense, but it works either way
    const { slug } = useParams(); 
    
    // We fetch all categories to find the name of the current one
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                // Fetch categories to get title/details
                const catRes = await axiosInstance.get("/categories/all");
                const currentCategory = catRes.data.data.find(c => c._id === slug || c.slug === slug);
                
                if (!currentCategory) {
                    setError("Category not found.");
                    setLoading(false);
                    return;
                }
                
                setCategoryDetails(currentCategory);

                // Fetch products filtered by the resolved category ID, not the slug string
                const prodRes = await axiosInstance.get(`/products/all?category=${currentCategory._id}`);
                setProducts(prodRes.data.data.products);
                
                setLoading(false);
            } catch (err) {
                console.error("Category data fetch error", err);
                setError("Failed to load category products. Please try again later.");
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [slug]);

    if (loading) return <Spinner />;

    if (error) {
        return <div className="text-center text-red-500 py-10 font-medium">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-6">
                {categoryDetails?.image && (
                    <img src={categoryDetails.image} alt={categoryDetails.name} className="w-24 h-24 object-cover rounded-full shadow-sm" />
                )}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {categoryDetails ? categoryDetails.name : "Category"}
                    </h1>
                    {categoryDetails?.description && (
                         <p className="text-gray-600 max-w-2xl">{categoryDetails.description}</p>
                    )}
                </div>
            </div>

            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full py-16 text-center text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-lg">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Category;
