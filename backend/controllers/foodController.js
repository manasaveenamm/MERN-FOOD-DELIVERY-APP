
import supabase from '../config/supabase.js';

// ADD FOOD ITEM
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                success: false,
                message: 'Food image is required'
            });
        }

        const { name, description, price, category } = req.body;

        if (!name || !description || price === undefined || !category) {
            return res.json({
                success: false,
                message: 'All food details are required'
            });
        }

        const safeName = req.file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '-');

        const filePath = `foods/${Date.now()}-${safeName}`;

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('food-images')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Get public image URL
        const { data: imageData } = supabase.storage
            .from('food-images')
            .getPublicUrl(filePath);

        // Save food details in PostgreSQL
        const { error: insertError } = await supabase
            .from('foods')
            .insert({
                name,
                description,
                price: Number(price),
                category,
                image: imageData.publicUrl
            });

        if (insertError) {
            // Remove uploaded image if database insert fails
            await supabase.storage
                .from('food-images')
                .remove([filePath]);

            throw insertError;
        }

        res.json({
            success: true,
            message: 'Food Added'
        });

    } catch (error) {
        console.error('Add food error:', error.message);
        res.json({
            success: false,
            message: 'Unable to add food'
        });
    }
};


// GET ALL FOOD ITEMS
const listFood = async (req, res) => {
    try {
        const { data: foods, error } = await supabase
            .from('foods')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: foods
        });

    } catch (error) {
        console.error('List food error:', error.message);
        res.json({
            success: false,
            message: 'Unable to fetch food items'
        });
    }
};


// REMOVE FOOD ITEM
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.json({
                success: false,
                message: 'Food ID is required'
            });
        }

        // Find food record
        const { data: food, error: fetchError } = await supabase
            .from('foods')
            .select('id, image')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        // Extract storage path from public URL
        const marker = '/storage/v1/object/public/food-images/';
        const imageUrl = new URL(food.image);

        if (imageUrl.pathname.includes(marker)) {
            const filePath = decodeURIComponent(
                imageUrl.pathname.split(marker)[1]
            );

            const { error: storageError } = await supabase.storage
                .from('food-images')
                .remove([filePath]);

            if (storageError) throw storageError;
        }

        // Delete food record
        const { error: deleteError } = await supabase
            .from('foods')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        res.json({
            success: true,
            message: 'Food Removed'
        });

    } catch (error) {
        console.error('Remove food error:', error.message);
        res.json({
            success: false,
            message: 'Unable to remove food'
        });
    }
};

export { addFood, listFood, removeFood };
