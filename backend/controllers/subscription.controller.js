import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL, QSTASH_TOKEN } from '../config/env.js'

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
}

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    let workflowRunId = null;

    // Only trigger workflow if Upstash is properly configured
    if (QSTASH_TOKEN && !QSTASH_TOKEN.includes('placeholder')) {
      try {
        const result = await workflowClient.trigger({
          url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
          body: {
            subscriptionId: subscription.id,
          },
          headers: {
            'content-type': 'application/json',
          },
          retries: 0,
        });
        workflowRunId = result.workflowRunId;
      } catch (workflowError) {
        console.log('Workflow trigger skipped:', workflowError.message);
      }
    }

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this subscription');
      error.statusCode = 403;
      throw error;
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedSubscription });
  } catch (e) {
    next(e);
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this subscription');
      error.statusCode = 403;
      throw error;
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (e) {
    next(e);
  }
}

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to cancel this subscription');
      error.statusCode = 403;
      throw error;
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
}