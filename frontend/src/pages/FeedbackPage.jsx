import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { 
  MessageSquare, 
  Send, 
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { useFeedback } from '../hooks/useApiHooks.js';
import { feedbackAPI } from '../lib/api.js';

const FeedbackPage = () => {
  const {
    feedback,
    setFeedback,
    loading,
    error,
    submitFeedback
  } = useFeedback();

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, my, unreviewed
  const [formData, setFormData] = useState({
    type: 'general',
    rating: 5,
    message: '',
    category: 'feature'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitFeedback(formData);
    if (result.success) {
      setShowForm(false);
      setFormData({
        type: 'general',
        rating: 5,
        message: '',
        category: 'feature'
      });
    }
  };
  useEffect(() => {
    // fetch feedback of user from the backend
    const fetchFeedback = async () => {
      try {
        const res = await feedbackAPI.getUserFeedback();
        setFeedback(res.data.data?.feedback || res.data.feedback || []);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        // If token is invalid, the API interceptor will handle redirect
        if (err.response?.status !== 401) {
          setFeedback([]);
        }
      }
    };

    fetchFeedback();
  }, [setFeedback]);

  const filteredFeedback = feedback.filter(item => {
    if (filter === 'my') return item.is_mine;
    if (filter === 'unreviewed') return !item.reviewed;
    return true;
  });

  const getRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const getCategoryColor = (category) => {
    const colors = {
      bug: 'red',
      feature: 'blue',
      improvement: 'green',
      ui: 'purple',
      performance: 'orange'
    };
    return colors[category] || 'gray';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Feedback & Suggestions
              </h1>
              <p className="text-gray-600">
                Help us improve Travel Rogue by sharing your feedback
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Submit Feedback
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Feedback
            </Button>
            <Button
              size="sm"
              variant={filter === 'my' ? 'default' : 'outline'}
              onClick={() => setFilter('my')}
            >
              My Feedback
            </Button>
            <Button
              size="sm"
              variant={filter === 'unreviewed' ? 'default' : 'outline'}
              onClick={() => setFilter('unreviewed')}
            >
              <Clock className="h-3 w-3 mr-1" />
              Pending Review
            </Button>
          </div>
        </div>

        {/* Feedback Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit New Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="improvement">Improvement</option>
                      <option value="ui">UI/UX</option>
                      <option value="performance">Performance</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="general">General Feedback</option>
                      <option value="plan">Plan Related</option>
                      <option value="ui">User Interface</option>
                      <option value="performance">Performance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rating (1-5 stars)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={`text-2xl ${
                          star <= formData.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Please share your thoughts, suggestions, or report any issues..."
                    rows={4}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowForm(false)}
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
          <div className="text-red-600 mb-6 p-3 bg-red-50 rounded-md border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Community Feedback ({filteredFeedback.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading feedback...</div>
            ) : filteredFeedback.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No feedback found</p>
                <p>
                  {filter === 'my' 
                    ? "You haven't submitted any feedback yet."
                    : "No feedback matches your current filter."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedback.map((item) => (
                  <div 
                    key={item.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {item.user_name || 'Anonymous'}
                          </span>
                          {item.is_mine && (
                            <Badge variant="outline" className="text-xs">
                              Your feedback
                            </Badge>
                          )}
                        </div>
                        
                        <Badge 
                          variant="outline"
                          className={`bg-${getCategoryColor(item.category)}-50 text-${getCategoryColor(item.category)}-700 border-${getCategoryColor(item.category)}-200`}
                        >
                          {item.category}
                        </Badge>
                        
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            {getRatingStars(item.rating)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.reviewed ? (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{item.message}</p>
                    
                    {item.admin_response && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-blue-600 text-white text-xs">
                            Admin Response
                          </Badge>
                        </div>
                        <p className="text-blue-800 text-sm">{item.admin_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {feedback.length}
              </div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {feedback.filter(f => !f.reviewed).length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {feedback.filter(f => f.reviewed).length}
              </div>
              <div className="text-sm text-gray-600">Reviewed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {feedback.length > 0 
                  ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
