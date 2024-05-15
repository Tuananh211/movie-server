const connection = require('../databases');
class Amount {
    static async getListAmount() {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT a.id,a.amount,a.amount_vip FROM amount a',
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

      static async getAmountById(id) {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT a.id,a.amount,a.amount_vip FROM amount a where a.id=?',
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

      static async updateAmount(
        id,
        amount,
        amount_vip,
      ) {
        return new Promise((resolve, reject) => {
          connection.query(
            'UPDATE amount SET amount=?,amount_vip=? WHERE id=?',
            [
              amount,
              amount_vip,
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
}
module.exports = Amount;