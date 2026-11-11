
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");

  const url = import.meta.env.VITE_API_URL || "";

  // FETCH FOOD FROM SUPABASE
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);

      if (response.data.success) {
        // Keep compatibility with existing frontend components
        const foods = response.data.data.map((food) => ({
          ...food,
          _id: food.id,
        }));

        setFoodList(foods);
      }
    } catch (error) {
      console.error("Food fetching failed:", error.message);
    }
  };

  // ADD TO CART
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Add to cart failed:", error.message);
      }
    }
  };

  // REMOVE FROM CART
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };

      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }

      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Remove from cart failed:", error.message);
      }
    }
  };

  // CART TOTAL
  const getTotalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      const product = food_list.find(
        (food) => food._id === item
      );

      if (product && cartItems[item] > 0) {
        total += product.price * cartItems[item];
      }
    }

    return total;
  };

  // LOAD CART FROM SUPABASE
  const loadCartData = async (savedToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: savedToken } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.error("Cart loading failed:", error.message);
    }
  };

  // INITIAL LOAD
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
