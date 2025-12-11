import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, products: [productId] });
        } else {
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: "Already in wishlist" });
            }
            wishlist.products.push(productId);
            await wishlist.save();
        }

        res.json({ message: "Added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();

        res.json({ message: "Removed from wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ userId }).populate("products");

        res.json(wishlist || { products: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
