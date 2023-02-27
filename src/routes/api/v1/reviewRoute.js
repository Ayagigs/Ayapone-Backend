import express from 'express';
import { createReview, getReviewsByProductId, getReviewsByUserId, getReviewById, updateReview, deleteReview } from '../../../controllers/reviewController.js';

export const reviewRoute = express.Router()

reviewRoute.post('/reviews', createReview);
reviewRoute.get('/reviews/product/:productId', getReviewsByProductId);
reviewRoute.get('/reviews/user/:userId', getReviewsByUserId);
reviewRoute.get('/reviews/:reviewId', getReviewById);
reviewRoute.patch('/reviews/:reviewId', updateReview);
reviewRoute.delete('/reviews/:reviewId', deleteReview);


