const Amount = require('../models/amount.model');
const connection = require('../databases');

exports.getListAmount = async (req, res) => {
    try {
      const amounts = await Amount.getListAmount();
      res.json(amounts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getAmountById = async (req, res) => {
    const { id } = req.params;
    try {
      const results = await Amount.getAmountById(id);
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.updateAmount = async (req, res) => {
    try {
      const {
        id,
        amount,
        amount_vip
      } = req.body;
  
      const results = await Amount.updateAmount(
        id,
        amount,
        amount_vip,
      );
  
      res.json({
        success: true,
        data: {
          message: 'Cập nhật giá vé thành công',
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };