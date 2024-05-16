const connection = require('../databases');
const moment = require('moment');
const Schedule = require('../models/schedule.model');
const constants = require('../utils/constants');
const stripe = require('stripe')(constants.STRIPE_SECRET_KEY);

const {
  sendMailBookingTicketSuccess,
  sendMailCancelTicketSuccess,
} = require('../mail/sendMail');

exports.getSchedulesOfCinema = async (req, res) => {
  const { cinemaId } = req.query;
  try {
    const results = await Schedule.getSchedulesOfCinema(cinemaId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSchedules = async (req, res) => {
  const { cinemaId, day, movieId } = req.query;
  console.log({ cinemaId, day, movieId });
  try {
    const results = await Schedule.getSchedule(cinemaId, day, movieId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSchedulesByCinemaId = async (req, res) => {
  const { cinemaId, movieId, day } = req.query;
  try {
    const results = await Schedule.getScheduleByCinemaId(cinemaId, movieId, day);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSchedulesOfMovieByDate = async (req, res) => {
  const { day, movieId } = req.query;
  try {
    const results = await Schedule.getSchedulesOfMovieByDate(day, movieId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getScheduleById = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const results = await Schedule.getScheduleById(scheduleId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllChairs = async (req, res) => {
  try {
    const results = await Schedule.getAllChairs();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAmount = async (req, res) => {
  const { date_type, time_type, format_id } = req.query;
  try {
    const results = await Schedule.getAmount(date_type, time_type, format_id);
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getReport = async (req, res) => {
  const fromDate = req.query.fromDate || '2023-01-01';
  const toDate = req.query.toDate || '2025-01-01';
  const movieId = req.query.movieId;
  const cinemaId = req.query.cinemaId;

  try {
    const results = await Schedule.getReport(movieId,fromDate, toDate,cinemaId);
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.bookingChairs = async (req, res) => {
  const { scheduleId, selectedChairs, totalMoney, products } = req.body;
  const { userId, userEmail } = req;
  const today = moment(new Date()).format('YYYY-MM-DD HH:mm');
  try {
    const results = await Schedule.bookingChairs(
      userId,
      scheduleId,
      totalMoney,
      today,
      selectedChairs,
      products
    );
    const ticket = await Schedule.getTicketDetailById(results.insertId);
    sendMailBookingTicketSuccess(userEmail, ticket[0]);
    return res.json({
      success: true,
      data: {
        message: 'Đặt vé thành công',
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.bookingChairsWithCheckout = async (req, res) => {
  const { scheduleId, selectedChairs, totalMoney, products } = req.body;
  const { userId, userEmail } = req;
  const today = moment(new Date()).format('YYYY-MM-DD HH:mm');
  try {
    const stripeCustomer = await stripe.customers.create({
      name: userEmail,
      email: userEmail,
    });
    const results = await Schedule.bookingChairs(
      userId,
      scheduleId,
      totalMoney,
      today,
      selectedChairs,
      products
    );
    const ticket = await Schedule.getTicketDetailById(results.insertId);
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      metadata: {
        ticket_id: ticket[0].id,
        user_email: userEmail,
      },
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            unit_amount: totalMoney,
            product_data: {
              name: 'Movie Ticket',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${constants.HOST}/stripe/payment/success`,
      cancel_url: `${constants.HOST}/stripe/payment/cancel`,
    });
    return res.json({
      success: true,
      data: {
        message: 'Thanh toán để đặt vé',
        url: checkoutSession.url,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTicketByCode = async (req, res) => {
  const { code } = req.query;
  try {
    const results = await Schedule.getTicketByCode(code);
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getTicketByCodeOfCinema = async (req, res) => {
  const { code,cinemaId } = req.query;
  try {
    const results = await Schedule.getTicketByCodeOfCinema(code,cinemaId);
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.receiveTicket = async (req, res) => {
  const { code } = req.body;
  try {
    const results = await Schedule.receiveTicket(code);
    return res.json({
      success: true,
      data: {
        message: 'Nhận vé thành công',
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.cancelTicket = async (req, res) => {
  const { code } = req.body;
  const { userEmail } = req;
  try {
    const ticketByCode = await Schedule.getTicketByCode(code);
    const tickets = await Schedule.getTicketDetailById(ticketByCode[0].id);
    const ticket = tickets[0];
    const endMoment = moment(new Date(ticket.premiere));
    const startMoment = moment(new Date());
    const expiredHour = moment.duration(endMoment.diff(startMoment)).asHours();
    if (
      ticket?.is_cancel ||
      !ticket?.is_success ||
      !ticket?.payment_id ||
      ticket?.status ||
      expiredHour < 24
    ) {
      return res.json({
        success: false,
        data: {
          message: 'Hủy vé thất bại',
        },
      });
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(
      ticket.payment_id
    );
    const refundPayment = await stripe.refunds.create({
      charge: `${paymentIntent.latest_charge}`,
    });
    const results = await Schedule.cancelTicket(code);
    sendMailCancelTicketSuccess(userEmail, tickets[0]);
    return res.json({
      success: true,
      data: {
        message: 'Hủy vé thành công',
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getChairsByScheduleId = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const results = await Schedule.getChairsByScheduleId(scheduleId);
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTimeTypeSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const results = await Schedule.getTimeTypeSchedule(scheduleId);
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  const { roomId, movieId, premiere } = req.body;
  try {
    const scheduleResult = await Schedule.getSchedulesByCinemaAndDate(premiere,roomId);
    if (scheduleResult.length > 0) {
      return res.json({
        success: false,
        data: {
          message: `Phòng này vào ${moment(premiere).format('HH:mm DD-MM-YYYY')} đã có lịch chiếu`,
        },
      });
    }

    const currentScheduleResult = await Schedule.getCurrentSchedule(premiere,roomId);
    if (currentScheduleResult.length > 0) {
      return res.json({
        success: false,
        data: {
          message: `Phòng này vào ${moment(premiere).format('HH:mm DD-MM-YYYY')} đang chiếu phim ${currentScheduleResult[0].name}`,
        },
      })
    }
    const results = await Schedule.createSchedule(roomId, movieId, premiere);
    return res.json({
      success: true,
      data: {
        message: 'Thêm lịch chiếu thành công',
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  const { id, roomId, movieId, premiere } = req.body;

  try {
    const results = await Schedule.updateSchedule(
      roomId,
      movieId,
      premiere,
      id
    );
    return res.json({
      success: true,
      data: {
        message: 'Cập nhật lịch chiếu thành công',
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  const { id } = req.body;
  try {
    const results = await Schedule.deleteSchedule(id);
    return res.json({
      success: true,
      data: {
        message: 'Xóa lịch chiếu thành công',
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
