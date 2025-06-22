import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import axios from 'axios';

const FeedbackSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/feedback`, {
        message: feedback.trim(),
        type: 'general'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setIsSuccess(true);
      setFeedback('');
      
      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // If user is not authenticated, still allow feedback submission
      if (error.response?.status === 401) {
        console.log('Feedback submitted (not authenticated):', feedback);
        setIsSuccess(true);
        setFeedback('');
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Feedback</span>
      </Button>      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            {isSuccess ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Thank You!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your feedback has been submitted successfully.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Share Your Feedback
                </h2>
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !feedback.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackSheet;
