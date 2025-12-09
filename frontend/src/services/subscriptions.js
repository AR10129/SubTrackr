import api from './api'

export const subscriptionService = {
  // Get all subscriptions for a user
  getUserSubscriptions: async (userId) => {
    const response = await api.get(`/subscriptions/user/${userId}`)
    return response.data
  },

  // Get a single subscription
  getSubscription: async (id) => {
    const response = await api.get(`/subscriptions/${id}`)
    return response.data
  },

  // Create a new subscription
  createSubscription: async (data) => {
    const response = await api.post('/subscriptions', data)
    return response.data
  },

  // Update a subscription
  updateSubscription: async (id, data) => {
    const response = await api.put(`/subscriptions/${id}`, data)
    return response.data
  },

  // Delete a subscription
  deleteSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`)
    return response.data
  },

  // Cancel a subscription
  cancelSubscription: async (id) => {
    const response = await api.put(`/subscriptions/${id}/cancel`)
    return response.data
  },
}
