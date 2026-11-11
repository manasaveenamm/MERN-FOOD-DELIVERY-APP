
import supabase from '../config/supabase.js';

// ADD ITEMS TO USER CART
const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { itemId } = req.body;

        if (!itemId) {
            return res.json({
                success: false,
                message: 'Food item ID is required'
            });
        }

        // Check whether this item already exists in the cart
        const { data: existingItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('food_id', itemId)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingItem) {
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: existingItem.quantity + 1 })
                .eq('id', existingItem.id);

            if (error) throw error;

        } else {
            const { error } = await supabase
                .from('cart_items')
                .insert({
                    user_id: userId,
                    food_id: itemId,
                    quantity: 1
                });

            if (error) throw error;
        }

        res.json({
            success: true,
            message: 'Added to cart'
        });

    } catch (error) {
        console.error('Add to cart error:', error.message);
        res.json({
            success: false,
            message: 'Unable to add item to cart'
        });
    }
};


// REMOVE ITEMS FROM USER CART
const removeFromCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { itemId } = req.body;

        const { data: existingItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('food_id', itemId)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingItem) {
            return res.json({
                success: true,
                message: 'Item is not in cart'
            });
        }

        if (existingItem.quantity <= 1) {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', existingItem.id);

            if (error) throw error;

        } else {
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: existingItem.quantity - 1 })
                .eq('id', existingItem.id);

            if (error) throw error;
        }

        res.json({
            success: true,
            message: 'Removed from cart'
        });

    } catch (error) {
        console.error('Remove from cart error:', error.message);
        res.json({
            success: false,
            message: 'Unable to remove item from cart'
        });
    }
};


// FETCH USER CART DATA
const getCart = async (req, res) => {
    try {
        const userId = req.body.userId;

        const { data, error } = await supabase
            .from('cart_items')
            .select('food_id, quantity')
            .eq('user_id', userId);

        if (error) throw error;

        // Convert database rows into the format expected by the frontend
        const cartData = {};

        data.forEach(item => {
            cartData[item.food_id] = item.quantity;
        });

        res.json({
            success: true,
            cartData
        });

    } catch (error) {
        console.error('Get cart error:', error.message);
        res.json({
            success: false,
            message: 'Unable to fetch cart'
        });
    }
};

export { addToCart, removeFromCart, getCart };
