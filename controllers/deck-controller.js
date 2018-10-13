const Decks = require('../models/Decks');
const deckController = {};

deckController.index = (req, res, next) => {
  Decks.findAll(req.user.id)
    .then(decks => {
      let message = 'ok'
      let response = decks
      if(!decks || decks.length < 1 || decks === null) {
        message = '0 results',
        response = []
      }
      res.json({
        message: message,
        decks: response,
      });
    }).catch(next)
};

deckController.show = (req, res, next) => {
  Decks.findById(req.params.id)
    .then(deck => {
      let message = 'ok'
      if(!deck || deck.length < 1 || deck === null) {
        message = '0 results'
      }
      res.json({
        message: message,
        deck: { deck },
      });
    }).catch(next);
};

deckController.create = (req, res, next) => {
  Decks.create({
    name: req.body.name,
    type: req.body.type,
    cards: req.body.cards,
    user_id: req.user.id
  }).then(deck => {
    res.json({
      message: 'Deck created',
      deck: deck
    });
  }).catch(next)
}

deckController.edit = (req, res, next) => {
  Decks.edit({
    name: req.body.name,
    cards: req.body.cards
  }, req.user.id).then(deck => {
    res.json({
      message: 'Deck updated',
      deck: deck
    })
  }).catch(next)
}

deckController.destroy = (req, res, next) => {
  Decks.destroy(req.params.id)
  .then(deck => {
    res.json({
      message: 'Deck Deleted',
      deck: deck
    })
  }).catch(next)
};

module.exports = deckController;
