const connection = require('../databases');
const moment = require('moment');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/auth.model');
const bcrypt = require('bcrypt');
const {
  sendMailRegisterSuccess,
  sendMailForgotPassword,
} = require('../mail/sendMail');
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // const results = await User.findByEmailAndPassword(email, password);
    const results = await User.findByEmail(email);
    const user = results[0];
    if (!user) {
      return next({ message: 'Đăng nhập thất bại' });
    }
    if(user && user.is_active==0){
      return next({ message: 'Tài khoản không tồn tại' });
    }
    if (user && !user?.isVerify) {
      return next({ message: 'Tài khoản chưa được xác minh' });
    }
    if (user && user?.isLock) {
      return next({ message: 'Tài khoản của bạn đã bị khóa' });
    }
    if (user?.id) {
      const isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        next({ message: 'Đăng nhập thất bại' });
        return;
      }
      const token = jwt.sign(
        {
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: '30d' }
      );
      res.json({
        accessToken: token,
      });
      return;
    }
    next({ message: 'Đăng nhập thất bại' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // const results = await User.findByEmailAndPassword(email, password);
    const results = await User.findByEmailAdmin(email);
    const user = results[0];
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không có quyền truy cập' });
    }
    if(user && user.is_active==0){
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }
    if (user && !user?.isVerify) {
      return res.status(401).json({ message: 'Tài khoản chưa được xác minh' });
    }
    if (user && user?.isLock) {
      return res.status(401).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }
    if (user?.id) {
      const isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        return res.status(401).json({ message: 'Đăng nhập thất bại' });
      }
      const token = jwt.sign(
        {
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: '30d' }
      );
      res.json({
        accessToken: token,
      });
    } else {
      return res.status(401).json({ message: 'Đăng nhập thất bại' });
    }
  } catch (err) {
    // Xử lý lỗi nếu có
    next(err);
  }
};


exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, address, dob, gender } = req.body;
    const userResult = await User.findByEmail(email);
    if (userResult.length > 0) {
      return res.json({
        success: false,
        data: {
          message: 'Email đã được sử dụng',
        },
      });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const results = await User.create(
      fullName,
      email,
      hashPassword,
      address,
      dob,
      gender
    );

    const token = jwt.sign(
      {
        email: email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    sendMailRegisterSuccess(email, token);
    return res.json({
      success: true,
      data: {
        message: 'Đăng ký thành công',
        results: results,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: {
        message: 'Đăng ký thất bại',
      },
    });
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { userId } = req;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const users = await User.findById(userId);
    const existUser = users[0];
    if (newPassword !== confirmNewPassword) {
      return res.json({
        success: false,
        data: {
          message: 'Mật khẩu mới không trùng khớp',
        },
      });
    }
    const isPassword = bcrypt.compareSync(oldPassword, existUser.password);
    if (!isPassword) {
      return res.json({
        success: false,
        data: {
          message: 'Mật khẩu không chính xác',
        },
      });
    }
    const newHashPassword = bcrypt.hashSync(newPassword, 10);
    const results = await User.changePassword(newHashPassword, userId);
    console.log(results);
    return res.json({
      success: true,
      data: {
        message: 'Đổi mật khẩu thành công',
        results: results,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: {
        message: 'Đổi mật khẩu thất bại',
      },
    });
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const users = await User.findByEmail(email);
    const existUser = users[0];
    if (!existUser) {
      return res.json({
        success: false,
        data: {
          message: 'Email chưa được đăng ký',
        },
      });
    }
    const token = jwt.sign(
      {
        email: email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    sendMailForgotPassword(email, token);
    return res.json({
      success: true,
      data: {
        message: 'Xác thực khẩu thành công',
        results: [],
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: {
        message: 'Xác thực mật khẩu thất bại',
      },
    });
  }
};

exports.confirmPassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const {newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.json({
        success: false,
        data: {
          message: 'Mật khẩu mới không trùng khớp',
        },
      });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const { userEmail } = decoded;
    const newHashPassword = bcrypt.hashSync(newPassword, 10);
    await User.confirmPassword(userEmail, newHashPassword);
    return res.json({
      success: true,
      data: {
        message: 'Xác nhận mật khẩu thành công',
        // results: results,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: {
        message: 'Xác nhận mật khẩu thất bại',
      },
    });
  }
};
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
      if (err) {
        next({ message: 'Token không hợp lệ' });
        return;
      }
      const { email } = decoded;
      await User.verifyEmail(email);
    });
    return res.json({
      success: true,
      data: {
        message: 'Xác thực thành công',
        // results: results,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      data: {
        message: 'Xác thực thất bại',
      },
    });
  }
};

exports.getMyInformation = async (req, res) => {
  const { userId } = req;
  try {
    const results = await User.getMyInformation(userId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateMyInformation = async (req, res) => {
  const { fullName, dateOfBirth, address, gender, avatar } = req.body;
  const formatDate = moment(dateOfBirth).format('YYYY-MM-DD');
  const { userId } = req;
  try {
    const results = await User.updateMyInformation(
      fullName,
      formatDate,
      address,
      avatar,
      gender,
      userId
    );
    res.json({
      success: true,
      data: {
        message: 'Sửa thông tin thành công',
        results: results,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTickets = async (req, res) => {
  const { userId } = req;
  const { handle } = req.query;
  try {
    const result = await User.getMyTickets(userId);
    if (!handle) {
      res.json(result);
    } else {
      const response = [];
      const ticketId = [];
      result.forEach(ticket => {
        if (!ticketId.includes(ticket.id)) {
          ticketId.push(ticket.id);
        }
      });
      for (let i = 0; i < ticketId.length; i++) {
        const allTicketDetail = result.filter(r => r.id === ticketId[i]);
        let ticketIndex = { ...allTicketDetail[0] };
        const allChairs = allTicketDetail.map(
          ticket => `${ticket.xPosition}${ticket.yPosition}`
        );
        ticketIndex.chairs = [...new Set(allChairs)];
        const products = [];
        allTicketDetail.forEach(ticketDetail => {
          if (
            !products.find(product => product.id === ticketDetail.product_id) &&
            ticketDetail.product_id
          ) {
            products.push({
              id: ticketDetail.product_id,
              name: ticketDetail.product_name,
              quantity: ticketDetail.product_quantity,
            });
          }
        });
        ticketIndex.products = products;
        response.push(ticketIndex);
      }
      response.sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );
      res.json(response);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTicketsOfMovie = async (req, res) => {
  const {userId}= req
  const { handle,movieId } = req.query;
  try {
    const result = await User.getMyTicketsOfMovie(userId,movieId);
    if (!handle) {
      res.json(result);
    } else {
      const response = [];
      const ticketId = [];
      result.forEach(ticket => {
        if (!ticketId.includes(ticket.id)) {
          ticketId.push(ticket.id);
        }
      });
      for (let i = 0; i < ticketId.length; i++) {
        const allTicketDetail = result.filter(r => r.id === ticketId[i]);
        let ticketIndex = { ...allTicketDetail[0] };
        const allChairs = allTicketDetail.map(
          ticket => `${ticket.xPosition}${ticket.yPosition}`
        );
        ticketIndex.chairs = [...new Set(allChairs)];
        const products = [];
        allTicketDetail.forEach(ticketDetail => {
          if (
            !products.find(product => product.id === ticketDetail.product_id) &&
            ticketDetail.product_id
          ) {
            products.push({
              id: ticketDetail.product_id,
              name: ticketDetail.product_name,
              quantity: ticketDetail.product_quantity,
            });
          }
        });
        ticketIndex.products = products;
        response.push(ticketIndex);
      }
      response.sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );
      res.json(response);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
