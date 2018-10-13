const express = require('express');
const epicRoutes = express.Router();

const epicController = require('../controllers/epic-controller');

epicRoutes.get('/', epicController.index);
epicRoutes.get('/:id', epicController.show);

module.exports = epicRoutes;
