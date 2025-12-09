import dayjs from 'dayjs'

function SubscriptionCard({ subscription, onClick }) {
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

  const daysUntilRenewal = () => {
    const renewal = dayjs(subscription.renewalDate)
    const today = dayjs()
    const days = renewal.diff(today, 'day')
    return days
  }

  const days = daysUntilRenewal()

  return (
    <div
      onClick={onClick}
      className="card hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
            {getCategoryIcon(subscription.category)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {subscription.name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{subscription.category}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
          {subscription.status}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {subscription.currency} {subscription.price}
            </p>
            <p className="text-sm text-gray-500">/{subscription.frequency}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Renewal</p>
            <p className={`text-sm font-medium ${days <= 7 ? 'text-orange-600' : 'text-gray-900'}`}>
              {days > 0 ? `in ${days} days` : days === 0 ? 'Today' : 'Expired'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCard
