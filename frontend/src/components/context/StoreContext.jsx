import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list } from "../../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  // ✅ Backend base URL (Render / Local safe)
  const url =
    import.meta.env.VITE_API_URL ||
    "https://mern-food-delivery-backend-ereb.onrender.com";

  // ================= ADD TO CART =================
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));

    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // ================= CART TOTAL =================
  const getTotalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const product = food_list.find(
          (food) => food._id === item
        );
        if (product) {
          total += product.price * cartItems[item];
        }
      }
    }
    return total;
  };

  // ================= FETCH FOOD =================
  const fetchFoodList = async () => {
    await axios.get(`${url}/api/food/list`);
  };

  // ================= LOAD CART =================
  const loadCartData = async (token) => {
    const res = await axios.post(
      `${url}/api/cart/get`,
      {},
      { headers: { token } }
    );
    setCartItems(res.data.cartData || {});
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    loadData();
  }, []);

  // ================= CONTEXT =================
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
