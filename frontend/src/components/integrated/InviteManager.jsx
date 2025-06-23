import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Send,
  Copy,
  Users
} from 'lucide-react';
import { useInvites } from '../../hooks/useApiHooks.js';

const InviteManager = ({ planId, planTitle }) => {
  const {
    invites,
    loading,
    error,
    fetchPlanInvites,
    createInvite
  } = useInvites();

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    message: `You've been invited to join the travel plan: ${planTitle || 'Travel Plan'}`
  });

  useEffect(() => {
    if (planId) {
      fetchPlanInvites(planId);
    }
  }, [planId, fetchPlanInvites]);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    const result = await createInvite({
      plan_id: planId,
      email: inviteData.email,
      message: inviteData.message
    });

    if (result.success) {
      setShowInviteForm(false);
      setInviteData({
        email: '',
        message: `You've been invited to join the travel plan: ${planTitle || 'Travel Plan'}`
      });
    }
  };

  const copyInviteLink = (token) => {
    const inviteUrl = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    // You could add a toast notification here
    alert('Invite link copied to clipboard!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'expired': return 'gray';
      default: return 'blue';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  if (loading && invites.length === 0) {
    return <div className="flex justify-center p-8">Loading invites...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Plan Collaborators</h2>
        </div>
        <Button 
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Invite People
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  placeholder="friend@example.com"
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Personal Message</label>
                <textarea
                  value={inviteData.message}
                  onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                  placeholder="Add a personal message to your invitation..."
                  rows={3}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowInviteForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-red-600 p-3 bg-red-50 rounded-md border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Invites List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending & Active Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No invitations sent yet</p>
              <p>Invite friends and family to collaborate on this travel plan!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div 
                  key={invite.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {getStatusIcon(invite.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{invite.email}</span>
                        <Badge 
                          variant="outline" 
                          className={`bg-${getStatusColor(invite.status)}-50 text-${getStatusColor(invite.status)}-700 border-${getStatusColor(invite.status)}-200`}
                        >
                          {invite.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Sent {new Date(invite.created_at).toLocaleDateString()} at{' '}
                        {new Date(invite.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {invite.message && (
                        <div className="text-sm text-gray-500 mt-1 italic">
                          "{invite.message.substring(0, 100)}{invite.message.length > 100 ? '...' : ''}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {invite.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyInviteLink(invite.token)}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy Link
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Implement resend functionality
                            console.log('Resend invite:', invite.id);
                          }}
                        >
                          Resend
                        </Button>
                      </>
                    )}
                    
                    {invite.status === 'accepted' && (
                      <div className="text-green-600 text-sm font-medium">
                        ✓ Joined Plan
                      </div>
                    )}
                    
                    {invite.status === 'rejected' && (
                      <div className="text-red-600 text-sm font-medium">
                        ✗ Declined
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {invites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {invites.length}
              </div>
              <div className="text-sm text-gray-600">Total Invites</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {invites.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {invites.filter(i => i.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-600">Accepted</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {invites.filter(i => i.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Declined</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InviteManager;
