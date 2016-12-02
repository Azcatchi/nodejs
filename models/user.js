// Création des constantes
const db = require('sqlite')
const bcrypt = require('bcryptjs');

// Création de la variable
var User = function () {
    this.firstname = "";
    this.email = "";
    this.pseudo = "";
    this.password = "";
    this.createdAt = "";
}


// Création des fonctions
User.insert = function(params) {
  var hash = bcrypt.hashSync(params.password);
  return db.run(
    'INSERT INTO users (firstname, email, pseudo, password, createdAt) VALUES (?, ?, ?, ?, ?)',
    params.firstname,
    params.email,
    params.pseudo,
    hash,
    Date.now()
  )
}

User.update =  function(userId, params) {

  const POSSIBLE_KEYS = [ 'firstname', 'email', 'pseudo', 'password' ]
  let dbArgs = []
  let queryArgs = []

  for (key in params) {
    if (-1 !== POSSIBLE_KEYS.indexOf(key)) {
      queryArgs.push(`${key} = ?`)
      dbArgs.push(params[key])
    }
  }

  if (!queryArgs.length) {
    let err = new Error('Bad request')
    err.status = 400
    return Promise.reject(err)
  }

  dbArgs.push(userId)
  let query = 'UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?'
  
  return db.run(query, dbArgs).then((stmt) => {
    if (stmt.changes === 0) {
      let err = new Error('Not Found')
      err.status = 404
      return Promise.reject(err)
    }
    return stmt
  })
}

User.getAll = function() => {
  return db.all('SELECT rowid, * FROM users')
}

User.get = function(userId) {
  return db.get('SELECT rowid, * FROM users WHERE rowid = ?', userId)
}

User.remove = function(userId) {
  return db.run('DELETE FROM users WHERE rowid = ?', userId)
}

User.count = function() {
  return db.get('SELECT COUNT(*) as count FROM users')
}

module.exports = User;
