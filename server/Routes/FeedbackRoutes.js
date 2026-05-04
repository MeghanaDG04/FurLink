const express = require('express');
const { addFeedback, getFeedbackByTarget, getAverageRating, getAllFeedback, deleteFeedback } = require('../Controller/FeedbackController');
const { verifyToken } = require('../Middleware/Auth');

const route = express.Router();

route.post('/add', verifyToken, addFeedback);
route.get('/target/:targetType/:targetId', getFeedbackByTarget);
route.get('/average/:targetType/:targetId', getAverageRating);
route.get('/all', getAllFeedback);
route.delete('/delete/:id', deleteFeedback);

module.exports = route;