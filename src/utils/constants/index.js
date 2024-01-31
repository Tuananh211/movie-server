require('dotenv').config();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const HOST = process.env.HOST;

module.exports = { STRIPE_SECRET_KEY, HOST };
