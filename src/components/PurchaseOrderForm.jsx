import { useState } from 'react';
import { createPurchaseOrder } from '../services/api';
import ErrorAlert from './ErrorAlert';

export default function PurchaseOrderForm() {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    cost: '',
    vendorName: '',
    description: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      await createPurchaseOrder(formData);
      setStatus({ type: 'success', message: 'Purchase order created successfully!' });
      setFormData({
        itemName: '',
        quantity: '',
        cost: '',
        vendorName: '',
        description: ''
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to create purchase order' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Purchase Order</h2>
      
      {status.type === 'error' && <ErrorAlert message={status.message} />}
      {status.type === 'success' && (
        <div className="mb-4 p-4 rounded bg-green-100 text-green-700">{status.message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 
              ${!formData.itemName ? 'border-red-300' : 'border-gray-300'}`}
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 
              ${!formData.quantity ? 'border-red-300' : 'border-gray-300'}`}
            required
          />
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Cost
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 
              ${!formData.cost ? 'border-red-300' : 'border-gray-300'}`}
            required
          />
        </div>

        <div>
          <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
            Vendor Name
          </label>
          <input
            type="text"
            id="vendorName"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 
              ${!formData.vendorName ? 'border-red-300' : 'border-gray-300'}`}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md 
            text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
            transform transition-all duration-200 hover:scale-[1.02]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Purchase Order
        </button>
      </form>
    </div>
  );
}