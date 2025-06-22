import React, { useState } from 'react';
import { Coins, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const CreditsDrawerWithDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Mock credits data - replace with real data from your backend
  const credits = user?.credits || 0;
  const freeCredits = user?.freeCredits || 5;
  const totalCredits = credits + freeCredits;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <Coins className="w-4 h-4" />
        <span className="hidden sm:inline">{totalCredits} Credits</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Credits
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Free Credits</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">{freeCredits}</span>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 dark:text-green-300">Purchased Credits</span>
                  <span className="font-semibold text-green-700 dark:text-green-300">{credits}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Available</span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">{totalCredits}</span>
                </div>
              </div>

              <Button
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => {
                  // TODO: Implement credit purchase
                  console.log('Purchase credits');
                }}
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy More Credits</span>
              </Button>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { CreditsDrawerWithDialog };
export default CreditsDrawerWithDialog;
