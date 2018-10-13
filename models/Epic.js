const db = require('../db/config');

const Epic = {};

Epic.findAll = () => {
  return db.query(`
    SELECT * FROM cards
    WHERE class != 'dragon'
  `);
};

Epic.draft = (cardlist) => {
  let cards = "{"+cardlist.toString()+"}";
  console.log(cards);
  return db.query(`
    SELECT * from cards
    WHERE id !=all($1)
  `,cards)
}

Epic.findById = (id) => {
  return db.oneOrNone(`
    SELECT * FROM cards
    WHERE id = $1
 `, [id]);
};

module.exports = Epic;
