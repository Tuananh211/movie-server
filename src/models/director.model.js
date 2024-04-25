const connection = require('../databases');
class Director {
    static async getListDirectors() {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT d.* FROM director d',
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
    
      static async getDirectorById(id) {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT d.* FROM director d where d.id = ?',
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

      static async createDirector(
        name,
        image
      ) {
        return new Promise((resolve, reject) => {
          connection.query(
            'INSERT INTO director(name,image) VALUES(?,?)',
            [
              name,
              image
            ],
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
      static async updateDirector(
        id,
        name,
        image,
      ) {
        return new Promise((resolve, reject) => {
          connection.query(
            'UPDATE director SET name=?,image=? WHERE id=?',
            [
              name,
              image,
              id,
            ],
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
    //   static async delete(id) {
    //     return new Promise((resolve, reject) => {
    //         connection.query(
    //             'DELETE FROM movie_actor WHERE actor_id=?',
    //             [id],
    //             (err, results) => {
    //               if (err) {
    //                 return reject(err);
    //               }
        
    //               connection.query(
    //                 'DELETE FROM actor WHERE id=?',
    //                 [id],
    //                 (err, results) => {
    //                   if (err) {
    //                     return reject(err);
    //                   }
        
    //                   resolve(results);
    //                 }
    //               );
    //             }
    //           );
    //     });
    //   }
      
}
module.exports = Director;