import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const priceToDisplay = product.discountPrice > 0 ? product.discountPrice : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent link navigation if button is clicked
        
        dispatch(addToCart({
            product: product._id,
            title: product.title,
            price: priceToDisplay,
            image: product.images?.[0] || "",
            quantity: 1
        }));
        
        toast.success(`${product.title} added to cart!`);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col h-full group">

            <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
            
                {product.images?.[0] ? (
                    <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        No Image
                    </div>
                )}
                {product.discountPrice > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                        SALE
                    </span>
                )}
            </Link>
            
            <div className="p-4 flex flex-col flex-grow">

                <Link to={`/product/${product._id}`} className="font-semibold text-gray-800 mb-2 hover:text-indigo-600 line-clamp-2">
                    {product.title}
                </Link>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        {product.discountPrice > 0 ? (
                            <>
                                <span className="text-lg font-bold text-gray-900">${product.discountPrice}</span>
                                <span className="text-sm text-gray-500 line-through">${product.price}</span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`px-4 py-2 rounded font-medium text-sm transition ${
                            product.stock > 0 
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
