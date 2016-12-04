const mongoose = require('mongoose')
const moment = require('moment')

// Déclaration du schéma de team
var shematodo = new mongoose.Schema({
  todosId: String,
  userId: String,
  pseudo: String,
  message: String,
  createdAt: String,
  updatedAt: String,
  completedAt: String,
  teamId: String,
  toUser: String,
  completed: Boolean
})

// Model
var todosModel = mongoose.model('todos', shematodo);

function dateFormated() {
	var now = moment(new Date())
	var date = now.format("D MMM YYYY")
	var time = now.format("HH:mm")
	return (date +" at "+ time)
}

module.exports = {

// Fonctions principales
	insert: (userId, pseudo, message, teamId, toUser) => {
		var newTodo = new todosModel({
			todosId: require('uuid').v4(),
			userId: userId,
			pseudo: pseudo,
			message: message,
			createdAt: dateFormated(),
			updatedAt: null,
			completedAt: null,
			teamId: teamId,
			toUser: toUser,
			completed: false
		})
		return newTodo.save()
	},

  changeMessage: (todosId, message) => {
		return todosModel.update({todosId: todosId}, {$set: {message: message, updatedAt: dateFormated()}},{upsert:true})
	},

	pourUser: (todosId, pseudo) => {
		return todosModel.update({todosId: todosId}, {$set: {toUser: pseudo}},{upsert:true})
	},

	deleteByUserId: () => {
		var TodosDelete = todosModel.find(null)
		return TodosDelete.remove()
	},

// Getters
	findByUserId: (userId) => {
		var findTodosById = todosModel.find(null)
		findTodosById.where('userId', userId)
		return findTodosById.exec()
	},

	findByUserIdWithoutTeam: (userId) => {
		var findTodosByIdWithoutTeam  = todosModel.find(null)
		findTodosByIdWithoutTeam.where('userId', userId)
		findTodosByIdWithoutTeam.where('teamId').equals(null)
		return findTodosByIdWithoutTeam.exec()
	},

	findByTeamId: (teamId) => {
		var findTodosByTeamId = todosModel.find(null)
		findTodosByTeamId.where('teamId', teamId)
		return findTodosByTeamId.exec()
	},

// Autres fonctions
	completed: (todosId) => {
		return todosModel.update({todosId: todosId}, {$set: {completed: true, completedAt: dateFormated()}},{upsert:true})
	}


}
