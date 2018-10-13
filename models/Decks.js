const db = require('../db/config');

const Decks = {};

Decks.findAll = (user_id) => {
  return db.query(`
    SELECT name, type FROM decks
    WHERE user_id = $1
  `, [user_id]);
};

Decks.findById = (id) => {
  return db.oneOrNone(`
    SELECT * FROM decks
    WHERE id = $1
 `, [id]);
};

module.exports = Decks;
