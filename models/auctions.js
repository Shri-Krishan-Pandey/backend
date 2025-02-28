const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: String, default: "" },
  endTime: { type: Date, required: true },
  isClosed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Auction", auctionSchema);