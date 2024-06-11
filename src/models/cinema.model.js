const connection = require('../databases');
class Cinema {
  static async getCinemas() {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT cinema.id,cinema.name,city.name as city,cinema.address,cinema.phone,cinema.urlImage FROM cinema JOIN city ON cinema.city_id=city.id WHERE cinema.is_delete=0',
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
        'SELECT cinema.id,cinema.name,city.id as city_id,city.name as city FROM cinema JOIN city ON cinema.city_id=city.id where cinema.id=? and cinema.is_delete=0',
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
        'SELECT cinema.*,city.id as city_id,city.name as city FROM cinema JOIN city ON cinema.city_id=city.id where cinema.id=? AND cinema.is_delete=0',
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

  static createCinema(name, address,cityId,phone,urlImage) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO cinema(name,address,city_id,phone,urlImage) VALUES(?,?,?,?,?)',
        [name, address,cityId,phone,urlImage],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static update(id, name, address,phone,urlImage) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE cinema SET name=?,address=?,phone=?,urlImage=? WHERE id=?',
        [name, address,phone,urlImage, id],
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
        'UPDATE room SET is_delete=1  WHERE cinema_id=?',
        [id],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          connection.query(
            'UPDATE  cinema SET is_delete=1  WHERE id=?',
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
        'SELECT * FROM room WHERE cinema_id=? AND is_delete=0',
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
        'SELECT * FROM cinema WHERE city_id=? and is_delete=0',
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
        'SELECT id,name FROM cinema WHERE name=? AND city_id=1 AND address= ? AND is_delete =0',
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
        'SELECT name FROM room WHERE name= ? AND cinema_id=? AND is_delete=0 ',
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

  static async updateRoom(roomName, roomId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE room SET name= ? where id = ?',
        [roomName, roomId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static deleteRoom(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE  room  SET is_delete=1 WHERE id=?',
        [id],
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
