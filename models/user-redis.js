const db = require('sqlite')
const bcrypt = require('bcryptjs');
var Redis = require('ioredis');
var redis = new Redis();
var uuid = require('node-uuid');

module.exports = {
  get: (userId) => {
    return db.get('SELECT rowid, * FROM users WHERE rowid = ?', userId)
  },

  count: () => {
    return db.get('SELECT COUNT(*) as count FROM users')
  },

  getAll: (limit, offset) => {
    redis.smembers('users').then((users) => {
      console.log(users)
      return Promise.all
      for (i in users) {
        var user = users[i];
        var table = [];
        redis.hgetall(`user:${user}`).then((user) => {
          table.push(user)
        })
      }

    })

    // for (i in utilisateurs) {
    //   redis.hgetall(`user:${utilisateurs}`).then(console.log)
    // }
  },

  insert: (params) => {
    var hash = bcrypt.hashSync(params.password);
    let pipeline = redis.pipeline()
    let userId = uuid.v4()
    var createdAt = Date.now()
    // {pseudo, email} = {pseudo: pseudo, email: email} en ES6
    pipeline.hmset(`user:${userId}`, {pseudo: params.pseudo, password: hash, email: params.email, firstname: params.firstname, lastname: params.firstname, createdAt: createdAt})
    pipeline.sadd('users', userId)
    return pipeline.exec()
  },

  update: (userId, params) => {
    const POSSIBLE_KEYS = [ 'pseudo', 'password', 'email', 'firstname' ]

    let dbArgs = []
    let queryArgs = []

    for (key in params) {
      if (-1 !== POSSIBLE_KEYS.indexOf(key)) {
        queryArgs.push(`${key} = ?`)
        dbArgs.push(params[key])
      }
    }

    // queryArgs.push('updatedAt = ?')
    // dbArgs.push(Date.now())

    if (!queryArgs.length) {
      let err = new Error('Bad request')
      err.status = 400
      return Promise.reject(err)
    }

    dbArgs.push(userId)

    let query = 'UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?'

    //db.run.apply(db, query, dbArgs)
    return db.run(query, dbArgs).then((stmt) => {
      // Ici je vais vérifier si l'updata a bien changé une ligne en base
      // Dans le cas contraire, cela voudra dire qu'il n'y avait pas d'utilisateur
      // Avec db.run, la paramètre passé dans le callback du then, est le `statement`
      // qui contiendra le nombre de lignes éditées en base

      // Si le nombre de lignes dans la table mis à jour est de 0
      if (stmt.changes === 0) {
        let err = new Error('Not Found')
        err.status = 404
        return Promise.reject(err)
      }

      // Tout va bien, on retourne le stmt au prochain then, on fait comme si de rien n'était
      return stmt
    })
  },

  remove: (userId) => {
    return db.run('DELETE FROM users WHERE rowid = ?', userId)
  }
}
