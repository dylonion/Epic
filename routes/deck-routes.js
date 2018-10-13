const express = require('express');
const deckRoutes = express.Router();

const deckController = require('../controllers/deck-controller');

deckRoutes.get('/', deckController.index);
deckRoutes.get('/:id', deckController.show);
deckRoutes.post('/', deckController.create);
deckRoutes.put('/:id', deckController.edit);
deckRoutes.delete('/:id', deckController.destroy);

module.exports = deckRoutes;
