const connection = require('../databases');
class Emp {
  static async getEmps() {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT u.*,c.name as cinema_name FROM user u JOIN cinema c ON c.id = u.cinema_id WHERE role="EMP"',
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
  static async getListEmpsOfCinema(cinema_id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT u.*,c.name as cinema_name FROM user u JOIN cinema c ON c.id = u.cinema_id WHERE role="EMP" AND cinema_id=?',
        [cinema_id],
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

  static async getManagers() {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT u.*,c.name as cinema_name FROM user u JOIN cinema c ON c.id = u.cinema_id WHERE role="MAN"',
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
  static async getUsers() {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE role="USER"',
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
  static async createEmp(fullName, address, email, password,role,cinema_id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO user(fullName,address,email,password,role,isVerify,cinema_id) VALUES(?,?,?,?,?,"1",?)',
        [fullName, address, email, password,role,cinema_id],
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

  static async createManager(fullName, address, email, password,cinema_id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO user(fullName,address,email,password,role,isVerify,cinema_id) VALUES(?,?,?,?,"MAN","1",?)',
        [fullName, address, email, password,cinema_id],
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
  static async createUser(fullName, address, email, password) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO user(fullName,address,email,password,role,isVerify) VALUES(?,?,?,?,"USER","1")',
        [fullName, address, email, password],
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

  static async getEmpById(empId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT fullName,address,email,password,cinema_id,role from user WHERE id=?',
        [empId],
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

  static async findEmpByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT email from user WHERE email=?',
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

  static async update(fullName, address, email, password, id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET fullName=?,address=?,email=?,password=? WHERE id=?',
        [fullName, address, email, password, id],
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

  static async updateEmp(fullName, address, email, password,role,cinema_id, id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET fullName=?,address=?,email=?,password=?,role=?,cinema_id=? WHERE id=?',
        [fullName, address, email, password,role,cinema_id, id],
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

  static async lockEmp(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET isLock=1 WHERE id=?',
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
  static async unLockEmp(userId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET isLock=0 WHERE id=?',
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

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM user WHERE id=?', [id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async deleteUser(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM comment WHERE user_id=?', [id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        connection.query(
                'DELETE FROM user WHERE id=?',
                [id],
                (err, results) => {
                  if (err) {
                    return reject(err);
                  }
  
                  resolve(results);
                }
              );
      });
    });
  }
}

module.exports = Emp;
