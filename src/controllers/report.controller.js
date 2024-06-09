const connection = require('../databases');
const Report = require('../models/report.model');

exports.getTotalUser = async (req, res) => {
    try {
      const total = await Report.getTotalUser();
      res.json(total);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getTotalTicket = async (req, res) => {
    try {
      const total = await Report.getTotalTicket();
      res.json(total);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getTotalTicketOfCinema = async (req, res) => {
    try {
      const {cinemaId}=req.params;
      const total = await Report.getTotalTicketOfCinema(cinemaId);
      res.json(total);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  exports.getTotalAccountOfCinema = async (req, res) => {
    try {
      const {cinemaId}=req.params;
      const total = await Report.getTotalAccountOfCinema(cinemaId);
      res.json(total);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getReport = async (req, res) => {
    const fromDate = req.query.fromDate || '2023-01-01';
    const toDate = req.query.toDate || (() => {
      let today = new Date();
      today.setDate(today.getDate() + 1);
      return today.toISOString().split('T')[0];
  })();
    const cinemaId = req.query.cinemaId;
    try {
      const results = await Report.getReport(cinemaId, fromDate, toDate);
      return res.json(results);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };