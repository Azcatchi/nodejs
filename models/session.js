// Création des constantes
const db = require('sqlite')
const crypto = require('crypto')

// Création de la variable
var Session = function () {
    this.userId = "";
    this.accessToken = "";
    this.createdAt = "";
    this.expiresAt = "";
}

// Création d'un nouveau token
var NewToken = function() {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(48, function(err, buffer) {
			token = buffer.toString('hex');
			resolve(token)
		})
	})
}

// Création des fonctions
Session.insert = function(params) {
  var hash = bcrypt.hashSync(params.password);
  var token = "";
  token = NewToken();
  return db.run(
    'INSERT INTO session (userId, accessToken, createdAt, expiresAt) VALUES (?, ?, ?, ?)',
    userId,
    token,
    Date.now(),
    Date.now()
  )
}

Session.getAll = function() => {
  return db.all('SELECT rowid, * FROM session')
}

module.exports = Session;
