const connection = require('../databases');

class User {
  static async findByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE email=? AND password=? AND is_active=1',
        [email, password],
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
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE email=?',
        [email],
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
  static async findByEmailAdmin(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE email=? AND (role="ADMIN" OR role="MAN" OR role="EMP")',
        [email],
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
  static async findById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE id=? AND is_active =1',
        [id],
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

  static async confirmPassword(email, newPassword) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET password = ? WHERE email=? AND is_active=1',
        [newPassword, email],
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
  static async verifyEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET isVerify = '1' WHERE email=? AND is_active=1",
        [email],
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

  static async create(fullName, email, password, address, dob, gender) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO user (fullName,email,password,address,dateOfBirth,role,gender) VALUES(?,?,?,?,?,?,?)',
        [fullName, email, password, address, dob, 'USER', gender],
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

  static async getMyInformation(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT user.id,user.fullName,user.role,user.email,user.address,user.gender,user.dateOfBirth,user.avatar,user.cinema_id as cinemaId FROM user WHERE id=? AND is_active=1',
        [userId],
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

  static async updateMyInformation(
    name,
    dateOfBirth,
    address,
    avatar,
    gender,
    userId
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET fullName=?,dateOfBirth=?,address=?,avatar=?,gender=? WHERE id=? AND is_active=1',
        [name, dateOfBirth, address, avatar, gender, userId],
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

  static async changePassword(password, userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET password=? WHERE id=? AND is_active=1',
        [password, userId],
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

  static async getMyTickets(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT ticket.id,ticket.value,ticket.created_date,ticket.code,ticket.status,ticket.is_cancel,ticket_detail.chair_id,chair.xPosition,cinema.name as cinema, chair.yPosition,schedule.premiere,room.name as room,movie.name as movie,product.name as product_name,ticket_product.quantity as product_quantity,product.id as product_id FROM ticket JOIN ticket_detail ON ticket_detail.ticket_id=ticket.id JOIN schedule ON schedule.id=ticket.schedule_id JOIN room ON room.id=schedule.room_id JOIN movie ON movie.id=schedule.movie_id JOIN chair ON chair.id=ticket_detail.chair_id JOIN cinema ON cinema.id=room.cinema_id LEFT JOIN ticket_product ON ticket_product.ticket_id=ticket.id LEFT JOIN product on ticket_product.product_id=product.id WHERE user_id=? AND is_success = 1',
        [userId],
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
  static async getMyTicketsOfMovie(userId,movieId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT ticket.id,ticket.value,ticket.created_date,ticket.code,ticket.status,ticket.is_cancel,ticket_detail.chair_id,chair.xPosition,cinema.name as cinema, chair.yPosition,schedule.premiere,room.name as room,movie.name as movie,product.name as product_name,ticket_product.quantity as product_quantity,product.id as product_id FROM ticket JOIN ticket_detail ON ticket_detail.ticket_id=ticket.id JOIN schedule ON schedule.id=ticket.schedule_id JOIN room ON room.id=schedule.room_id JOIN movie ON movie.id=schedule.movie_id JOIN chair ON chair.id=ticket_detail.chair_id JOIN cinema ON cinema.id=room.cinema_id LEFT JOIN ticket_product ON ticket_product.ticket_id=ticket.id LEFT JOIN product on ticket_product.product_id=product.id WHERE user_id=? AND is_success = 1 AND movie.id=?',
        [userId,movieId],
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
}

module.exports = User;
