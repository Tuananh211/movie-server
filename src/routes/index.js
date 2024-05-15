const movieRoute = require('./movie.route');
const actorRoute = require('./actor.route')
const directorRoute= require('./director.route')
const cinemaRoute = require('./cinema.route');
const productRoute = require('./product.route');
const newsRoute = require('./news.route');
const empRoute = require('./emp.route');
const scheduleRoute = require('./schedule.route');
const commentRoute= require('./comment.route');
const authRoute = require('./auth.route');
const authMiddleware = require('../middlewares/auth.middleware');
const stripeRoute = require('./stripe.route');
const uploadRoute= require('./upload.route')
const userRouter = require('../routes/user.route')
const reportRouter= require('../routes/report.route')
const amountRoute= require('../routes/amount.route')

const initRoute = app => {
  app.use('/movies', movieRoute);
  app.use('/upload',authMiddleware.checkLogin,uploadRoute);
  app.use('/actor', authMiddleware.checkLogin,actorRoute);
  app.use('/director', authMiddleware.checkLogin,directorRoute);
  app.use('/cinemas', cinemaRoute);
  app.use('/products', authMiddleware.checkLogin, productRoute);
  app.use('/news', authMiddleware.checkLogin, newsRoute);
  app.use('/employees', authMiddleware.checkAdmin, empRoute);
  app.use('/users', authMiddleware.checkAdmin, userRouter);
  app.use('/schedules', authMiddleware.checkLogin, scheduleRoute);
  app.use('/report',authMiddleware.checkLogin,reportRouter);
  app.use('/amounts',authMiddleware.checkLogin,amountRoute);
  app.use('/auth', authRoute);
  app.use('/comment',authMiddleware.checkLogin,commentRoute);
  app.use('/stripe', stripeRoute);
  app.use((data, req, res, next) => {
    console.log('Handling error middleware', data);
    res.status(200).json({
      success: false,
      data,
    });
  });
};
module.exports = initRoute;
