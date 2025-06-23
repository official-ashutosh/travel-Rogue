import React from 'react';
import PaymentManager from '../components/integrated/PaymentManager.jsx';

const PaymentsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Credits & Payments
          </h1>
          <p className="text-gray-600">
            Purchase AI credits and manage your payment history
          </p>
        </div>
        
        <PaymentManager />
      </div>
    </div>
  );
};

export default PaymentsPage;
