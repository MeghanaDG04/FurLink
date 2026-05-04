const mongoose = require('mongoose');
const Feedback = require('../Models/FeedbackModel');
const productTable = require('../Models/ProductModel');
const Adopt = require('../Models/AdoptModel');

const addFeedback = async (req, res) => {
  try {
    const { targetId, targetType, rating, comment } = req.body;
    const userId = req.userid;

    if (!targetId || !targetType || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['product', 'adoption'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    const feedback = new Feedback({ userId, targetId, targetType, rating, comment });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getFeedbackByTarget = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    const feedbacks = await Feedback.find({ targetId, targetType })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    
    const result = await Feedback.aggregate([
      { $match: { targetId: new mongoose.Types.ObjectId(targetId), targetType } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ avgRating: 0, count: 0 });
    }

    res.status(200).json({ avgRating: result[0].avgRating, count: result[0].count });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    // Enrich with target names
    const enrichedFeedbacks = await Promise.all(feedbacks.map(async (fb) => {
      let targetName = fb.targetId;
      if (fb.targetType === 'product') {
        const product = await productTable.findById(fb.targetId).select('name');
        if (product) targetName = product.name;
      } else if (fb.targetType === 'adoption') {
        const adoption = await Adopt.findById(fb.targetId).select('petName');
        if (adoption) targetName = adoption.petName;
      }
      return { ...fb.toObject(), targetName };
    }));
    
    res.status(200).json({ feedbacks: enrichedFeedbacks });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { addFeedback, getFeedbackByTarget, getAverageRating, getAllFeedback, deleteFeedback };