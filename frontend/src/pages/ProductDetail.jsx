import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { addToCart } from "../redux/cartSlice";
import Spinner from "../components/Spinner";

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { role } = useSelector(state => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/products/${id}`);
                setProduct(res.data.data);
                if (res.data.data.images && res.data.data.images.length > 0) {
                    setActiveImage(res.data.data.images[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Product fetch error", err);
                setError("Failed to load product details.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        // use backend discount logic
        const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;

        dispatch(addToCart({
            product: product._id,
            title: product.title,
            price: priceToUse,
            image: product.images?.[0] || "",
            quantity: Number(quantity)
        }));
        
        toast.success(`Added ${quantity} ${product.title} to cart`);
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-center text-red-500 py-20 font-medium">{error}</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    const inStock = product.stock > 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
            <div className="flex flex-col md:flex-row gap-10">
                
                {/* Image Gallery */}
                <div className="md:w-1/2 flex flex-col space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative">
                        {activeImage ? (
                            <img src={activeImage} alt={product.title} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                        {product.discountPrice > 0 && (
                            <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded">
                                SALE
                            </span>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${activeImage === img ? 'border-indigo-600' : 'border-transparent'}`}
                                >
                                    <img src={img} alt="" className="object-cover w-full h-full" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col">
                    <Link to={`/category/${product.category?._id}`} className="text-sm font-semibold text-indigo-500 uppercase tracking-wider hover:underline mb-2">
                        {product.category?.name || "Category"}
                    </Link>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                    
                    <div className="flex items-center space-x-4 mb-6">
                        {product.discountPrice > 0 ? (
                            <>
                                <span className="text-3xl font-extrabold text-indigo-600">${product.discountPrice}</span>
                                <span className="text-xl text-gray-400 line-through">${product.price}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-extrabold text-indigo-600">${product.price}</span>
                        )}
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8 border-t border-b border-gray-100 py-6">
                        {product.description}
                    </p>

                    <div className="mt-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {inStock && role !== "admin" && (
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white w-full sm:w-32 h-12">
                                    <button 
                                        className="w-10 h-full text-gray-600 hover:bg-gray-100 transition"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    >-</button>
                                    <input 
                                        type="number"
                                        className="w-full text-center border-none focus:ring-0 font-medium text-gray-900" 
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button 
                                        className="w-10 h-full text-gray-600 hover:bg-gray-100 transition"
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    >+</button>
                                </div>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-lg transition shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        )}
                        {role === "admin" && (
                            <div className="mt-4 p-4 bg-orange-50 text-orange-700 rounded-lg border border-orange-200">
                                As an admin, you cannot add items to the cart or place orders.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
