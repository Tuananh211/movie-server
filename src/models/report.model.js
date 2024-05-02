const connection = require('../databases');

class Report {
    static async getTotalUser() {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT user.role,COUNT(*) as totalAccount From user group by user.role',
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

    static async getTotalTicket() {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT  COUNT(*) as totalTicket, SUM(value) as totalValue From ticket where is_cancel = 0 AND is_success = 1',
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

    static async getReport(cinemaId, fromDate, toDate) {
        return new Promise((resolve, reject) => {
          const query = cinemaId
            ? `SELECT COALESCE(SUM(t.value), 0) as total_value, DATE_FORMAT(ticket.created_date, '%Y-%m') AS month_only
            FROM ticket
            LEFT JOIN schedule ON schedule.id = ticket.schedule_id
            LEFT JOIN ticket t on schedule.id = t.schedule_id AND t.is_cancel = 0 AND t.is_success = 1
            LEFT JOIN room ON schedule.room_id = room.id
            LEFT JOIN cinema ON room.cinema_id = cinema.id
            WHERE cinema.id = ?
            AND ticket.created_date BETWEEN ? AND ?
            GROUP BY month_only
            ORDER BY month_only`
            : `SELECT COALESCE(t.total_value, 0) AS total_value, ci.name AS cinema
            FROM cinema ci
            LEFT JOIN (
                SELECT r.cinema_id, COALESCE(SUM(t.value), 0) AS total_value
                FROM room r
                LEFT JOIN schedule sch ON r.id = sch.room_id
                LEFT JOIN ticket t ON sch.id = t.schedule_id AND t.is_cancel = 0 AND t.is_success = 1
                GROUP BY r.cinema_id
            ) t ON ci.id = t.cinema_id`;
          const params = cinemaId ? [cinemaId, fromDate, toDate] : [fromDate, toDate];
          connection.query(query, params, (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        });
      }
}

module.exports = Report;