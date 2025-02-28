const express = require("express");
const router = express.Router();
const Auction = require("../models/auctions");

// Create Auction
router.post("/auction", async (req, res) => {
  const { itemName, description, startingBid, endTime } = req.body;
  try {
    const auction = new Auction({ itemName, description, startingBid, endTime });
    await auction.save();
    res.status(201).json({ message: "Auction created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Auctions
router.get("/auctions", async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.status(200).json(auctions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Auction
router.get("/auctions/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place Bid
router.post("/bid/:id", async (req, res) => {
  const { bidAmount, bidderName } = req.body;
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    if (auction.isClosed) return res.status(400).json({ error: "Auction is closed" });

    if (bidAmount <= auction.currentBid)
      return res.status(400).json({ error: "Bid must be higher than current bid" });

    auction.currentBid = bidAmount;
    auction.highestBidder = bidderName;

    // Check if auction time is over
    if (new Date() > auction.endTime) auction.isClosed = true;

    await auction.save();
    res.status(200).json({ message: "Bid placed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Auction
router.delete("/auctions/:id", async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.status(200).json({ message: "Auction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Auction
router.put("/auctions/:id", async (req, res) => {
  try {
    const auction = await Auction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;