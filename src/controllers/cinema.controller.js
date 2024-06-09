const connection = require('../databases');
const Cinema = require('../models/cinema.model');

exports.getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.getCinemas();
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getCinemasByMovieId = async (req, res) => {
  const { movieId } = req.params;
  try {
    const cinemas = await Cinema.getCinemasByMovieId(movieId);
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getCinemaById = async (req, res) => {
  const { cinemaId } = req.params;
  try {
    const results = await Cinema.getCinemaById(cinemaId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getCinemaById2 = async (req, res) => {
  const { cinemaId } = req.params;
  try {
    const results = await Cinema.getCinemaById2(cinemaId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createCinema = async (req, res) => {
  const { name, address,cityId,phone,urlImage } = req.body;
  try {
    const cinemaResult = await Cinema.findCinemaByName(name, address);
    if (cinemaResult.length > 0) {
      res.json({
        success: false,
        data: {
          message: 'Tên rạp không được trùng nhau',
        },
      });
      return;
    }
    const results = await Cinema.createCinema(name, address,cityId,phone,urlImage);
    res.json({
      success: true,
      data: {
        message: 'Thêm rạp thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCinema = async (req, res) => {
  try {
    const { id, name, address,phone,urlImage } = req.body;
    const cinemaResult = await Cinema.findCinemaByName(name, address);
    if (cinemaResult.length > 0 && cinemaResult[0].id != id) {
      res.json({
        success: false,
        data: {
          message: 'Tên rạp không được trùng nhau',
        },
      });
      return;
    }

    const results = await Cinema.update(id, name, address,phone,urlImage);
    res.json({
      success: true,
      data: {
        message: 'Cập nhật rạp thành công',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCinema = async (req, res) => {
  try {
    const { id } = req.body;
    const results = await Cinema.deleteCinema(id);
    res.json({
      success: true,
      data: {
        message: 'Xóa rạp thành công',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await Cinema.getCities();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getRoomsByCinemaId = async (req, res) => {
  const { cinemaId } = req.params;
  try {
    const rooms = await Cinema.getRoomsByCinemaId(cinemaId);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCinemaByCityId = async (req, res) => {
  const { cityId } = req.params;
  try {
    const cinemas = await Cinema.getCinemaByCityId(cityId);
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCinemaByRoomId = async (req, res) => {
  const { roomId } = req.params;
  try {
    const cinemas = await Cinema.getCinemaByRoomId(roomId);
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addRoom = async (req, res) => {
  const { roomName, cinemaId } = req.body;
  try {
    const roomResult = await Cinema.findRoomByName(roomName, cinemaId);

    if (roomResult.length > 0) {
      res.json({
        success: false,
        data: {
          message: 'Tên phòng không được trùng nhau',
        },
      });
      return;
    }

    const results = await Cinema.addRoom(roomName, cinemaId);
    res.json({
      success: true,
      data: {
        message: 'Thêm phòng thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
