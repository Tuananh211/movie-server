const Actor = require('../models/actor.model');
const connection = require('../databases');

exports.getListActors = async (req, res) => {
    try {
      const actors = await Actor.getListActors();
      res.json(actors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getActors = async (req, res) => {
    const {movieId} = req.params;
    try {
      const actors = await Actor.getActorByMovieID(movieId);
      res.json(actors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  exports.createActor = async (req, res) => {
    const {
      name,
      image,
    } = req.body;
    try {
      const results = await Movie.create(
        name,
        image,
      );
      res.json({
        success: true,
        data: {
          message: 'Thêm mới diễn viên thành công',
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.updateActor = async (req, res) => {
    try {
      const {
        id,
        name,
        image
      } = req.body;
  
      const results = await Movie.update(
        id,
        name,
        image,
      );
  
      res.json({
        success: true,
        data: {
          message: 'Cập nhật diễn viên thành công',
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.deleteActor = async (req, res) => {
    try {
      const { id } = req.body;
      const results = await Movie.delete(id);
  
      res.json({
        success: true,
        data: {
          message: 'Xóa diễn viên thành công',
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };