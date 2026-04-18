import { createSlice } from "@reduxjs/toolkit";

// Helper to get cart from localStorage
const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem("cartItems");
        if (serializedCart === null) return [];
        return JSON.parse(serializedCart);
    } catch (e) {
        console.warn("Could not load cart from localStorage", e);
        return [];
    }
};

// Helper to save cart to localStorage
const saveCartToStorage = (cart) => {
    try {
        const serializedCart = JSON.stringify(cart);
        localStorage.setItem("cartItems", serializedCart);
    } catch (e) {
        console.warn("Could not save cart to localStorage", e);
    }
};

const initialState = {
    items: loadCartFromStorage(), // Array of { product(id), title, price, image, quantity }
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload; // expects product object + quantity
            const existingItem = state.items.find(i => i.product === item.product);

            if (existingItem) {
                existingItem.quantity += (item.quantity || 1);
            } else {
                state.items.push({ ...item, quantity: item.quantity || 1 });
            }
            saveCartToStorage(state.items);
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(i => i.product !== productId);
            saveCartToStorage(state.items);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find(i => i.product === productId);
            if (existingItem && quantity > 0) {
                existingItem.quantity = quantity;
            }
            saveCartToStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToStorage(state.items);
        },
        // We'll call this if we ever pull cart from DB on login (not req per specs, but good practice)
        setCart: (state, action) => {
            state.items = action.payload;
            saveCartToStorage(state.items);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;

export default cartSlice.reducer;
