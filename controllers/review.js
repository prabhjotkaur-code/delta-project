const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author = res.locals.currUser._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  const reviews = await Review.find({ _id: { $in: listing.reviews } });
  req.flash("success", "new review created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.showReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  const reviews = await Review.find({
    _id: { $in: listing.reviews },
  }).populate("author");
  res.render("listings/review.ejs", { reviews });
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  res.redirect(`/listings/${id}`);
};
