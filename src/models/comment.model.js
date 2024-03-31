const connection = require('../databases');


class Comments{

static async getComment(movie_id){
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT c.id,c.user_id as userId,c.movie_id as movieId,c.content,c.rate,c.create_at as createAt,u.fullName,u.avatar from comments c JOIN user u ON c.user_id=u.id where movie_id = ?',
            [movie_id],
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
static async getUserComment(movie_id,user_id){
  return new Promise((resolve, reject) => {
      connection.query(
          'SELECT c.id,c.user_id as userId,c.movie_id as movieId,c.content,c.rate,c.create_at as createAt,u.fullName,u.avatar from comments c JOIN user u ON c.user_id=u.id where movie_id = ? AND user_id =?',
          [movie_id,user_id],
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
static async create(
    user_id,
    movie_id,
    content,
    rate,
  ) {
    const create_at=new Date();
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO comments(user_id,movie_id,content,rate,create_at) VALUES(?,?,?,?,?)',
        [
          user_id,
          movie_id,
          content,
          rate,
          create_at
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          connection.query(
            'SELECT c.id,c.user_id as userId,c.movie_id as movieId,c.content,c.rate,c.create_at as createAt,u.fullName,u.avatar from comments c JOIN user u ON c.user_id=u.id where movie_id = ?',
            [movie_id],
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

  static async update(
    id,
    content,
    rate,
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE comments SET content= ?, rate =? WHERE id=?',
        [
          content,
          rate,
          id
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
            resolve(results);
        }
      );
    });
  }
  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM comments WHERE movie_id=?',
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


module.exports= Comments