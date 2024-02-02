require('dotenv').config();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const HOST = process.env.HOST;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { STRIPE_SECRET_KEY, HOST,cloudinary };
