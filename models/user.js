// Création des constantes
const db = require('sqlite')
const bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userModel = new Shema({
    firstname: String,
    email: String,
    pseudo: String,
    password: String,
    createdAt: Date
})

// Création du User
var User = mongoose.model('User', userModel)


// Création des fonctions
User.insert = function(params) {
  return new Promise((resolve, reject) => {
    User = new User({
      firstname: params.firstname,
      email: params.email,
      pseudo: params.pseudo,
      password: params.password,
      createdAt: Date.now()
    })
    User.save(function(err){
			if(err){
				reject(err);
			}
			resolve(true);
		})
  })
}

User.update =  function(userId, params) {
  return new Promise((resolve, reject) => {
    User = new User({
      firstname: params.firstname,
      email: params.email,
      pseudo: params.pseudo,
      password: params.password,
      createdAt: Date.now()
    })
    User.save(function(err){
			if(err){
				reject(err);
			}
			resolve(true);
		})
  })
}

User.getAll = function() => {
  User.find({}, function(err, users) {
    if (err) throw err;
    return users;
  });

User.get = function(userId) {

  User.findById(userId, function(err, user) {
    if (err) throw err;

    // show the one user
    return user;
  });
}

User.remove = function(userId) {

  User.findByIdAndRemove(userId, function(err) {
  if (err) throw err;

});
}


module.exports = User;
