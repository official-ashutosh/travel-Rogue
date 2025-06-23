const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { createResponse } = require('../utils/helpers');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Credit packages
const creditPackages = {
  basic: { credits: 10, price: 999, name: 'Basic Package' },      // $9.99
  standard: { credits: 25, price: 1999, name: 'Standard Package' }, // $19.99
  premium: { credits: 50, price: 3499, name: 'Premium Package' },   // $34.99
  ultimate: { credits: 100, price: 5999, name: 'Ultimate Package' } // $59.99
};

// Create Stripe payment session
const createStripeSession = async (req, res, next) => {
  try {
    const { packageType } = req.body;
    const userId = req.userId;

    if (!creditPackages[packageType]) {
      return res.status(400).json(
        createResponse('error', 'Invalid package type')
      );
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    const package_ = creditPackages[packageType];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Travel Planner AI - ${package_.name}`,
              description: `${package_.credits} AI travel plan credits`,
            },
            unit_amount: package_.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      customer_email: user.email,
      metadata: {
        userId,
        packageType,
        credits: package_.credits.toString()
      }
    });

    // Create payment record
    const payment = await Payment.create({
      paymentId: session.id,
      email: user.email,
      amount: package_.price / 100, // Convert to dollars
      currency: 'USD',
      method: 'stripe',
      status: 'pending',
      userId,
      creditsAdded: package_.credits,
      stripeSessionId: session.id,
      metadata: {
        packageType,
        sessionUrl: session.url
      }
    });

    res.json(
      createResponse('success', 'Stripe session created successfully', {
        sessionId: session.id,
        sessionUrl: session.url,
        payment
      })
    );
  } catch (error) {
    next(error);
  }
};

// Create Razorpay order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { packageType } = req.body;
    const userId = req.userId;

    if (!creditPackages[packageType]) {
      return res.status(400).json(
        createResponse('error', 'Invalid package type')
      );
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    const package_ = creditPackages[packageType];

    // Convert USD to INR (approximate rate)
    const amountInINR = Math.round(package_.price * 83); // 1 USD = 83 INR (approximate)

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInINR,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId,
        packageType,
        credits: package_.credits.toString()
      }
    });

    // Create payment record
    const payment = await Payment.create({
      paymentId: order.id,
      email: user.email,
      amount: amountInINR / 100, // Convert to rupees
      currency: 'INR',
      method: 'razorpay',
      status: 'pending',
      userId,
      creditsAdded: package_.credits,
      razorpayOrderId: order.id,
      metadata: {
        packageType
      }
    });

    res.json(
      createResponse('success', 'Razorpay order created successfully', {
        orderId: order.id,
        amount: amountInINR,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
        payment
      })
    );
  } catch (error) {
    next(error);
  }
};

// Verify Stripe payment
const verifyStripePayment = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json(
        createResponse('error', 'Session not found')
      );
    }

    // Find payment record
    const payment = await Payment.findOne({ stripeSessionId: sessionId });
    if (!payment) {
      return res.status(404).json(
        createResponse('error', 'Payment record not found')
      );
    }

    if (session.payment_status === 'paid' && payment.status !== 'completed') {
      // Update payment status
      payment.status = 'completed';
      await payment.save();

      // Add credits to user
      const user = await User.findOne({ userId: payment.userId });
      if (user) {
        user.credits += payment.creditsAdded;
        await user.save();
      }

      res.json(
        createResponse('success', 'Payment verified and credits added successfully', {
          payment,
          creditsAdded: payment.creditsAdded
        })
      );
    } else if (session.payment_status === 'unpaid') {
      payment.status = 'failed';
      await payment.save();

      res.json(
        createResponse('error', 'Payment failed', { payment })
      );
    } else {
      res.json(
        createResponse('success', 'Payment status unchanged', { payment })
      );
    }
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json(
        createResponse('error', 'Invalid payment signature')
      );
    }

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json(
        createResponse('error', 'Payment record not found')
      );
    }

    // Update payment record
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // Add credits to user
    const user = await User.findOne({ userId: payment.userId });
    if (user) {
      user.credits += payment.creditsAdded;
      await user.save();
    }

    res.json(
      createResponse('success', 'Payment verified and credits added successfully', {
        payment,
        creditsAdded: payment.creditsAdded
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get user's payment history
const getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.userId;
    const { skip, limit: limitNum } = require('../utils/helpers').paginate(page, limit);

    const payments = await Payment.find({ userId })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments({ userId });

    res.json(
      createResponse('success', 'Payment history retrieved successfully', {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalPayments: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get credit packages
const getCreditPackages = async (req, res, next) => {
  try {
    const packages = Object.entries(creditPackages).map(([key, value]) => ({
      id: key,
      ...value,
      priceInDollars: value.price / 100
    }));

    res.json(
      createResponse('success', 'Credit packages retrieved successfully', { packages })
    );
  } catch (error) {
    next(error);
  }
};

// Stripe webhook handler
const handleStripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Find and update payment record
        const payment = await Payment.findOne({ stripeSessionId: session.id });
        if (payment && payment.status === 'pending') {
          payment.status = 'completed';
          await payment.save();

          // Add credits to user
          const user = await User.findOne({ userId: payment.userId });
          if (user) {
            user.credits += payment.creditsAdded;
            await user.save();
          }
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        
        // Mark payment as failed
        const expiredPayment = await Payment.findOne({ stripeSessionId: expiredSession.id });
        if (expiredPayment && expiredPayment.status === 'pending') {
          expiredPayment.status = 'failed';
          await expiredPayment.save();
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStripeSession,
  createRazorpayOrder,
  verifyStripePayment,
  verifyRazorpayPayment,
  getPaymentHistory,
  getCreditPackages,
  handleStripeWebhook
};
