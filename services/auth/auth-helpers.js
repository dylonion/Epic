const bcrypt = require('bcryptjs');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function genUrl(req, res, next) {
  res.locals.newRoom = bcrypt.genSaltSync()
  next()
}

module.exports = {
  comparePass,
  genUrl
}
