const express = require('express');
const router = express.Router();
const {
  createInvite,
  acceptInvite,
  rejectInvite,
  getInviteDetails,
  getPlanInvites,
  cancelInvite,
  resendInvite
} = require('../controllers/inviteController');
const auth = require('../middleware/auth');

// Public routes (for accepting invites)
router.get('/:token', getInviteDetails);
router.post('/:token/accept', auth, acceptInvite);
router.post('/:token/reject', rejectInvite);

// Protected routes
router.post('/', auth, createInvite);
router.get('/plan/:planId', auth, getPlanInvites);

router.post('/:inviteId/cancel', auth, cancelInvite);

router.post('/:inviteId/resend', auth, resendInvite);

module.exports = router;
