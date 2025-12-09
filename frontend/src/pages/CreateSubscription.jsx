import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscriptionService } from '../services/subscriptions'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const categories = [
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'news', label: 'News', icon: '📰' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'politics', label: 'Politics', icon: '🏛️' },
  { value: 'other', label: 'Other', icon: '📦' },
]

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
]

function CreateSubscription() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    frequency: 'monthly',
    category: '',
    paymentMethod: '',
    startDate: dayjs().format('YYYY-MM-DD'),
    renewalDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-calculate renewal date based on frequency
    if (name === 'frequency' || name === 'startDate') {
      const startDate = name === 'startDate' ? value : formData.startDate
      const frequency = name === 'frequency' ? value : formData.frequency
      
      let renewalDate
      switch (frequency) {
        case 'daily':
          renewalDate = dayjs(startDate).add(1, 'day')
          break
        case 'weekly':
          renewalDate = dayjs(startDate).add(1, 'week')
          break
        case 'monthly':
          renewalDate = dayjs(startDate).add(1, 'month')
          break
        case 'yearly':
          renewalDate = dayjs(startDate).add(1, 'year')
          break
        default:
          renewalDate = dayjs(startDate).add(1, 'month')
      }
      setFormData((prev) => ({ ...prev, renewalDate: renewalDate.format('YYYY-MM-DD') }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await subscriptionService.createSubscription({
        ...formData,
        price: parseFloat(formData.price),
        startDate: new Date(formData.startDate),
        renewalDate: new Date(formData.renewalDate),
      })
      toast.success('Subscription created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subscription')
    } finally {
      setLoading(false)
    }
  }

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
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Subscription</h1>
        <p className="text-gray-600 mt-1">Track a new subscription service</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Subscription Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Netflix, Spotify, Gym"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category *
          </label>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: category.value }))}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  formData.category === category.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
              Price *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              placeholder="9.99"
              required
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1.5">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-field"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Billing Frequency
          </label>
          <div className="flex gap-3">
            {frequencies.map((freq) => (
              <button
                key={freq.value}
                type="button"
                onClick={() => handleChange({ target: { name: 'frequency', value: freq.value } })}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                  formData.frequency === freq.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1.5">
            Payment Method *
          </label>
          <input
            id="paymentMethod"
            name="paymentMethod"
            type="text"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Credit Card, PayPal, Bank Transfer"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1.5">
              Start Date *
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="input-field"
              max={dayjs().format('YYYY-MM-DD')}
              required
            />
          </div>
          <div>
            <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700 mb-1.5">
              Next Renewal Date *
            </label>
            <input
              id="renewalDate"
              name="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={handleChange}
              className="input-field"
              min={formData.startDate}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.category}
            className="btn-primary flex-1 flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Create Subscription'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateSubscription
