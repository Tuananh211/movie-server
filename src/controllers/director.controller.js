const Director = require('../models/director.model');
const connection = require('../databases');

  exports.getListDirector = async (req, res) => {
    try {
      const actors = await Director.getListDirectors();
      res.json(actors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  exports.getDirectorById = async (req, res) => {
    const { id } = req.params;
    try {
      const results = await Director.getDirectorById(id);
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.createDirector = async (req, res) => {
    const {
      name,
      image,
    } = req.body;
    try {
      const results = await Director.createDirector(
        name,
        image,
      );
      res.json({
        success: true,
        data: {
          message: 'Thêm mới đạo diễn thành công',
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.updateDirector = async (req, res) => {
    try {
      const {
        id,
        name,
        image
      } = req.body;
  
      const results = await Director.updateDirector(
        id,
        name,
        image,
      );
  
      res.json({
        success: true,
        data: {
          message: 'Cập nhật đạo diễn thành công',
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
//   exports.deleteActor = async (req, res) => {
//     try {
//       const { id } = req.body;
//       const results = await Movie.delete(id);
  
//       res.json({
//         success: true,
//         data: {
//           message: 'Xóa diễn viên thành công',
//         },
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };