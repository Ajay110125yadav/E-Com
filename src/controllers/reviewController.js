import Review from "../models/Review.js";
import Product from "../models/Product.js";

/**
 * ⭐ Add OR Update Review (One review per user per product)
 */
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    // 🔍 Check existing review
    const existingReview = await Review.findOne({
      user: userId,
      product: productId
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      await updateProductRating(productId);

      return res.json({
        message: "Review updated successfully",
        review: existingReview
      });
    }

    // ➕ Create new review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment
    });

    await updateProductRating(productId);

    res.status(201).json({
      message: "Review added successfully",
      review
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ❌ Delete Review
 */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await updateProductRating(review.product);

    res.json({ message: "Review deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📊 Get Reviews of a Product
 */
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId
    }).populate("user", "name");

    res.json({
      total: reviews.length,
      reviews
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔢 Update Product Average Rating
 */
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);

  const avgRating =
    reviews.length === 0 ? 0 : (totalRating / reviews.length).toFixed(1);

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    numReviews: reviews.length
  });
};
