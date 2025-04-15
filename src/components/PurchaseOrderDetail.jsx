import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getPurchaseOrderById, approvePurchaseOrder } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  useEffect(() => {
    fetchPurchaseOrder();
  }, [id]);

  const fetchPurchaseOrder = async () => {
    try {
      const data = await getPurchaseOrderById(id);
      setPurchaseOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    try {
      setActionStatus('');
      await approvePurchaseOrder(id, { status, comment });
      setActionStatus('Action completed successfully');
      setComment('');
      fetchPurchaseOrder();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update purchase order');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (!purchaseOrder) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Purchase Order Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Order #{purchaseOrder.id}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Item Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{purchaseOrder.itemName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Quantity</dt>
              <dd className="mt-1 text-sm text-gray-900">{purchaseOrder.quantity}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Cost</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatCurrency(purchaseOrder.cost)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Vendor Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{purchaseOrder.vendorName}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{purchaseOrder.description}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{purchaseOrder.status}</dd>
            </div>
          </dl>
        </div>

        {/* Approval History */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Approval History</h4>
          <div className="flow-root">
            <ul className="-mb-8">
              {purchaseOrder.approvalHistory?.map((history, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== purchaseOrder.approvalHistory.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          history.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <span className="text-white text-sm">{history.status === 'approved' ? '✓' : '✕'}</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {history.status === 'approved' ? 'Approved' : 'Rejected'} by {history.reviewer}
                          </p>
                          <p className="mt-1 text-sm text-gray-700">{history.comment}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={history.date}>{formatDate(history.date)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Approval Actions */}
        {user?.role === 'reviewer' && purchaseOrder.status === 'pending' && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-4">
              {actionStatus && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-fade-in">
                  {actionStatus}
                </div>
              )}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <div className="mt-1">
                  <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleAction('approved')}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-md 
                    text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 
                    transform transition-all duration-200 hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('rejected')}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-md 
                    text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 
                    transform transition-all duration-200 hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}