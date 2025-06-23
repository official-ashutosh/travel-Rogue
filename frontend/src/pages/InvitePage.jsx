import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar,
  Users,
  ArrowLeft
} from 'lucide-react';
import { invitesAPI } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const InvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchInviteDetails = async () => {
      try {
        const result = await invitesAPI.getInviteDetails(token);
        setInvite(result.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired invite');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInviteDetails();
    }
  }, [token]);

  const handleAccept = async () => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/invite/${token}`);
      return;
    }

    try {
      setProcessing(true);
      const result = await invitesAPI.acceptInvite(token);
      setResponse({
        type: 'success',
        message: 'Invitation accepted! You can now collaborate on this travel plan.',
        data: result.data
      });
    } catch (err) {
      setResponse({
        type: 'error',
        message: err.response?.data?.message || 'Failed to accept invitation'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      await invitesAPI.rejectInvite(token);
      setResponse({
        type: 'info',
        message: 'Invitation declined.'
      });
    } catch (err) {
      setResponse({
        type: 'error',
        message: err.response?.data?.message || 'Failed to decline invitation'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (response) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            {response.type === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to the Team!
                </h2>
              </>
            )}
            {response.type === 'info' && (
              <>
                <XCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Invitation Declined
                </h2>
              </>
            )}
            {response.type === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Something Went Wrong
                </h2>
              </>
            )}
            
            <p className="text-gray-600 mb-6">{response.message}</p>
            
            <div className="flex gap-2 justify-center">
              {response.type === 'success' && response.data?.plan_id && (
                <Button onClick={() => navigate(`/plans/${response.data.plan_id}`)}>
                  View Plan
                </Button>
              )}
              <Button onClick={() => navigate('/')} variant="outline">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-2xl mx-4">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">You're Invited!</CardTitle>
          <p className="text-gray-600 mt-2">
            {invite.inviter_name} has invited you to collaborate on a travel plan
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Plan Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {invite.plan_title || 'Travel Plan'}
                </h3>
                {invite.plan_description && (
                  <p className="text-gray-600 mb-3">{invite.plan_description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {invite.plan_destination && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {invite.plan_destination}
                    </div>
                  )}
                  {invite.plan_dates && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {invite.plan_dates}
                    </div>
                  )}
                  {invite.collaborators_count && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {invite.collaborators_count} collaborators
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Message */}
          {invite.message && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Personal Message:</h4>
              <p className="text-blue-800 italic">"{invite.message}"</p>
            </div>
          )}

          {/* Invite Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="font-medium text-gray-700">Invited by:</span>
              <p className="text-gray-600">{invite.inviter_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Invited on:</span>
              <p className="text-gray-600">
                {new Date(invite.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <Badge 
              variant={invite.status === 'pending' ? 'secondary' : 'outline'}
              className="capitalize"
            >
              Status: {invite.status}
            </Badge>
          </div>

          {/* Auth Notice */}
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> You need to be logged in to accept this invitation. 
                You'll be redirected to login after clicking "Accept Invitation".
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {invite.status === 'pending' && (
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleAccept}
                disabled={processing}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {processing ? 'Processing...' : 'Accept Invitation'}
              </Button>
              
              <Button 
                onClick={handleReject}
                disabled={processing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Decline
              </Button>
            </div>
          )}

          {invite.status !== 'pending' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                This invitation has already been {invite.status}.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Go Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitePage;
