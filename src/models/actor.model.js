const connection = require('../databases');
class Actor {
    static async getListActors() {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT a.* FROM actor a',
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
      static async getActorByMovieID(movieId) {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT a.* FROM movie_actor ma  JOIN actor a on a.id=ma.actor_id  WHERE ma.movie_id=?',
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
      static async createActor(
        name,
        image
      ) {
        return new Promise((resolve, reject) => {
          connection.query(
            'INSERT INTO actor(name,image) VALUES(?,?)',
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
      static async updateActor(
        id,
        name,
        image,
      ) {
        return new Promise((resolve, reject) => {
          connection.query(
            'UPDATE actor SET name=?,image=? WHERE id=?',
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
      static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM movie_actor WHERE actor_id=?',
                [id],
                (err, results) => {
                  if (err) {
                    return reject(err);
                  }
        
                  connection.query(
                    'DELETE FROM actor WHERE id=?',
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
      
}
module.exports = Actor;