const connection = require('../databases');
class Cinema {
  static async getCinemas() {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT cinema.id,cinema.name,city.name as city,cinema.address,cinema.phone,cinema.urlImage FROM cinema JOIN city ON cinema.city_id=city.id',
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }
  static async getCinemasByMovieId(movieId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT DISTINCT cinema.id,cinema.name,city.name as city FROM cinema JOIN city ON cinema.city_id=city.id join room r on r.cinema_id= cinema.id join schedule sh on sh.room_id=r.id where sh.movie_id = ? AND sh.premiere >= CURRENT_TIMESTAMP()',
        [movieId],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  static async getCinemaById(cinemaId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT cinema.id,cinema.name,city.id as city_id,city.name as city FROM cinema JOIN city ON cinema.city_id=city.id where cinema.id=?',
        [cinemaId],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  static async getCinemaById2(cinemaId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT cinema.*,city.id as city_id,city.name as city FROM cinema JOIN city ON cinema.city_id=city.id where cinema.id=?',
        [cinemaId],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  static createCinema(name, address) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO cinema(name,address) VALUES(?,?)',
        [name, address],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static update(id, name, address) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE cinema SET name=?,address=? WHERE id=?',
        [name, address, id],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
  }

  static deleteCinema(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM room  WHERE cinema_id=?',
        [id],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          connection.query(
            'DELETE FROM cinema  WHERE id=?',
            [id],
            (err, results) => {
              if (err) {
                return reject(err);
              }
              resolve(results);
            }
          );
        }
      );
    });
  }

  static async getCities() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM city where name = "Hà Nội"', (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static async getRoomsByCinemaId(cinemaId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room WHERE cinema_id=?',
        [cinemaId],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static async getCinemaByCityId(cityId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM cinema WHERE city_id=?',
        [cityId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static async findCinemaByName(name, address) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT name FROM cinema WHERE name=? AND city_id=1 AND address= ?',
        [name, address],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static async getCinemaByRoomId(roomId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room WHERE id=?',
        [roomId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static async addRoom(roomName, cinemaId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO room(name,cinema_id) VALUES(?,?)',
        [roomName, cinemaId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static async findRoomByName(roomName, cinemaId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT name FROM room WHERE name= ? AND cinema_id=?',
        [roomName, cinemaId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }
}
module.exports = Cinema;
