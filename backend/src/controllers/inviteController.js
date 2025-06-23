const crypto = require('crypto');
const Invite = require('../models/Invite');
const Access = require('../models/Access');
const Plan = require('../models/Plan');
const User = require('../models/User');
const { createResponse, paginate } = require('../utils/helpers');
const { sendPlanInviteEmail } = require('../services/emailService');

// Create plan invite
const createInvite = async (req, res, next) => {
  try {
    const { planId, email } = req.body;
    const userId = req.userId;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Check if user is plan owner
    if (plan.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Only plan owner can send invites')
      );
    }

    // Check if invite already exists for this email and plan
    const existingInvite = await Invite.findOne({ planId, email, status: 'pending' });
    if (existingInvite) {
      return res.status(400).json(
        createResponse('error', 'Invite already sent to this email for this plan')
      );
    }

    // Check if user already has access
    const existingAccess = await Access.findOne({ planId, email });
    if (existingAccess) {
      return res.status(400).json(
        createResponse('error', 'User already has access to this plan')
      );
    }

    // Generate unique invite token
    const token = crypto.randomBytes(32).toString('hex');

    // Create invite
    const invite = await Invite.create({
      planId,
      email: email.toLowerCase(),
      token,
      invitedBy: userId,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Get inviter details
    const inviter = await User.findOne({ userId });
    const inviterName = inviter ? `${inviter.firstName} ${inviter.lastName}`.trim() : 'Someone';

    // Send invite email
    try {
      await sendPlanInviteEmail(email, plan.nameoftheplace, inviterName, token);
      
      res.status(201).json(
        createResponse('success', 'Invite sent successfully', { invite })
      );
    } catch (emailError) {
      // Delete the invite if email fails
      await Invite.findByIdAndDelete(invite._id);
      
      return res.status(500).json(
        createResponse('error', 'Failed to send invite email')
      );
    }
  } catch (error) {
    next(error);
  }
};

// Accept invite
const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const userId = req.userId;

    // Find invite by token
    const invite = await Invite.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('planId');

    if (!invite) {
      return res.status(404).json(
        createResponse('error', 'Invalid or expired invite')
      );
    }

    // Get user details
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    // Check if invite email matches user email
    if (invite.email !== user.email.toLowerCase()) {
      return res.status(403).json(
        createResponse('error', 'This invite was sent to a different email address')
      );
    }

    // Check if user already has access
    const existingAccess = await Access.findOne({ planId: invite.planId._id, userId });
    if (existingAccess) {
      // Update invite status and return success
      invite.status = 'accepted';
      await invite.save();
      
      return res.json(
        createResponse('success', 'You already have access to this plan', {
          plan: invite.planId,
          access: existingAccess
        })
      );
    }

    // Create access record
    const access = await Access.create({
      planId: invite.planId._id,
      userId,
      email: user.email,
      role: 'viewer',
      grantedBy: invite.invitedBy
    });

    // Update invite status
    invite.status = 'accepted';
    await invite.save();

    res.json(
      createResponse('success', 'Invite accepted successfully', {
        plan: invite.planId,
        access
      })
    );
  } catch (error) {
    next(error);
  }
};

// Reject invite
const rejectInvite = async (req, res, next) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invite) {
      return res.status(404).json(
        createResponse('error', 'Invalid or expired invite')
      );
    }

    invite.status = 'rejected';
    await invite.save();

    res.json(
      createResponse('success', 'Invite rejected')
    );
  } catch (error) {
    next(error);
  }
};

// Get invite details
const getInviteDetails = async (req, res, next) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({
      token,
      expiresAt: { $gt: new Date() }
    }).populate('planId', 'nameoftheplace userPrompt imageUrl')
      .populate('invitedBy', 'firstName lastName email');

    if (!invite) {
      return res.status(404).json(
        createResponse('error', 'Invalid or expired invite')
      );
    }

    // Get inviter details
    const inviter = await User.findOne({ userId: invite.invitedBy });

    res.json(
      createResponse('success', 'Invite details retrieved successfully', {
        invite: {
          planName: invite.planId.nameoftheplace,
          planDescription: invite.planId.userPrompt,
          planImage: invite.planId.imageUrl,
          inviterName: inviter ? `${inviter.firstName} ${inviter.lastName}`.trim() : 'Unknown',
          inviterEmail: inviter ? inviter.email : '',
          status: invite.status,
          expiresAt: invite.expiresAt,
          createdAt: invite.createdAt
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get plan invites (for plan owner)
const getPlanInvites = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.userId;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Check if plan exists and user is owner
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    if (plan.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Access denied. Only plan owner can view invites.')
      );
    }

    // Build query
    let query = { planId };
    if (status) query.status = status;

    const invites = await Invite.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Invite.countDocuments(query);

    res.json(
      createResponse('success', 'Plan invites retrieved successfully', {
        invites,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalInvites: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Cancel invite (for plan owner)
const cancelInvite = async (req, res, next) => {
  try {
    const { inviteId } = req.params;
    const userId = req.userId;

    const invite = await Invite.findById(inviteId).populate('planId');
    if (!invite) {
      return res.status(404).json(
        createResponse('error', 'Invite not found')
      );
    }

    // Check if user is plan owner
    if (invite.planId.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Access denied. Only plan owner can cancel invites.')
      );
    }

    // Can only cancel pending invites
    if (invite.status !== 'pending') {
      return res.status(400).json(
        createResponse('error', 'Can only cancel pending invites')
      );
    }

    invite.status = 'expired';
    await invite.save();

    res.json(
      createResponse('success', 'Invite cancelled successfully')
    );
  } catch (error) {
    next(error);
  }
};

// Resend invite
const resendInvite = async (req, res, next) => {
  try {
    const { inviteId } = req.params;
    const userId = req.userId;

    const invite = await Invite.findById(inviteId).populate('planId');
    if (!invite) {
      return res.status(404).json(
        createResponse('error', 'Invite not found')
      );
    }

    // Check if user is plan owner
    if (invite.planId.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Access denied. Only plan owner can resend invites.')
      );
    }

    // Can only resend pending or expired invites
    if (!['pending', 'expired'].includes(invite.status)) {
      return res.status(400).json(
        createResponse('error', 'Cannot resend this invite')
      );
    }

    // Update invite
    invite.status = 'pending';
    invite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    invite.token = crypto.randomBytes(32).toString('hex'); // New token
    await invite.save();

    // Get inviter details
    const inviter = await User.findOne({ userId });
    const inviterName = inviter ? `${inviter.firstName} ${inviter.lastName}`.trim() : 'Someone';

    // Send invite email
    try {
      await sendPlanInviteEmail(invite.email, invite.planId.nameoftheplace, inviterName, invite.token);
      
      res.json(
        createResponse('success', 'Invite resent successfully', { invite })
      );
    } catch (emailError) {
      return res.status(500).json(
        createResponse('error', 'Failed to resend invite email')
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvite,
  acceptInvite,
  rejectInvite,
  getInviteDetails,
  getPlanInvites,
  cancelInvite,
  resendInvite
};
