const connection = require("./dbconn");

const extractExternalLink = (description) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = description.match(urlRegex);
  if (match) {
    const externalLink = match[0];
    const updatedDescription = description.replace(externalLink, "").trim();
    return { externalLink, updatedDescription };
  }
  return { externalLink: null, updatedDescription: description };
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};
const FetchService = {
  getAllData: async (tableName1, tableName2) => {
    try {
      const sql = `
        SELECT 
            a.ACT_ID AS id, 
            a.ACT_Name AS title, 
            a.ACT_Desc AS description, 
            a.DATE_MADE AS date, 
            a.Place AS location, 
            a.Cover_Picture AS coverImage, 
            a.Pin AS pin,
            a.Advisor AS lecturer,
            t.Type_Name AS category,
            i.Image_Path AS imagePath
        FROM ${tableName1} a
        JOIN ${tableName2} t ON a.Type_ID = t.Type_ID
        LEFT JOIN Activity_Images i ON a.ACT_ID = i.ACT_ID
        ORDER BY a.ACT_ID ASC`; // Add ORDER BY clause

      const [results] = await connection.execute(sql);

      const data = results.reduce((acc, result) => {
        const { externalLink, updatedDescription } = extractExternalLink(result.description);
        const existingEntry = acc.find(item => item.id === result.id);
        if (existingEntry) {
          existingEntry.images.push(result.imagePath);
        } else {
          const { imagePath, ...rest } = result; // Exclude imagePath from the result object
          acc.push({
            ...rest,
            date: formatDate(result.date),
            description: updatedDescription,
            externalLink,
            images: imagePath ? [imagePath] : [],
          });
        }
        return acc;
      }, []);
      return data;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  getDataById: async (tableName1, tableName2, id) => {
    try {
      const sql = `
        SELECT 
            a.ACT_ID AS id, 
            a.ACT_Name AS title, 
            a.ACT_Desc AS description, 
            a.DATE_MADE AS date, 
            a.Place AS location, 
            a.Cover_Picture AS coverImage, 
            a.Pin AS pin,
            a.Advisor AS lecturer,
            t.Type_Name AS category,
            i.Image_Path AS imagePath
        FROM ${tableName1} a
        JOIN ${tableName2} t ON a.Type_ID = t.Type_ID
        LEFT JOIN Activity_Images i ON a.ACT_ID = i.ACT_ID
        WHERE a.ACT_ID = ?`;

      const [results] = await connection.execute(sql, [id]);

      if (results.length) {
        const { externalLink, updatedDescription } = extractExternalLink(results[0].description);
        const data = results.reduce((acc, result) => {
          if (!acc) {
            const { imagePath, ...rest } = result; // Exclude imagePath from the result object
            acc = {
              ...rest,
              date: formatDate(result.date),
              description: updatedDescription,
              externalLink,
              images: imagePath ? [imagePath] : [],
            };
          } else {
            acc.images.push(result.imagePath);
          }
          return acc;
        }, null);
        return data;
      }
      return null;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },
};

module.exports = FetchService;
