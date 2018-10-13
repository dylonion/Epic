const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const usersController = {};

usersController.create = (req, res, next) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  console.log(`username: ${req.body.username} email: ${req.body.email} password: ${hash}`)
  User.create({
    username: req.body.username,
    email: req.body.email,
    password_digest: hash,
  }).then(user => {
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json({
        message: 'user successfully created',
        auth: true,
        data: {
          user,
        }
      })
    });
  })
  .catch(next);
}

usersController.destroy = (req, res, next) => {
  if(req.user.id){
    User.destroy(req.user.id)
    .then(user => {
      res.status(200).json({
        message: 'user successfully deleted',
        auth: false,
        data: {
          user
        }
      })
    })
    .catch(next)
  }
}

module.exports = usersController;
