const Epic = require('../models/Epic');
const epicController = {};

epicController.index = (req, res, next) => {
  Epic.findAll()
    .then(cards => {
      res.json({
        message: 'ok',
        cards: { cards },
      });
    }).catch(next)
};

epicController.show = (req, res, next) => {
  Epic.findById(req.params.id)
    .then(card => {
      res.json({
        message: 'ok',
        cards: { card },
      });
    }).catch(next);
};

module.exports = epicController;
