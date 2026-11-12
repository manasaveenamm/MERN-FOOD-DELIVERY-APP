
import supabase from '../config/supabase.js';

// Convert Supabase order records into the format expected by both frontends
const formatOrder = (order) => ({
    _id: order.id,
    userId: order.user_id,
    items: (order.order_items || []).map(item => ({
        _id: item.food_id,
        name: item.food_name,
        price: Number(item.price),
        quantity: item.quantity
    })),
    amount: Number(order.amount),
    address: order.address,
    status: order.status,
    payment: order.payment,
    createdAt: order.created_at
});

// PLACE ORDER
const placeOrder = async (req, res) => {
    let createdOrderId = null;

    try {
        const userId = req.user.id;
        const { address, items } = req.body;

        if (!address || !Array.isArray(items) || items.length === 0) {
            return res.json({
                success: false,
                message: 'Address and order items are required'
            });
        }

        // Get food IDs and quantities from the request
        const orderItems = items.map(item => ({
            foodId: item.id || item._id,
            quantity: Number(item.quantity)
        }));

        if (orderItems.some(item =>
            !item.foodId ||
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
        )) {
            return res.json({
                success: false,
                message: 'Invalid order items'
            });
        }

        const foodIds = [...new Set(orderItems.map(item => item.foodId))];

        // Fetch actual prices from Supabase instead of trusting frontend prices
        const { data: foods, error: foodError } = await supabase
            .from('foods')
            .select('id, name, price')
            .in('id', foodIds);

        if (foodError) throw foodError;

        if (!foods || foods.length !== foodIds.length) {
            return res.json({
                success: false,
                message: 'One or more food items are unavailable'
            });
        }

        const foodMap = new Map(foods.map(food => [food.id, food]));

        const databaseItems = orderItems.map(item => {
            const food = foodMap.get(item.foodId);

            return {
                food_id: food.id,
                food_name: food.name,
                price: Number(food.price),
                quantity: item.quantity
            };
        });

        // Calculate total on the backend.
        // Delivery charge is ₹2, matching the existing PlaceOrder.jsx.
        const foodTotal = databaseItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const totalAmount = foodTotal + 2;

        // Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                amount: totalAmount,
                address,
                payment: true,
                status: 'Food Processing'
            })
            .select('id')
            .single();

        if (orderError) throw orderError;

        createdOrderId = order.id;

        // Save individual order items
        const itemsToInsert = databaseItems.map(item => ({
            ...item,
            order_id: createdOrderId
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        // Clear the user's cart after successful order creation
        const { error: cartError } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (cartError) throw cartError;

        return res.json({
            success: true,
            message: 'Order placed successfully'
        });

    } catch (error) {
        console.error('Place order error:', error.message);

        // Remove incomplete order if a later step failed
        if (createdOrderId) {
            await supabase
                .from('orders')
                .delete()
                .eq('id', createdOrderId);
        }

        return res.json({
            success: false,
            message: 'Order failed'
        });
    }
};

// GET LOGGED-IN USER ORDERS
const userOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.json({
            success: true,
            data: data.map(formatOrder)
        });

    } catch (error) {
        console.error('User orders error:', error.message);
        return res.json({ success: false, message: 'Failed to fetch orders' });
    }
};

// GET ALL ORDERS (ADMIN)
const listOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.json({
            success: true,
            data: data.map(formatOrder)
        });

    } catch (error) {
        console.error('List orders error:', error.message);
        return res.json({ success: false, message: 'Failed to fetch orders' });
    }
};

// UPDATE ORDER STATUS
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const allowedStatuses = [
            'Food Processing',
            'Out for delivery',
            'Delivered'
        ];

        if (!orderId || !allowedStatuses.includes(status)) {
            return res.json({
                success: false,
                message: 'Invalid order ID or status'
            });
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select('id')
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.json({
            success: true,
            message: 'Status updated'
        });

    } catch (error) {
        console.error('Update status error:', error.message);
        return res.json({ success: false, message: 'Status update failed' });
    }
};

export { placeOrder, userOrders, listOrders, updateStatus };
