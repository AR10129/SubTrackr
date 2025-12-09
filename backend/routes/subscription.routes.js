import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js'
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/:id', authorize, getSubscriptionById);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

export default subscriptionRouter;