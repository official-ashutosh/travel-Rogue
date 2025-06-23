import React from 'react';
import { useParams } from 'react-router-dom';
import ExpenseManager from '../components/integrated/ExpenseManager.jsx';

const ExpensesPage = () => {
  const { planId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {planId ? 'Plan Expenses' : 'My Expenses'}
          </h1>
          <p className="text-gray-600">
            {planId 
              ? 'Track and manage expenses for this travel plan'
              : 'View and manage all your travel expenses'
            }
          </p>
        </div>
        
        <ExpenseManager planId={planId} />
      </div>
    </div>
  );
};

export default ExpensesPage;
