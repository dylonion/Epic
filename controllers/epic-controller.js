const Epic = require('../models/Epic');
const epicController = {};

epicController.index = (req, res, next) => {
  Epic.findAll()
    .then(cards => {
      let message = 'ok'
      if(!cards || cards.length < 1 || cards === null) {
        message = '0 results'
      }
      res.json({
        message: message,
        cards: { cards },
      });
    }).catch(next)
};

epicController.draft = (req, res, next) => {
  Epic.draft(req.body.cardList)
  .then(cards => {
    res.json({
      message: 'ok',
      cards: cards
    })
  })
}

epicController.show = (req, res, next) => {
  Epic.findById(req.params.id)
    .then(card => {
      let message = 'ok'
      if(!card || card.length < 1 || card === null) {
        message = '0 results'
      }
      res.json({
        message: message,
        cards: { card },
      });
    }).catch(next);
};

module.exports = epicController;
