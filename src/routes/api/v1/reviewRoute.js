import express from 'express';
import { createReview, getReviewsByProductId, getReviewsByCurrentUser, getReviewById, updateReview, deleteReview } from '../../../controllers/reviewController.js';
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const ReviewRoutes = express.Router()

ReviewRoutes.post('/reviews', requiresAuth, createReview);
ReviewRoutes.get('/reviews', requiresAuth, getReviewsByCurrentUser);
ReviewRoutes.get('/reviews/product/:productId', getReviewsByProductId);
ReviewRoutes.get('/reviews/:reviewId', getReviewById);
ReviewRoutes.patch('/reviews/:reviewId', requiresAuth, updateReview);
ReviewRoutes.delete('/reviews/:reviewId', requiresAuth, deleteReview);


