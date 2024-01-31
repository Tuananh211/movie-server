const { sendMailBookingTicketSuccess } = require('../mail/sendMail');
const Schedule = require('../models/schedule.model');
exports.stripeWebhookListening = async (req, res) => {
  try {
    const event = req.body;
    switch (event.type) {
      case 'payment_intent.succeeded':
        // const paymentIntent = event.data.object;
        // console.log('paymentIntent', paymentIntent);
        break;
      case 'checkout.session.completed':
        const checkoutSession = event.data.object;
        const {
          metadata: { ticket_id: ticketId, user_email: userEmail },
          payment_intent: paymentIntentId,
        } = checkoutSession;
        await Schedule.completeCheckoutTicket(ticketId, paymentIntentId);
        const ticket = await Schedule.getTicketDetailById(ticketId);
        sendMailBookingTicketSuccess(userEmail, ticket[0]);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.stripePaymentSuccess = async (req, res) => {
  try {
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.stripePaymentCancel = async (req, res) => {
  try {
    res.json({ success: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
