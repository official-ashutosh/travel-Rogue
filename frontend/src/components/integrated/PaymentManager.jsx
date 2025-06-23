import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { 
  CreditCard, 
  Coins, 
  Star, 
  CheckCircle,
  Gift,
  Zap,
  Crown,
  History
} from 'lucide-react';
import { usePayments, useUserProfile } from '../../hooks/useApiHooks.js';

const PaymentManager = () => {
  const {
    packages,
    paymentHistory,
    loading,
    error,
    fetchCreditPackages,
    fetchPaymentHistory,
    createStripeSession
  } = usePayments();
  const {
    credits,
    fetchCredits
  } = useUserProfile();

  useEffect(() => {
    fetchCreditPackages();
    fetchPaymentHistory();
    fetchCredits();
  }, [fetchCreditPackages, fetchPaymentHistory, fetchCredits]);

  const handlePurchase = async (packageData) => {
    try {
      const result = await createStripeSession(packageData);
      if (result.success && result.session.url) {
        window.location.href = result.session.url;
      }
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const getPackageIcon = (packageType) => {
    switch (packageType) {
      case 'starter': return <Coins className="h-6 w-6" />;
      case 'popular': return <Star className="h-6 w-6" />;
      case 'premium': return <Crown className="h-6 w-6" />;  
      default: return <Gift className="h-6 w-6" />;
    }
  };

  const getPackageColor = (packageType) => {
    switch (packageType) {
      case 'starter': return 'blue';
      case 'popular': return 'green';
      case 'premium': return 'purple';
      default: return 'gray';
    }
  };

  if (loading && packages.length === 0) {
    return <div className="flex justify-center p-8">Loading payment options...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Credits */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your AI Credits</h2>
              <p className="text-blue-100">Use credits to generate travel plans with AI</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{credits}</div>
              <div className="text-blue-100">Credits Available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Purchase Credits
        </h2>
        
        {error && (
          <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-md">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative transition-all hover:shadow-lg ${
                pkg.popular ? 'ring-2 ring-green-500 scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto p-3 rounded-full bg-${getPackageColor(pkg.type)}-100 text-${getPackageColor(pkg.type)}-600 w-fit`}>
                  {getPackageIcon(pkg.type)}
                </div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900">
                  ${pkg.price}
                </div>
                <p className="text-gray-600">{pkg.credits} AI Credits</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  {pkg.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600">
                    ${(pkg.price / pkg.credits).toFixed(3)} per credit
                  </div>
                  {pkg.savings && (
                    <div className="text-green-600 font-medium text-sm">
                      Save {pkg.savings}%
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase Credits
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No payments yet</p>
              <p>Your payment history will appear here after your first purchase.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Coins className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {payment.package_name || `${payment.credits} Credits`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(payment.created_at).toLocaleDateString()} at{' '}
                        {new Date(payment.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${payment.amount}
                    </div>
                    <Badge 
                      variant={payment.status === 'completed' ? 'success' : 'secondary'}
                      className="capitalize"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            How to Use Your Credits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <span>Generate complete travel itineraries (5 credits)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <span>Get local cuisine recommendations (2 credits)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <span>Find top activities and attractions (3 credits)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <span>Create packing checklists (1 credit)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManager;
