// Création des constantes
const db = require('sqlite')

// Création de la variable
var Todo = function () {
    this.userId = "";
    this.message = "";
    this.team = "";
    this.status = "";
    this.priorite = "";
    this.createdBy = "";
    this.createdAt = "";
}

// Création des fonctions
Todo.insert = function(params) {
  var hash = bcrypt.hashSync(params.password);
  return db.run(
    'INSERT INTO todo (userId, message, team, status, priorite, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    params.firstname,
    params.email,
    params.pseudo,
    hash,
    Date.now()
  )
}

Todo.update =  function(userId, params) {

  const POSSIBLE_KEYS = [ 'userId', 'message', 'team', 'status', 'priorite' ]
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
  let query = 'UPDATE todo SET ' + queryArgs.join(', ') + ' WHERE rowid = ?'

  return db.run(query, dbArgs).then((stmt) => {
    if (stmt.changes === 0) {
      let err = new Error('Not Found')
      err.status = 404
      return Promise.reject(err)
    }
    return stmt
  })
}

// Todo.getAll = function() => {
//   return db.all('SELECT rowid, * FROM users')
// }

Todo.get = function(userId) {
  return db.get('SELECT rowid, * FROM todo WHERE rowid = ?', userId)
}

Todo.remove = function(userId) {
  return db.run('DELETE FROM todo WHERE rowid = ?', userId)
}

Todo.count = function() {
  return db.get('SELECT COUNT(*) as count FROM todo')
}

Todo.countByUser = function(userId) {
  return db.get('SELECT COUNT(*) as count FROM todo WHERE rowid = ?', userId)
}

module.exports = Todo;
