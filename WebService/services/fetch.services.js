const connection = require("./dbconn");

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to mySQL");
});

const FetchService = {
  getAllData: async (tableName1, tableName2) => {
    return new Promise((resolve, reject) => {
      const sql = `
                SELECT 
                    a.ACT_ID, 
                    a.Activity_Name, 
                    a.Description_ACT, 
                    a.DATE_MADE, 
                    a.Place, 
                    a.Picture, 
                    a.Pin, 
                    t.Type_Name
                FROM ?? a
                JOIN ?? t ON a.Type_ID = t.Type_ID`;

      connection.query(sql, [tableName1, tableName2], (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  getDataById: async (tableName1,tableName2, id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
            a.ACT_ID, 
            a.Activity_Name, 
            a.Description_ACT, 
            a.DATE_MADE, 
            a.Place, 
            a.Picture, 
            a.Pin, 
            t.Type_Name
        FROM ?? a
        JOIN ?? t ON a.Type_ID = t.Type_ID
        WHERE a.ACT_ID = ?`;
      connection.query(sql, [tableName1,tableName2, id], (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return reject(err);
        }
        resolve(results.length ? results[0] : null);
      });
    });
  },
};

module.exports = FetchService;
