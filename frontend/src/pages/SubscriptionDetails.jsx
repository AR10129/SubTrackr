import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { subscriptionService } from '../services/subscriptions'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

function SubscriptionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [id])

  const fetchSubscription = async () => {
    try {
      const response = await subscriptionService.getSubscription(id)
      setSubscription(response.data)
    } catch (error) {
      toast.error('Failed to fetch subscription')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this subscription?')) return

    setDeleting(true)
    try {
      await subscriptionService.deleteSubscription(id)
      toast.success('Subscription deleted')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to delete subscription')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return

    try {
      await subscriptionService.cancelSubscription(id)
      toast.success('Subscription cancelled')
      fetchSubscription()
    } catch (error) {
      toast.error('Failed to cancel subscription')
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      sports: '⚽',
      news: '📰',
      entertainment: '🎬',
      lifestyle: '🌟',
      technology: '💻',
      finance: '💰',
      politics: '🏛️',
      other: '📦',
    }
    return icons[category] || '📦'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'expired':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Subscription not found</p>
      </div>
    )
  }

  const daysUntilRenewal = dayjs(subscription.renewalDate).diff(dayjs(), 'day')

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Subscription Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
              {getCategoryIcon(subscription.category)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{subscription.name}</h1>
              <p className="text-gray-500 capitalize">{subscription.category}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
            {subscription.status}
          </span>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {subscription.currency} {subscription.price}
            </span>
            <span className="text-gray-500">/ {subscription.frequency}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium text-gray-900">{subscription.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">Start Date</span>
            <span className="font-medium text-gray-900">
              {dayjs(subscription.startDate).format('MMM D, YYYY')}
            </span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">Next Renewal</span>
            <span className={`font-medium ${daysUntilRenewal <= 7 ? 'text-orange-600' : 'text-gray-900'}`}>
              {dayjs(subscription.renewalDate).format('MMM D, YYYY')}
              {daysUntilRenewal > 0 && ` (in ${daysUntilRenewal} days)`}
              {daysUntilRenewal === 0 && ' (Today)'}
              {daysUntilRenewal < 0 && ' (Expired)'}
            </span>
          </div>
          
          <div className="flex justify-between py-3">
            <span className="text-gray-500">Created</span>
            <span className="font-medium text-gray-900">
              {dayjs(subscription.createdAt).format('MMM D, YYYY')}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        
        <div className="flex gap-4">
          {subscription.status === 'active' && (
            <button
              onClick={handleCancel}
              className="btn-secondary flex-1"
            >
              Cancel Subscription
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger flex-1 flex items-center justify-center"
          >
            {deleting ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Delete Subscription'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionDetails
