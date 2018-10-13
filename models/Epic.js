const db = require('../db/config');

const Epic = {};

Epic.findAll = () => {
  return db.query(`
    SELECT * FROM cards
    WHERE class != 'dragon'
  `);
};

Epic.findById = (id) => {
  return db.oneOrNone(`
    SELECT * FROM cards
    WHERE id = $1
 `, [id]);
};

module.exports = Epic;
