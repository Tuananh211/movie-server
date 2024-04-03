const connection = require('../databases');
class Movie {
  static async getMovies() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT m.id, m.name, m.description, d.name AS director, d.image AS imageDirector, m.image, m.view, m.ageLimit, m.timeRelease, m.time, m.primaryThumbnail AS trailer, l.name AS language, f.name AS format, IFNULL(AVG(rate), '0') AS rate 
        FROM movie m 
        JOIN language l ON m.language_id = l.id 
        JOIN format f ON f.id = m.format_id 
        JOIN director d ON d.id = m.director 
        LEFT JOIN comments c ON m.id = c.movie_id
        GROUP BY m.id, m.name, m.description, d.name, d.image, m.image, m.view, m.ageLimit, m.timeRelease, m.time, m.primaryThumbnail, l.name, f.name
        ORDER BY rate DESC`,
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
  static async getMoviesHasSchedule(cinemaId, day) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                m.id,
                m.name,
                m.description,
                d.name AS director,
                d.image AS imageDirector,
                m.image,
                m.view,
                m.ageLimit,
                m.timeRelease,
                m.time,
                m.primaryThumbnail AS trailer,
                l.name AS language,
                f.name AS format,
                sh.id AS schedule_id,
                sh.premiere AS schedule_premiere,
                sh.room_id AS room_id,
                sh.movie_id AS movie_id,
                room.name AS room,
                IFNULL(AVG(c.rate), '0') AS rate 
            FROM 
                movie m 
                JOIN language l ON m.language_id = l.id 
                JOIN format f ON f.id = m.format_id 
                JOIN director d ON d.id = m.director 
                JOIN movie_category mv ON m.id = mv.movie_id 
                JOIN schedule sh ON sh.movie_id = m.id 
                JOIN room ON room.id = sh.room_id
                LEFT JOIN comments c ON m.id = c.movie_id
            WHERE 
                room.cinema_id = ? AND DATE(sh.premiere) = ? AND sh.premiere >= CURRENT_TIMESTAMP()
            GROUP BY
                m.id, sh.id 
            ORDER BY 
                sh.premiere ASC, rate DESC`,
            [cinemaId, day],
            (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const movies = {};
                
                // Iterate over each row in the results
                results.forEach(row => {
                    // If the movie doesn't exist in the movies object, create a new movie object
                    if (!movies[row.id]) {
                        movies[row.id] = {
                            id: row.id,
                            name: row.name,
                            description: row.description,
                            director: row.director,
                            imageDirector: row.imageDirector,
                            image: row.image,
                            view: row.view,
                            ageLimit: row.ageLimit,
                            timeRelease: row.timeRelease,
                            time: row.time,
                            trailer: row.trailer,
                            language: row.language,
                            format: row.format,
                            rate: row.rate, // Lưu giá trị rate
                            listSchedule: [] // Initialize an empty array to store schedules
                        };
                    }
                    
                    // Push the schedule of the current row to the listSchedule array of the current movie
                    movies[row.id].listSchedule.push({
                        id: row.schedule_id,
                        room_id: row.room_id,
                        movie_id: row.movie_id,
                        premiere: row.schedule_premiere,
                        room_name: row.room
                    });
                });

                // Convert the movies object to an array
                const moviesArray = Object.values(movies);

                resolve(moviesArray);
            }
        );
    });
}

static async getMoviesByCategoryId(categoryId) {
  return new Promise((resolve, reject) => {
      connection.query(
          `SELECT 
              m.id,
              m.name,
              m.description,
              d.name AS director,
              d.image AS imageDirector,
              m.image,
              m.view,
              m.ageLimit,
              m.timeRelease,
              m.time,
              m.primaryThumbnail AS trailer,
              l.name AS language,
              f.name AS format,
              IFNULL(AVG(c.rate), '0') AS rate
          FROM 
              movie m 
              JOIN language l ON m.language_id = l.id 
              JOIN format f ON f.id = m.format_id 
              JOIN director d ON d.id = m.director 
              JOIN movie_category mv ON m.id = mv.movie_id 
              LEFT JOIN comments c ON m.id = c.movie_id
          WHERE 
              mv.category_id = ?
          GROUP BY
              m.id
          ORDER BY rate DESC
          `,
          [categoryId],
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

static async getMoviesByName(nameMovie) {
  return new Promise((resolve, reject) => {
      connection.query(
          `SELECT 
              m.id,
              m.name,
              m.description,
              d.name AS director,
              d.image AS imageDirector,
              m.image,
              m.view,
              m.ageLimit,
              m.timeRelease,
              m.time,
              m.primaryThumbnail AS trailer,
              l.name AS language,
              f.name AS format,
              IFNULL(AVG(c.rate), 0) AS rate
          FROM 
              movie m 
              JOIN language l ON m.language_id = l.id 
              JOIN format f ON f.id = m.format_id 
              JOIN director d ON d.id = m.director 
              LEFT JOIN comments c ON m.id = c.movie_id
          WHERE 
              LOWER(m.name) LIKE LOWER(?)
          GROUP BY
              m.id, m.name, m.description, d.name, d.image, m.image, m.view, m.ageLimit, m.timeRelease, m.time, m.primaryThumbnail, l.name, f.name
          ORDER BY rate DESC
              `, // Sử dụng GROUP BY để nhóm kết quả theo id của bộ phim và tính trung bình rate
          ['%' + nameMovie + '%'],
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
  static async getCategoriesByMovieId(movieId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT c.id,c.name FROM movie_category m  JOIN category c on c.id=m.category_id  WHERE movie_id=?',
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
  static async getMovieById(movieId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT movie.*,language.name as language,format.name as format,country.name as country FROM movie JOIN language ON movie.language_id=language.id JOIN format on format.id=movie.format_id JOIN country ON country.id=movie.country_id WHERE movie.id=?',
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
  static async getCategories() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM category', (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  }
  static async getLanguages() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM language', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
  static async getFormats() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM format', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
  static async getCountries() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM country', (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }
  static async create(
    name,
    director,
    description,
    image,
    countryId,
    languageId,
    view,
    ageLimit,
    timeRelease,
    time,
    formatId,
    categoryId,
    primaryThumbnail
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO movie(name,director,description,image,country_id,language_id,view,ageLimit,timeRelease,time,format_id,primaryThumbnail) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          name,
          director,
          description,
          image,
          countryId,
          languageId,
          view || 0,
          ageLimit,
          timeRelease,
          time,
          formatId,
          primaryThumbnail,
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          connection.query(
            'INSERT INTO movie_category(movie_id,category_id) VALUES(?,?)',
            [results.insertId, categoryId],
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
    name,
    director,
    description,
    image,
    countryId,
    languageId,
    view,
    ageLimit,
    timeRelease,
    time,
    formatId,
    categoryId
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE movie SET name=?,director=?,description=?,image=?,country_id=?,language_id=?,view=?,ageLimit=?,timeRelease=?,time=?,format_id=? WHERE id=?',
        [
          name,
          director,
          description,
          image,
          countryId,
          languageId,
          view,
          ageLimit,
          timeRelease,
          time,
          formatId,
          id,
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }

          connection.query(
            'UPDATE movie_category SET category_id=? WHERE movie_id=?',
            [categoryId, id],
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
  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM movie_category WHERE movie_id=?',
        [id],
        (err, results) => {
          if (err) {
            return reject(err);
          }

          connection.query(
            'DELETE FROM movie WHERE id=?',
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

module.exports = Movie;
